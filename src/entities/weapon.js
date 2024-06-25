/**
 * Standard class for a weapon.
 */
export class Weapon {
    
    constructor(type, speed, delay, damage, ship) {
        // Type of projectile fired.
        this.type = type;
        
        // Speed multiplier for this weapon (used for projectile velocity).
        this.speed = speed;
        
        // Frequency between each shot.
        this.delay = delay;

        // Damage inflicted by this weapon.
        this.damage = damage;

        // Ship attached to the weapon.
        this.ship = ship;
    }
}