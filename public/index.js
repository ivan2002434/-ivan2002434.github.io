document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
 
    // Обработка нажатия кнопки мыши
    canvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    });
 
    // Обработка движения мыши
    canvas.addEventListener('mousemove', function(e) {
        if (isDrawing) {
            ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
            ctx.stroke();
        }
    });
 
    // Обработка отпускания кнопки мыши
    canvas.addEventListener('mouseup', function() {
        isDrawing = false;
    });

    // Обработка отправки формы
    document.getElementById('inputForm').addEventListener('submit', async function(e) {
        e.preventDefault(); // Предотвращаем стандартное поведение формы
        const text = document.getElementById('textInput').value;
        const imageData = canvas.toDataURL(); // Получаем изображение в формате base64
        const formData = {
            text: text,
            image: imageData
        };

        // Отправляем данные на сервер
        const response = await fetch('/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Обрабатываем ответ от сервера
        const result = await response.json();
        console.log('Processed result:', result);
        // Добавьте код для отображения результата на странице
        function displayResult(imageUrl) {
            const resultImage = document.getElementById('resultImage');
            resultImage.src = imageUrl;
            resultImage.style.display = 'block';
        }
    });
});
