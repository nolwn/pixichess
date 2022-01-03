import { Container, Graphics, Sprite, Texture } from "pixi.js";
import GameElement from "./GameElement";

export type Color = "white" | "black";

const HELD_HIGHLIGHT_COLOR = 0x33_77_66;

export default class Piece extends GameElement {
	color: Color;
	graphics: Graphics | null;
	object: Container | null;
	path: string | null;
	sprite: Sprite | null;

	#held: boolean;

	constructor(
		color: Color,
		x: number,
		y: number,
		width: number,
		height: number
	) {
		super(x, y, width, height);

		this.color = color;
		this.#held = false;
		this.object = null;
		this.sprite = null;
		this.graphics = null;
		this.path = null;
	}

	get held(): boolean {
		return this.#held;
	}

	set held(held: boolean) {
		if (this.#held === held) return;

		this.#held = held;
		const g = this.graphics!;

		if (held) {
			g.alpha = 1;
		} else {
			g.alpha = 0;
		}
	}

	async draw(): Promise<Container> {
		if (this.path === null) {
			throw new Error("Cannot draw piece before path is set.");
		}

		if (!this.loaded) {
			const t = Texture.from(this.path);
			const s = new Sprite(t);
			const g = new Graphics();
			const object = new Container();

			if (!g) {
				throw new Error("Unable to create piece graphics.");
			}

			g.beginFill(HELD_HIGHLIGHT_COLOR);
			g.drawRect(0, 0, this.width, this.height);
			g.endFill();

			g.alpha = 0;

			for (const [event, cb] of this.listeners) {
				s.addListener(event, cb);
				s.interactive = true;
			}

			object.addChild(g, s);

			this.graphics = g;
			this.sprite = s;
			this.object = object;
			this.loaded = true;
		}

		this.setObjectProperties();
		return this.object!;
	}

	private setObjectProperties() {
		if (this.object) {
			this.sprite!.x = 0;
			this.sprite!.y = 0;
			this.sprite!.width = this.width;
			this.sprite!.height = this.height;

			this.graphics!.x = 0;
			this.graphics!.y = 0;
			this.graphics!.width = this.width;
			this.graphics!.height = this.height;

			this.object!.x = this.getPaddedX();
			this.object!.y = this.getPaddedY();
			this.object!.width = this.getPaddedWidth();
			this.object!.height = this.getPaddedHeight();
		}
	}
}
