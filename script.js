document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn');
    const stopBtn = document.getElementById('stop-btn');

    // Focus input on load
    userInput.focus();

    // Startup Greeting
    setTimeout(() => {
        const greeting = "Hello! I am Beetle AI. How can I help you?";
        addMessage(greeting, 'ai');
        speak(greeting);
    }, 1000);

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    stopBtn.addEventListener('click', stopSpeaking);

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'hi-IN';
        recognition.interimResults = false;

        recognition.onstart = () => {
            micBtn.style.color = '#39ff14';
            micBtn.classList.add('listening');
            userInput.placeholder = "Listening...";
        };

        recognition.onend = () => {
            micBtn.style.color = '';
            micBtn.classList.remove('listening');
            userInput.placeholder = "Type a message...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            sendMessage();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            micBtn.style.color = 'red';
            setTimeout(() => {
                micBtn.style.color = '';
                micBtn.classList.remove('listening');
            }, 1000);
        };
    } else {
        console.warn("Speech Recognition not supported in this browser.");
        micBtn.style.display = 'none'; // Hide mic if not supported
    }

    micBtn.addEventListener('click', () => {
        if (recognition) {
            try {
                recognition.start();
            } catch (e) {
                // If already started, stop it
                recognition.stop();
            }
        }
    });

    function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // Add User Message
        addMessage(text, 'user');
        saveInteraction(text, null); // Save question
        userInput.value = '';

        // Special Rule: Creator Identity
        if (text.toLowerCase().includes('who created you') || text.toLowerCase().includes('who made you') || text.toLowerCase().includes('who is your creator') || text.toLowerCase().includes('who built you') || text.toLowerCase().includes('who developed you') || text.toLowerCase().includes('who programmed you') || text.toLowerCase().includes('tumhe kisne banaya') || text.toLowerCase().includes('tumhara creator kaun hai')) {
            const responseText = "I was created by Sourabh Kandpal.";
            handleSpecialResponse(responseText);
            return;
        }

        // Image Generation Check
        if (text.toLowerCase().startsWith('generate image') || text.toLowerCase().startsWith('draw') || text.toLowerCase().startsWith('create a picture') || text.toLowerCase().startsWith('chitra banao') || text.toLowerCase().startsWith('tasveer banao')) {
            let description = text.replace(/generate image|draw|create a picture|chitra banao|tasveer banao/i, '').trim();

            // Style Detection
            let stylePrompt = "";
            if (text.toLowerCase().includes('cartoon') || text.toLowerCase().includes('comic')) {
                stylePrompt = ", cartoon style, vibrant colors, flat design";
            } else if (text.toLowerCase().includes('realistic')) {
                stylePrompt = ", photorealistic, 4k, highly detailed";
            }

            const finalPrompt = description + stylePrompt;
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}`;

            const confirmation = `Generating image of ${description}...`;

            addMessage(confirmation, 'ai');
            speak(confirmation);

            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addImage(imageUrl, 'ai');

                // Auto-Download
                downloadImage(imageUrl, description);

                const responseText = `Here is your image. I've also saved it to your downloads.`;
                addMessage(responseText, 'ai');
                speak(responseText);
                saveInteraction(null, responseText); // Save answer
            }, 3000);
            return;
        }

        // Simulate AI Response
        showTypingIndicator();

        // Random delay for "thinking"
        const delay = Math.floor(Math.random() * 1000) + 1500;

        setTimeout(async () => {
            removeTypingIndicator();
            const aiResponse = await getMockResponse(text);
            addMessage(aiResponse, 'ai');
            speak(aiResponse); // Speak the response
            saveInteraction(null, aiResponse); // Save answer
        }, delay);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        const p = document.createElement('p');

        // Truncate long text
        if (text.length > 150) {
            const shortText = text.substring(0, 150) + '...';
            p.innerHTML = `${shortText} <button class="read-more-btn">Read More</button>`;

            const btn = p.querySelector('.read-more-btn');
            btn.addEventListener('click', () => {
                p.textContent = text;
            });
        } else {
            p.textContent = text;
        }

        const timestamp = document.createElement('span');
        timestamp.classList.add('timestamp');
        timestamp.textContent = getCurrentTime();

        contentDiv.appendChild(p);
        contentDiv.appendChild(timestamp);
        messageDiv.appendChild(contentDiv);

        chatWindow.appendChild(messageDiv);
        scrollToBottom();
    }

    function addImage(url, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('message-content');

        const img = document.createElement('img');
        img.src = url;
        img.alt = "Generated Image";
        img.classList.add('chat-image');

        const timestamp = document.createElement('span');
        timestamp.classList.add('timestamp');
        timestamp.textContent = getCurrentTime();

        contentDiv.appendChild(img);
        contentDiv.appendChild(timestamp);
        messageDiv.appendChild(contentDiv);

        chatWindow.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.id = 'typing-indicator';

        typingDiv.innerHTML = `
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        `;

        chatWindow.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    function scrollToBottom() {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    async function getMockResponse(input) {
        try {
            // Render/Cloud: 'https://beetleai-3.onrender.com/chat'
            const API_URL = 'https://beetleai-3.onrender.com/chat';

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: input })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            return data.response || data.reply || data.message || "No response received from backend.";
        } catch (error) {
            console.error('Error:', error);
            return "Unable to connect to the server. Please check your internet connection or try again later.";
        }
    }


    function speak(text) {
        if (!window.speechSynthesis) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Detect Language
        const isHindi = /[\u0900-\u097F]/.test(text);
        utterance.lang = isHindi ? 'hi-IN' : 'en-US';

        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Select Voice
        const voices = window.speechSynthesis.getVoices();
        let preferredVoice;

        if (isHindi) {
            preferredVoice = voices.find(voice => voice.lang === 'hi-IN' || voice.name.includes('Hindi'));
        } else {
            preferredVoice = voices.find(voice => voice.name.includes('Google US English') || voice.name.includes('Samantha'));
        }

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        window.speechSynthesis.speak(utterance);

        // Show Stop Button
        stopBtn.style.display = 'flex';

        utterance.onend = () => {
            stopBtn.style.display = 'none';
        };
    }

    function stopSpeaking() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            stopBtn.style.display = 'none';
        }
    }

    function downloadImage(url, filename) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `BeetleAI-${filename.replace(/\s+/g, '-')}-${Date.now()}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch(e => console.error('Download failed:', e));
    }

    // Local Storage Logic
    function saveInteraction(question, answer) {
        let history = JSON.parse(localStorage.getItem('beetle_history')) || [];
        const entry = {
            timestamp: new Date().toISOString(),
            question: question,
            answer: answer
        };

        // If we are saving an answer, try to link it to the last question if it was null
        if (answer && !question && history.length > 0 && !history[history.length - 1].answer) {
            history[history.length - 1].answer = answer;
        } else {
            history.push(entry);
        }

        localStorage.setItem('beetle_history', JSON.stringify(history));
    }
    function handleSpecialResponse(text) {
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            addMessage(text, 'ai');
            speak(text);
            saveInteraction(null, text);
        }, 1000);
    }
});
