/**
 * Main class for animation.
 */
export class Animation {
    
    constructor(config) {
        // Frame duration in ms and last frame stored.
        this.frameDuration = config.duration || 120;

        // Required for animation (not used yet).
        this.frame = config.frame || 0;

        // Last frame saved.
        this.lastFrame = 0;
    }
    
    update(timestamp) {
        
        // When the lastFrame subtracted from the timestamp is above our fixed frame duration for the alien.
        if (timestamp - this.lastFrame >= this.frameDuration) {
            // Swaps between frames (animation effect).
            this.frame = (this.frame + 1) % 2;
            
            // Determine the last frame with the given timestamp.
            this.lastFrame = timestamp;
        }
    }
}