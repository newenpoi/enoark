import { Weapon } from './weapon.js';
import { Projectile } from './projectile.js';
import { Animation } from './animation.js';

/**
 * Class to create and provide a default ship.
 * @Drawable
 */
export class Ship {
	
    /**
     * Note that I passed the Game object to retrieve the max canvas (plateau) width.
     * @param {Dictionnary} config 
     * @param {Game} game 
     */
    constructor(config, game) {
        
        // Main reference of the game used to retrieve the boundaries of the screen.
        this.game = game;
        
        this.sprite = config.sprite || 'default-ship.png';
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.speed = config.speed || 150;
        this.angle = 90;
        
        // Input being currently held.
        this.direction = config.direction || { left: false, right: false };

        this.weapon = config.weapon || new Weapon(0, 500, 128, 10, this);
        this.shooting = config.shooting || false;
        this.lastShotTime = 0;
        
        // A projectile array updated and rendered by the game loop.
        this.projectiles = [];

        // Simulates speed at which this entity swaps between frame.
        this.frameDuration = 120;

        // Simple animation class for our ship.
        this.animation = new Animation({entity: this, duration: this.frameDuration, frame: 0});

        // Whether it allows collision.
        // Could use @Collidable interface?
        this.collidable = true;
    }

    /**
     * Updates the position given the direction (left or right).
     * 
     * Where 16 is the resolution of the ship.
     */
    update(delta, timestamp) {

        // OK.
        // console.log(`Moving ${(direction < 0) ? 'left' : 'right'} !`);

        // Resets the position to the left if outbound.
        if (this.x <= 0) this.x = 0 + 16;
        
        // Resets the position to the right if outbound.
        if (this.x + 16 >= this.game.width) this.x = (this.game.width - 16 - 4);
        
        // Moves left (direction is negative) or right (positive).
        if (this.direction.left) this.x -= (this.speed * delta);
        if (this.direction.right) this.x += (this.speed * delta);

        // Fires projectile if this ship is currently shooting (based on the difference between the the last shot and the current timestamp).
        if (this.shooting && (timestamp - this.lastShotTime) > this.weapon.delay) this.shoot(timestamp);

        // Updating the animation.
        // Now according to our current animation mechanism let's say the interval will change given the condition of the entity.
        // The first thing I would think about is giving the animation object the health of the entity...
        // We did already passed the concerned entity using 'this' keyword though.
        this.animation.update(timestamp);
    }

    shoot(timestamp) {

        this.game.projectiles.push(new Projectile((this.x + 16 / 2), this.y, this.weapon));

        // Plays the shoot sound.
        // /!\ Might consider accessing resources in a static way.
        this.game.resources.sounds.shoot.play();
        this.game.resources.sounds.shoot.currentTime = 0;
        
        // Determine the last frame with the given timestamp.
        this.animation.lastFrame = timestamp;

        // Sets the last shot time to the current timestamp.
        this.lastShotTime = timestamp;
    }

    /**
     * In order to swap weapon from input handler key is pressed.
     */
    weapon_swap() {
        console.log("Swapping ship's weapon...");
        
        // We'll fix organizing stuff first.

        /*
        if (this.weapon.type == 0) this.weapon = new Weapon({ type: 1, speed: 0, delay: 64, damage: 100 });
        else this.weapon = new Weapon({ type: 0, speed: 4, delay: 128, damage: 10 });
        */
    }
}