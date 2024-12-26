import { LCProps } from "../../@types/LiterallyCanvas";
import { Pencil } from "./Pencil";
import { createShape } from "../core/shapes";

export class Eraser extends Pencil {
  name: string = "";
  iconName: string = "";

  constructor(lc: LCProps) {
    super(lc);
    this.name = "Eraser";
    this.iconName = "eraser";
  }

  makePoint = (x: number, y: number) => {
    return createShape("Point", {
      x,
      y,
      size: this.strokeWidth,
      color: "#000",
    });
  };

  makeShape = () => {
    return createShape("ErasedLinePath");
  };
}
