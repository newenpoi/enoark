import { Explosion } from './entities/explosion.js';

/**
 * Class for collision management.
 */
export class CollisionHandler {
    constructor(game) { this.game = game; }

    perform() {
        // For every projectiles coming from the ship.
        for (let i = 0; i < this.game.projectiles.length; i++)
        {
            let projectile_x = this.game.projectiles[i].x;
            let projectile_y = this.game.projectiles[i].y;
            
            // Loops through each aliens to check their position against the projectiles.
            for (let j = 0; j < this.game.aliens.length; j++)
            {
                let alien_x = this.game.aliens[j].x;
                let alien_y = this.game.aliens[j].y;
                
                let collision = false;
                
                // Blasted by a photon.
                if (this.game.projectiles[i].type == 0)
                {
                    // If there is collision with the photon.
                    if (projectile_x >= alien_x && projectile_x <= alien_x + 16 && projectile_y >= alien_y - 16 && projectile_y <= alien_y + 16)
                    {
                        // If there is collision marks this projectile for deletion (splice) during drawing.
                        this.game.projectiles[i].collision = true;
                        collision = true;
                    }
                }
                
                // Wrecked by ion canon beam.
                if (this.game.projectiles[i].category == 1)
                {
                    // Alien ship cannot be « behind » the ship to take damage.
                    if (alien_y <= (this.game.ship.y + 32) && projectile_x >= alien_x && projectile_x <= alien_x + 16)
                    {
                        this.game.projectiles[i].collision = true;
                        collision = true;
                    }
                }
                
                // Whenever collision is true for any of the above conditions.
                if (collision)
                {
                    // Lowers the durability of the alien ship given the damage inflicted by the projectile.
                    this.game.aliens[j].durability -= this.game.projectiles[i].damage;

                    // Adding an explosion to be drawn by the game loop.
                    this.game.explosions.push(new Explosion({x: alien_x, y: alien_y}));
                    
                    // Plays the sound effect and immetiately sets the sound cursor back to zero.
                    this.game.resources.sounds.explode.play();
                    this.game.resources.sounds.explode.currentTime = 0;
                    
                    // Splices the alien from the table and increments the score if destroyed.
                    if (this.game.aliens[j].durability <= 0) { this.game.score += this.game.aliens[j].score; this.game.aliens.splice(j, 1); }
                }
            }
        }
    }
}