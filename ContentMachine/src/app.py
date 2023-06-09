from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/process-data', methods=['POST'])
def process_data():
    data = request.json
    # Perform necessary computations using the input data
    result = data['name'] + ' is ' + str(data['age']) + ' years old'
    # Return the result as JSON response
    return jsonify(result=result)

if __name__ == '__main__':
    app.run()
