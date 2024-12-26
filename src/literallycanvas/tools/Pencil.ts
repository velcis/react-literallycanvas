import { LCProps } from "../../@types/LiterallyCanvas";
import { ToolWithStroke } from "./base";
import { createShape } from "../core/shapes";

export class Pencil extends ToolWithStroke {
  eventTimeThreshold: number = 0;
  color: string | null = null;
  currentShape: any = null;
  lastEventTime: any = null;

  // willBecomeInactive = (lc: LCProps) => {
  //   super.willBecomeInactive(lc);
  // };

  constructor(lc: LCProps) {
    super(lc);
    this.name = "Pencil";
    this.iconName = "pencil";
    this.eventTimeThreshold = 10;
  }

  begin = (x: number, y: number, lc: LCProps) => {
    this.color = lc.getColor("primary");
    this.currentShape = this.makeShape();
    this.currentShape.addPoint(this.makePoint(x, y, lc));
    this.lastEventTime = Date.now();
  };

  continue = (x: number, y: number, lc: LCProps) => {
    const timeDiff = Date.now() - this.lastEventTime;

    if (timeDiff > this.eventTimeThreshold) {
      this.lastEventTime += timeDiff;
      this.currentShape.addPoint(this.makePoint(x, y, lc));
      lc.drawShapeInProgress(this.currentShape);
    }
  };

  end = (x: number, y: number, lc: LCProps) => {
    lc.saveShape(this.currentShape);
    this.currentShape = undefined;
  };

  makePoint = (x: number, y: number, lc: LCProps) => {
    return createShape("Point", {
      x,
      y,
      size: this.strokeWidth,
      color: this.color,
    });
  };

  makeShape = () => {
    return createShape("LinePath");
  };
}
