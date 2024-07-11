import { Animation } from './animation.js';

/**
 * Class for the Alien entity.
 * @Drawable
 * @Animable
 * @Collidable
 */
export class Alien {
    
    constructor(config) {
        this.sprite = config.sprite || 'default-alien.png';
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.speed = config.speed || 25;
        
        this.health = config.durability | 15;
        this.durability = config.durability | 15;
        
        // Simulates speed at which this entity swaps between frame.
        this.frameDuration = 120;
        
        // Score when obliterating the alien.
        this.score = 1;

        // Simple animation class for our alien.
        this.animation = new Animation({entity: this, duration: this.frameDuration, frame: 0});

        // Whether it allows collision.
        // Could use @Collidable interface?
        this.collidable = true;
    }

    /**
     * Decoupling the animation speed from the frame rate, ensuring that each frame is displayed for exactly the duration intended, regardless of how long each frame takes to render.
     * @param {*} delta 
     * @param {*} timestamp 
     */
    update(delta, timestamp) {

        // Adjusting the position.
        this.y += (this.speed * delta);

        // Updating the animation.
        // Now according to our current animation mechanism let's say the interval will change given the condition of the entity.
        // The first thing I would think about is giving the animation object the health of the entity...
        // We did already passed the concerned entity using this keyword though.
        this.animation.update(timestamp);
    }

    isOutOfBounds(height) { return this.y > height; }
}