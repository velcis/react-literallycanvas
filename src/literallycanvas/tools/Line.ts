import { ToolWithStroke } from "./base";
import { createShape } from "../core/shapes";
import { LCProps } from "../../@types/LiterallyCanvas";

interface LineShape {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strokeWidth: number;
  dash: number[] | null;
  endCapShapes: (string | null)[] | null;
  color: string;
}

export class Line extends ToolWithStroke {
  name: string = "Line";
  iconName: string = "line";
  optionsStyle: string = "line-options-and-stroke-width";
  currentShape: LineShape | null = null; // Initialize to null
  isDashed: boolean = false;
  hasEndArrow: boolean = false;

  begin = (x: number, y: number, lc: LCProps): void => {
    // Replace 'any' with the actual type of 'lc'
    this.currentShape = createShape("Line", {
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      strokeWidth: this.strokeWidth,
      dash: this.isDashed ? [this.strokeWidth * 2, this.strokeWidth * 4] : null,
      endCapShapes: this.hasEndArrow ? [null, "arrow"] : null,
      color: lc.getColor("primary"),
    });
  };

  continue = (x: number, y: number, lc: LCProps): void => {
    // Replace 'any' with the actual type of 'lc'
    if (this.currentShape) {
      // Check if currentShape exists
      this.currentShape.x2 = x;
      this.currentShape.y2 = y;
      lc.drawShapeInProgress(this.currentShape);
    }
  };

  end = (x: number, y: number, lc: LCProps): void => {
    // Replace 'any' with the actual type of 'lc'
    if (this.currentShape) {
      // Check if currentShape exists
      const sameX = this.currentShape.x1 === this.currentShape.x2;
      const sameY = this.currentShape.y1 === this.currentShape.y2;
      if (sameX && sameY) {
        return;
      }
      lc.saveShape(this.currentShape);
    }
  };
}
