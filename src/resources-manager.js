/**
 * Class to handle static resources.
 */
export class ResourcesManager {
    
    constructor() {
        
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

        this.images = {
            alien: document.getElementById("imgAlien"),
            ship: document.getElementById("imgShip"),
            explosion: document.getElementById("imgExpl"),
            bonusSpeed: document.getElementById("bonus1"),
            bonusFireRate: document.getElementById("bonus2")
        }
    }

    /**
     * Initialize resources parameters like sound volume or adding event listeners.
     */
    initialize() {
        Object.values(this.sounds).forEach(sound => sound.volume = 0.2);

        Object.values(this.musics).forEach(music => {
            music.volume = 0.2;
            
            // Adds an event listener of type ended to every music in order to restart the song when completed.
            music.addEventListener('ended', function() { this.currentTime = 0; this.play(); }, false);
        });
    }
}







