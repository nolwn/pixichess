import { Application, Container, Loader, Texture } from "pixi.js";
import Cell, { Shade } from "./Cell";
import GameElement from "./GameElement";
import Piece from "./Piece";

enum PieceName {
	WhiteKing,
	WhiteQueen,
	WhiteBishop,
	WhiteKnight,
	WhiteRook,
	WhitePawn,
	BlackKing,
	BlackQueen,
	BlackBishop,
	BlackKnight,
	BlackRook,
	BlackPawn,
}

const CELLS = 8 * 8;
const BASE_SPRITE_PATH = "../assets";

export default class Board extends GameElement {
	protected object: Container;
	private app: Application;
	private holding: Piece | null;
	private pieces: Piece[];

	readonly initial = [
		4, 3, 2, 0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
		-1, -1, -1, -1, -1, -1, -1, -1, 11, 11, 11, 11, 11, 11, 11, 11, 10, 9,
		8, 6, 7, 8, 9, 10,
	];

	constructor(app: Application, size: number, x: number = 0, y: number = 0) {
		super(x, y, size, size);

		this.app = app;
		this.holding = null;
		this.pieces = [];
		this.object = new Container();
	}

	async draw(): Promise<Container> {
		const cellWidth = this.width / 8;
		const cellHeight = this.height / 8;

		for (let i = 0; i < CELLS; i++) {
			const x = (i % 8) * cellWidth;
			const y = Math.floor(i / 8) * cellHeight;

			const color: Shade =
				(i + Math.floor(i / 8)) % 2 === 1 ? "dark" : "light";

			const cell = new Cell(color, x, y, cellWidth, cellHeight);

			cell.onMouseOver = () => {
				if (this.holding) {
					cell.active = true;
					cell.draw();
				}
			};

			cell.onMouseOut = () => {
				cell.active = false;
				cell.draw();
			};

			cell.onClick = () => {
				if (this.holding) {
					this.holding.x = cell.x;
					this.holding.y = cell.y;
					this.holding.held = false;
					this.holding.draw();
					this.holding = null;
				}
			};

			this.object.addChild(await cell.draw());
		}

		await this.loadBoard();

		for (const piece of this.pieces) {
			this.object.addChild(await piece.draw());
		}

		this.app.stage.addChild(this.object);

		this.loaded = true;

		return this.object;
	}

	getCellCoords(col: number, row: number) {
		const x = col * this.cellSize();
		const y = row * this.cellSize();

		return [x, y];
	}

	private removePiece(index: number): Piece {
		const [piece] = this.pieces.splice(index, 1);

		this.object.removeChild(piece.object!);

		return piece;
	}

	private async setupSprites(): Promise<void> {
		return new Promise((resolve) => {
			const loader = Loader.shared;
			loader
				.add("pieces", `${BASE_SPRITE_PATH}/spritesheet.json`)
				.load(resolve);
		});
	}

	private async loadBoard(board: number[] = this.initial) {
		await this.setupSprites();

		for (let i = 0; i < board.length; i++) {
			const pieceValue = board[i];
			if (pieceValue >= 0) {
				const col = 7 - (i % 8);
				const row = 7 - Math.floor(i / 8);
				const color = pieceValue < 6 ? "white" : "black";

				const [x, y] = this.getCellCoords(col, row);
				const piece = new Piece(
					color,
					x,
					y,
					this.cellSize(),
					this.cellSize()
				);

				piece.path = this.buildPiecePath(pieceValue);
				piece.onClick = () => {
					if (this.holding === null) {
						this.holding = piece;
						piece.held = true;
						piece.draw();
					} else if (this.holding?.color !== piece.color) {
						const capturedIndex = this.pieces.findIndex(
							(p) => p === piece
						);
						const captured = this.removePiece(capturedIndex);

						this.holding.x = captured.x;
						this.holding.y = captured.y;
						this.holding.held = false;
						this.holding.draw();

						this.holding = null;
					} else if (this.holding !== piece) {
						this.holding.held = false;
						this.holding = piece;
						piece.held = true;
						piece.draw();
					}
				};

				this.pieces.push(piece);
			}
		}
	}

	private buildPiecePath(piece: PieceName) {
		const color = piece >= 6 ? "B" : "W";
		const relativeNumber = color === "B" ? piece - 6 : piece;
		let initial = "";

		switch (relativeNumber) {
			case 0:
				initial = "K";
				break;
			case 1:
				initial = "Q";
				break;
			case 2:
				initial = "B";
				break;
			case 3:
				initial = "N";
				break;
			case 4:
				initial = "R";
				break;
			case 5:
				initial = "P";
				break;
		}

		return `${color}-${initial}.png`;
	}

	private cellSize(): number {
		return this.height / 8;
	}
}
