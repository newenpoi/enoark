/**
 * Class to create and provide a default ship.
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
        this.speed = config.speed || 1.5;
        this.direction = config.direction || { left: false, right: false };
        this.weapon = config.weapon || { type: 0, speed: 4, delay: 128 };
        this.shooting = config.shooting || false;

        this.game = game;
    }

    /**
     * Updates the position given the direction (left or right).
     * 
     * Where 16 is the resolution of the ship.
     * @param {direction} direction 
     */
    update(direction) {

        // OK.
        // console.log(`Moving ${(direction < 0) ? 'left' : 'right'} !`);

        // Resets the position to the left if outbound.
        if (this.x <= 0) direction = 0;
        
        // Resets the position to the right if outbound.
        if (this.x + 16 >= this.game.width) direction = 0;
        
        // Moves left (direction is negative) or right (positive).
        this.x += direction * this.speed;
    }

}