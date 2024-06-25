/**
 * Base class for projectile entity.
 * @Drawable
 * @Collidable
 */
export class Projectile {
    
    constructor(x, y, weapon) {

        // Positioning.
        this.x = x;
        this.y = y;
        
        // Common attributes.
        this.type = weapon.type;
        this.damage = weapon.damage;

        // Conversion in radians.
        let rad = weapon.ship.angle * (Math.PI / 180);

        // Used for updating position.
        this.velocity_x = weapon.speed * Math.cos(rad);
        this.velocity_y = weapon.speed * Math.sin(rad);
        
        // If this projectile made collision with another entity.
        this.collision = false;

        // The entity that fired the projectile.
        this.instigator = weapon.ship;
    }

    update(delta) {

        // Adjusting trajectory of y axis.
        this.y -= this.velocity_y * delta;
        
        // Adjusting trajectory of x axis.
        this.x -= this.velocity_x * delta;
    }

    isOutOfBounds(width) { return this.x < 0 || this.x > width || this.y < 0; }
}