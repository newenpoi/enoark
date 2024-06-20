import { InputHandler } from './input-handler.js';
import { ResourcesManager } from './resources-manager.js';
import { Ship } from './entities/ship.js';
import { Alien } from './entities/alien.js';
import { Explosion } from './entities/explosion.js';
import { HUD } from './hud.js';
import { UserInterface } from './ui.js';
import { MathUtils } from './utils/math-utils.js';
import { DrawingUtils } from './utils/drawing-utils.js';

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

        // Previous frame timestamp for game update loop.
        this.lastFrame = 0;

        // Holds alien object and their stats (map related).
        this.aliens = [];

        // Explosion effects used in animation (not related to a map).
        this.explosions = [];

        // Bonuses that spawns from destroying enemy ships (not related to a map).
        this.bonuses = [];
        
        // Width and height of the canvas (~ like resolution of the game).
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // Map parameters (map related).
        this.columns = this.width / (16 * 2);
        this.rows = 2;

        // Other properties like game level (the higher the harder), lives remaining, and ship score.
        // Should be associated to the HUD.
        this.level = 1;
        this.lives = 3;
        this.score = 0;

        // Holds all static assets.
        this.resources = new ResourcesManager();

        // The player ship.
        this.ship = new Ship({img: this.resources.images.ship, frame: 0, x: this.width / 2, y: (this.height - 16) - 8, speed: 150, direction: {left: false, right: false}, weapon: {type: 0, speed: 4, delay: 128}, shooting: false }, this);

        // Input handler.
        this.inputs = new InputHandler(this.ship, this);

        // Holds the HUD.
        this.hud = new HUD(this);

        // And the user interface (when pressing pause for now).
        // Ideally speaking we want new game, load game, and save.
    }

    /**
     * Initializes the game and the required static ressources.
     */
    async initialize() {
        
        // Initialize the input handler.
        this.inputs.initialize();

        // Parameterize sounds and musics.
        this.resources.initialize();

        // This function is used to place the aliens on the map.
        this.positioning();

        console.log("The game is ready.");

        // Will be started only with a user interaction in the future.
        this.run();
    }

    /**
     * Runs the game and performs update and render methods.
     */
    run() {
        const loop = (timestamp) => {
            // Breaks the recursive loop when the game is not running.
            if (!this.running) return;
            
            // Update and draw methods.
            this.update(timestamp);
            this.draw();

            // Recursive call of the loop.
            requestAnimationFrame(loop);
        };

        // The call it.
        requestAnimationFrame(loop);
    }

    /**
     * Updates all game objects properly given a deterministic timestamp.
     * @param {*} timestamp 
     * @returns 
     */
    update(timestamp) {
        if (!this.running) return;

        let delta = (timestamp - this.lastFrame) / 1000;
        this.lastFrame = timestamp;

        // Updating game entities
        this.ship.update(delta, timestamp);
        this.aliens.forEach(alien => alien.update(delta, timestamp));
        this.explosions.forEach(explosion => explosion.update(delta, timestamp));
        this.hud.update();

        // Checking for collisions
        this.collision_check();
    }

    /**
     * Draws all entities.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.draw_aliens();
        this.draw_ship();
        this.draw_shoot();
        this.draw_explosions();

        // Draws the user interface (holds another clearRect).
        this.hud.draw();
    }

    /**
     * Clears the whole field and draws the aliens.
     */
    draw_aliens() {
        // Drawing the aliens.
        this.aliens.forEach(alien => { this.ctx.drawImage(alien.sprite, ((alien.frame) * 16), 0, 16, 16, alien.x, alien.y, 16, 16); });
    }

    /**
     * Draws the ship's line.
     * Since a clear is already performed in the draw_aliens() method, the drawing image performs correctly.
     */
    draw_ship() {
        // Drawing the ship in the canvas.
        this.ctx.drawImage(this.ship.sprite, this.ship.x, this.ship.y, 16, 16);
    }

    /**
     * This method should be dedicated to drawing projectiles on the map.
     * /!\ Currently it only draw the projectiles from the player's ship.
     * /!\ If the weapon is being swapped during drawing, and the new weapon has a different speed, it might affect projectiles, which is bad.
     */
    draw_shoot() {
        
        // Loops through the projectiles and displays them.
        for (let i = 0; i < this.ship.projectiles.length; i++)
        {
            // Photons.
            if (this.ship.projectiles[i].ammo == 0)
            {
                DrawingUtils.draw_rectangle(this.ctx, this.ship.projectiles[i].x - 1, this.ship.projectiles[i].y - this.ship.weapon.speed, 2, 4, '#FFFFFF');
                
                // Adjusting trajectory.
                this.ship.projectiles[i].y -= this.ship.weapon.speed;
                
                // If the projectile is out of range or made collision.
                if (this.ship.projectiles[i].y <= 0 || this.ship.projectiles[i].collision) this.ship.projectiles.splice(i, 1);
            }
        }
    }

    /**
     * This function works a bit differently and takes both delta and timestamp (for animating purpose).
     * It draws any explosion effects from an entity that has been vaporized.
     * @param {*} delta 
     * @param {*} timestamp 
     */
    draw_explosions() {
        
        // Iterate through each of the explosion and draw their image.
        for (let i = 0; i < this.explosions.length; i++)
        {
            this.ctx.drawImage(this.resources.images.explosion, this.explosions[i].frame * 16, 0, 16, 16, this.explosions[i].x, this.explosions[i].y, 16, 16);

            // Removes the explosion from the list if the last frame of the animation has been drawed.
            if (this.explosions[i].frame >= 8) this.explosions.splice(i, 1);
        }
    }

    /**
     * Performs collision check for incoming projectiles.
     */
    collision_check() {
        // For every projectile coming from the ship.
        for (let i = 0; i < this.ship.projectiles.length; i++)
        {
            let tir_x = this.ship.projectiles[i].x;
            let tir_y = this.ship.projectiles[i].y;
            
            // Loops through each aliens to check their position against the projectiles.
            for (let j = 0; j < this.aliens.length; j++)
            {
                let alien_x = this.aliens[j].x;
                let alien_y = this.aliens[j].y;
                
                let collision = false;
                
                // Blasted by a photon.
                if (this.ship.projectiles[i].ammo == 0)
                {
                    // If there is collision with the photon.
                    if (tir_x >= alien_x && tir_x <= alien_x + 16 && tir_y >= alien_y - 16 && tir_y <= alien_y + 16)
                    {
                        // If there is collision marks this projectile for deletion (splice) during drawing.
                        this.ship.projectiles[i].collision = true;
                        
                        // /!\ Cant splice there because otherwise projectiles[i].ammo will get undefined (ammo) at some point.
                        // this.ship.projectiles.splice(i, 1);
                        
                        collision = true;
                    }
                }
                
                // Whenever collision is true for any of the above (in case we add more weapon types).
                if (collision)
                {
                    // Adding an explosion to the array and pressing the first frame of the explosion sprite.
                    this.explosions.push(new Explosion({x: alien_x, y: alien_y}));
                    
                    // Plays the sound effect and immetiately sets the sound cursor back to zero.
                    this.resources.sounds.explode.play();
                    this.resources.sounds.explode.currentTime = 0;

                    this.score += this.aliens[j].score;
                    this.aliens.splice(j, 1);
                }
            }
        }
    }

    /**
     * Pauses the game by freezing drawers.
     * The game loop will check for the running variable.
     * TODO : Not being used yet.
     */
    pause() { this.running = !this.running; console.log(`The game is ${this.running ? "resumed" : "paused"}.`); }

    /**
     * Builds the array of aliens and positions them in the map.
     * Each of them are positioned given a number of rows and columns from the map.
     * 
     * /!\ The positioning should be done given the map currently bound to the level and we have not coded that yet.
     */
    positioning() {
        let k = 0;
	
        // Dual loop to fill the map.
        // Where 16 is the alien width AND height.
        for (let i = 0; i < this.rows; i++)
        {
            for (let j = 1; j < this.columns - 1; j++)
            {
                // Aliens are positioned so they don't overlap each other.
                let new_x = (16 * 2 * j) + 8;
                let new_y = -64 - (-32 * i);
                
                // Creates a new alien entity in the array.
                this.aliens[k++] = new Alien({img: this.resources.images.alien, frame: Math.round(Math.random(), 0), x: new_x, y: new_y, speed: MathUtils.random(25, 40)});
            }
        }

        console.log(`There are ${this.columns} enemy entities spawned on each row.`);
    }
}