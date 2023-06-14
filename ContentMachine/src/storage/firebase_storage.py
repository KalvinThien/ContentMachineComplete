import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
from google.cloud import storage
import sys
import os
import appsecrets as appsecrets
from enum import Enum
import json

# This code retrieves the current directory path and appends the '../src' directory to the sys.path, allowing access to modules in that directory.
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, "../src"))

# Initialize Firebase Admin SDK.
cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': appsecrets.FIREBASE_CONFIG['storageBucket']
})

# Get the storage bucket
bucket_name = firebase_admin.get_app().options['storageBucket']
bucket = storage.Client().get_bucket(bucket_name)

# 'bucket' is an object defined in the google-cloud-storage Python library.
# See https://googlecloudplatform.github.io/google-cloud-python/latest/storage/buckets.html
# for more details.

from google.cloud import storage



def download_blob(source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    # The ID of your GCS bucket
    # bucket_name = "your-bucket-name"

    # The ID of your GCS object
    # source_blob_name = "storage-object-name"

    # The path to which the file should be downloaded
    # destination_file_name = "local/path/to/file"

    storage_client = storage.Client()

    bucket = storage_client.bucket(bucket_name)

    # Construct a client side representation of a blob.
    # Note `Bucket.blob` differs from `Bucket.get_blob` as it doesn't retrieve
    # any content from Google Cloud Storage. As we don't need additional data,
    # using `Bucket.blob` is preferred here.
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)

    print(
        "Downloaded storage object {} from bucket {} to local file {}.".format(
            source_blob_name, appsecrets.GOOGLE_APP_STORAGE_ADDRESS, destination_file_name
        )
    )

def downoad_input_prompts(download_folder_name, destination_folder_name):
    print("🚀 ~ file: firebase_storage.py:62 ~ destination_folder_name:", destination_folder_name)
    print("🚀 ~ file: firebase_storage.py:62 ~ download_folder_name:", download_folder_name)
    """Iterates through all files in a folder in the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)

    blobs = bucket.list_blobs(prefix=download_folder_name)
    for blob in blobs:
        # Process each file here
        # Example: Print the name of the file
        print("File Name:", blob.name)
        download_blob(f"{download_folder_name}/{blob.name}", f"{destination_folder_name}/{blob.name}")
