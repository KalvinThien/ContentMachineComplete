from __future__ import unicode_literals

import sys
import os
import ai.gpt as gpt
import storage.dropbox_storage as dropbox_storage
from storage.dropbox_storage import DB_FOLDER_READY, DB_FOLDER_SCHEDULED
import content.ig_content_repo as ig_content_repo
import content.fb_content_repo as fb_content_repo
import content.twitter_content_repo as twitter_content_repo
import content.youtube_content_repo as youtube_content_repo
import content.linkedin_content_repo as linkedin_content_repo
import content.medium_content_repo as medium_content_repo
import media.video_converter as video_converter
import storage.dropbox_storage as dropbox_storage
from storage.dropbox_storage import DB_FOLDER_REFORMATTED

# This code retrieves the current directory path and appends the '../src' directory to the sys.path, allowing access to modules in that directory.
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, "../src"))

test_mode_enabled=True

def reels_optimize_video_remote_path(remote_video_path):
    print('Optimizing video for reels...')
    local_video_download = dropbox_storage.download_file_to_local_path(remote_video_path)
    optimized_local_path = video_converter.optimize_video_for_reels(local_video_download)
    dropbox_file_path = DB_FOLDER_REFORMATTED + '/' + os.path.basename(optimized_local_path)
    dropbox_storage.upload_file(optimized_local_path, dropbox_file_path)
    return dropbox_file_path

# Begin the running of our application
if __name__ == '__main__':
    print('💸 Running Money Printer 💸')

    # Quickly process our post calls
    ig_content_repo.post_ig_media_post(test_mode_enabled)
    fb_content_repo.post_to_facebook(test_mode_enabled)
    twitter_content_repo.post_tweet(test_mode_enabled)
    medium_content_repo.post_to_medium(test_mode_enabled)
    linkedin_content_repo.post_to_linkedin(test_mode_enabled)
    youtube_content_repo.post_previously_scheduled_youtube_video() 


    # Get newest video from Dropbox and create content
    local_joined_path = os.path.join('src','output_downloads')
    db_video_entry = dropbox_storage.get_earliest_ready_short_video()

    if (db_video_entry is not None and test_mode_enabled == False):
        dropbox_storage.bulk_download_prompts()

        # our remote path to the next video to upload
        raw_db_remote_path = db_video_entry.path_display

        # local download: video -> audio -> transcript -> summary
        local_video_path = dropbox_storage.download_file_to_local_path(raw_db_remote_path)
        local_audio_path = video_converter.local_video_to_mp3(local_video_path)
        transcript_path = gpt.mp3_to_transcript(local_audio_path)
        summary_output_path = gpt.transcript_to_summary(transcript_path)

        # remote paths: remote path -> download -> optimize -> upload
        db_remote_scheduled_path = reels_optimize_video_remote_path(raw_db_remote_path)
        dropbox_storage.delete_file(raw_db_remote_path)

        # Youtube Shorts
        youtube_content_repo.complete_scheduling_and_posting_of_video(
            remote_video_path=db_remote_scheduled_path
        )

        # Instagram Reels
        gpt.generate_video_with_prompt(
            prompt_source=os.path.join('src', 'input_prompts', 'instagram.txt'),
            db_remote_path=db_remote_scheduled_path,
            upload_func=ig_content_repo.schedule_ig_video_post
        )

        # Facebook Page & Personal
        gpt.generate_video_with_prompt(
            prompt_source=os.path.join('src', 'input_prompts', 'facebook.txt'),
            db_remote_path=db_remote_scheduled_path,
            upload_func=fb_content_repo.schedule_fb_video_post
        )

        # Twitter 
        gpt.generate_video_with_prompt(
            prompt_source=os.path.join('src', 'input_prompts', 'tweetstorm.txt'),
            db_remote_path=db_remote_scheduled_path,
            upload_func=twitter_content_repo.schedule_video_tweet
        )
        gpt.generate_text_prompt(
            prompt_source=os.path.join('src', 'input_prompts', 'tweetstorm.txt'),
            post_num=6,
            upload_func=twitter_content_repo.schedule_tweet
        )

        #LinkedIn
        gpt.generate_text_prompt(
            prompt_source=os.path.join('src', 'input_prompts', 'linkedin.txt'),
            post_num=1,
            upload_func=linkedin_content_repo.schedule_linkedin_post,
        )
   
        # Medium
        gpt.generate_text_prompt(
            prompt_source=os.path.join('src', 'input_prompts', 'blog.txt'),
            post_num=1,
            upload_func=medium_content_repo.schedule_medium_article
        )
        
        print('🏆 Finished Generating Content Run 🏆')
    