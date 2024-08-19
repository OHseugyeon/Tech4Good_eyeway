import 'dotenv/config'; // dotenv 패키지를 사용하여 환경 변수 로드
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/generate-alt-text', async (req, res) => {
  const { imageUrl } = req.body;
  
  console.log('Received image URL:', imageUrl);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // 또는 "gpt-4o"
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "이 그림을 한글로 설명해줘" },
            {
              type: "image_url",
              image_url: { url: imageUrl }
            }
          ]
        }
      ],
      max_tokens: 300
    });

    const altText = response.choices[0].message.content.trim();
    res.json({ altText });
  } catch (error) {
    console.error('Error generating alt text:', error);
    res.status(500).json({ error: 'Failed to generate alt text' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
