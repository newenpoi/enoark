/**
 * Class for the Alien entity.
 * @Drawable
 */
export class Alien {
    
    constructor(config) {
        this.img = config.img || 'default-alien.png';
        this.frame = config.frame || Math.round(Math.random(), 0);
        this.x = config.x || 0;
        this.y = config.y || 0;
    }

    update() {
        // Adjusting to a random frame for animation.
        this.frame = (this.frame + 1) % 2;
        
        // Adjusting the position.
        this.y += 0.1;
        
        // if (this.x <= 0) this.x = 0;
        
        // if (this.x >= game.width - 16) this.x = game.width - 16;
    }
}