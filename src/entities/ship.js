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
        if (this.x <= 0) direction = 0;
        
        // Resets the position to the right if outbound.
        if (this.x + 16 >= this.game.width) direction = 0;
        
        // Moves left (direction is negative) or right (positive).
        if (this.direction.left) this.x -= (this.speed * delta);
        if (this.direction.right) this.x += (this.speed * delta);
    }

    /*
    draw() {
        // Cleaning up a portion of the canvas (x, y, width, height).
        this.game.ctx.clearRect(0, this.game.canvas.height - 32, this.game.canvas.width, 32);
        
        // Drawing the ship in the canvas.
        this.game.ctx.drawImage(this.img, this.x, this.y, 16, 16);
    }
    */
}