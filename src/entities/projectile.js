export class Projectile {
    
    constructor(config) {
        this.x = config.x;
        this.y = config.y;
        this.category = config.category;
        this.collision = config.collision;
    }
}