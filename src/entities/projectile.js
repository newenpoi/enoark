export class Projectile {
    
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.ammo = config.ammo;
        this.collision = config.collision;
    }
}