import { Container, Loader, Sprite, Texture } from "pixi.js";
import GameElement from "./GameElement";

export type Color = "white" | "black";

export default class Piece extends GameElement {
	held: boolean;
	object: Sprite | null;
	path: string | null;
	color: Color;

	constructor(
		color: Color,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		super(x, y, width, height);

		this.color = color;
		this.held = false;
		this.object = null;
		this.path = null;
	}

	async draw(): Promise<Container> {
		if (this.path === null) {
			throw new Error("Cannot draw piece before path is set.");
		}

		if (!this.loaded) {
			const t = Texture.from(this.path);
			const s = new Sprite(t);

			this.setSpriteProperties(s);

			for (const [event, cb] of this.listeners) {
				s.addListener(event, cb);
				s.interactive = true;
			}

			this.loaded = true;
			this.object = s;

			return s;
		} else {
			const s = this.object!;

			this.setSpriteProperties(s);

			return s;
		}
	}

	private setSpriteProperties(s: Sprite) {
		s.x = this.getPaddedX();
		s.y = this.getPaddedY();
		s.width = this.getPaddedWidth();
		s.height = this.getPaddedHeight();
	}
}
