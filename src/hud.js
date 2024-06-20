import { DrawingUtils } from '../utils/drawing-utils.js';

/**
 * Class to create and provide a hud to display information.
 * Since this could be a Singleton class we could leave the drawing method here.
 * @Drawable
 */
export class HUD {
    
    constructor(game) {
        this.game = game;
        this.timer = 0;
    }

    update() {
        // Updating a timer for testing purposes of the update mechanics.
        this.timer += 1;
    }

    draw() {

        // Cleaning up a portion of the canvas (x, y, width, height).
        // this.game.ctx.clearRect(0, 0, this.game.canvas.width, 32);
        
        // Interface rectangle.
        DrawingUtils.draw_rectangle(this.game.ctx, 0, 0, this.game.width, 32, '#18226a');
        
        // Creating a separation.
        DrawingUtils.draw_line(this.game.ctx, 0, 32, this.game.width, 32, 1, '#FF0000');

        // Elements of left side of the user interface.
        var line = 'Level ' + this.game.level + ' | Enemies [' + this.game.aliens.length + ']';
        DrawingUtils.draw_text(this.game.ctx, line, 8, 20, "15px Consolas", 'orange', 'left');

        // Elements on the right side.
        var line = 'Score [' + this.game.score + '] | Lives [5]';
        DrawingUtils.draw_text(this.game.ctx, line, this.game.width - 8, 20, "15px Verdana", 'orange', 'right');
    }
}