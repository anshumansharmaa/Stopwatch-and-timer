let tickAudio;
let beepAudio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");

window.addEventListener('click', () => {
    if (!tickAudio) {
        tickAudio = new Audio('tick.mp3');  // Make sure this file exists in your project
        tickAudio.load();
    }
});

let isTimer = false;
let running = false;
let time = 0;
let interval;

const display = {
    h1: document.getElementById('h1'),
    h2: document.getElementById('h2'),
    m1: document.getElementById('m1'),
    m2: document.getElementById('m2'),
    s1: document.getElementById('s1'),
    s2: document.getElementById('s2')
};

function updateDisplay() {
    let hrs = Math.floor(time / 3600);
    let mins = Math.floor((time % 3600) / 60);
    let secs = time % 60;

    let hStr = hrs.toString().padStart(2, '0');
    let mStr = mins.toString().padStart(2, '0');
    let sStr = secs.toString().padStart(2, '0');

    flip(display.h1, hStr[0]);
    flip(display.h2, hStr[1]);
    flip(display.m1, mStr[0]);
    flip(display.m2, mStr[1]);
    flip(display.s1, sStr[0]);
    flip(display.s2, sStr[1]);
}

function flip(el, val) {
    if (el.textContent !== val) {
        el.style.transform = 'rotateX(90deg)';
        setTimeout(() => {
            el.textContent = val;
            el.style.transform = 'rotateX(0deg)';
        }, 150);
    }
}

function playTick() {
    if (tickAudio) {
        tickAudio.currentTime = 0;
        tickAudio.play().catch(() => {});
    }
}

function startPause() {
    if (!running) {
        if (isTimer && time === 0) {
            const hrs = parseInt(document.getElementById('input-hours').value) || 0;
            const mins = parseInt(document.getElementById('input-minutes').value) || 0;
            const secs = parseInt(document.getElementById('input-seconds').value) || 0;
            time = hrs * 3600 + mins * 60 + secs;
            if (time <= 0) return alert('Set valid timer time.');
            localStorage.setItem('lastTimer', JSON.stringify({ hrs, mins, secs }));
        }
        running = true;
        document.getElementById('startBtn').textContent = 'Pause';
        interval = setInterval(() => {
            if (isTimer) {
                time--;
                if (time <= 0) {
                    time = 0;
                    clearInterval(interval);
                    document.getElementById('startBtn').textContent = 'Start';
                    running = false;
                    beepAudio.play();
                    if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
                    alert("⏰ Time's up!");
                }
            } else {
                time++;
            }
            updateDisplay();
            playTick(); // ✅ TICK SOUND
        }, 1000);
    } else {
        clearInterval(interval);
        running = false;
        document.getElementById('startBtn').textContent = 'Start';
    }
}

function reset() {
    clearInterval(interval);
    running = false;
    time = 0;
    updateDisplay();
    document.getElementById('startBtn').textContent = 'Start';
}

function toggleMode() {
    reset();
    isTimer = !isTimer;
    document.getElementById('timer-inputs').style.display = isTimer ? 'flex' : 'none';
    document.querySelector('.top-controls button').textContent = isTimer ? 'Switch to Stopwatch' : 'Switch to Timer';

    if (isTimer) {
        let saved = JSON.parse(localStorage.getItem('lastTimer') || '{}');
        document.getElementById('input-hours').value = saved.hrs || '';
        document.getElementById('input-minutes').value = saved.mins || '';
        document.getElementById('input-seconds').value = saved.secs || '';
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function toggleTheme() {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
}

// Apply stored theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
}

updateDisplay();
