import { DrawingUtils } from '../utils/drawing-utils.js';

/**
 * Class to create and provide a user interface.
 * Since this could be a Singleton class we could leave the drawing method here.
 * @Drawable
 */
export class UserInterface {
    
    constructor(game) {
        this.game = game;
        this.timer = 0;
    }

    update() {
        // Updating a timer for testing purposes of the update mechanics.
        this.timer += 1;
    }

    draw() {}
}