import { LCProps } from "../../@types/LiterallyCanvas";
import { Tool } from "./base";

interface Point {
  x: number;
  y: number;
}

export class Pan extends Tool {
  name: string = "Pan";
  iconName: string = "pan";
  usesSimpleAPI: boolean = false;
  oldPosition: Point | null = null;
  pointerStart: Point | null = null;
  unsubscribe: (() => void) | null = null;

  didBecomeActive = (lc: LCProps): void => {
    const unsubscribeFuncs: (() => void)[] = [];

    this.unsubscribe = () => {
      for (const func of unsubscribeFuncs) {
        func();
      }
    };

    unsubscribeFuncs.push(
      lc.on(
        "lc-pointerdown",
        ({ rawX, rawY }: { rawX: number; rawY: number }) => {
          this.oldPosition = lc.position;
          this.pointerStart = { x: rawX, y: rawY };
        }
      )
    );

    unsubscribeFuncs.push(
      lc.on(
        "lc-pointerdrag",
        ({ rawX, rawY }: { rawX: number; rawY: number }) => {
          if (this.pointerStart && this.oldPosition) {
            const dp = {
              x: (rawX - this.pointerStart.x) * lc.backingScale,
              y: (rawY - this.pointerStart.y) * lc.backingScale,
            };
            lc.setPan(this.oldPosition.x + dp.x, this.oldPosition.y + dp.y);
          }
        }
      )
    );
  };

  willBecomeInactive = (): void => {
    // Replace 'any' with the actual type of 'lc'
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  };
}
