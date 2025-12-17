// Анимация звезд с движением
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 150;
    
    // Очищаем контейнер
    starsContainer.innerHTML = '';
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Случайные параметры для звезд
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Разные скорости движения
        const speedX = (Math.random() - 0.5) * 0.5;
        const speedY = (Math.random() - 0.5) * 0.3;
        
        // Разное время для мерцания
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.opacity = Math.random() * 0.7 + 0.3;
        
        // Сохраняем параметры движения в dataset
        star.dataset.speedX = speedX;
        star.dataset.speedY = speedY;
        star.dataset.posX = posX;
        star.dataset.posY = posY;
        
        // Добавляем анимацию мерцания
        star.style.animation = `twinkle ${duration}s infinite ${delay}s`;
        
        starsContainer.appendChild(star);
    }
    
    // Запускаем движение звезд
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
            
            // Обновляем позицию
            posX += speedX * deltaTime * 0.01;
            posY += speedY * deltaTime * 0.01;
            
            // Если звезда ушла за границы, возвращаем ее
            if (posX > 100) posX = 0;
            if (posX < 0) posX = 100;
            if (posY > 100) posY = 0;
            if (posY < 0) posY = 100;
            
            // Сохраняем новую позицию
            star.dataset.posX = posX;
            star.dataset.posY = posY;
            
            // Применяем новую позицию
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

// Мобильное меню
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        mobileMenuBtn.innerHTML = mobileNav.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Закрытие меню при клике на ссылку
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Обработка загрузки файла
const fileUploadArea = document.getElementById('fileUploadArea');
const fileInput = document.getElementById('file');
const fileName = document.getElementById('fileName');

if (fileUploadArea && fileInput) {
    // Клик по области загрузки
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Изменение файла
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const fileSize = file.size / 1024 / 1024; // Размер в MB
            
            // Проверка размера файла
            if (fileSize > 10) {
                alert('Файл слишком большой! Максимальный размер: 10MB');
                fileInput.value = '';
                fileName.textContent = '';
                return;
            }
            
            fileName.textContent = `Выбран файл: ${file.name} (${fileSize.toFixed(2)} MB)`;
            fileName.style.color = 'var(--success)';
        } else {
            fileName.textContent = '';
        }
    });
    
    // Drag and drop
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.backgroundColor = 'rgba(10, 14, 23, 0.9)';
        fileUploadArea.style.borderColor = 'var(--accent-light)';
    });
    
    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.style.backgroundColor = '';
        fileUploadArea.style.borderColor = '';
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.backgroundColor = '';
        fileUploadArea.style.borderColor = '';
        
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            const event = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(event);
        }
    });
}

// Подсчет символов в текстовом поле
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

// Обработка отправки формы
const articleForm = document.getElementById('article-form');
const successModal = document.getElementById('successModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeModal = document.querySelector('.close-modal');

if (articleForm) {
    articleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Проверяем обязательные поля
        const requiredFields = articleForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'var(--error)';
                
                // Убираем подсветку при исправлении
                field.addEventListener('input', () => {
                    field.style.borderColor = 'var(--accent)';
                });
            }
        });
        
        // Проверяем файл
        if (!fileInput.files.length) {
            isValid = false;
            fileUploadArea.style.borderColor = 'var(--error)';
            fileUploadArea.style.borderStyle = 'solid';
            
            fileInput.addEventListener('change', () => {
                fileUploadArea.style.borderColor = '';
                fileUploadArea.style.borderStyle = '';
            });
        }
        
        if (!isValid) {
            alert('Пожалуйста, заполните все обязательные поля и прикрепите файл со статьей');
            return;
        }
        
        // Проверяем согласие с условиями
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox.checked) {
            alert('Необходимо согласие с условиями конкурса');
            termsCheckbox.focus();
            return;
        }
        
        // В реальном приложении здесь был бы AJAX-запрос на сервер
        // Для демо просто показываем модальное окно
        showSuccessModal();
        
        // Очищаем форму
        articleForm.reset();
        fileName.textContent = '';
        charCount.textContent = '0';
        charCount.style.color = 'var(--text-light)';
    });
}

// Показ модального окна успеха
function showSuccessModal() {
    if (successModal) {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Закрытие модального окна
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (closeModal) {
    closeModal.addEventListener('click', () => {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Закрытие модального окна при клике вне его
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Закрываем мобильное меню, если оно открыто
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    
    // Добавляем класс для анимации появления элементов
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Анимация появления при скролле
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
    
    // Запускаем сразу и при скролле
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Анимация появления при загрузке
    setTimeout(() => {
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        });
    }, 300);
});

// Адаптация звезд при изменении размера окна
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        createStars();
    }, 250);
});