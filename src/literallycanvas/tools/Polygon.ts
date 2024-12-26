import { LCProps } from "../../@types/LiterallyCanvas";
import { ToolWithStroke } from "./base";
import { createShape } from "../core/shapes";

interface Point {
  x: number;
  y: number;
}

export class Polygon extends ToolWithStroke {
  name: string = "Polygon";
  iconName: string = "polygon";
  usesSimpleAPI: boolean = false;

  private points: Point[] | null = null;
  private maybePoint: Point | null = null;
  private polygonUnsubscribeFuncs: (() => void)[] = [];
  private polygonUnsubscribe: any;

  didBecomeActive = (lc: any): void => {
    // Replace 'any' with the actual type of 'lc'
    // super(lc);

    this.polygonUnsubscribeFuncs = [];
    this.polygonUnsubscribe = () => {
      for (const func of this.polygonUnsubscribeFuncs) {
        func();
      }
    };

    const onUp = (): void => {
      if (this._getWillFinish()) {
        this._close(lc);
        return;
      }
      lc.trigger("lc-polygon-started");

      if (this.points) {
        this.points.push(this.maybePoint!); // Use non-null assertion after check
      } else {
        this.points = [this.maybePoint!]; // Use non-null assertion after check
      }

      this.maybePoint = { x: this.maybePoint!.x, y: this.maybePoint!.y };
      lc.setShapesInProgress(this._getShapes(lc));
      lc.repaintLayer("main");
    };

    const onMove = ({ x, y }: { x: number; y: number }): void => {
      if (this.maybePoint) {
        this.maybePoint.x = x;
        this.maybePoint.y = y;
        lc.setShapesInProgress(this._getShapes(lc));
        lc.repaintLayer("main");
      }
    };

    const onDown = ({ x, y }: { x: number; y: number }): void => {
      this.maybePoint = { x, y };
      lc.setShapesInProgress(this._getShapes(lc));
      lc.repaintLayer("main");
    };

    const polygonFinishOpen = (): void => {
      this.maybePoint = { x: Infinity, y: Infinity };
      this._close(lc);
    };

    const polygonFinishClosed = (): void => {
      this.maybePoint = this.points![0]; // Use non-null assertion after check
      this._close(lc);
    };

    const polygonCancel = (): void => {
      this._cancel(lc);
    };

    this.polygonUnsubscribeFuncs.push(
      lc.on("drawingChange", this._cancel.bind(this, lc))
    ); // Bind 'this' context
    this.polygonUnsubscribeFuncs.push(lc.on("lc-pointerdown", onDown));
    this.polygonUnsubscribeFuncs.push(lc.on("lc-pointerdrag", onMove));
    this.polygonUnsubscribeFuncs.push(lc.on("lc-pointermove", onMove));
    this.polygonUnsubscribeFuncs.push(lc.on("lc-pointerup", onUp));

    this.polygonUnsubscribeFuncs.push(
      lc.on("lc-polygon-finishopen", polygonFinishOpen)
    );
    this.polygonUnsubscribeFuncs.push(
      lc.on("lc-polygon-finishclosed", polygonFinishClosed)
    );
    this.polygonUnsubscribeFuncs.push(
      lc.on("lc-polygon-cancel", polygonCancel)
    );
  };

  willBecomeInactive = (lc: LCProps): void => {
    // Replace 'any' with the actual type of 'lc'
    // super(lc);
    if (this.points || this.maybePoint) {
      this._cancel(lc);
    }
    this.polygonUnsubscribe();
  };

  private _getArePointsClose = (a: Point, b: Point): boolean => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) < 10;
  };

  private _getWillClose = (): boolean => {
    return (
      this.points &&
      this.points.length > 1 &&
      this.maybePoint &&
      this._getArePointsClose(this.points[0], this.maybePoint)
    );
  };

  _getWillFinish() {
    if (!(this.points && this.points.length > 1)) {
      return false;
    }
    if (!this.maybePoint) {
      return false;
    }
    return (
      this._getArePointsClose(this.points[0], this.maybePoint) ||
      this._getArePointsClose(
        this.points[this.points.length - 1],
        this.maybePoint
      )
    );
  }

  _cancel = (lc) => {
    lc.trigger("lc-polygon-stopped");
    this.maybePoint = null;
    this.points = null;
    lc.setShapesInProgress([]);
    return lc.repaintLayer("main");
  };

  _close = (lc) => {
    lc.trigger("lc-polygon-stopped");
    lc.setShapesInProgress([]);
    if (this.points.length > 2) {
      lc.saveShape(this._getShape(lc, false));
    }
    this.maybePoint = null;
    return (this.points = null);
  };

  _getShapes = (lc: LCProps, isInProgress: boolean) => {
    var shape;
    if (isInProgress == null) {
      isInProgress = true;
    }
    shape = this._getShape(lc, isInProgress);
    if (shape) {
      return [shape];
    } else {
      return [];
    }
  };

  _getShape = (lc: LCProps, isInProgress: boolean) => {
    var points;
    if (isInProgress == null) {
      isInProgress = true;
    }
    points = [];
    if (this.points) {
      points = points.concat(this.points);
    }
    if (!isInProgress && points.length < 3) {
      return null;
    }
    if (isInProgress && this.maybePoint) {
      points.push(this.maybePoint);
    }
    if (points.length > 1) {
      return createShape("Polygon", {
        isClosed: this._getWillClose(),
        strokeColor: lc.getColor("primary"),
        fillColor: lc.getColor("secondary"),
        strokeWidth: this.strokeWidth,
        points: points.map(function (xy) {
          return createShape("Point", xy);
        }),
      });
    } else {
      return null;
    }
  };
}
