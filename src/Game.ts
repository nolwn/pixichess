import { Application } from "pixi.js";
import Board from "./Board";
import Piece from "./Piece";

export default class Game {
	#app: Application;
	#board: Board;

	constructor(width: number, height: number) {
		this.#app = new Application({ height: height, width: width });
		this.#board = new Board(this.#app, height, 0, 0);
	}

	async run(el: HTMLElement) {
		const board = this.#board;
		board.getCellCoords(0, 0);

		el.appendChild(this.#app.view);
		await board.draw();
		// this.#app.stage.addChild(await board.draw());
	}
}
