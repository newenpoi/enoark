/**
 * Main class for animation.
 */
export class Animation {
    
    constructor(config) {
        // Frame duration in ms and last frame stored.
        this.frameDuration = config.duration || 120;
        this.lastFrame = 0;

        // Required for animation (not used yet).
        this.frame = config.frame || 0;
    }
    
}