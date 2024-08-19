require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const client = new ImageAnnotatorClient({
  keyFilename: 'eyeway-api-key.json',
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/generate-alt-text', async (req, res) => {
  const { imageUrl } = req.body;
  
  console.log('Received image URL:', imageUrl); // 이미지 URL 로그 추가

  try {
    const [result] = await client.labelDetection(imageUrl);
    const labels = result.labelAnnotations;

    if (labels.length > 0) {
      const altText = labels.map(label => label.description).join(', ');
      res.json({ altText });
    } else {
      res.json({ altText: '이미지에서 대체 텍스트를 생성할 수 없습니다.' });
    }
  } catch (error) {
    console.error('Error generating alt text:', error);
    res.status(500).json({ error: 'Failed to generate alt text' });
  }
});


// 여기에 추가된 라우팅: 정의되지 않은 모든 경로에 대해 기본 응답 처리
app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
