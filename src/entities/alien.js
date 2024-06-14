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
        this.speed = config.speed || 25;

        this.lastFrame = null;
    }

    update(delta, timestamp) {

        // Adjusting the position.
        this.y += (this.speed * delta);

        let animate = true;

        if (!this.lastFrame)
            this.lastFrame = timestamp;
        else if (timestamp - this.lastFrame < 60)
            animate = false;
        else
            this.lastFrame = timestamp;

        // Adjusting to a random frame for animation.
        if (animate) this.frame = (this.frame + 1) % 2;
        
        // if (this.x <= 0) this.x = 0;
        
        // if (this.x >= game.width - 16) this.x = game.width - 16;
    }
}