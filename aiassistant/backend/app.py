from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import json
import os
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
CORS(app)


def sendToGPT(req_prompt):
    print('prompt')
    openai.api_key = os.environ['API_KEY']
    chat_request = openai.ChatCompletion.create(
        model="gpt-3.5-turbo", messages=[{"role": "user", "content": req_prompt}])
    return chat_request.choices[0].message.content


@app.route('/', methods=['POST'])
def home():
    print('triggered')
    with open('prompts.json', 'r') as file:
        prompt_data = json.load(file)
    user_data = request.json
    required_fields = ['resume', 'portfolio',
                       'vacancy', 'laborMarket', 'country']
    for field in required_fields:
        if field not in user_data or not isinstance(user_data[field], str):
            return jsonify({'error': 'Invalid data format'}), 400
    full_prompt = prompt_data['text'][0] + "\n" + user_data['resume'] + "\n" + prompt_data['text'][1] + "\n" + user_data['portfolio'] + "\n" + prompt_data['text'][2] + "\n" + user_data['vacancy'] + \
        "\n" + prompt_data['text'][3] + ' ' + user_data['laborMarket'] + ' ' + prompt_data['text'][4] + \
        ' ' + prompt_data['text'][5] + ' ' + \
        user_data['country'] + '. ' + prompt_data['text'][6]
    resp = sendToGPT(full_prompt)
    print('received resp')
    return resp
