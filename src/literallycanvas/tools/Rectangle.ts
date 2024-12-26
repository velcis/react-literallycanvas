import { LCProps } from "../../@types/LiterallyCanvas";
import { ToolWithStroke } from "./base";
import { createShape } from "../core/shapes";

interface RectangleShape {
  x: number;
  y: number;
  width: number;
  height: number;
  strokeWidth: number;
  strokeColor: string;
  fillColor: string;
}

export class Rectangle extends ToolWithStroke {
  name: string = "Rectangle";
  iconName: string = "rectangle";
  currentShape: RectangleShape | null = null;

  begin = (x: number, y: number, lc: LCProps): void => {
    // Replace 'LC' with the actual type of 'lc'
    this.currentShape = createShape("Rectangle", {
      x,
      y,
      strokeWidth: this.strokeWidth,
      strokeColor: lc.getColor("primary"),
      fillColor: lc.getColor("secondary"),
    });
  };

  continue = (x: number, y: number, lc: LCProps): void => {
    // Replace 'any' with the actual type of 'lc'
    if (this.currentShape) {
      this.currentShape.width = x - this.currentShape.x;
      this.currentShape.height = y - this.currentShape.y;
      lc.drawShapeInProgress(this.currentShape);
    }
  };

  end = (x: number, y: number, lc: LCProps): void => {
    // Replace 'any' with the actual type of 'lc'
    if (this.currentShape) {
      if (this.currentShape.height === 0 || this.currentShape.width === 0) {
        return;
      }
      lc.saveShape(this.currentShape);
    }
  };
}
