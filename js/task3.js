const btn = document.getElementById('customBtn');
const iconLeftContainer = document.getElementById('btnIconLeft');
const iconRightContainer = document.getElementById('btnIconRight');
const btnText = document.getElementById('btnText');
const radiusLabel = document.getElementById('radiusVal');
const borderWidthLabel = document.getElementById('borderWidthVal');

const iconsMap = {
print: '<svg viewBox="0 0 512 512"><path d="M448 192V77.25c0-8.49-3.37-16.62-9.37-22.63L393.37 9.37c-6-6-14.14-9.37-22.63-9.37H96C78.33 0 64 14.33 64 32v160c-35.35 0-64 28.65-64 64v112c0 8.84 7.16 16 16 16h48v96c0 17.67 14.33 32 32 32h320c17.67 0 32-14.33 32-32v-96h48c8.84 0 16-7.16 16-16V256c0-35.35-28.65-64-64-64zm-64 256H128v-96h256v96zm0-224H128V64h192v48c0 8.84 7.16 16 16 16h48v96zm48 72c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24 524 10.74 24 24c0 13.25-10.75 24-24 24z"/></svg>',
edit: '<svg viewBox="0 0 512 512"><path d="M497.9 142.1l-46.1 46.1c-4.7 4.7-12.3 4.7-17 0l-111-111c-4.7-4.7-4.7-12.3 0-17l46.1-46.1c18.7-18.7 49.1-18.7 67.9 0l60.1 60.1c18.8 18.7 18.8 49.1 0 67.9zM284.2 99.8L21.6 362.4.4 483.9c-2.9 16.4 11.4 30.6 27.8 27.8l121.5-21.3 262.6-262.6c4.7-4.7 4.7-12.3 0-17l-111-111c-4.8-4.7-12.4-4.7-17.1 0zM124.1 339.9c-5.5-5.5-5.5-14.3 0-19.8l154-154c5.5-5.5 14.3-5.5 19.8 0s5.5 14.3 0 19.8l-154 154c-5.5 5.5-14.3 5.5-19.8 0zM88 424h48v36.3l-64.5 11.3-31.1-31.1L51.7 376H88v48z"/></svg>',
excel: '<svg viewBox="0 0 512 512"><path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24z"/></svg>',
delete: '<svg viewBox="0 0 352 512"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.19 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.19 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>',
upload: '<svg viewBox="0 0 512 512"><path d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24z"/></svg>'
};

function updateBtnStyles() {
btn.style.setProperty('--btn-bg', document.getElementById('ctrlBgColor').value);
btn.style.setProperty('--btn-text', document.getElementById('ctrlTextColor').value);
btn.style.setProperty('--btn-border', document.getElementById('ctrlBorderColor').value);

btn.style.setProperty('--btn-arrow-color', document.getElementById('ctrlArrowColor').value);

const borderWidth = document.getElementById('ctrlBorderWidth').value;
btn.style.setProperty('--btn-border-width', borderWidth + 'px');
borderWidthLabel.textContent = borderWidth + 'px';

const radius = document.getElementById('ctrlRadius').value;
btn.style.setProperty('--btn-radius', radius + 'px');
radiusLabel.textContent = radius + 'px';
}

document.getElementById('ctrlIconSelect').addEventListener('change', (e) => {
const key = e.target.value;
if (key === 'none') {
    iconLeftContainer.style.display = 'none';
    iconLeftContainer.innerHTML = '';
} else {
    iconLeftContainer.style.display = 'block';
    iconLeftContainer.innerHTML = iconsMap[key];
}
});

document.querySelectorAll('input[type="color"], input[type="range"]').forEach(input => {
input.addEventListener('input', updateBtnStyles);
});

document.getElementById('ctrlText').addEventListener('input', (e) => {
btnText.textContent = e.target.value;
});

document.getElementById('ctrlShowArrowRight').addEventListener('change', (e) => {
iconRightContainer.style.display = e.target.checked ? 'block' : 'none';
});

document.getElementById('ctrlDisabled').addEventListener('change', (e) => {
btn.disabled = e.target.checked;
});

iconLeftContainer.innerHTML = iconsMap['print'];
iconLeftContainer.style.display = 'block';
updateBtnStyles();