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

def run_text_machine( user_uuid, content_summary, image_query ):
  
  

  try:
      gpt.gpt_generate_summary(content_summary)
        
      # we need to consider the posting numbers
        
      ig_caption = gpt.get_gpt_generated_text(prompt_source=os.path.join('src', 'input_prompts', 'instagram.txt'))
      ig_content_repo.schedule_ig_image_post(user_uuid, ig_caption, image_query)
      
      # FACEBOOK 
      fb_caption = gpt.get_gpt_generated_text(prompt_source=os.path.join('src', 'input_prompts', 'facebook.txt'))
      fb_content_repo.schedule_fb_post(user_uuid, fb_caption, image_query)

      # BLOG AND PROMOS
      blog_caption = gpt.get_gpt_generated_text(prompt_source=os.path.join('src', 'input_prompts', 'blog.txt'))
      medium_content_repo.schedule_medium_article(user_uuid, blog_caption, image_query)
      
      # TWEETS
      tweet = gpt.get_gpt_generated_text(prompt_source=os.path.join('src', 'input_prompts', 'twitter.txt'))
      twitter_content_repo.schedule_tweet(user_uuid, tweet, image_query)
          
      print('Finished as SUCCESS')
      return True
  except Exception as e:
      print(f'Finished with error {e}')
      return False        
