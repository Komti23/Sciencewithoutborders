// ================ АНИМАЦИЯ ЗВЕЗД ================

// Создание звезд с движением
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 150;
    
    starsContainer.innerHTML = '';
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.3;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.opacity = Math.random() * 0.7 + 0.3;
        
        star.dataset.speedX = speedX;
        star.dataset.speedY = speedY;
        star.dataset.posX = posX;
        star.dataset.posY = posY;
        star.style.animation = `twinkle ${duration}s infinite ${delay}s`;
        
        starsContainer.appendChild(star);
    }
    
    moveStars();
}

// Движение звезд
function moveStars() {
    const stars = document.querySelectorAll('.star');
    let lastTime = 0;
    
    function animate(currentTime) {
        if (!lastTime) lastTime = currentTime;
        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;
        
        stars.forEach(star => {
            let posX = parseFloat(star.dataset.posX);
            let posY = parseFloat(star.dataset.posY);
            const speedX = parseFloat(star.dataset.speedX);
            const speedY = parseFloat(star.dataset.speedY);
            
            posX += speedX * deltaTime * 0.01;
            posY += speedY * deltaTime * 0.01;
            
            if (posX > 100) posX = 0;
            if (posX < 0) posX = 100;
            if (posY > 100) posY = 0;
            if (posY < 0) posY = 100;
            
            star.dataset.posX = posX;
            star.dataset.posY = posY;
            star.style.left = `${posX}%`;
            star.style.top = `${posY}%`;
        });
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}

// Анимация мерцания звезд
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// ================ МОБИЛЬНОЕ МЕНЮ ================

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenuBtn.innerHTML = mobileNav.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// ================ ВАЛИДАЦИЯ URL ================

const fileUrlInput = document.getElementById('file-url');
const urlValidation = document.getElementById('urlValidation');

if (fileUrlInput) {
    fileUrlInput.addEventListener('input', () => {
        const url = fileUrlInput.value;
        
        if (url.length === 0) {
            urlValidation.style.display = 'none';
            return;
        }
        
        // Проверяем, является ли строка URL
        try {
            new URL(url);
            
            // Проверяем, что это URL облачных хранилищ
            const allowedDomains = [
                'drive.google.com',
                'docs.google.com',
                'yadi.sk',
                'disk.yandex.ru',
                'yandex.ru/disk',
                'dropbox.com',
                'onedrive.live.com',
                'cloud.mail.ru'
            ];
            
            const urlObj = new URL(url);
            const isValidDomain = allowedDomains.some(domain => urlObj.hostname.includes(domain));
            
            if (isValidDomain) {
                urlValidation.textContent = '✓ Ссылка выглядит корректной';
                urlValidation.className = 'url-validation valid';
                urlValidation.style.display = 'block';
                fileUrlInput.style.borderColor = 'var(--success)';
            } else {
                urlValidation.textContent = '⚠ Убедитесь, что ссылка ведет на облачное хранилище (Google Drive, Яндекс.Диск, Dropbox)';
                urlValidation.className = 'url-validation invalid';
                urlValidation.style.display = 'block';
                fileUrlInput.style.borderColor = 'var(--gold)';
            }
            
        } catch (error) {
            urlValidation.textContent = '✗ Пожалуйста, введите корректную ссылку (начинается с https://)';
            urlValidation.className = 'url-validation invalid';
            urlValidation.style.display = 'block';
            fileUrlInput.style.borderColor = 'var(--error)';
        }
    });
    
    // Проверка при потере фокуса
    fileUrlInput.addEventListener('blur', () => {
        if (fileUrlInput.value && !fileUrlInput.validity.valid) {
            urlValidation.textContent = '✗ Введите корректный URL (например: https://drive.google.com/file/d/...)';
            urlValidation.className = 'url-validation invalid';
            urlValidation.style.display = 'block';
        }
    });
}

// ================ EMAILJS ИНИЦИАЛИЗАЦИЯ ================

// Инициализация EmailJS
(function() {
    emailjs.init("UTY33QAerXaGEK-Nm");
})();

// ================ ОБРАБОТЧИК ФОРМЫ (ОБЛАЧНЫЙ ВАРИАНТ) ================

const articleForm = document.getElementById('article-form');

if (articleForm) {
    articleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Проверяем обязательные поля
        const requiredFields = articleForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'var(--error)';
                
                field.addEventListener('input', () => {
                    field.style.borderColor = 'var(--accent)';
                });
            }
        });
        
        // Специальная проверка для URL
        if (!fileUrlInput.value.trim()) {
            isValid = false;
            fileUrlInput.style.borderColor = 'var(--error)';
            
            fileUrlInput.addEventListener('input', () => {
                fileUrlInput.style.borderColor = 'var(--accent)';
            });
        }
        
        if (!isValid) {
            showFormStatus('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        // Проверяем согласие с условиями
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            showFormStatus('Необходимо согласие с условиями конкурса', 'error');
            termsCheckbox.focus();
            return;
        }
        
        // Проверяем валидность URL
        if (!fileUrlInput.validity.valid) {
            showFormStatus('Пожалуйста, введите корректную ссылку на файл', 'error');
            fileUrlInput.focus();
            return;
        }
        
        // Отключаем кнопку отправки
        const submitBtn = document.getElementById('submitBtn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        
        // Показываем статус загрузки
        showFormStatus('Отправка заявки...', 'loading');
        
        try {
            // Собираем данные формы
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                category: document.getElementById('category').value,
                title: document.getElementById('title').value,
                content: document.getElementById('article-text').value,
                file_url: fileUrlInput.value
            };
            
            // Проверяем, что URL доступен
            await testUrlAccessibility(formData.file_url);
            
            // Отправляем через EmailJS
            const emailResult = await sendEmailToOrganizer(formData);
            
            if (emailResult.success) {
                showSuccessModal(formData);
                showFormStatus('Заявка успешно отправлена!', 'success');
                
                // Очищаем форму
                articleForm.reset();
                charCount.textContent = '0';
                charCount.style.color = 'var(--text-light)';
                urlValidation.style.display = 'none';
            } else {
                throw new Error(emailResult.message);
            }
            
        } catch (error) {
            console.error('Ошибка:', error);
            showFormStatus(`Ошибка: ${error.message}`, 'error');
            
            // Показываем модальное окно с ошибкой
            showErrorModal(error.message);
            
        } finally {
            // Восстанавливаем кнопку
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
}

// ================ ФУНКЦИЯ ПРОВЕРКИ ДОСТУПНОСТИ URL ================

async function testUrlAccessibility(url) {
    return new Promise((resolve, reject) => {
        // В реальном проекте здесь будет реальная проверка URL
        // Для демонстрации просто разрешаем
        setTimeout(() => {
            resolve(true);
        }, 500);
    });
}

// ================ ФУНКЦИЯ ОТПРАВКИ EMAIL ================

async function sendEmailToOrganizer(formData) {
    const templateParams = {
        from_name: formData.name,
        user_email: formData.email,
        article_category: formData.category,
        article_title: formData.title,
        article_content: formData.content,
        article_file: formData.file_url,
        to_email: "gemiandrui@gmail.com",
        submission_date: new Date().toLocaleDateString('ru-RU'),
        submission_time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    try {
        // Отправляем письмо через EmailJS
        const response = await emailjs.send(
            "service_9g7zkce",
            "template_0owa5yd",
            templateParams
        );
        
        return { success: true, message: "Заявка отправлена!" };
        
    } catch (error) {
        console.error("Ошибка отправки письма:", error);
        return { 
            success: false, 
            message: `Ошибка отправки: ${error.text || "Неизвестная ошибка"}` 
        };
    }
}

// ================ ПОКАЗ УСПЕШНОГО МОДАЛЬНОГО ОКНА ================

function showSuccessModal(formData) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-icon success">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Заявка отправлена успешно!</h3>
            <p>Ваша статья "${formData.title}" отправлена на конкурс в категории "${formData.category}".</p>
            <p>Мы свяжемся с вами по email <strong>${formData.email}</strong> после проверки заявки.</p>
            
            <div class="submission-details">
                <h4><i class="fas fa-info-circle"></i> Детали вашей заявки:</h4>
                <ul>
                    <li><strong>ФИО:</strong> ${formData.name}</li>
                    <li><strong>Ссылка на файл:</strong> <a href="${formData.file_url}" target="_blank" style="color: var(--accent-light); word-break: break-all;">${formData.file_url.substring(0, 50)}...</a></li>
                    <li><strong>Дата отправки:</strong> ${new Date().toLocaleDateString('ru-RU')}</li>
                </ul>
            </div>
            
            <div class="next-steps">
                <h4><i class="fas fa-list-ol"></i> Что дальше?</h4>
                <ol>
                    <li>Мы проверим вашу заявку в течение 3 рабочих дней</li>
                    <li>Если статья соответствует требованиям, она будет допущена к конкурсу</li>
                    <li>О результатах отбора вы узнаете по email</li>
                    <li>Финал конкурса и голосование пройдут после 15 января 2026 года</li>
                </ol>
            </div>
            
            <button class="modal-btn" id="closeSuccessModal">
                <i class="fas fa-check"></i> Понятно
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Обработчики закрытия
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.querySelector('#closeSuccessModal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// ================ ФУНКЦИЯ ДЛЯ ПОКАЗА СТАТУСА ================

function showFormStatus(message, type = 'info') {
    const statusElement = document.getElementById('formStatus');
    if (!statusElement) return;
    
    statusElement.textContent = message;
    statusElement.className = `form-status ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}

// ================ ФУНКЦИЯ ДЛЯ ПОКАЗА ОШИБКИ ================

function showErrorModal(errorMessage) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-icon error">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <h3>Ошибка отправки</h3>
            <p>${errorMessage}</p>
            <p>Пожалуйста, попробуйте еще раз или отправьте статью напрямую на <strong>gemiandrui@gmail.com</strong></p>
            <div style="margin-top: 20px;">
                <button class="modal-btn" id="closeErrorModal">Закрыть</button>
                <button class="modal-btn secondary" id="retryBtn">Попробовать снова</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Обработчики для модального окна с ошибкой
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('#closeErrorModal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('#retryBtn').addEventListener('click', () => {
        modal.remove();
        document.getElementById('article-form').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Закрытие при клике вне окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ================ ФУНКЦИИ ДЛЯ ОБЛАЧНЫХ СЕРВИСОВ ================

// Добавляем обработчики для кнопок облачных сервисов
document.addEventListener('DOMContentLoaded', () => {
    // Google Drive
    const googleDriveBtn = document.getElementById('googleDriveBtn');
    if (googleDriveBtn) {
        googleDriveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showCloudInstructions('Google Drive', 'https://drive.google.com');
        });
    }
    
    // Яндекс.Диск
    const yandexDiskBtn = document.getElementById('yandexDiskBtn');
    if (yandexDiskBtn) {
        yandexDiskBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showCloudInstructions('Яндекс.Диск', 'https://disk.yandex.ru');
        });
    }
    
    // Dropbox
    const dropboxBtn = document.getElementById('dropboxBtn');
    if (dropboxBtn) {
        dropboxBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showCloudInstructions('Dropbox', 'https://www.dropbox.com');
        });
    }
});

function showCloudInstructions(serviceName, serviceUrl) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    let instructions = '';
    if (serviceName === 'Google Drive') {
        instructions = `
            <ol>
                <li>Загрузите файл на Google Drive</li>
                <li>Нажмите правой кнопкой на файл → "Предоставить доступ"</li>
                <li>Выберите "Доступ по ссылке" (Anyone with the link)</li>
                <li>Скопируйте ссылку и вставьте в форму</li>
                <li>Настройте доступ: "Может просматривать" или "Может комментировать"</li>
            </ol>
        `;
    } else if (serviceName === 'Яндекс.Диск') {
        instructions = `
            <ol>
                <li>Загрузите файл на Яндекс.Диск</li>
                <li>Нажмите на файл → "Поделиться"</li>
                <li>Включите "Доступ по ссылке"</li>
                <li>Скопируйте ссылку и вставьте в форму</li>
                <li>Убедитесь, что стоит галочка "Разрешить скачивание"</li>
            </ol>
        `;
    } else if (serviceName === 'Dropbox') {
        instructions = `
            <ol>
                <li>Загрузите файл в Dropbox</li>
                <li>Наведите на файл → нажмите "Поделиться"</li>
                <li>Выберите "Создать ссылку"</li>
                <li>Скопируйте ссылку и вставьте в форму</li>
                <li>Убедитесь, что доступ разрешен для "Anyone with the link"</li>
            </ol>
        `;
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-icon">
                <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <h3>Инструкция для ${serviceName}</h3>
            ${instructions}
            <div class="modal-buttons">
                <a href="${serviceUrl}" target="_blank" class="modal-btn primary">
                    <i class="fas fa-external-link-alt"></i> Перейти в ${serviceName}
                </a>
                <button class="modal-btn secondary" id="closeCloudModal">
                    Закрыть
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.querySelector('#closeCloudModal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}

// ================ ПОДСЧЕТ СИМВОЛОВ ================

const articleText = document.getElementById('article-text');
const charCount = document.getElementById('charCount');

if (articleText && charCount) {
    articleText.addEventListener('input', () => {
        const count = articleText.value.length;
        charCount.textContent = count;
        
        if (count > 3000) {
            charCount.style.color = 'var(--error)';
            articleText.style.borderColor = 'var(--error)';
        } else if (count > 2500) {
            charCount.style.color = 'var(--gold)';
            articleText.style.borderColor = 'var(--gold)';
        } else {
            charCount.style.color = 'var(--text-light)';
            articleText.style.borderColor = 'var(--accent)';
        }
    });
}

// ================ ВАЛИДАЦИЯ EMAIL ================

const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            showFormStatus('Пожалуйста, введите корректный email адрес', 'error');
            emailInput.style.borderColor = 'var(--error)';
        } else {
            emailInput.style.borderColor = 'var(--accent)';
        }
    });
}

// ================ ПЛАВНАЯ ПРОКРУТКА ================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ================ ИНИЦИАЛИЗАЦИЯ ================

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    function animateOnScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight - 100) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    }
    
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    setTimeout(() => {
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }, 300);
});

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        createStars();
    }, 250);
});
