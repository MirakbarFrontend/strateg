class Timer {
	constructor(buttonSelectors, duration = 120) {
		this.buttons = buttonSelectors.map(selector => document.querySelector(selector));
		this.time = duration;
		this.duration = duration;
		this.intervalId = null;
		this.init();
	}

	init() {
		this.updateDisplay();
		this.intervalId = setInterval(() => this.tick(), 1000);
	}

	tick() {
		if (this.time <= 0) {
			this.time = this.duration;
		} else {
			this.time--;
		}
		this.updateDisplay();
	}

	updateDisplay() {
		const minutes = String(Math.floor(this.time / 60)).padStart(2, '0');
		const seconds = String(this.time % 60).padStart(2, '0');
		const timeString = `${minutes}:${seconds}`;
		this.buttons.forEach(btn => (btn.textContent = timeString));
	}
}

class Modal {
	static open(id) {
		const modal = document.getElementById(id);
		if (modal) modal.style.display = 'block';
	}

	static close(id) {
		const modal = document.getElementById(id);
		if (modal) modal.style.display = 'none';
	}

	static initGlobalClose(modalId) {
		window.addEventListener('click', e => {
			const modal = document.getElementById(modalId);
			if (e.target === modal) Modal.close(modalId);
		});
	}
}

class FormValidator {
	constructor(formId) {
		this.form = document.getElementById(formId);
		this.nameInput = document.getElementById('name');
		this.numberInput = document.getElementById('number');
		this.countryCodeEl = document.getElementById('selectedCode');
		this.nameError = document.getElementById('name-error');
		this.numberError = document.getElementById('number-error');

		if (this.form) {
			this.form.addEventListener('submit', e => this.handleSubmit(e));
		}
	}

	handleSubmit(e) {
		e.preventDefault();
		this.clearErrors();

		const name = this.nameInput.value.trim();
		const number = this.numberInput.value.trim();
		const countryCode = this.countryCodeEl.textContent.trim();
		const digitsOnly = number.replace(/\D/g, '');

		let isValid = true;

		if (!name) {
			this.nameError.textContent = 'Ism kiritilishi shart.';
			isValid = false;
		} else if (/\d/.test(name)) {
			this.nameError.textContent = "Ismda raqam bo'lishi mumkin emas.";
			isValid = false;
		}

		const { requiredLength, errorMessage } = FormValidator.getValidationRules(countryCode);
		if (digitsOnly.length !== requiredLength) {
			this.numberError.textContent = errorMessage;
			isValid = false;
		}

		if (isValid) {
			window.location.href = 'obuna.html';
		}
	}

	clearErrors() {
		this.nameError.textContent = '';
		this.numberError.textContent = '';
	}

	static getValidationRules(code) {
		const rules = {
			'+998': { requiredLength: 9, errorMessage: "91 123 45 67 bo'lishi kerak." },
			'+1': { requiredLength: 10, errorMessage: "555 123 4567 bo'lishi kerak." },
			'+82': { requiredLength: 10, errorMessage: "10 1234 5678 bo'lishi kerak." },
			'+996': { requiredLength: 9, errorMessage: "555 123 456 bo'lishi kerak." },
			'+7': { requiredLength: 10, errorMessage: "912 345 67 89 bo'lishi kerak." },
			'+90': { requiredLength: 10, errorMessage: "532 123 45 67 bo'lishi kerak." },
			'+44': { requiredLength: 10, errorMessage: "7911 123456 bo'lishi kerak." },
		};
		return rules[code] || rules['+998'];
	}
}

class CountrySelector {
	constructor() {
		this.selectedCode = '+998';
		this.isOpen = false;
		this.initializeElements();
		this.addEventListeners();
	}

	initializeElements() {
		this.button = document.getElementById('countryButton');
		this.dropdown = document.getElementById('countryDropdown');
		this.arrow = document.getElementById('dropdownArrow');
		this.selectedSpan = document.getElementById('selectedCode');
		this.options = document.querySelectorAll('.country-option');
		this.input = document.getElementById('number');
	}

	addEventListeners() {
		this.button.addEventListener('click', e => {
			e.preventDefault();
			this.toggle();
		});

		this.options.forEach(option => {
			option.addEventListener('click', e => {
				e.preventDefault();
				this.select(option);
			});
		});

		document.addEventListener('click', e => {
			if (!this.button.contains(e.target) && !this.dropdown.contains(e.target)) {
				this.close();
			}
		});

		document.addEventListener('keydown', e => {
			if (e.key === 'Escape') this.close();
		});

		this.input.addEventListener('keypress', e => {
			const char = String.fromCharCode(e.which);
			if (!/\d/.test(char)) e.preventDefault();
		});

		this.input.addEventListener('input', e => {
			e.target.value = CountrySelector.formatPhoneNumber(e.target.value, this.selectedCode);
			document.getElementById('number-error').textContent = '';
		});

		this.input.addEventListener('paste', e => {
			setTimeout(() => {
				this.input.value = CountrySelector.formatPhoneNumber(this.input.value, this.selectedCode);
			}, 10);
		});
	}

	toggle() {
		this.isOpen ? this.close() : this.open();
	}

	open() {
		this.dropdown.classList.add('show');
		this.arrow.classList.add('open');
		this.isOpen = true;
	}

	close() {
		this.dropdown.classList.remove('show');
		this.arrow.classList.remove('open');
		this.isOpen = false;
	}

	select(option) {
		this.selectedCode = option.dataset.code;
		this.selectedSpan.textContent = this.selectedCode;
		this.options.forEach(opt => opt.classList.remove('selected'));
		option.classList.add('selected');

		if (this.input) {
			this.input.placeholder = CountrySelector.getPlaceholder(this.selectedCode);
			this.input.value = CountrySelector.formatPhoneNumber(this.input.value, this.selectedCode);
			setTimeout(() => this.input.focus(), 100);
		}

		this.close();
		this.onChange(this.selectedCode, option.dataset.name);
	}

	onChange(code, name) {
		console.log(`Selected: ${name} (${code})`);
	}

	static getPlaceholder(code) {
		const placeholders = {
			'+998': '91 123 45 67',
			'+1': '555 123 4567',
			'+82': '10 1234 5678',
			'+996': '555 123 456',
			'+7': '912 345 67 89',
			'+90': '532 123 45 67',
			'+44': '7911 123456',
		};
		return placeholders[code] || '91 123 45 67';
	}

	static formatPhoneNumber(value, code) {
		const cleaned = value.replace(/\D/g, '');
		const formatters = {
			'+998': /^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/,
			'+1': /^(\d{0,3})(\d{0,3})(\d{0,4})$/,
			'+82': /^(\d{0,2})(\d{0,4})(\d{0,4})$/,
			'+996': /^(\d{0,3})(\d{0,3})(\d{0,3})$/,
			'+7': /^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/,
			'+90': /^(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/,
			'+44': /^(\d{0,4})(\d{0,6})$/,
		};

		const match = cleaned.match(formatters[code] || formatters['+998']);
		return match ? match.slice(1).filter(Boolean).join(' ') : cleaned;
	}
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
	new Timer(['.strateg__info-flex-btn2', '.strateg__info-flex-btn3']);
	const countrySelector = new CountrySelector();
	new FormValidator('myForm'); // Replace with your actual form id
	Modal.initGlobalClose('modal');

	window.addEventListener('pageshow', e => {
		if (e.persisted || performance.getEntriesByType('navigation')[0].type === 'back_forward') {
			document.getElementById('name').value = '';
			document.getElementById('number').value = '';
			document.getElementById('name-error').textContent = '';
			document.getElementById('number-error').textContent = '';
			countrySelector.selectedCode = '+998';
			countrySelector.selectedSpan.textContent = '+998';
			document.querySelectorAll('.country-option').forEach(opt => opt.classList.remove('selected'));
			document.querySelector('.country-option[data-code="+998"]').classList.add('selected');
			countrySelector.input.placeholder = CountrySelector.getPlaceholder('+998');
			countrySelector.close();
			Modal.close('modal');
		}
	});
});
