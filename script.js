let display = document.getElementById("display");
let tickSound = document.getElementById("tickSound");

let timerMode = true;
let interval;
let totalSeconds = 0;

document.getElementById("start").onclick = () => {
  if (interval) return;
  if (timerMode) {
    const h = parseInt(document.getElementById("hoursInput").value || "0");
    const m = parseInt(document.getElementById("minutesInput").value || "0");
    const s = parseInt(document.getElementById("secondsInput").value || "0");
    totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds <= 0) return;
  } else {
    totalSeconds = 0;
  }

  interval = setInterval(() => {
    if (tickSound) tickSound.play();

    if (timerMode) {
      if (totalSeconds > 0) {
        totalSeconds--;
      } else {
        clearInterval(interval);
        interval = null;
      }
    } else {
      totalSeconds++;
    }
    updateDisplay();
  }, 1000);
};

document.getElementById("pause").onclick = () => {
  clearInterval(interval);
  interval = null;
};

document.getElementById("reset").onclick = () => {
  clearInterval(interval);
  interval = null;
  totalSeconds = 0;
  updateDisplay();
};

document.getElementById("switchToTimer").onclick = () => {
  timerMode = true;
  document.getElementById("timeInputs").style.display = "block";
  updateDisplay();
};
document.getElementById("switchToStopwatch").onclick = () => {
  timerMode = false;
  document.getElementById("timeInputs").style.display = "none";
  updateDisplay();
};

document.getElementById("fullscreen").onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

function updateDisplay() {
  let h = Math.floor(totalSeconds / 3600);
  let m = Math.floor((totalSeconds % 3600) / 60);
  let s = totalSeconds % 60;
  display.textContent =
    String(h).padStart(2, "0") +
    ":" +
    String(m).padStart(2, "0") +
    ":" +
    String(s).padStart(2, "0");
}

updateDisplay();