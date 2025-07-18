const inputTxt = document.getElementById('input-text');
const voiceSelect = document.getElementById('voice-select');
const rate = document.getElementById('rate');
const rateValue = document.getElementById('rate-value');
const pitch = document.getElementById('pitch');
const pitchValue = document.getElementById('pitch-value');
const speakBtn = document.getElementById('speak-btn');
const stopBtn = document.getElementById('stop-btn');
const listenBtn = document.getElementById('listen-btn');

// Store original Listen button text
const listenOriginalText = listenBtn.textContent;

let voices = [];

function populateVoiceList() {
    voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';
    voices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = i;
        voiceSelect.appendChild(option);
    });
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

let utterance;

speakBtn.addEventListener('click', () => {
    if (utterance && speechSynthesis.speaking) {
        speechSynthesis.cancel();
    }
    utterance = new SpeechSynthesisUtterance(inputTxt.value);
    utterance.voice = voices[voiceSelect.value];
    utterance.rate = rate.value;
    utterance.pitch = pitch.value;
    speechSynthesis.speak(utterance);
});

stopBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
});

rate.addEventListener('change', () => {
    rateValue.textContent = rate.value;
});

pitch.addEventListener('change', () => {
    pitchValue.textContent = pitch.value;
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
        inputTxt.value = event.results[0][0].transcript;
    };

    // When recognition starts, update UI
    recognition.onstart = () => {
        listenBtn.disabled = true;
        listenBtn.textContent = 'Listening...';
        inputTxt.value = '';
        inputTxt.placeholder = 'Listening...';
    };
    // When recognition ends, restore UI
    recognition.onend = () => {
        listenBtn.disabled = false;
        listenBtn.textContent = listenOriginalText;
        inputTxt.placeholder = 'Enter text here...';
    };

    listenBtn.addEventListener('click', () => {
        recognition.start();
    });
} else {
    listenBtn.disabled = true;
    listenBtn.textContent = 'Speech Recognition Not Supported';
}