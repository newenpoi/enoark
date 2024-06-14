import { InputHandler } from './input-handler.js';
import { sounds, musics, images } from './resources.js';
import { Ship } from './entities/ship.js';
import { Alien } from './entities/alien.js';
import { UserInterface } from './ui.js';

/**
 * Class that handles the main game instructions.
 */
export class Game {

    // Basic constructor to define properties.
    constructor() {
        // Properties.
        this.running = true;
        this.music = true;

        // Other components to initialize.
        this.canvas = document.getElementById("plateau");
        this.ctx = this.canvas.getContext("2d");

        // Previous frame timestamp.
        this.lastFrame = 0;

        // The drawers will request the animation frames (using requestAnimationFrame).
        // For example, drawers[0] for the aliens, drawers[1] for the ship and the ship projectiles, etc...
        // Maybe we want to separate the ship and the projectiles in two distinct drawers.
        this.drawers = [];

        // Holds alien object and their stats.
        this.aliens = [];

        // Explosion effects used in animation.
        this.explosions = [];

        // Bonuses that spawns from destroying enemy ships.
        this.bonuses = [];
        
        // Width and height of the canvas.
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Map parameters (we will create a map class in the future).
        this.columns = this.width / (16 * 2);
        this.rows = 2;

        // Other properties like game level (the higher the harder), lives remaining, and ship score.
        this.level = 1;
        this.lives = 3;
        this.score = 0;

        // We need these in a different file called resources.
        this.sounds = sounds;
        this.musics = musics;
        
        // Sprites.
        this.images = images;

        // The player ship.
        this.ship = new Ship({img: this.images.ship, frame: 0, x: this.width / 2, y: (this.height - 16) - 8, speed: 150, direction: {left: false, right: false}, weapon: {type: 0, speed: 4, delay: 128}, shooting: false }, this);

        // Input handler.
        this.inputs = new InputHandler(this.ship, this);

        // Holds the user interface.
        this.ui = new UserInterface(this);
    }

    /**
     * Initializes the game and the required static ressources.
     */
    async initialize() {
        
        // Initialize the input handler.
        this.inputs.initialize();

        /*
            Parameterize sounds and musics.
        */

        Object.values(this.sounds).forEach(sound => sound.volume = 0.2);

        Object.values(this.musics).forEach(music => {
            music.volume = 0.2;
            
            // Adds an event listener of type ended to every music in order to restart the song when completed.
            music.addEventListener('ended', function() { this.currentTime = 0; this.play(); }, false);
        });

        // This function is used to place the aliens on the map.
        this.positioning();

        console.log("The game is ready.");

        // Will be started only with a user interaction in the future.
        this.start();
    }

    start() { requestAnimationFrame(this.update.bind(this)); }

    update(timestamp) {
        if (!this.running) return;

        // Requests a frame for the update logic.
        // requestAnimationFrame(timestamp => this.update(timestamp));

        let delta = (timestamp - this.lastFrame) / 1000;
        this.lastFrame = timestamp;

        // Updating the ship.
        this.ship.update(delta);

        // Updates the aliens.
        this.aliens.forEach(alien => alien.update(delta, timestamp));

        // Updates the user interface.
        this.ui.update();

        // Call drawing function.
        this.draw();

        requestAnimationFrame(this.update.bind(this));
    }

    draw() {
        // Cleaning up a portion of the canvas (x, y, width, height) for the ship.
        this.ctx.clearRect(0, this.canvas.height - 32, this.canvas.width, 32);
        
        // Drawing the ship in the canvas.
        this.ctx.drawImage(this.ship.img, this.ship.x, this.ship.y, 16, 16);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height - 32);

        // Clearing and drawing the aliens.
        this.aliens.forEach(alien => {
            this.ctx.drawImage(alien.img, ((alien.frame) * 16), 0, 16, 16, alien.x, alien.y, 16, 16);
        });

        // Draws the user interface.
        this.ui.draw();
    }

    /**
     * Pauses the game by freezing drawers.
     * The game loop will check for the running variable.
     */
    pause() { this.running = !this.running; console.log(`The game is ${this.running ? "resumed" : "paused"}.`); }

    /**
     * Builds the array of aliens and positions them in the map.
     * Each of them are positioned given a number of rows and columns from the map.
     */
    positioning() {
        let k = 0;
	
        // Dual loop to fill the map.
        // Where 16 is the alien width AND height.
        for (let i = 0; i < this.rows; i++)
        {
            for (let j = 0; j < this.columns; j++)
            {
                // Aliens are positioned so they don't overlap each other.
                let new_x = (16 * 2 * j) + 8;
                let new_y = (16 + 16 * 2 * i);
                
                // Creates a new alien entity in the array.
                this.aliens[k++] = new Alien({img: this.images.alien, frame: Math.round(Math.random(), 0), x: new_x, y: new_y, speed: 25});
            }
        }

        console.log(`There are ${this.columns} enemy entities spawned on each row.`);
    }
}