import { Container, interaction } from "pixi.js";

type UpdateableProperties = {
	height?: number;
	width?: number;
	x?: number;
	y?: number;
};

type EventHandler = (e: interaction.InteractionEvent) => void;

export default class GameElement {
	height: number;
	loaded: boolean;
	padding: number;
	width: number;
	x: number;
	y: number;

	protected object: Container | null;
	protected listeners: Map<interaction.InteractionEventTypes, EventHandler>;

	constructor(x: number, y: number, width: number, height: number) {
		this.object = null;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.padding = 0;
		this.listeners = new Map<
			interaction.InteractionEventTypes,
			EventHandler
		>();
		this.loaded = false;
	}

	set onMouseOver(cb: EventHandler) {
		this.setEventHandler("pointerover", cb);
	}

	set onMouseOut(cb: EventHandler) {
		this.setEventHandler("pointerout", cb);
	}

	set onClick(cb: EventHandler) {
		this.setEventHandler("click", cb);
	}

	async draw(): Promise<Container> {
		if (this.object === null) {
			throw new Error(
				"Cannot draw GameElement until it has an internal object to draw."
			);
		}

		this.object.x = this.x;
		this.object.y = this.y;
		this.object.width = this.width;
		this.object.height = this.height;

		return this.object;
	}

	protected updateProperties({ height, width, x, y }: UpdateableProperties) {
		if (height) this.height = height;
		if (width) this.width = width;
		if (x) this.x = x;
		if (y) this.y = y;

		this.draw();
	}

	private setEventHandler(
		event: interaction.InteractionEventTypes,
		cb: (e: interaction.InteractionEvent) => void | null
	) {
		if (this.object !== null) {
			const prevCb = this.listeners.get(event);
			this.object.removeListener(event, prevCb);
			this.object.addListener(event, cb);
			this.listeners.set(event, cb);

			if (this.listeners.size > 0) {
				this.object.interactive = true;
			} else {
				this.object.interactive = false;
			}
		} else {
			this.listeners.set(event, cb);
		}
	}

	protected getPaddedX(): number {
		return this.getPaddedCoord(this.x);
	}

	protected getPaddedY() {
		return this.getPaddedCoord(this.y);
	}

	protected getPaddedHeight(): number {
		return this.getPaddedDim(this.height);
	}

	protected getPaddedWidth(): number {
		return this.getPaddedDim(this.width);
	}

	protected getPaddedCoord(coord: number) {
		return coord + this.padding;
	}

	protected getPaddedDim(dim: number): number {
		return dim - this.padding * 2;
	}
}
