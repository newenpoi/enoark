/**
 * Main class for animation.
 */
export class Animation {
    
    constructor(config) {
        // Frame duration in ms and last frame stored.
        this.frameDuration = config.duration || 120;

        // Required for animation.
        this.frame = config.frame || 0;

        // Last frame timestamp recorded.
        this.lastFrame = 0;

        // Concerned entity (required).
        this.entity = config.entity;
    }
    
    update(timestamp) {
        
        // Tweaks the frequency given the entity state.
        // Can perform other stuff.
        if (this.entity.durability <= (this.entity.health / 2)) this.frameDuration = 60;
        
        // When the lastFrame subtracted from the timestamp is above our fixed frame duration for the alien.
        if (timestamp - this.lastFrame >= this.frameDuration) {
            // Swaps between frames (animation effect).
            this.frame = (this.frame + 1) % 2;
            
            // Determine the last frame with the given timestamp.
            this.lastFrame = timestamp;
        }
    }
}