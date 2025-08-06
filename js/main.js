// Tugmalarni olish
const btn2 = document.querySelector('.strateg__info-flex-btn2');
const btn3 = document.querySelector('.strateg__info-flex-btn3');

// Boshlang'ich vaqti (2 daqiqa = 120 soniya)
let time = 120;

function startTimer() {
	const minutes = String(Math.floor(time / 60)).padStart(2, '0');
	const seconds = String(time % 60).padStart(2, '0');
	const displayTime = `${minutes}:${seconds}`;

	btn2.textContent = displayTime;
	btn3.textContent = displayTime;

	if (time > 0) {
		time--;
	} else {
		time = 120;
	}
}

setInterval(startTimer, 1000);

function openModal() {
	document.getElementById('modal').style.display = 'block';
}

function closeModal() {
	document.getElementById('modal').style.display = 'none';
}

function submitForm(event) {
	event.preventDefault();
	const nameInput = document.getElementById('name');
	const numberInput = document.getElementById('number');
	const countryCode = document.getElementById('selectedCode').textContent.trim();
	const name = nameInput.value.trim();
	const number = numberInput.value.trim();
	const nameError = document.getElementById('name-error');
	const numberError = document.getElementById('number-error');

	nameError.textContent = '';
	numberError.textContent = '';

	let isValid = true;

	if (name === '') {
		nameError.textContent = 'Ism kiritilishi shart.';
		isValid = false;
	} else if (/\d/.test(name)) {
		nameError.textContent = "Ismda raqam bo'lishi mumkin emas.";
		isValid = false;
	}

	const digitsOnly = number.replace(/\D/g, '');
	const validationRules = getValidationRules(countryCode);
	if (digitsOnly.length !== validationRules.requiredLength) {
		numberError.textContent = validationRules.errorMessage;
		isValid = false;
	}

	if (!isValid) return false;

	window.location.href = 'obuna.html';
	return true;
}

function getValidationRules(countryCode) {
	const rules = {
		'+998': {
			requiredLength: 9,
			errorMessage: "O'zbekiston raqami 9 ta raqam bo'lishi kerak (masalan: 91 123 45 67).",
		},
		'+1': {
			requiredLength: 10,
			errorMessage: "AQSH raqami 10 ta raqam bo'lishi kerak (masalan: 555 123 4567).",
		},
		'+82': {
			requiredLength: 10,
			errorMessage: "Janubiy Koreya raqami 10 ta raqam bo'lishi kerak (masalan: 10 1234 5678).",
		},
		'+996': {
			requiredLength: 9,
			errorMessage: "Qirg'iziston raqami 9 ta raqam bo'lishi kerak.",
		},
		'+7': {
			requiredLength: 10,
			errorMessage: "Qozog'iston raqami 10 ta raqam bo'lishi kerak.",
		},
		'+90': {
			requiredLength: 10,
			errorMessage: "Turkiya raqami 10 ta raqam bo'lishi kerak.",
		},
		'+44': {
			requiredLength: 10,
			errorMessage: "Angliya raqami 10 ta raqam bo'lishi kerak.",
		},
	};

	return rules[countryCode] || rules['+998'];
}

function formatPhoneNumber(value, countryCode) {
	const cleaned = value.replace(/\D/g, '');

	switch (countryCode) {
		case '+998':
			const cleaned998 = cleaned.substring(0, 9);
			const match998 = cleaned998.match(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/);
			if (!match998) return cleaned998;
			return [match998[1], match998[2], match998[3], match998[4]].filter(Boolean).join(' ').trim();

		case '+1':
			const cleaned1 = cleaned.substring(0, 10);
			const match1 = cleaned1.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
			if (!match1) return cleaned1;
			return [match1[1], match1[2], match1[3]].filter(Boolean).join(' ').trim();

		case '+82':
			const cleaned82 = cleaned.substring(0, 10);
			const match82 = cleaned82.match(/^(\d{0,2})(\d{0,4})(\d{0,4})$/);
			if (!match82) return cleaned82;
			return [match82[1], match82[2], match82[3]].filter(Boolean).join(' ').trim();

		case '+996':
			const cleaned996 = cleaned.substring(0, 9);
			const match996 = cleaned996.match(/^(\d{0,3})(\d{0,3})(\d{0,3})$/);
			if (!match996) return cleaned996;
			return [match996[1], match996[2], match996[3]].filter(Boolean).join(' ').trim();

		case '+7':
			const cleaned7 = cleaned.substring(0, 10);
			const match7 = cleaned7.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
			if (!match7) return cleaned7;
			return [match7[1], match7[2], match7[3], match7[4]].filter(Boolean).join(' ').trim();

		case '+90':
			const cleaned90 = cleaned.substring(0, 10);
			const match90 = cleaned90.match(/^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
			if (!match90) return cleaned90;
			return [match90[1], match90[2], match90[3], match90[4]].filter(Boolean).join(' ').trim();

		case '+44':
			const cleaned44 = cleaned.substring(0, 10);
			const match44 = cleaned44.match(/^(\d{0,4})(\d{0,6})$/);
			if (!match44) return cleaned44;
			return [match44[1], match44[2]].filter(Boolean).join(' ').trim();

		default:
			return cleaned.substring(0, 9);
	}
}

function getPlaceholder(countryCode) {
	const placeholders = {
		'+998': '91 123 45 67',
		'+1': '555 123 4567',
		'+82': '10 1234 5678',
		'+996': '555 123 456',
		'+7': '912 345 67 89',
		'+90': '532 123 45 67',
		'+44': '7911 123456',
	};

	return placeholders[countryCode] || '91 123 45 67';
}

class CountrySelector {
	constructor() {
		this.selectedCountryCode = '+998';
		this.isDropdownOpen = false;
		this.initializeElements();
		this.bindEvents();
	}

	initializeElements() {
		this.countryButton = document.getElementById('countryButton');
		this.dropdown = document.getElementById('countryDropdown');
		this.dropdownArrow = document.getElementById('dropdownArrow');
		this.selectedCodeSpan = document.getElementById('selectedCode');
		this.countryOptions = document.querySelectorAll('.country-option');
		this.numberInput = document.getElementById('number');
	}

	bindEvents() {
		this.countryButton.addEventListener('click', e => {
			e.preventDefault();
			this.toggleDropdown();
		});

		this.countryOptions.forEach(option => {
			option.addEventListener('click', e => {
				e.preventDefault();
				this.selectCountry(option);
			});
		});

		document.addEventListener('click', e => {
			if (!this.countryButton.contains(e.target) && !this.dropdown.contains(e.target)) {
				this.closeDropdown();
			}
		});

		document.addEventListener('keydown', e => {
			if (e.key === 'Escape') {
				this.closeDropdown();
			}
		});

		if (this.numberInput) {
			this.numberInput.addEventListener('keypress', e => {
				const char = String.fromCharCode(e.which);
				if (!/[0-9]/.test(char) && e.which !== 8 && e.which !== 0) {
					e.preventDefault();
				}
			});

			this.numberInput.addEventListener('input', e => {
				const formatted = formatPhoneNumber(e.target.value, this.selectedCountryCode);
				e.target.value = formatted;

				const numberError = document.getElementById('number-error');
				if (numberError) {
					numberError.textContent = '';
				}
			});

			this.numberInput.addEventListener('paste', e => {
				setTimeout(() => {
					const formatted = formatPhoneNumber(e.target.value, this.selectedCountryCode);
					e.target.value = formatted;
				}, 10);
			});
		}
	}

	toggleDropdown() {
		this.isDropdownOpen ? this.closeDropdown() : this.openDropdown();
	}

	openDropdown() {
		this.dropdown.classList.add('show');
		this.dropdownArrow.classList.add('open');
		this.isDropdownOpen = true;
	}

	closeDropdown() {
		this.dropdown.classList.remove('show');
		this.dropdownArrow.classList.remove('open');
		this.isDropdownOpen = false;
	}

	selectCountry(option) {
		const code = option.dataset.code;
		const name = option.dataset.name;

		this.selectedCountryCode = code;
		this.selectedCodeSpan.textContent = code;

		this.countryOptions.forEach(opt => opt.classList.remove('selected'));
		option.classList.add('selected');

		if (this.numberInput) {
			this.numberInput.placeholder = getPlaceholder(code);
			if (this.numberInput.value) {
				this.numberInput.value = formatPhoneNumber(this.numberInput.value, code);
			}
			setTimeout(() => this.numberInput.focus(), 100);
		}

		this.closeDropdown();
		this.onCountryChange(code, name);
	}

	getSelectedCountry() {
		return {
			code: this.selectedCountryCode,
			name: document.querySelector('.country-option.selected').dataset.name,
		};
	}

	onCountryChange(code, name) {
		console.log(`Tanlangan davlat: ${name} (${code})`);
	}
}

document.addEventListener('DOMContentLoaded', function () {
	const countrySelector = new CountrySelector();

	countrySelector.onCountryChange = function (code, name) {
		console.log(`Tanlangan davlat: ${name} (${code})`);
	};

	window.addEventListener('pageshow', function (event) {
		if (event.persisted || performance.getEntriesByType('navigation')[0].type === 'back_forward') {
			const nameInput = document.getElementById('name');
			const numberInput = document.getElementById('number');
			const nameError = document.getElementById('name-error');
			const numberError = document.getElementById('number-error');

			if (nameInput) nameInput.value = '';
			if (numberInput) numberInput.value = '';
			if (nameError) nameError.textContent = '';
			if (numberError) numberError.textContent = '';

			countrySelector.selectedCountryCode = '+998';
			countrySelector.selectedCodeSpan.textContent = '+998';
			countrySelector.countryOptions.forEach(opt => opt.classList.remove('selected'));
			countrySelector.countryOptions[0].classList.add('selected');
			countrySelector.closeDropdown();

			if (numberInput) {
				numberInput.placeholder = getPlaceholder('+998');
			}

			closeModal();
		}
	});
});

window.addEventListener('click', function (event) {
	const modal = document.getElementById('modal');
	if (event.target === modal) {
		closeModal();
	}
});
