// Typing Animation Class
class TypingAnimation {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.options = {
            typeSpeed: 100,
            deleteSpeed: 50,
            pauseTime: 2000,
            loop: true,
            ...options
        };
        
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.isTyping = false;
        
        this.start();
    }

    start() {
        if (this.texts.length === 0) return;
        this.isTyping = true;
        this.type();
    }

    type() {
        if (!this.isTyping) return;

        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            // Deleting characters
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                
                if (!this.options.loop && this.currentTextIndex === 0) {
                    this.isTyping = false;
                    return;
                }
                
                setTimeout(() => this.type(), this.options.pauseTime / 2);
                return;
            }
            
            setTimeout(() => this.type(), this.options.deleteSpeed);
        } else {
            // Typing characters
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                this.isDeleting = true;
                setTimeout(() => this.type(), this.options.pauseTime);
                return;
            }
            
            setTimeout(() => this.type(), this.options.typeSpeed);
        }
    }

    stop() {
        this.isTyping = false;
    }

    restart() {
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.start();
    }

    updateTexts(newTexts) {
        this.texts = newTexts;
        this.restart();
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TypingAnimation;
}
