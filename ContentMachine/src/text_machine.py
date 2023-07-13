from __future__ import unicode_literals

import sys
import os
import ai.gpt as gpt
import storage.dropbox_storage as dropbox_storage
import content.ig_content_repo as ig_content_repo
import content.fb_content_repo as fb_content_repo
import content.twitter_content_repo as twitter_content_repo
import content.youtube_content_repo as youtube_content_repo
import content.linkedin_content_repo as linkedin_content_repo
import content.medium_content_repo as medium_content_repo
import utility.utils as utils
import random

# This code retrieves the current directory path and appends the '../src' directory to the sys.path, allowing access to modules in that directory.
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, "../src"))

def run_text_machine( user_uuid, content_summary, content_image, frequency ):

#   return {
#     "blog": [
#         {
#             "2023-07-13T16:00:00": {
#                 "content": "<img src=\"https://images.unsplash.com/photo-1637474001051-1233cfa4158b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDQyMTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODkyMTcwODF8&ixlib=rb-4.0.3&q=80&w=1080\" style=\"display: block; width: 100%; height: auto;\"/><p></p>It's hard to overstate how pivotal the invention of the steam engine was in the history of modern technology and industry. From Thomas Newcomen and James Watt to the production of cooling systems for the cool drinks industry and advancements in steel production, the development of this technique has enabled humanity to reshape the planet. In this blog post, we'll dig into the incredible progressions of this technology and explain how it helped fuel the emergence of a truly global economy despite its humble beginnings. Follow along and explore the groundbreaking series of steps taken to get us where we are today.",
#                 "title": "Answer Unlock Your Creativity with STYLE Learn the Winning Strategy"
#             }
#         }
#     ],
#     "facebook": [
#         {
#             "2023-07-13T15:00:00": {
#                 "media_type": "IMAGE",
#                 "message": "#SteamPoweredRevolution",
#                 "published": 'true'
#             }
#         }
#     ],
#     "instagram": [
#         {
#             "2023-07-14T07:00:00": {
#                 "caption": "#HistoryMatters \n\nMaking history come alive! To get a deeper appreciation of the modern world, take a moment to recognize the wonders of the steam engine. A true symbol of technological progress which cannot be understated! By 1790, British inventors Thomas Newcomen and James Watt had succeeded in unlocking the source of power, driving industrial machinery and railway transport. The huge developments made afterwards, such as the production of engines that would generate cooling systems for the nascent drinks industry, or enhancing steel production with their circular millers – had immediate global implications by propelling industrialization and boosting world trade. Let's remember these geniuses behind the steam engine for the lasting impact they have made - the changes made then still reverberate today! #History #IndustriaRevolition",
#                 "image_url": "https://images.unsplash.com/photo-1583170012000-64d452012c63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDQyMTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODkyMTcwNzJ8&ixlib=rb-4.0.3&q=80&w=1080",
#                 "published": 'true'
#             }
#         }
#     ],
#     "tweet": [
#         {
#             "2023-07-13T12:00:00": {
#                 "media_url": "https://images.unsplash.com/photo-1569921465730-95abdbef3027?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDQyMTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODkyMTcwOTF8&ixlib=rb-4.0.3&q=80&w=1080",
#                 "tweet": "Stay curious! Newcomen&Watt's revolutionizing steam engine changed the world years ago - from cooling systems to ships & circular millers, expand your perspective and discover how today's technologies have taken us further. #ChangeMakers #ScienceHistory #IndustrialRevolution"
#             }
#         },
#         {
#             "2023-07-13T12:00:00": {
#                 "tweet": "Wow! The evolution of steam engines from Thomas Newcomen & James Watt to the advanced technology of today combined with its historic impact on global trade & industry shows the power of human ingenuity -learning this history is essential! #SteamPower #IndustrialRevolution"
#             }
#         },
#         {
#             "2023-07-13T12:00:00": {
#                 "tweet": "Creating the perfect twee(t): Combining both perplexity and burstiness can unlock the door to innovative and engaging content, so in honor of the👏 steam engine's 💪 revolutionary impact, let's craft content powered by text complexity & dynamic spectacle! #HistoryisFun  #TechnologicalAdvancements #WritingTip #steamengines #IndustrialRevolution"
#             }
#         },
#         {
#             "2023-07-13T12:00:00": {
#                 "tweet": "From Thomas Newcomen to James Watt, inventors have had a profound effect on our world.#ThrowbackThursday  The mechanics of the steam engine changed industrial + economic landscapes, led 2 increased global trade, & paved the way 4 modern inventions. #EngineDay #edu"
#             }
#         },
#         {
#             "2023-07-13T12:00:00": {
#                 "tweet": "Craft a tweet: \nThomas Newcomen and James Watt's inventions were the basis of the steam engine, which revolutionized the industrial and economic landscape and enabled new inventions. In writing, it's sometimes important to consider the concepts of perplexity and burstiness - incorporating longer and more complex sentences alongside shorter ones make writing more engaging and accurate for readers! #Education #Technology #Inventors"
#             }
#         },
#         {
#             "2023-07-13T12:00:00": {
#                 "media_url": "https://images.unsplash.com/photo-1514250609276-c577268ef8fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDQyMTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODkyMTcwOTZ8&ixlib=rb-4.0.3&q=80&w=1080",
#                 "tweet": "Craft a tweet!\n\nRevolutions don't happen overnight! -How the steam engine changed the world forever: Thomas Newcomen. James Watt, cooling systems, steel production, global trade--a look at the concepts, contexts, and tech that made it happen! #IndustrialRevolution#Inventors"
#             }
#         }
#     ]
# }
  
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
      facebookPosts = gpt.generate_image_prompt(
        user_id=user_uuid,
        prompt_source=os.path.join('src', 'input_prompts', 'facebook.txt'),
        image_query=content_image,
        post_num=generationCount,
        upload_func=fb_content_repo.schedule_fb_post
      )
      instagramPosts = gpt.generate_image_prompt(
        user_id=user_uuid,
        prompt_source=os.path.join('src', 'input_prompts', 'instagram.txt'),
        image_query=content_image,
        post_num=generationCount,
        upload_func=ig_content_repo.schedule_ig_image_post
      )

      # # BLOG AND PROMOS
      blogPosts = gpt.generate_image_prompt(
        user_id=user_uuid, 
        prompt_source=os.path.join('src', 'input_prompts', 'blog.txt'),
        image_query=content_image,
        post_num=generationCount,
        upload_func=medium_content_repo.schedule_medium_article
      )
      
      # # TWEETS
      tweetPosts = gpt.generate_mixed_image_text_prompt(
        user_id=user_uuid,
        prompt_source=os.path.join('src', 'input_prompts', 'tweetstorm.txt'),
        image_query=content_image,
        post_num=twitterGenerationCount,
        text_func=twitter_content_repo.schedule_tweet,
        image_func=twitter_content_repo.schedule_image_tweet
      )

      scheduledOutput = {
        'facebook': utils.randomize_array(facebookPosts),
        'instagram': utils.randomize_array(instagramPosts),
        'blog': utils.randomize_array(blogPosts),
        'tweet': utils.randomize_array(tweetPosts),
      }
          
      print('Finished as SUCCESS')
      return scheduledOutput
  except Exception as e:
      print(f'Finished with error {e}')
      return {
        'message': 'finished with error',
        'error': str(e)
      }        
