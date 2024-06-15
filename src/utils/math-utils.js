/**
 * Math utilities function class.
 */
export class MathUtils {
    
    static random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}