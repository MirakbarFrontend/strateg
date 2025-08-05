// Tugmalarni olish
const btn2 = document.querySelector('.strateg__info-flex-btn2');
const btn3 = document.querySelector('.strateg__info-flex-btn3');

// Boshlang'ich vaqti (2 daqiqa = 120 soniya)
let time = 120;

function startTimer() {
	const minutes = String(Math.floor(time / 60)).padStart(2, '0');
	const seconds = String(time % 60).padStart(2, '0');
	const displayTime = `${minutes}:${seconds}`;

	// Har ikkala button ga vaqtni yozamiz
	btn2.textContent = displayTime;
	btn3.textContent = displayTime;

	// Vaqt tugamasa kamaytirishda davom etadi
	if (time > 0) {
		time--;
	} else {
		// Timer tugaganda qaytadan 2 daqiqaga o‘rnatiladi
		time = 120;
	}
}

// Har 1 sekundda update
setInterval(startTimer, 1000);
