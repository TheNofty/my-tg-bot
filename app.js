// Инициализация Telegram Web App
Telegram.WebApp.ready();
Telegram.WebApp.expand();

console.log("App started");

// Переключение вкладок
document.querySelectorAll('.tab-header').forEach(tab => {
    tab.addEventListener('click', function() {
        console.log("Tab clicked:", this.getAttribute('data-tab'));
        
        // Убираем активный класс у всех вкладок
        document.querySelectorAll('.tab-header').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Активируем текущую вкладку
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.add('active');
    });
});

// Загрузка файлов
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadedFiles = document.getElementById('uploadedFiles');

console.log("Upload elements:", uploadArea, fileInput);

uploadArea.addEventListener('click', () => {
    console.log("Upload area clicked");
    fileInput.click();
});

// Обработка выбора файла
fileInput.addEventListener('change', (e) => {
    console.log("File selected", e.target.files);
    
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        handleFileUpload(file);
    }
});

function handleFileUpload(file) {
    console.log("Handling file:", file.name, file.type, file.size);
    
    if (!file.name.toLowerCase().endsWith('.wav')) {
        Telegram.WebApp.showAlert('Пожалуйста, выберите WAV файл');
        return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
        Telegram.WebApp.showAlert('Файл слишком большой (макс. 50MB)');
        return;
    }

    // Создаем URL для файла
    const fileUrl = URL.createObjectURL(file);
    
    // Показываем файл в списке
    const fileElement = document.createElement('div');
    fileElement.className = 'uploaded-file';
    fileElement.innerHTML = `
        <div class="sound-cover">🎵</div>
        <div class="uploaded-file-info">
            <div class="uploaded-file-name">${file.name}</div>
            <div class="uploaded-file-size">${formatFileSize(file.size)} • ${file.type}</div>
        </div>
        <button class="play-btn upload-play">▶</button>
        <button class="delete-btn">✕</button>
    `;

    // Добавляем обработчики для кнопок
    const playBtn = fileElement.querySelector('.upload-play');
    const deleteBtn = fileElement.querySelector('.delete-btn');

    playBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        console.log("Playing uploaded file:", file.name);
        
        // Создаем аудио элемент для воспроизведения
        const audio = new Audio(fileUrl);
        
        if (audio.paused) {
            audio.play();
            this.textContent = '⏸';
            document.querySelector('.current-track').textContent = `Playing: ${file.name}`;
            
            audio.onended = () => {
                this.textContent = '▶';
                document.querySelector('.current-track').textContent = 'No track selected';
            };
        } else {
            audio.pause();
            this.textContent = '▶';
        }
    });

    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        fileElement.remove();
        URL.revokeObjectURL(fileUrl); // Освобождаем память
        Telegram.WebApp.showAlert(`Файл удален: ${file.name}`);
    });

    uploadedFiles.appendChild(fileElement);
    Telegram.WebApp.showAlert(`✅ Файл загружен: ${file.name}`);
    
    // Очищаем input чтобы можно было выбрать тот же файл снова
    fileInput.value = '';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Обработчики для стандартных звуков
document.querySelectorAll('.play-btn').forEach(btn => {
    if (!btn.classList.contains('upload-play')) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const soundItem = this.closest('.sound-item');
            const soundName = soundItem.querySelector('.sound-name').textContent;
            
            Telegram.WebApp.showAlert(`Playing: ${soundName}`);
            this.textContent = '⏸';
            
            setTimeout(() => {
                this.textContent = '▶';
            }, 3000);
        });
    }
});

// Обработчик для главной кнопки play/pause
document.querySelector('.play-pause').addEventListener('click', function() {
    if (this.textContent === '▶') {
        this.textContent = '⏸';
        document.querySelector('.current-track').textContent = 'Now playing: demo track';
    } else {
        this.textContent = '▶';
        document.querySelector('.current-track').textContent = 'No track selected';
    }
});

// Обработчик поиска
document.querySelector('.search').addEventListener('input', function() {
    if (this.value.length > 2) {
        console.log('Searching for:', this.value);
    }
});

console.log("All event listeners attached");