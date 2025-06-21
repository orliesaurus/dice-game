class DiceGame {
    constructor() {
        this.dice = document.getElementById('dice');
        this.dotsContainer = document.getElementById('dots');
        this.resultText = document.getElementById('resultText');
        this.wordMap = document.getElementById('wordMap');
        this.body = document.body;
        this.isRolling = false;
        
        // Color mapping
        this.colors = {
            1: { hex: "#ff2222", name: "Red" },
            2: { hex: "#ff893b", name: "Orange" },
            3: { hex: "#ffd93b", name: "Yellow" },
            4: { hex: "#1fdf28", name: "Green" },
            5: { hex: "#1f24ef", name: "Blue" },
            6: { hex: "#b71fef", name: "Violet" }
        };
        
        // Word lists for each color
        this.wordLists = {
            1: ["passion", "fire", "danger", "power", "rebellion", "desire", "blood", "heat", "love", "urgency", "chaos", "strength"],
            2: ["creativity", "warmth", "energy", "movement", "adventure", "transformation", "boldness", "autumn", "joy", "mischief", "rhythm", "glow"],
            3: ["sunshine", "curiosity", "alertness", "joy", "youth", "radiance", "caution", "spark", "light", "clarity", "playfulness", "hope"],
            4: ["growth", "calm", "envy", "nature", "rebirth", "balance", "roots", "softness", "healing", "patience", "life", "freshness"],
            5: ["sadness", "depth", "wisdom", "sea", "loyalty", "memory", "serenity", "melancholy", "logic", "sleep", "dream", "cool"],
            6: ["mystery", "royalty", "fantasy", "magic", "dusk", "introspection", "spirituality", "shadow", "surreal", "wonder", "imagination", "elegance"]
        };
        
        this.init();
    }
    
    init() {
        // Add event listeners
        this.dice.addEventListener('click', () => this.rollDice());
        this.dice.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.rollDice();
            }
        });
        
        // Initialize with 1 dot
        this.showDots(1);
    }
    
    rollDice() {
        if (this.isRolling) return;
        
        this.isRolling = true;
        this.dice.classList.add('rolling');
        this.resultText.classList.remove('show');
        this.wordMap.classList.remove('show');
        this.clearWordMap();
        
        // Generate random number after 1.8s for smooth timing
        setTimeout(() => {
            const result = Math.floor(Math.random() * 6) + 1;
            this.showResult(result);
        }, 1800);
        
        // Stop rolling animation after 2s
        setTimeout(() => {
            this.dice.classList.remove('rolling');
            this.dice.classList.add('finished');
        }, 2000);
    }
    
    showResult(number) {
        // Update dice dots
        this.showDots(number);
        
        // Start background color transition with ripple effect
        setTimeout(() => {
            this.createRippleEffect(this.colors[number].hex);
            this.showResultText(number);
        }, 200);
        
        // Reset rolling state
        setTimeout(() => {
            this.isRolling = false;
            this.dice.classList.remove('finished');
        }, 3000);
    }
    
    showDots(number) {
        // Clear existing dots
        this.dotsContainer.innerHTML = '';
        
        const dotPositions = this.getDotPositions(number);
        
        dotPositions.forEach(pos => {
            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('cx', pos.x);
            dot.setAttribute('cy', pos.y);
            dot.setAttribute('r', '8');
            dot.setAttribute('fill', '#333333');
            dot.setAttribute('filter', 'url(#dotShadow)');
            this.dotsContainer.appendChild(dot);
        });
    }
    
    getDotPositions(number) {
        const positions = {
            1: [{ x: 100, y: 100 }],
            2: [{ x: 70, y: 70 }, { x: 130, y: 130 }],
            3: [{ x: 70, y: 70 }, { x: 100, y: 100 }, { x: 130, y: 130 }],
            4: [{ x: 70, y: 70 }, { x: 130, y: 70 }, { x: 70, y: 130 }, { x: 130, y: 130 }],
            5: [{ x: 70, y: 70 }, { x: 130, y: 70 }, { x: 100, y: 100 }, { x: 70, y: 130 }, { x: 130, y: 130 }],
            6: [{ x: 70, y: 60 }, { x: 130, y: 60 }, { x: 70, y: 100 }, { x: 130, y: 100 }, { x: 70, y: 140 }, { x: 130, y: 140 }]
        };
        
        return positions[number] || positions[1];
    }
    
    createRippleEffect(color) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.backgroundColor = color;
        
        this.body.appendChild(ripple);
        
        // Start ripple animation
        setTimeout(() => {
            ripple.classList.add('animate');
        }, 10);
        
        // Change background color and remove ripple
        setTimeout(() => {
            this.body.style.backgroundColor = color;
            ripple.remove();
        }, 1000);
    }
    
    showResultText(number) {
        const colorInfo = this.colors[number];
        
        // Announce result for screen readers
        const announcement = `You rolled ${number}, your color is ${colorInfo.name}`;
        this.resultText.setAttribute('aria-label', announcement);
        
        // Update text content
        this.resultText.innerHTML = `
            <h2>Your Color:</h2>
            <h3>${colorInfo.name}</h3>
        `;
        
        // Show text with fade-in
        setTimeout(() => {
            this.resultText.classList.add('show');
            // Show word map after text appears
            setTimeout(() => {
                this.showWordMap(number);
            }, 500);
        }, 1000);
    }
    
    showWordMap(number) {
        const words = this.getRandomWords(number, 7);
        const mapWidth = this.wordMap.offsetWidth;
        const mapHeight = this.wordMap.offsetHeight;
        
        words.forEach((word, index) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word';
            wordElement.textContent = word;
            
            // Add random size class
            const sizes = ['size-small', 'size-medium', 'size-large'];
            const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
            wordElement.classList.add(randomSize);
            
            // Position randomly within the word map area
            const x = Math.random() * (mapWidth - 100); // Leave some margin
            const y = Math.random() * (mapHeight - 50);
            
            wordElement.style.left = `${x}px`;
            wordElement.style.top = `${y}px`;
            
            // Stagger the animation
            wordElement.style.animationDelay = `${index * 0.1}s`;
            
            this.wordMap.appendChild(wordElement);
        });
        
        // Show the word map
        this.wordMap.classList.add('show');
    }
    
    getRandomWords(colorNumber, count) {
        const availableWords = [...this.wordLists[colorNumber]];
        const selectedWords = [];
        
        for (let i = 0; i < count && availableWords.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            selectedWords.push(availableWords.splice(randomIndex, 1)[0]);
        }
        
        return selectedWords;
    }
    
    clearWordMap() {
        this.wordMap.innerHTML = '';
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DiceGame();
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('reduced-motion');
}
