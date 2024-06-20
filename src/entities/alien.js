/**
 * Class for the Alien entity.
 * @Drawable
 * @Animable
 */
export class Alien {
    
    constructor(config) {
        this.sprite = config.sprite || 'default-alien.png';
        this.frame = config.frame || Math.round(Math.random(), 0);
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.speed = config.speed || 25;
        this.score = 1;

        // Frame duration in ms.
        this.frameDuration = 120;

        this.lastFrame = 0;
        this.frame = 0;
    }

    /**
     * Decoupling the animation speed from the frame rate, ensuring that each frame is displayed for exactly the duration intended, regardless of how long each frame takes to render.
     * @param {*} delta 
     * @param {*} timestamp 
     */
    update(delta, timestamp) {

        // Adjusting the position.
        this.y += (this.speed * delta);

        // When the lastFrame subtracted from the timestamp is above our fixed frame duration for the alien.
        if (timestamp - this.lastFrame >= this.frameDuration) {
            // Swaps between frames (animation effect).
            this.frame = (this.frame + 1) % 2;
            
            // Determine the last frame with the given timestamp.
            this.lastFrame = timestamp;
        }
        
        // if (this.x <= 0) this.x = 0;
        
        // if (this.x >= game.width - 16) this.x = game.width - 16;
    }
}