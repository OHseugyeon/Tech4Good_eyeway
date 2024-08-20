from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI 
import os

app = Flask(__name__)
CORS(app)  # CORS 설정 추가

MODEL="gpt-4o-mini"

@app.route('/')
def home():
    return 'Server is running!'

@app.route('/generate-alt-text', methods=['POST'])
def generate_alt_text():
    print("Received request")  
    data = request.json
    image_url = data.get('imageUrl')
    print(image_url)

    if not image_url:
        return jsonify({'error': 'Image URL is required'}), 400

    try:
        # OpenAI API 호출
        client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "Generate detailed and descriptive alt text for the given image that is easy for visually impaired users to understand."},
                {"role": "user", "content": [
                    {"type": "text", 
                     "text":  """시각장애인들을 위해 입력받은 이미지를 분석하여서 너무 길지 않게 중요 정보만 뽑아서 사람이 이해하기 쉽게 이미지를 잘 설명해주세요.
                                이미지에 텍스트가 있는 경우 중요 정보를 모두 뽑아서 출력해주는 대신에 출력값을 시각장애인이 음성으로 듣기 때문에 듣고 이해하는데 지장없어야해
                                예를들어 사이즈라면 S,M,L,XL, 어깨너비 30,40,50,60, 소매길이 60,66,70,75 이런식으로 무작정 나열된대로 읽지말고 S 사이즈 어깨너비 30, 소매길이 60, M사이즈 어깨너비 40, 소매길이 66 이런식으로 사람이 이해하기 쉽게 텍스트로 풀어 출력해주세요.

                                단순 이미지의 경우 그 이미지에 대해 최대한 구체적으로 설명해줬으면 좋겠어 이때 너무 답변이 길진 않았으면해.
                                한국어로 출력되어야한다. """},
                    {"type": "image_url", "image_url": {
                        "url": image_url}
                    }
                ]}
            ],
            temperature=0.0,
        )
        print(response)
        alt_text = response.choices[0].message.content.strip()
        return jsonify({'altText': alt_text})

    except OpenAI.error.OpenAIError as e:
        return jsonify({'error': 'Failed to generate alt text', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)