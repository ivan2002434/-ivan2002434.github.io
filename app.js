const express = require('express');
const Replicate = require('replicate');
const path = require('path');
const fs = require('fs');

const app = express();
const replicate = new Replicate();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статический маршрут для обслуживания файлов в папке uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Статический маршрут для обслуживания файлов в папке public
app.use(express.static(path.join(__dirname, 'public')));

// Обработчик GET-запроса для favicon.ico
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content
});

// Обработчик POST-запроса для обработки входных данных через API Replicate
app.post('/process', async (req, res) => {
  try {
    const input = req.body;
    const imageData = input.image; // Получаем изображение в формате base64
    // Генерируем уникальное имя файла
    const imageName = `${Date.now()}.png`;
    // Путь к файлу на сервере
    const imagePath = path.join(__dirname, 'uploads', imageName);
    // Сохраняем изображение на сервере
    fs.writeFileSync(imagePath, Buffer.from(imageData.split(',')[1], 'base64'));
    // Формируем URL для изображения
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${imageName}`;
    // Добавляем переменную mask и дублируем ее в image
    input.mask = imageUrl;
    input.image = imageUrl;
    console.log('Received input:', input); // Выводим полученные данные в консоль
    // Отправляем данные на сервер Replicate
    const output = await replicate.run("stability-ai/stable-diffusion-inpainting:95b7223104132402a9ae91cc677285bc5eb997834bd2349fa486f53910fd68b3", { input });
    res.json(output);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Обработчик маршрута для корневого пути, который будет отдавать HTML файл
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера на порте 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
