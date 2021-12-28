import { Container, Loader, Sprite } from "pixi.js";
import GameElement from "./GameElement";

export default class Piece extends GameElement {
	held: boolean;
	object: Sprite | null;
	path: string | null;

	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height);

		this.held = false;
		this.object = null;
		this.path = null;
	}

	async draw(): Promise<Container> {
		if (this.path === null) {
			throw new Error("Cannot draw piece before path is set.");
		}

		if (!this.loaded) {
			const loader = new Loader();
			loader.add("piece", this.path);

			return new Promise((resolve) =>
				loader.load((_loader: any, resources: any) => {
					const p = resources["piece"];
					const s = new Sprite(p.texture);
					this.setSpriteProperties(s);

					for (const [event, cb] of this.listeners) {
						s.addListener(event, cb);
						s.interactive = true;
					}

					this.object = s;

					this.loaded = true;

					resolve(s);
				})
			);
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
