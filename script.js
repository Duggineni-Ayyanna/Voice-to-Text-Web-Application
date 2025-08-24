document.addEventListener('DOMContentLoaded', () => {
    const textBox = document.getElementById('textBox');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const copyBtn = document.getElementById('copyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const status = document.getElementById('status');
    
    let recognition;
    let isListening = false;
    
    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        status.textContent = 'Speech recognition not supported in this browser';
        startBtn.disabled = true;
        return;
    }
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    // Event handlers
    recognition.onstart = () => {
        isListening = true;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        status.textContent = 'Listening... Speak now';
    };
    
    recognition.onend = () => {
        isListening = false;
        startBtn.disabled = false;
        stopBtn.disabled = true;
        status.textContent = 'Press "Start Listening" to begin';
    };
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        
        textBox.innerHTML = finalTranscript + '<span style="color:#999">' + interimTranscript + '</span>';
    };
    
    recognition.onerror = (event) => {
        status.textContent = 'Error occurred: ' + event.error;
        console.error('Speech recognition error', event.error);
    };
    
    // Button click handlers
    startBtn.addEventListener('click', () => {
        try {
            recognition.start();
        } catch (error) {
            status.textContent = 'Error starting recognition: ' + error.message;
        }
    });
    
    stopBtn.addEventListener('click', () => {
        recognition.stop();
    });
    
    copyBtn.addEventListener('click', () => {
        const textToCopy = textBox.innerText;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                status.textContent = 'Text copied to clipboard!';
                setTimeout(() => {
                    if (isListening) {
                        status.textContent = 'Listening... Speak now';
                    } else {
                        status.textContent = 'Press "Start Listening" to begin';
                    }
                }, 2000);
            })
            .catch(err => {
                status.textContent = 'Failed to copy text: ' + err;
            });
    });
    
    clearBtn.addEventListener('click', () => {
        textBox.textContent = '';
    });
});

