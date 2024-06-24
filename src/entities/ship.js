import { Weapon } from './weapon.js';
import { Projectile } from './projectile.js';

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
        
        // Input being currently held.
        this.direction = config.direction || { left: false, right: false };

        this.weapon = new Weapon(config.weapon) || new Weapon({ type: 0, speed: 4, delay: 128, damage: 10 });
        this.shooting = config.shooting || false;
        
        // A projectile array updated and rendered by the game loop.
        this.projectiles = [];

        // Frame duration in ms and last frame stored.
        this.frameDuration = 120;
        this.lastFrame = 0;

        // Required for animation (not used yet) at which frame this entity starts animating if animable.
        this.frame = config.frame || 0;
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

        // Updates the projectiles if any have been fired.
        for (let i = 0; i < this.projectiles.length; i++) {

            // If the projectile is a beam, it disappears with time.
            if (this.projectiles[i].category == 1) { this.projectiles.splice(i, 1); break; }
            
            // Adjusting trajectory.
            this.projectiles[i].y -= this.weapon.speed;
            
            // If the projectile is out of range or made collision.
            if (this.projectiles[i].y <= 0 || this.projectiles[i].collision) this.projectiles.splice(i, 1);
        }

        if (this.shooting) this.shoot(timestamp);
    }

    shoot(timestamp) {

        // Calculation of projectile frequency using frame rate.
        // Note that projectiles should be an entity of its own, and drawable.
        if (timestamp - this.lastFrame >= this.frameDuration) {
            
            this.projectiles.push(new Projectile({
                x: (this.x + 16 / 2),
                y: this.y,
                category: this.weapon.type,
                collision: false
            }));

            // Plays the shoot sound.
            // TODO : Should access static resources.
            this.game.resources.sounds.shoot.play();
            this.game.resources.sounds.shoot.currentTime = 0;
            
            // Determine the last frame with the given timestamp.
            this.lastFrame = timestamp;
        }
    }

    /**
     * In order to swap weapon from input handler key is pressed.
     */
    weapon_swap() {
        console.log("Changing weapon...");
        
        if (this.weapon.type == 0) this.weapon = new Weapon({ type: 1, speed: 0, delay: 64, damage: 100 });
        else this.weapon = new Weapon({ type: 0, speed: 4, delay: 128, damage: 10 });
    }
}