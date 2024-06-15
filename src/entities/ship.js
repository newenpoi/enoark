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
        this.img = config.img || 'default-ship.png';
        this.frame = config.frame || 0;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.speed = config.speed || 150;
        this.direction = config.direction || { left: false, right: false };
        this.weapon = config.weapon || { type: 0, speed: 4, delay: 128 };
        this.shooting = config.shooting || false;
        
        this.firing = false;
        this.projectiles = [];
        this.game = game;
    }

    /**
     * Updates the position given the direction (left or right).
     * 
     * TODO : Fix the stuck bug when touching borders.
     * 
     * Where 16 is the resolution of the ship.
     */
    update(delta) {

        // OK.
        // console.log(`Moving ${(direction < 0) ? 'left' : 'right'} !`);

        // Resets the position to the left if outbound.
        if (this.x <= 0) this.x = 0;
        
        // Resets the position to the right if outbound.
        if (this.x + 16 >= this.game.width) this.x = (16 - 4);
        
        // Moves left (direction is negative) or right (positive).
        if (this.direction.left) this.x -= (this.speed * delta);
        if (this.direction.right) this.x += (this.speed * delta);

        if (this.firing) this.shoot();
    }

    shoot() {
        console.log("Call to function shoot()...");

        if (this.shooting) return;
        this.shooting = true;

        this.projectiles.push({
            x: (this.x + 16 / 2),
            y: this.y,
            ammo: this.weapon.type,
            collision: false
        });

        console.log(this.projectiles.length);
        
        if (this.weapon.type == 0) setTimeout(function() {this.shooting = false; console.log("Its false."); }, this.weapon.delay);
        else setTimeout(function() {this.shooting = false;}, 64);
    }
}