import { InputHandler } from './input-handler.js';
import { sounds, musics, images } from './resources.js';
import { Ship } from './entities/ship.js';
import { Alien } from './entities/alien.js';
import { Explosion } from './entities/explosion.js';
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

        let delta = (timestamp - this.lastFrame) / 1000;
        this.lastFrame = timestamp;

        // Updating the ship.
        this.ship.update(delta, timestamp);

        // Updates the aliens.
        this.aliens.forEach(alien => alien.update(delta, timestamp));

        // Updates the user interface.
        this.ui.update();

        // Call drawing functions.
        this.draw_aliens();
        this.draw_ship();
        this.draw_shoot();
        this.draw_explosions(delta, timestamp);

        // Checks for any collision from objects.
        this.collision_check();

        requestAnimationFrame(this.update.bind(this));
    }

    draw_aliens() {
        // Clearing for the aliens.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Drawing the aliens.
        this.aliens.forEach(alien => { this.ctx.drawImage(alien.img, ((alien.frame) * 16), 0, 16, 16, alien.x, alien.y, 16, 16); });

        // Draws the user interface (holds another clearRect).
        this.ui.draw();
    }

    draw_ship() {
        // Drawing the ship in the canvas.
        this.ctx.drawImage(this.ship.img, this.ship.x, this.ship.y, 16, 16);
    }

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

            // TODO :
            // Other drawings given the kind of ammo (a photon or a beam).
            // Thing is... Something does not add up... It should be given the weapon being used.
        }
    }

    draw_explosions(delta, timestamp) {
        
        // Iterate through each of the explosion and draw their image.
        for (let i = 0; i < this.explosions.length; i++)
        {
            // Updates the explosion entity.
            this.explosions[i].update(delta, timestamp);

            this.ctx.drawImage(this.images.explosion, this.explosions[i].frame * 16, 0, 16, 16, this.explosions[i].x, this.explosions[i].y, 16, 16);

            // Removes the explosion from the list if the last frame of the animation has been drawed.
            if (this.explosions[i].frame >= 8) this.explosions.splice(i, 1);
        }
    }

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
                        this.ship.projectiles[i].collision = true;
                        collision = true;
                    }
                }
                
                // Whenever collision is true for any of the above (in case we add more weapon types).
                if (collision)
                {
                    // Adding an explosion to the array and pressing the first frame of the explosion sprite.
                    this.explosions.push(new Explosion({x: alien_x, y: alien_y}));
                    
                    // Plays the sound effect and immetiately sets the sound cursor back to zero.
                    this.sounds.explode.play();
                    this.sounds.explode.currentTime = 0;

                    this.score += this.level;
                    this.aliens.splice(j, 1);
                }
            }
        }
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
            for (let j = 1; j < this.columns - 1; j++)
            {
                // Aliens are positioned so they don't overlap each other.
                let new_x = (16 * 2 * j) + 8;
                let new_y = -64 - (-32 * i);
                
                // Creates a new alien entity in the array.
                this.aliens[k++] = new Alien({img: this.images.alien, frame: Math.round(Math.random(), 0), x: new_x, y: new_y, speed: MathUtils.random(25, 40)});
            }
        }

        console.log(`There are ${this.columns} enemy entities spawned on each row.`);
    }
}