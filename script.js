// ==========================================
// 1. ИНИЦИАЛИЗАЦИЯ И СИСТЕМА ЗАГРУЗКИ
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Безопасный таймер загрузки: рабочий стол откроется через 2 секунды в любом случае
    setTimeout(() => {
        const bootScreen = document.getElementById('boot-screen');
        const desktop = document.getElementById('desktop');
        if (bootScreen && desktop) {
            bootScreen.style.opacity = '0';
            setTimeout(() => {
                bootScreen.style.display = 'none';
                desktop.style.display = 'block';
            }, 400);
        }
    }, 2000);

    // Запуск часов
    updateClock();
    setInterval(updateClock, 1000);

    // Включение Drag & Drop для окон
    document.querySelectorAll('.window').forEach(win => makeDraggable(win));

    // Поведение адресной строки в браузере (Enter)
    const urlInput = document.getElementById('browser-url');
    if (urlInput) {
        urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                let url = urlInput.value.trim();
                if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
                urlInput.value = url;
                document.getElementById('browser-iframe').src = url;
            }
        });
    }
});

// ==========================================
// 2. ЧАСЫ И ДАТА
// ==========================================
function updateClock() {
    const now = new Date();
    const timeEl = document.getElementById('current-time');
    const dateEl = document.getElementById('current-date');
    if (timeEl) timeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (dateEl) dateEl.textContent = now.toLocaleDateString();
}

// ==========================================
// 3. БРАУЗЕР EDGE
// ==========================================
function reloadIframe() {
    const iframe = document.getElementById('browser-iframe');
    if (iframe) iframe.src = iframe.src;
}

function openExternalTab() {
    const url = document.getElementById('browser-url').value;
    window.open(url, '_blank');
}

// ==========================================
// 4. УПРАВЛЕНИЕ ОКНАМИ
// ==========================================
let zIndexCounter = 10;

function openWindow(id) {
    const win = document.getElementById(id);
    if (win) {
        win.style.display = 'flex';
        bringToFront(win);
    }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) win.style.display = 'none';
}

function bringToFront(windowEl) {
    zIndexCounter++;
    windowEl.style.zIndex = zIndexCounter;
}

// ==========================================
// 5. ПЕРЕТАСКИВАНИЕ ОКОН (DRAG & DROP)
// ==========================================
function makeDraggable(windowEl) {
    const header = windowEl.querySelector('.window-header');
    let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
    if (!header) return;

    header.onmousedown = (e) => {
        if (e.target.classList.contains('control-btn')) return;
        e.preventDefault();
        bringToFront(windowEl);
        mouseX = e.clientX; 
        mouseY = e.clientY;

        document.onmouseup = () => { 
            document.onmouseup = null; 
            document.onmousemove = null; 
        };

        document.onmousemove = (ev) => {
            ev.preventDefault();
            posX = mouseX - ev.clientX; 
            posY = mouseY - ev.clientY;
            mouseX = ev.clientX; 
            mouseY = ev.clientY;
            windowEl.style.top = (windowEl.offsetTop - posY) + "px";
            windowEl.style.left = (windowEl.offsetLeft - posX) + "px";
        };
    };
}

// ==========================================
// 6. КАЛЬКУЛЯТОР
// ==========================================
let calcExpression = "";
const screen = document.getElementById('calc-screen');

function pressCalc(val) {
    if (!screen) return;
    if (screen.value === "0" && !isNaN(val)) calcExpression = val;
    else calcExpression += val;
    screen.value = calcExpression;
}

function clearCalc() {
    calcExpression = ""; 
    if (screen) screen.value = "0"; 
}

function calculateResult() {
    if (!screen) return;
    try {
        let result = eval(calcExpression); 
        screen.value = result;
        calcExpression = result.toString();
    } catch { 
        screen.value = "Ошибка"; 
        calcExpression = ""; 
    }
}
