/**
 * Main class for explosion.
 * @Drawable
 */
export class Explosion {
    
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.speed = 25;
        
        // Frame duration in ms.
        this.frameDuration = 60;

        this.lastFrame = 0;
        this.frame = 0;
    }

    update(delta, timestamp) {
        
        // Adjusting the position.
        this.y += (this.speed * delta);

        // When the lastFrame subtracted from the timestamp is above our fixed frame duration for the alien.
        if (timestamp - this.lastFrame >= this.frameDuration) {
            // Swaps between frames (animation effect).
            this.frame = (this.frame + 1);
            
            // Determine the last frame with the given timestamp.
            this.lastFrame = timestamp;
        }
    }
}