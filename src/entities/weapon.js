/**
 * Standard class for a weapon.
 */
export class Weapon {
    
    constructor(config) {
        this.type = config.type;
        this.speed = config.speed;
        this.delay = config.delay;
    }
}