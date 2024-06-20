import { Weapon } from './weapon.js';

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
        this.sprite = config.sprite || 'default-ship.png';
        this.frame = config.frame || 0;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.speed = config.speed || 150;
        this.direction = config.direction || { left: false, right: false };
        this.weapon = new Weapon(config.weapon) || new Weapon({ type: 0, speed: 4, delay: 128 });
        this.shooting = config.shooting || false;
        
        this.projectiles = [];
        this.game = game;

        // Frame duration in ms.
        this.frameDuration = 120;

        this.lastFrame = 0;
        this.frame = 0;
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

        if (this.shooting) this.shoot(timestamp);
    }

    shoot(timestamp) {

        // Calculation of projectile frequency using frame rate.
        // Note that projectiles should be an entity of its own, and drawable.
        if (timestamp - this.lastFrame >= this.frameDuration) {
            
            this.projectiles.push({
                x: (this.x + 16 / 2),
                y: this.y,
                ammo: this.weapon.type,
                collision: false
            });

            // Plays the shoot sound.
            this.game.resources.sounds.shoot.play();
            this.game.resources.sounds.shoot.currentTime = 0;
            
            // Determine the last frame with the given timestamp.
            this.lastFrame = timestamp;
        }
    }
}