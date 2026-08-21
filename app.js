// --- 1. Three.js Background Rendering ---
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// 3D Globe
const sphereGeometry = new THREE.SphereGeometry(1.4, 24, 24);
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0055,
    wireframe: true,
    transparent: true,
    opacity: 0.6
});
const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(globe);

// Space Dust Particles
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 250;
const posArray = new Float32Array(particleCount * 3);

for(let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 12;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particleMaterial = new THREE.PointsMaterial({ size: 0.03, color: 0xff2a6d });
const particlesMesh = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particlesMesh);

function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.004;
    particlesMesh.rotation.y -= 0.001;
    renderer.render(scene, camera);
}
animate();

// --- 2. Web Audio Ambient Space Sound Effect ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSpaceAmbience() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
}

window.addEventListener('click', () => playSpaceAmbience(), { once: true });

// --- 3. Gen Z K.A.R.E.N. Voice Engine (Urdu + English) ---
function speakKAREN(text, lang = 'en-US') {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.pitch = 1.3;
    utterance.rate = 1.05;

    window.speechSynthesis.speak(utterance);
}

window.addEventListener('load', () => {
    setTimeout(() => {
        speakKAREN("Hey bestie! K.A.R.E.N. suit protocols online. What are we doing today?");
    }, 1000);
});

// --- 4. Speech Recognition (Supports English & Urdu Commands) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function toggleListening() {
    if (!SpeechRecognition) {
        alert("Browser speech API unavailable.");
        return;
    }

    const recognition = new SpeechRecognition();
    const statusText = document.getElementById('voice-status');
    const hudLog = document.getElementById('hud-log');

    recognition.lang = 'en-US'; 
    recognition.start();
    statusText.innerText = "K.A.R.E.N. IS LISTENING...";

    recognition.onresult = (event) => {
        const cmd = event.results[0][0].transcript.toLowerCase();
        statusText.innerText = `YOU: "${cmd.toUpperCase()}"`;

        const logEntry = document.createElement('p');
        logEntry.innerText = `> ${cmd}`;
        hudLog.appendChild(logEntry);

        if (cmd.includes("hello") || cmd.includes("hey") || cmd.includes("karen")) {
            speakKAREN("Slay! What's the plan, boss?");
        } 
        else if (cmd.includes("kaise ho") || cmd.includes("kya haal hai")) {
            speakKAREN("Main bilkul sahi hoon, aap batao kya karna hai!", "ur-PK");
        }
        else if (cmd.includes("open youtube")) {
            speakKAREN("Opening YouTube for you right now.");
            openApp("https://youtube.com");
        }
        else if (cmd.includes("kya kar rahi ho")) {
            speakKAREN("Aap ke laptop ke systems scan kar rahi hoon!", "ur-PK");
        }
        else {
            speakKAREN("No cap, I didn't quite get that command.");
        }
    };
}

// --- 5. App Launcher ---
function openApp(url) {
    window.open(url, '_blank');
}

// --- 6. Web Bluetooth Phone Pairing ---
async function connectPhone() {
    const statusDiv = document.getElementById('phone-status');
    try {
        statusDiv.innerText = "PHONE: SEARCHING...";
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true
        });
        statusDiv.innerText = `PHONE: CONNECTED (${device.name})`;
        speakKAREN(`Phone paired successfully with ${device.name}!`);
    } catch (error) {
        statusDiv.innerText = "PHONE: PAIRING CANCELED";
        speakKAREN("Bluetooth connection failed or canceled.");
    }
}
