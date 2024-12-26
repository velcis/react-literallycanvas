import { LCProps } from "../../@types/LiterallyCanvas";
import { Tool } from "./base";

interface Point {
  x: number;
  y: number;
}

const getPixel = (
  ctx: CanvasRenderingContext2D,
  { x, y }: Point
): string | null => {
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  if (pixel[3]) {
    return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
  } else {
    return null;
  }
};

export class Eyedropper extends Tool {
  name: string = "Eyedropper";
  iconName: string = "eyedropper";
  optionsStyle: string = "stroke-or-fill";
  strokeOrFill: string = "stroke";

  constructor(lc: LCProps) {
    // Type 'any' should be replaced with the actual type of 'lc'
    super(lc);
  }

  readColor = (x: number, y: number, lc: any): void => {
    // Type 'any' should be replaced with the actual type of 'lc'
    const offset = lc.getDefaultImageRect();
    const canvas = lc.getImage();
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get 2D rendering context");
      return; // or throw an error, depending on the desired behavior
    }

    const newColor = getPixel(ctx, { x: x - offset.x, y: y - offset.y });
    // const color = newColor || lc.getColor('background');
    if (this.strokeOrFill === "stroke") {
      lc.setColor("primary", newColor);
    } else {
      lc.setColor("secondary", newColor);
    }
  };

  begin = (x: number, y: number, lc: any): void => {
    // Type 'any' should be replaced with the actual type of 'lc'
    this.readColor(x, y, lc);
  };

  continue = (x: number, y: number, lc: any): void => {
    // Type 'any' should be replaced with the actual type of 'lc'
    this.readColor(x, y, lc);
  };
}
