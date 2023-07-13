from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import appsecrets
import text_machine as text_machine
import storage.firebase_storage as firebase_storage
import os
import sys

# This code retrieves the current directory path and appends the '../src' directory to the sys.path, allowing access to modules in that directory.
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(current_dir, "../src"))

# Initialize the SDK with the service account credentials
# cred = credentials.Certificate(os.path.join(current_dir, 'legion-ai-content-machine-63f5b63456a6.json'))
# # firebase_admin.initialize_app(cred)


app = Flask(__name__)
CORS(app)

@app.route('/api/linkedin', methods=['GET'])
def linkedin_callback():
    auth_code = request.args.get('authCode')
    params = {
        'code': auth_code,
        'grant_type': 'authorization_code',
        'redirect_uri': 'http://localhost:4200/linkedin-callback',
        'client_id': appsecrets.LINKEDIN_CLIENT_ID,
        'client_secret': appsecrets.LINKEDIN_CLIENT_SECRET
    }
    
    try:
        response = requests.post('https://www.linkedin.com/oauth/v2/accessToken', data=params)
        print("🚀 ~ response:", response.json())
        
        return jsonify({'message': 'success', 'data': response.json()}), 200
    except Exception as e:
        print("🚀 ~ error:", str(e))
        return jsonify({ 'message': 'error', 'error': str(e) }), 500

@app.route('/api/facebook/callback', methods=['GET'])
def facebook_callback():
    auth_code = request.args.get('authCode')
    params = {
        'client_id': appsecrets.FACEBOOK_CLIENT_ID,
        'client_secret': appsecrets.FACEBOOK_CLIENT_SECRET,
        'redirect_uri': 'http://localhost:4200/facebook-callback',
        'code': auth_code
    }
    
    try:
        response = requests.get('https://graph.facebook.com/v15.0/oauth/access_token', params=params)
        print("🚀 ~ response:", response.json())
        
        token = response.json()['access_token']
        # Use the access token for further API requests or save it for later use
        
        return jsonify({
            'message': 'success',
            'data': {'accessToken': token}
        }), 200
    except Exception as e:
        print("🚀 ~ error:", str(e))
        return jsonify({ 'Authentication failed.', 500 })

@app.route('/api/schedule-text-posts', methods=['POST'])
def text_to_content():
    data = request.json
    print("🚀 ~ file: app.py:58 ~ data:", data)
    userUuid = data['userUuid']
    content = data['content']
    image = data['image']
    frequency = data['frequency']

    if (userUuid is None or content is None or image is None or frequency is None):
        return jsonify(result=False)
    else:
        print('🔻 downloading prompts')
        firebase_storage.downoad_input_prompts('input_prompts', os.path.join('src', 'input_prompts'))
        print('🔺 downloaded prompts')
    
    returnResult = text_machine.run_text_machine(userUuid, content, image, frequency)

    return jsonify(returnResult)

if __name__ == '__main__':
    app.run(port=8000, debug=True)
