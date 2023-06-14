from __future__ import unicode_literals

import sys
import os
import ai.gpt as gpt
import content.ig_content_repo as ig_content_repo
import content.fb_content_repo as fb_content_repo
import content.twitter_content_repo as twitter_content_repo
import content.youtube_content_repo as youtube_content_repo
import content.linkedin_content_repo as linkedin_content_repo
import content.medium_content_repo as medium_content_repo

# This code retrieves the current directory path and appends the '../src' directory to the sys.path, allowing access to modules in that directory.
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, "../src"))

def run_text_machine( user_uuid, content_summary, image_query, frequency ):
  
  try:
      gpt.gpt_generate_summary(content_summary)
        
      # we need to consider the posting numbers
      generationCount = 0
      twitterGenerationCount = 0
      if frequency == 'passive':
        generationCount = 1
        twitterGenerationCount = 6
      elif frequency == 'professional':
        generationCount = 3
        twitterGenerationCount = 12
      elif frequency == 'aggressive':
        generationCount = 6
        twitterGenerationCount = 24
      
      # META 
      facebookPosts = gpt.generate_text_prompt(
        prompt_source=os.path.join('src', 'input_prompts', 'facebook.txt'),
        post_num=generationCount,
        upload_func=fb_content_repo.schedule_fb_post
      )
      instagramPosts = gpt.generate_image_prompt(
        prompt_source=os.path.join('src', 'input_prompts', 'instagram.txt'),
        post_num=generationCount,
        upload_func=ig_content_repo.schedule_ig_image_post
      )

      # BLOG AND PROMOS
      blogPosts = gpt.generate_text_prompt(
        prompt_source=os.path.join('src', 'input_prompts', 'blog.txt'),
        post_num=generationCount,
        upload_func=medium_content_repo.schedule_medium_article
      )
      
      # TWEETS
      tweetPosts = gpt.generate_text_prompt(
        prompt_source=os.path.join('src', 'input_prompts', 'tweetstorm.txt'),
        post_num=twitterGenerationCount,
        upload_func=twitter_content_repo.schedule_tweet
      )

      print(facebookPosts)
      print(instagramPosts)
      print(blogPosts)
      print(tweetPosts)
          
      print('Finished as SUCCESS')
      return True
  except Exception as e:
      print(f'Finished with error {e}')
      return False        
