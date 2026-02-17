declare module 'rellax' {
    interface RellaxOptions {
        speed?: number;
        center?: boolean;
        wrapper?: string | HTMLElement | null;
        round?: boolean;
        vertical?: boolean;
        horizontal?: boolean;
        breakpoints?: [number, number, number];
        callback?: (positions: { x: number; y: number }) => void;
    }

    class Rellax {
        constructor(el: string | HTMLElement, options?: RellaxOptions);
        destroy(): void;
        refresh(): void;
    }

    export default Rellax;
}
