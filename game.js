class EmojiOddOneOut {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.gameActive = false;
        this.puzzlesSolved = 0;
        this.timeLeft = 15;
        this.timer = null;
        this.usedEmojis = new Set();
        this.highScore = this.getHighScore();
        
        // DOM elements
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.timerElement = document.getElementById('timer');
        this.highScoreElement = document.getElementById('highScore');
        this.startButton = document.getElementById('startButton');
        
        // Audio elements
        this.correctSound = document.getElementById('correctSound');
        this.wrongSound = document.getElementById('wrongSound');
        this.victorySound = document.getElementById('victorySound');
        this.gameOverSound = document.getElementById('gameOverSound');
        
        // Initialize high score display
        this.highScoreElement.textContent = this.highScore;
        
        // Event listeners
        this.startButton.addEventListener('click', () => this.startGame());

        // Add method to play sounds reliably
        this.playSound = (sound) => {
            sound.pause();
            sound.currentTime = 0;
            sound.play();
        };
    }
    
    getHighScore() {
        const savedHighScore = localStorage.getItem('emojiOddOneOutHighScore');
        return savedHighScore ? parseInt(savedHighScore) : 0;
    }
    
    setHighScore(score) {
        if (score > this.highScore) {
            this.highScore = score;
            localStorage.setItem('emojiOddOneOutHighScore', score.toString());
            this.highScoreElement.textContent = score;
            this.highScoreElement.classList.add('new-high-score');
            this.playSound(this.victorySound);
            setTimeout(() => {
                this.highScoreElement.classList.remove('new-high-score');
            }, 2000);
        }
    }
    
    startGame() {
        this.score = 0;
        this.level = 1;
        this.puzzlesSolved = 0;
        this.gameActive = true;
        this.usedEmojis.clear();
        
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
        this.startButton.style.display = 'none';
        
        this.createBoard();
        this.startTimer();
    }
    
    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timeLeft = 15;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        this.timerElement.textContent = this.timeLeft;
        const timerContainer = this.timerElement.parentElement;
        
        if (this.timeLeft <= 5) {
            timerContainer.classList.add('warning');
        } else {
            timerContainer.classList.remove('warning');
        }
    }
    
    handleTimeUp() {
        clearInterval(this.timer);
        this.gameActive = false;
        this.setHighScore(this.score);
        this.playSound(this.gameOverSound);
        setTimeout(() => {
            alert(`Time's up! Your score: ${this.score}`);
            this.startButton.style.display = 'inline-block';
        }, 500);
    }
    
    createBoard() {
        this.gameBoard.innerHTML = '';
        const baseSize = 4;
        const sizeIncrease = Math.floor(this.puzzlesSolved / 5);
        const gridSize = Math.min(baseSize + sizeIncrease, 8);
        
        // Extensive emoji categories with subtle differences
        const categories = [
            // Faces and expressions
            ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛'],
            // Animals
            ['🐶', '🐺', '🦊', '🐱', '🦁', '🐯', '🐨', '🐼', '🐻', '🐰', '🐹', '🐭', '🐮', '🐷', '🐸', '🐵', '🐒', '🦍', '🦧', '🦮'],
            // Fruits and vegetables
            ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍑', '🍒', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄'],
            // Weather and nature
            ['☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '🌪️', '🌫️', '🌊', '🌋', '🏔️', '⛰️', '🌲', '🌳', '🌴'],
            // Hand gestures
            ['👍', '👎', '👏', '🙌', '👋', '🤝', '✌️', '🤞', '🤘', '👌', '🤏', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖'],
            // Flags and symbols
            ['🏳️', '🏴', '🏁', '🚩', '🎌', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇺🇳', '🇪🇺', '⚜️', '🔱', '🏴', '🏳️‍⚧️', '🏳️‍🌈', '🏴‍☠️', '🏳️‍⚧️', '🏳️‍🌈', '🏴‍☠️', '🏳️‍⚧️'],
            // Time and clocks
            ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣'],
            // Zodiac and astrology
            ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔯', '♑', '♒', '♓', '⛎', '🔯', '♑'],
            // Music and instruments
            ['🎵', '🎶', '🎼', '🎹', '🎺', '🎸', '🎻', '🥁', '🎷', '🎤', '🎧', '🎼', '🎹', '🎺', '🎸', '🎻', '🥁', '🎷', '🎤', '🎧'],
            // Office and school
            ['📎', '✂️', '📏', '📐', '📌', '📍', '✏️', '✒️', '📝', '📋', '📑', '📒', '📓', '📔', '📕', '📖', '📗', '📘', '📙', '📚'],
            // Sports and activities
            ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🎯', '🪀', '🪁', '🎣', '🎮', '🎲'],
            // Food and drink
            ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍑', '🍒', '🍕', '🌭', '🍔', '🍟', '🥪', '🌮', '🌯', '🥗', '🍜', '🍝'],
            // Transportation
            ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🚨', '🚔', '🚍'],
            // Buildings and places
            ['🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌'],
            // Clothing and accessories
            ['👕', '👖', '🧥', '🧦', '👗', '👔', '👘', '👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟', '👠', '👡', '👢', '👑', '🎩'],
            // Technology
            ['📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📺', '📻', '🎙️'],
            // Nature and plants
            ['🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌺', '🌻', '🌼', '🌷', '🌹', '🥀', '🌞', '🌝'],
            // Weather and sky
            ['☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '🌪️', '🌫️', '🌊', '🌋', '🏔️', '⛰️', '🌲', '🌳', '🌴'],
            // Tools and objects
            ['🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🗜️', '⚖️', '🔗', '⛓️', '🔪', '🗡️', '⚔️', '🛡️', '🔫', '🏹', '🪃', '🪚', '🪛']
        ];
        
        // Select a random category and ensure we haven't used these emojis recently
        let category;
        let attempts = 0;
        do {
            category = categories[Math.floor(Math.random() * categories.length)];
            attempts++;
        } while (this.usedEmojis.has(category[0]) && attempts < 5);
        
        // Add the emojis to used set
        category.forEach(emoji => this.usedEmojis.add(emoji));
        
        // If we've used too many emojis, clear the set
        if (this.usedEmojis.size > 100) {
            this.usedEmojis.clear();
        }
        
        const mainEmoji = category[0];
        const oddEmoji = category[1];
        
        // Create array of emojis with one odd one
        const emojis = Array(gridSize * gridSize).fill(mainEmoji);
        const oddPosition = Math.floor(Math.random() * emojis.length);
        emojis[oddPosition] = oddEmoji;
        
        // Shuffle the array
        for (let i = emojis.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [emojis[i], emojis[j]] = [emojis[j], emojis[i]];
        }
        
        // Create the grid
        this.gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        
        emojis.forEach((emoji, index) => {
            const emojiElement = document.createElement('div');
            emojiElement.className = 'emoji-item';
            emojiElement.textContent = emoji;
            emojiElement.dataset.index = index;
            emojiElement.addEventListener('click', () => this.handleClick(emojiElement, emoji === oddEmoji));
            this.gameBoard.appendChild(emojiElement);
        });
    }
    
    handleClick(element, isCorrect) {
        if (!this.gameActive) return;
        
        if (isCorrect) {
            this.playSound(this.correctSound);
            this.score += 10;
            this.puzzlesSolved++;
            this.level = Math.floor(this.puzzlesSolved / 5) + 1;
            
            this.scoreElement.textContent = this.score;
            this.levelElement.textContent = this.level;
            
            // Check if this is a new high score
            if (this.score > this.highScore) {
                this.setHighScore(this.score);
            }
            
            // Visual feedback for correct answer
            element.style.backgroundColor = '#4CAF50';
            setTimeout(() => {
                clearInterval(this.timer);
                this.createBoard();
                this.startTimer();
            }, 500);
        } else {
            this.playSound(this.wrongSound);
            // Visual feedback for incorrect answer
            element.style.backgroundColor = '#ff6b6b';
            setTimeout(() => {
                element.style.backgroundColor = '#f8f8f8';
            }, 500);
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new EmojiOddOneOut();
}); 