/**
 * Class to handle static resources.
 * Ideally speaking, we should turn it into a static class.
 * Because ressources should be accessible anywhere.
 * However, if it was a real game engine, we dont load every resources available in one shot.
 * We could load them whenever necessary.
 */
export class ResourcesManager {

    static instance = null;
    
    constructor() {

        if (ResourcesManager.instance) return ResourcesManager.instance;
        
        /**
         * Initializes all available resources.
         */

        this.sounds = {
            shoot: new Audio('/snd/shoot.wav'),
            explode: new Audio('/snd/explode.wav'),
            warning: new Audio('/cue/alert.ogg'),
            palier: new Audio('/cue/palier.ogg'),
            great: new Audio('/cue/excellent.ogg')
        };

        this.musics = {
            intro: new Audio('/bgm/intro.ogg'),
            action_mid: new Audio('/bgm/action_mid.ogg'),
            action_mid_high: new Audio('/bgm/action_mid_high.ogg'),
            action_high: new Audio('/bgm/action_high.ogg')
        }

        // TODO :
        // Async loading of sprites?
        this.images = {
            alien: document.getElementById("imgAlien"),
            ship: document.getElementById("imgShip"),
            explosion: document.getElementById("imgExpl"),
            bonusSpeed: document.getElementById("bonus1"),
            bonusFireRate: document.getElementById("bonus2")
        }
        
        // Configures the resources.
        this.configure();

        // In case no instance has been defined yet.
        ResourcesManager.instance = this;
    }

    /**
     * Configures resources parameters like sound volume or adding event listeners.
     * Note that given the resources are being instanciated only once it will be virtually impossible to tweak them after instanciation.
     */
    configure() {
        Object.values(this.sounds).forEach(sound => sound.volume = 0.2);

        Object.values(this.musics).forEach(music => {
            music.volume = 0.2;
            
            // Adds an event listener of type ended to every music in order to restart the song when completed.
            music.addEventListener('ended', function() { this.currentTime = 0; this.play(); }, false);
        });
    }

}
