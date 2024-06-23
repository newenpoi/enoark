/**
 * Class to handle animations.
 * Particularly useful for shared animations.
 */
class AnimationManager {
    constructor() {
        this.animations = [];
    }

    add(animation) {
        this.animations.push(animation);
    }

    update(timestamp) {
        this.animations.forEach(anim => anim.update(timestamp));
    }
}