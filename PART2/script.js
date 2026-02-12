/**
 * Valentine's Day Interactive Experience
 * Professional web application with animations, chat, and dark mode
 */

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================
const CONFIG = {
    INTRO_TEXT: "You are my today and my forever ❤️",
    TYPING_SPEED: 40, // milliseconds per character
    VALENTINE_DATE: "Feb 14, 2026 00:00:00",
    MESSAGE_DELAY: 1500, // milliseconds between messages
    PARTICLES_COUNT: 80,
    DARK_MODE_KEY: "valentine-dark-mode"
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================
const state = {
    typingIndex: 0,
    messageIndex: 0,
    isAnimating: false
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Safely get DOM element and log error if not found
 */
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with id "${id}" not found`);
    }
    return element;
}

/**
 * Typing animation effect with proper cleanup
 */
function typeIntro() {
    const typingElement = getElement("typingText");
    if (!typingElement) return;
    
    if (state.typingIndex < CONFIG.INTRO_TEXT.length) {
        // Use textContent for better security (prevents XSS)
        typingElement.textContent += CONFIG.INTRO_TEXT.charAt(state.typingIndex);
        state.typingIndex++;
        setTimeout(typeIntro, CONFIG.TYPING_SPEED);
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize app when DOM is fully loaded
 */
document.addEventListener("DOMContentLoaded", () => {
    typeIntro();
    updateCountdown();
    initDarkMode();
    initThemeToggle();
    initStartButton();
    initReasonButton();
    initCanvas();
});


// ============================================================================
// COUNTDOWN TIMER
// ============================================================================

/**
 * Update countdown timer to Valentine's Day
 */
function updateCountdown() {
    const countdownElement = getElement("countdown");
    if (!countdownElement) return;
    
    const valentineTime = new Date(CONFIG.VALENTINE_DATE).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = valentineTime - currentTime;

    if (timeDifference <= 0) {
        countdownElement.textContent = "Happy Valentine's Day! 💖";
        return;
    }

    const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
    const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;
    
    const days = Math.floor(timeDifference / MILLISECONDS_PER_DAY);
    const hours = Math.floor((timeDifference % MILLISECONDS_PER_DAY) / MILLISECONDS_PER_HOUR);

    countdownElement.textContent = `${days}d ${hours}h until Valentine ❤️`;
}

// Update countdown immediately and then every second
setInterval(updateCountdown, 1000);


// ============================================================================
// DARK MODE THEME
// ============================================================================

/**
 * Initialize dark mode from localStorage
 */
function initDarkMode() {
    const savedTheme = localStorage.getItem(CONFIG.DARK_MODE_KEY);
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }
}

/**
 * Initialize theme toggle button
 */
function initThemeToggle() {
    const toggleButton = getElement("themeToggle");
    if (!toggleButton) return;
    
    toggleButton.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem(CONFIG.DARK_MODE_KEY, isDark ? "dark" : "light");
    });
}


// ============================================================================
// INTERACTIVE EXPERIENCE
// ============================================================================

const REASONS = [
    "Your smile lights up my whole world ✨",
    "The way you listen like my words actually matter 👂",
    "You make me laugh even on my worst days 😂",
    "Your kindness towards me is everything 💚",
    "You believe in me more than I believe in myself, Even tho am full on flaws 🌟",
    "The way you hold onto me feels like home 🏠",
    "You never give up 🚀",
    "Your presence calms all my worries and fears 🕊️",
    "The inside jokes only we understand 🤭",
    "How You love me at my absolute worst 💜",
    "Every moment with you feels like an adventure 🗺️",
    "You're the first person I want to tell everything to believe it or not 📱",
    "Your passion for life everyday is contagious 🔥",
    "The way you make ordinary days extraordinary ✨",
    "Because you're my forever person ❤️"
];

/**
 * Start the interactive experience and display introduction
 */
function startExperience() {
    if (state.isAnimating) return;
    
    state.isAnimating = true;
    state.messageIndex = 0;
    
    const reasonBox = getElement("reasonBox");
    const reasonControls = getElement("reasonControls");
    
    if (!reasonBox || !reasonControls) return;

    reasonBox.classList.remove("hidden");
    displayNextReason();
    reasonControls.classList.remove("hidden");
    state.isAnimating = false;
}

/**
 * Display next reason and update counter
 */
function displayNextReason() {
    const reasonBox = getElement("reasonBox");
    const reasonCounter = getElement("reasonCounter");
    const nextButton = getElement("nextReason");
    
    if (!reasonBox || !reasonCounter) return;
    
    if (state.messageIndex < REASONS.length) {
        const reason = REASONS[state.messageIndex];
        
        reasonBox.textContent = reason;
        reasonCounter.textContent = `${state.messageIndex + 1} / ${REASONS.length}`;
        
        state.messageIndex++;
        
        // Change button text on last reason
        if (state.messageIndex === REASONS.length && nextButton) {
            nextButton.textContent = "I Love You So Much 💕";
        }
    } else {
        // Show final message
        showFinalMessage();
    }
}

/**
 * Show the final romantic message
 */
function showFinalMessage() {
    const finalOverlay = getElement("finalOverlay");
    if (finalOverlay) {
        finalOverlay.classList.remove("hidden");
    }
}

/**
 * Initialize start button
 */
function initStartButton() {
    const startButton = document.querySelector(".main-btn");
    if (!startButton) return;
    
    startButton.addEventListener("click", startExperience);
}


// ============================================================================
// REASON BUTTON
// ============================================================================

/**
 * Initialize reason navigation button
 */
function initReasonButton() {
    const nextButton = getElement("nextReason");
    if (!nextButton) return;
    
    nextButton.addEventListener("click", displayNextReason);
}


// ============================================================================
// CANVAS ANIMATION - FLOATING HEARTS
// ============================================================================

const canvasState = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null
};

/**
 * Initialize canvas and particle system
 */
function initCanvas() {
    canvasState.canvas = getElement("bgCanvas");
    if (!canvasState.canvas) return;
    
    canvasState.ctx = canvasState.canvas.getContext("2d");
    if (!canvasState.ctx) return;
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    createParticles();
    animate();
}

/**
 * Resize canvas to match window dimensions
 */
function resizeCanvas() {
    if (!canvasState.canvas) return;
    
    canvasState.canvas.width = window.innerWidth;
    canvasState.canvas.height = window.innerHeight;
}

/**
 * Create particle objects for animation
 */
function createParticles() {
    canvasState.particles = [];
    
    for (let i = 0; i < CONFIG.PARTICLES_COUNT; i++) {
        canvasState.particles.push({
            x: Math.random() * canvasState.canvas.width,
            y: Math.random() * canvasState.canvas.height,
            size: Math.random() * 4 + 2,
            speed: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.5 + 0.3
        });
    }
}

/**
 * Draw a heart shape at specified coordinates
 */
function drawHeart(x, y, size, opacity) {
    const ctx = canvasState.ctx;
    if (!ctx) return;
    
    ctx.fillStyle = `rgba(255, 46, 99, ${opacity})`;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(x - size, y - size, x - size * 2, y + size, x, y + size * 2);
    ctx.bezierCurveTo(x + size * 2, y + size, x + size, y - size, x, y);
    ctx.fill();
}

/**
 * Animation loop using requestAnimationFrame for smooth performance
 */
function animate() {
    const { ctx, particles, canvas } = canvasState;
    if (!ctx || !canvas) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        drawHeart(particle.x, particle.y, particle.size, particle.opacity);
        particle.y -= particle.speed;
        
        // Recycle particles that go off-screen
        if (particle.y < 0) {
            particle.y = canvas.height;
            particle.x = Math.random() * canvas.width;
        }
    });
    
    canvasState.animationId = requestAnimationFrame(animate);
}
