class SlidingWindow {
    #index = 0;
    #target;
    constructor(target) {
        this.#target = target;
    }
    slide(glyph) {
        if (this.#index > this.#target.length) {
            this.#index = 0;
        }
        if (this.#target.charAt(this.#index - 1) !== glyph) {
            this.#index == 0;
        }
        this.#index += 1;
        return this.#index > this.#target.length;
    }
}
export { SlidingWindow };
