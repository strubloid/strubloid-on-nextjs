declare module 'rellax' {
  interface RellaxOptions {
    speed?: number;
    center?: boolean;
    wrapper?: HTMLElement | null;
    relativeToWrapper?: boolean;
    round?: boolean;
    vertical?: boolean;
    horizontal?: boolean;
    zindex?: number;
    callback?: (positions: number[]) => void;
  }

  class Rellax {
    constructor(selector?: string | HTMLElement | NodeListOf<HTMLElement>, options?: RellaxOptions);
    destroy(): void;
    refresh(): void;
  }

  export = Rellax;
}
