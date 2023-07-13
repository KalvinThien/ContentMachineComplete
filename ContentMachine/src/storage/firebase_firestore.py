import sys
import os
import pyrebase
import appsecrets as appsecrets
from enum import Enum
import json
import utility.scheduler as scheduler
import utility.time_utils as time_utils

# This code retrieves the current directory path and appends the '../src' directory to the sys.path, allowing access to modules in that directory.
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, "../src"))

class PostingPlatform(Enum):
    FACEBOOK = 'facebook'
    INSTAGRAM = 'instagram'
    TWITTER = 'twitter'
    YOUTUBE = 'youtube'
    MEDIUM = 'medium'
    TIKTOK = 'tiktok'
    LINKEDIN = 'linkedin'

class FirebaseFirestore():
    # Initializations    
    firebase = pyrebase.initialize_app(appsecrets.FIREBASE_CONFIG)
    # Deprecated Constants
    TOKEN_COLLECTION = "tokens"
    META_LF_TOKEN_COLLECTION = "meta_long_form_tokens" 
    META_SF_TOKEN_COLLECTION = "meta_short_form_one_hour_tokens"
    DROPBOX_ACCESS_TOKEN = "dropbox_access_token"
    # deprecated Realtime Database
    firebaseRealtimeDatabase = firebase.database()

    POSTS_COLLECTION = "posts"    
    BLOGS_COLLECTION = "posted_blogs" 

    # deprecated above
    storage = firebase.storage()

    @classmethod
    def get_complete_access_token( self, access_token_type ):
        result = self.firebaseRealtimeDatabase.child(self.TOKEN_COLLECTION).child(access_token_type).get()
        if (result is not None):
            return result.val()
        else:
            return ''

    @classmethod
    def put_complete_access_token( self, access_token_type, token ):
        result = self.firebaseRealtimeDatabase.child(self.TOKEN_COLLECTION).update({
            access_token_type: token
        })
        return result

    @classmethod
    def get_meta_short_lived_token(self, platform):
        results = self.firebaseRealtimeDatabase.child(self.TOKEN_COLLECTION).child(self.META_SF_TOKEN_COLLECTION).get()
        if (results.each() is not None):
            for result in results.each():
                if (result.key() == platform.value): return result.val()
        return '' 

    @classmethod
    def store_meta_bearer_token(self, platform, token):
        result = self.firebaseRealtimeDatabase.child(self.TOKEN_COLLECTION).child(self.META_LF_TOKEN_COLLECTION).update({
            platform.value: token
        })
        return result

    @classmethod
    def get_meta_bearer_token(self, platform):
        results = self.firebaseRealtimeDatabase.child(self.TOKEN_COLLECTION).child(self.META_LF_TOKEN_COLLECTION).get()
        if (results.each() is not None):
            for result in results.each():
                if (result.key() == platform.value): return result.val()
        return ''    

    @classmethod
    def delete_storage_file(self, remote_storage_path):
        result = self.storage.child(remote_storage_path).delete()
        print(f'successful firebase storage delete {result}')

    @classmethod
    def upload_file_to_storage( self, remote_storage_path, local_path ):
        result = self.storage.child(remote_storage_path).put(local_path)
        print(f'successful firebase storage upload {result}')

    @classmethod
    def get_url( self, child_path_to_file ):
        url = self.storage.child(child_path_to_file).get_url(None)
        return url

    @classmethod
    def get_earliest_scheduled_datetime( self, platform ):
        collection = self.firebaseRealtimeDatabase.child(platform.value).get().each()
        if (collection is None):
            print(f'{platform.value} earliest scheduled datetime not found')
            return ''
        if (len(collection) > 0):
            earliest_scheduled_datetime_str = collection[0].key()

            if (earliest_scheduled_datetime_str is not None and earliest_scheduled_datetime_str != ''):
                return earliest_scheduled_datetime_str
            else:
                print(f'{platform.value} earliest_scheduled_datetime_str is None or earliest_scheduled_datetime_str == ''')
                return ''    
        else:
            print(f'{platform.value} something went wrong with get_earliest_scheduled_datetime( self, platform )')  
            return ''

    @classmethod
    def get_latest_scheduled_datetime( self, user_id, platform ):
        print("🚀 ~ file: firebase_firestore.py:113 ~ user_id, platform:", user_id, platform)
        # prepper = self.firebaseRealtimeDatabase.child(user_id).child(platform.value).get().val()
        # print(f'🌴 {platform} get_latest_scheduled_datetime() collection: {prepper}')
        self.firebaseRealtimeDatabase.child(user_id).child(platform.value).get().val()
        collection = self.firebaseRealtimeDatabase.child(user_id).child(platform.value).get().val()

        if (collection is None):
            return scheduler.get_best_posting_time(platform)
        
        if (len(collection) > 0):
            latest_scheduled_datetime_str = list(collection.keys())[len(collection) - 1]
            formatted_iso = time_utils.convert_str_to_iso_format(latest_scheduled_datetime_str)
            latest_scheduled_datetime = time_utils.from_iso_format(formatted_iso)
            return latest_scheduled_datetime
        else:
            print(f'{platform} something went wrong with get_latest_scheduled_datetime( self, platform )')  
            return ''  

    @classmethod
    def get_specific_post( self, platform, posting_time ):
        '''
            Get the actual post that we stored earlier in firebase document/JSON format

            Args:
                string platform: The value from our enum determing the platform we are working with
                string posting_time: Specific ISO formatted datetime used to fetch

            Returns:
                string. JSON string translated from the specific document fetched from firebase
        '''
        result = self.firebaseRealtimeDatabase.child(platform.value).get()

        if result.each() is None:
            return "No document found with the specified property value."
        else:
            for document in result.each():                
                if (document.key() == posting_time):
                    document_json = json.dumps(document.val())
                    return document_json

    @classmethod
    def upload_scheduled_post( self, user_id, platform, payload ):
        print(f'upload_scheduled_post() user_id: {user_id} platform: {platform} payload: {payload}')

        last_posted_time = self.get_latest_scheduled_datetime(user_id, platform)
        print("🚀 ~ file: firebase_firestore.py:158 ~ last_posted_time:", last_posted_time)

        if (last_posted_time == '' or last_posted_time is None):
            print("🌴 ~ file: firebase_firestore.py:160 ~ last_posted_time:", last_posted_time)
            future_publish_date = scheduler.get_best_posting_time(platform)
        else:
            future_publish_date = scheduler.get_best_posting_time(platform, last_posted_time)
            print("🌴 ~ file: firebase_firestore.py:164 ~ future_publish_date:", future_publish_date)

        result = self.firebaseRealtimeDatabase.child(user_id).child(platform.value).update({
            future_publish_date: payload
        })
        return result

    @classmethod
    def delete_post( self, platform, datetime_key ):
        result = self.firebaseRealtimeDatabase.child(platform.value).child(datetime_key).remove()
        print(f'{platform.value} firebase deleting @ key {datetime_key}')
        return result
    
    @classmethod
    def upload_if_ready( self, platform, api_fun, is_test=False ):
        earliest_scheduled_datetime_str = firestore_instance.get_earliest_scheduled_datetime(platform)
        while (time_utils.is_expired(earliest_scheduled_datetime_str) and is_test == False):
            print(f'❌ {platform.value} Expired! Deleting post')
            self.delete_post(platform, earliest_scheduled_datetime_str)
            earliest_scheduled_datetime_str = firestore_instance.get_earliest_scheduled_datetime(platform)

        if (earliest_scheduled_datetime_str == '' or earliest_scheduled_datetime_str is None): 
            return 'no posts scheduled'
        print(f'👉 {platform.value} Analyzing Post: {earliest_scheduled_datetime_str}')
        
        ready_to_post = time_utils.is_current_posting_time_within_window(earliest_scheduled_datetime_str)
        if (ready_to_post or is_test == True): 
            # our main functionality
            upload_result = api_fun(earliest_scheduled_datetime_str)
            self.delete_post(platform, earliest_scheduled_datetime_str)

            return upload_result
        else:
            return f'{platform.value} time not within posting window' 

#static instances
firestore_instance = FirebaseFirestore()
