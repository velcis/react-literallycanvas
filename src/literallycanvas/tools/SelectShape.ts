import { Tool } from "./base.ts";
import { createShape } from "../core/shapes";
import * as actions from "../core/actions.ts";
import { LCProps } from "../../@types/LiterallyCanvas.ts";

type Point = { x: number; y: number };

export class SelectShape extends Tool {
  name = "SelectShape";
  usesSimpleAPI = false;

  private selectCanvas: HTMLCanvasElement;
  private selectCtx: CanvasRenderingContext2D;
  private selectedShape: any = null;
  private dragOffset: Point | null = null;
  private initialPosition: Point | null = null;
  private didDrag: boolean = false;
  private unsubscribe: (() => void) | null = null;

  constructor(lc: LCProps) {
    super(lc);
    this.selectCanvas = document.createElement("canvas");
    this.selectCanvas.style.backgroundColor = "transparent";
    this.selectCtx = this.selectCanvas.getContext("2d")!;
  }

  didBecomeActive = (lc: any): void => {
    const unsubscribeFuncs: Array<() => void> = [];
    this.unsubscribe = () => {
      unsubscribeFuncs.forEach((func) => func());
    };

    const onDown = ({ x, y }: Point): void => {
      this.didDrag = false;
      const shapeIndex = this._getPixel(x, y, lc, this.selectCtx);
      this.selectedShape = lc.shapes[shapeIndex];

      if (this.selectedShape) {
        lc.trigger("shapeSelected", { selectedShape: this.selectedShape });
        lc.setShapesInProgress([
          this.selectedShape,
          createShape("SelectionBox", {
            shape: this.selectedShape,
            handleSize: 0,
          }),
        ]);
        lc.repaintLayer("main");

        const br = this.selectedShape.getBoundingRect();
        this.dragOffset = { x: x - br.x, y: y - br.y };
        this.initialPosition = { x: br.x, y: br.y };
      }
    };

    const onDrag = ({ x, y }: Point): void => {
      if (this.selectedShape) {
        this.didDrag = true;
        this.selectedShape.setUpperLeft({
          x: x - this.dragOffset!.x,
          y: y - this.dragOffset!.y,
        });
        lc.setShapesInProgress([
          this.selectedShape,
          createShape("SelectionBox", {
            shape: this.selectedShape,
            handleSize: 0,
          }),
        ]);
        lc.repaintLayer("main");
      }
    };

    const onUp = ({ x, y }: Point): void => {
      if (this.didDrag) {
        this.didDrag = false;

        const br = this.selectedShape.getBoundingRect();
        const newPosition = { x: br.x, y: br.y };

        lc.execute(
          new actions.MoveAction(
            lc,
            this.selectedShape,
            this.initialPosition,
            newPosition
          )
        );

        lc.trigger("shapeMoved", { shape: this.selectedShape });
        lc.trigger("drawingChange", {});
        lc.repaintLayer("main");
        this._drawSelectCanvas(lc);
      }
    };

    unsubscribeFuncs.push(lc.on("lc-pointerdown", onDown));
    unsubscribeFuncs.push(lc.on("lc-pointerdrag", onDrag));
    unsubscribeFuncs.push(lc.on("lc-pointerup", onUp));

    this._drawSelectCanvas(lc);
  };

  willBecomeInactive = (lc: any): void => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    lc.setShapesInProgress([]);
  };

  private _drawSelectCanvas = (lc: any): void => {
    this.selectCanvas.width = lc.canvas.width;
    this.selectCanvas.height = lc.canvas.height;
    this.selectCtx.clearRect(
      0,
      0,
      this.selectCanvas.width,
      this.selectCanvas.height
    );

    const shapes = lc.shapes.map((shape: any, index: number) =>
      createShape("SelectionBox", {
        shape,
        handleSize: 0,
        backgroundColor: `#${this._intToHex(index)}`,
      })
    );

    lc.draw(shapes, this.selectCtx);
  };

  private _intToHex = (i: number): string => {
    return `000000${i.toString(16)}`.slice(-6);
  };

  private _getPixel = (
    x: number,
    y: number,
    lc: any,
    ctx: CanvasRenderingContext2D
  ): number | null => {
    const p = lc.drawingCoordsToClientCoords(x, y);
    const pixel = ctx.getImageData(p.x, p.y, 1, 1).data;
    return pixel[3]
      ? parseInt(this._rgbToHex(pixel[0], pixel[1], pixel[2]), 16)
      : null;
  };

  private _componentToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  private _rgbToHex = (r: number, g: number, b: number): string => {
    return `${this._componentToHex(r)}${this._componentToHex(
      g
    )}${this._componentToHex(b)}`;
  };
}
