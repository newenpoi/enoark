/**
 * Class to handle input logic.
 */
export class InputHandler {
    
    constructor(ship, game) {
        this.ship = ship;
        this.game = game;
        this.keyStates = {};

        // Bind event handlers.
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    /**
     * Initialize the input handler and adds listeners on keydown and keyup, in which they get handled by the proper methods.
     */
    initialize() {
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);

        console.log("Inputs initialized.");
    }

    handleKeyDown(event) {
        this.keyStates[event.which] = true;
        this.processInput();
    }

    handleKeyUp(event) {
        this.keyStates[event.which] = false;
        this.processInput();
    }

    processInput() {
        console.log("Processing incoming input...");
        
        // Q (Left).
        if (this.keyStates[81]) this.ship.direction.left = true;
        else this.ship.direction.left = false;

        // D (Right).
        if (this.keyStates[68]) this.ship.direction.right = true;
        else this.ship.direction.right = false;

        // Space (Fire).
        if (this.keyStates[32]) this.ship.firing = true;
        else this.ship.firing = false;

        // P (Pause).
        if (this.keyStates[80]) this.game.pause();

        // W (Swap Weapon).
        if (this.keyStates[87]) this.ship.weapon.type = this.ship.weapon.type ? 0 : 1;
    }

    cleanup() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
    }
}