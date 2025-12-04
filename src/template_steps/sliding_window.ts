export interface SlidingWindowInterface {
	slide(glyph: string): boolean;
}

export class SlidingWindow implements SlidingWindow {
	#index: number = 1;
	#target: string;

	constructor(target: string) {
		this.#target = target;
	}

	slide(glyph: string): boolean {
		if (this.#target.charAt(this.#index - 1) !== glyph) {
			this.#index = 0;
		}

		this.#index += 1;

		return this.#index > this.#target.length;
	}
}
