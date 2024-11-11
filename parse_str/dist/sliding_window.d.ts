interface SlidingWindowInterface {
    slide(glyph: string): boolean;
}
declare class SlidingWindow implements SlidingWindow {
    #private;
    constructor(target: string);
    slide(glyph: string): boolean;
}
export type { SlidingWindowInterface };
export { SlidingWindow };
