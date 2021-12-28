import { Container, Graphics, interaction } from "pixi.js";
import GameElement from "./GameElement";

export type Shade = "light" | "dark";

const HOVER_COLOR = 0x00_00_00;
const DARK_COLOR = 0x66_66_99;
const LIGHT_COLOR = 0xdd_dd_f0;

export default class Cell extends GameElement {
	active: boolean;
	color: number;
	protected object: Graphics;

	constructor(
		color: Shade,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		super(x, y, width, height);

		this.object = new Graphics();

		this.color = color === "dark" ? DARK_COLOR : LIGHT_COLOR;
		this.active = false;
	}

	async draw(): Promise<Container> {
		this.object.clear();

		this.object.beginFill(this.color);
		this.object.drawRect(this.x, this.y, this.width, this.height);
		this.object.endFill();

		if (this.active) {
			this.object.beginFill(HOVER_COLOR, 0.5);
			this.object.drawRect(this.x, this.y, this.width, this.height);
			this.object.endFill();
		}

		this.loaded = true;

		return this.object;
	}
}
