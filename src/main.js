import { Game } from './game.js';

// Only fire the initialization when the DOM is ready.
document.addEventListener("DOMContentLoaded", async () => {
	const game = new Game();
	await game.initialize();

	console.log("Ready.");
});