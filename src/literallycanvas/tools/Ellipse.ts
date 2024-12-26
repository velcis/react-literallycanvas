import { ToolWithStroke } from "./base";
import { createShape } from "../core/shapes";

export class Ellipse extends ToolWithStroke {
  name = "Ellipse";
  iconName = "ellipse";
  currentShape: { width: number; height: number; x: number; y: number } | null =
    null;

  begin = (x: number, y: number, lc: any) => {
    this.currentShape = createShape("Ellipse", {
      x,
      y,
      strokeWidth: this.strokeWidth,
      strokeColor: lc.getColor("primary"),
      fillColor: lc.getColor("secondary"),
    });
  };

  continue = (x: number, y: number, lc: any) => {
    if (!this.currentShape) return;
    this.currentShape.width = x - this.currentShape.x;
    this.currentShape.height = y - this.currentShape.y;
    lc.drawShapeInProgress(this.currentShape);
  };

  end = (x: number, y: number, lc: any) => {
    if (!this.currentShape) return;
    // If there is no height or width, don't save
    if (this.currentShape.height === 0 || this.currentShape.width === 0) {
      return;
    }
    lc.saveShape(this.currentShape);
  };
}
