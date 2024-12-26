import { Tool } from "./base";
//@ts-ignore
import { createShape } from "../core/shapes";
//@ts-ignore
import LiterallyCanvasModel from "../core/LiterallyCanvas";

type Point = { x: number; y: number };
type Box = { x: number; y: number; width: number; height: number };

function getIsPointInBox(point: Point, box: Box) {
  if (point.x < box.x) return false;
  if (point.y < box.y) return false;
  if (point.x > box.x + box.width) return false;
  if (point.y > box.y + box.height) return false;
  return true;
}

export class Text extends Tool {
  name = "Text";
  iconName = "text";

  private text: string = "";
  private font: string = "bold 18px sans-serif";
  private currentShape: any = null;
  private currentShapeState: string | null = null;
  private initialShapeBoundingRect: any = null;
  private dragAction: string | null = null;
  private didDrag: boolean = false;
  private inputEl: HTMLTextAreaElement | null = null;
  private unsubscribe: (() => void) | null = null;
  private dragOffset = { x: 0, y: 0 };

  constructor(lc: LiterallyCanvasModel) {
    super(lc);
  }

  didBecomeActive = (lc: any): void => {
    const unsubscribeFuncs: Array<() => void> = [];
    this.unsubscribe = () => {
      unsubscribeFuncs.forEach((func) => func());
    };

    const switchAway = (): void => {
      this._ensureNotEditing(lc);
      this._clearCurrentShape(lc);
      lc.repaintLayer("main");
    };

    const updateInputEl = (): string | undefined => this._updateInputEl(lc);

    unsubscribeFuncs.push(lc.on("drawingChange", switchAway));
    unsubscribeFuncs.push(lc.on("zoom", updateInputEl));
    unsubscribeFuncs.push(lc.on("imageSizeChange", updateInputEl));
    unsubscribeFuncs.push(
      lc.on("snapshotLoad", () => {
        this._clearCurrentShape(lc);
        lc.repaintLayer("main");
      })
    );

    unsubscribeFuncs.push(
      lc.on("primaryColorChange", (newColor: string) => {
        if (!this.currentShape) return;
        this.currentShape.color = newColor;
        this._updateInputEl(lc);
        lc.repaintLayer("main");
      })
    );

    unsubscribeFuncs.push(
      lc.on("setFont", (font: string) => {
        if (!this.currentShape) return;
        this.font = font;
        this.currentShape.setFont(font);
        this._setShapesInProgress(lc);
        this._updateInputEl(lc);
        lc.repaintLayer("main");
      })
    );
  };

  willBecomeInactive = (lc: any): void => {
    console.log("willBecomeInactive");
    if (this.currentShape) {
      this._ensureNotEditing(lc);
      this.commit(lc);
    }
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  };

  setText = (text: string): void => {
    this.text = text;
  };

  _ensureNotEditing = (lc: any): void => {
    if (this.currentShapeState === "editing") {
      this._exitEditingState(lc);
    }
  };

  _clearCurrentShape = (lc: any): void => {
    this.currentShape = null;
    this.initialShapeBoundingRect = null;
    this.currentShapeState = null;
    lc.setShapesInProgress([]);
  };

  commit = (lc: any): void => {
    console.log("commited here", this.currentShape, this.currentShapeState);
    if (this.currentShape.text) {
      lc.saveShape(this.currentShape);
    }
    this._clearCurrentShape(lc);
    lc.repaintLayer("main");
  };

  _getSelectionShape = (
    ctx: CanvasRenderingContext2D,
    backgroundColor: string | null = null
  ): any => {
    return createShape("SelectionBox", {
      shape: this.currentShape,
      ctx,
      backgroundColor,
    });
  };

  _setShapesInProgress = (lc: LiterallyCanvasModel): void => {
    switch (this.currentShapeState) {
      case "selected":
        lc.setShapesInProgress([
          this._getSelectionShape(lc.ctx),
          this.currentShape,
        ]);
        break;
      case "editing":
        lc.setShapesInProgress([this._getSelectionShape(lc.ctx, "#fff")]);
        break;
      default:
        lc.setShapesInProgress([this.currentShape]);
    }
  };

  begin = (x: number, y: number, lc: any): void => {
    this.dragAction = "none";
    this.didDrag = false;
    console.log("here");
    if (
      this.currentShapeState === "selected" ||
      this.currentShapeState === "editing"
    ) {
      const br = this.currentShape.getBoundingRect(lc.ctx);
      const selectionShape = this._getSelectionShape(lc.ctx);
      const selectionBox = selectionShape.getBoundingRect();
      const point = { x, y };

      if (getIsPointInBox(point, br)) this.dragAction = "move";
      if (getIsPointInBox(point, selectionShape.getBottomRightHandleRect()))
        this.dragAction = "resizeBottomRight";
      if (getIsPointInBox(point, selectionShape.getTopLeftHandleRect()))
        this.dragAction = "resizeTopLeft";
      if (getIsPointInBox(point, selectionShape.getBottomLeftHandleRect()))
        this.dragAction = "resizeBottomLeft";
      if (getIsPointInBox(point, selectionShape.getTopRightHandleRect()))
        this.dragAction = "resizeTopRight";

      if (this.dragAction === "none" && this.currentShapeState === "editing") {
        this.dragAction = "stop-editing";
        this._exitEditingState(lc);
      }
    } else {
      this.currentShape = createShape("Text", {
        x,
        y,
        text: this.text,
        color: lc.getColor("primary"),
        font: this.font,
        v: 1,
      });
      this.dragAction = "place";
      this.currentShapeState = "selected";
    }

    if (this.dragAction === "none") {
      this.commit(lc);
      return;
    }

    this.initialShapeBoundingRect = this.currentShape.getBoundingRect(lc.ctx);
    this.dragOffset = {
      x: x - this.initialShapeBoundingRect.x,
      y: y - this.initialShapeBoundingRect.y,
    };

    this._setShapesInProgress(lc);
    lc.repaintLayer("main");
  };

  continue = (x: number, y: number, lc: any): void => {
    if (this.dragAction === "none") return;

    const br = this.initialShapeBoundingRect;
    const brRight = br.x + br.width;
    const brBottom = br.y + br.height;

    switch (this.dragAction) {
      case "place":
        this.currentShape.x = x;
        this.currentShape.y = y;
        this.didDrag = true;
        break;
      case "move":
        this.currentShape.x = x - this.dragOffset.x;
        this.currentShape.y = y - this.dragOffset.y;
        this.didDrag = true;
        break;
      case "resizeBottomRight":
        this.currentShape.setSize(
          x - (this.dragOffset.x - this.initialShapeBoundingRect.width) - br.x,
          y - (this.dragOffset.y - this.initialShapeBoundingRect.height) - br.y
        );
        break;
      case "resizeTopLeft":
        this.currentShape.setSize(
          brRight - x + this.dragOffset.x,
          brBottom - y + this.dragOffset.y
        );
        this.currentShape.setPosition(
          x - this.dragOffset.x,
          y - this.dragOffset.y
        );
        break;
      case "resizeBottomLeft":
        this.currentShape.setSize(
          brRight - x + this.dragOffset.x,
          y - (this.dragOffset.y - this.initialShapeBoundingRect.height) - br.y
        );
        this.currentShape.setPosition(
          x - this.dragOffset.x,
          this.currentShape.y
        );
        break;
      case "resizeTopRight":
        this.currentShape.setSize(
          x - (this.dragOffset.x - this.initialShapeBoundingRect.width) - br.x,
          brBottom - y + this.dragOffset.y
        );
        this.currentShape.setPosition(
          this.currentShape.x,
          y - this.dragOffset.y
        );
        break;
    }

    this._setShapesInProgress(lc);
    lc.repaintLayer("main");
    this._updateInputEl(lc);
  };

  end = (x: number, y: number, lc: any): void => {
    if (!this.currentShape) return;

    this.currentShape.setSize(this.currentShape.forcedWidth, 0);

    if (
      this.currentShapeState === "selected" ||
      (this.currentShapeState === "editing" && this.dragAction !== "none")
    ) {
      this._enterEditingState(lc);
    } else {
      this.currentShapeState = "selected";
    }

    this._setShapesInProgress(lc);
    lc.repaintLayer("main");
    this._updateInputEl(lc);
  };

  _enterEditingState = (lc: LiterallyCanvasModel): void => {
    this.currentShapeState = "editing";

    if (this.inputEl) throw new Error("State error");

    this.inputEl = document.createElement("textarea");
    this.inputEl.className = "text-tool-input";
    this.inputEl.style.position = "absolute";
    this.inputEl.style.transformOrigin = "0px 0px";
    this.inputEl.style.backgroundColor = "transparent";
    this.inputEl.style.border = "none";
    this.inputEl.style.outline = "none";
    this.inputEl.style.margin = "0";
    this.inputEl.style.padding = "4px";
    this.inputEl.style.zIndex = "1000";
    this.inputEl.style.overflow = "hidden";
    this.inputEl.style.resize = "none";

    this.inputEl.value = this.currentShape.text;

    this.inputEl.addEventListener("mousedown", (e) => e.stopPropagation());
    this.inputEl.addEventListener("touchstart", (e) => e.stopPropagation());

    const onBlur = (e: FocusEvent): void => {
      e.preventDefault();
      // Exit editing state and keep the shape selected
      this._exitEditingState(lc);
    };

    this.inputEl.addEventListener("blur", onBlur);

    const onChange = (e: Event): void => {
      const target = e.target as HTMLTextAreaElement;
      this.currentShape.setText(target.value);
      this.currentShape.enforceMaxBoundingRect(lc);
      this._setShapesInProgress(lc);
      lc.repaintLayer("main");
      this._updateInputEl(lc);
      e.stopPropagation();
    };

    this.inputEl.addEventListener("keydown", () =>
      this._updateInputEl(lc, true)
    );
    this.inputEl.addEventListener("keyup", onChange);
    this.inputEl.addEventListener("change", onChange);

    this._updateInputEl(lc);

    lc.containerEl.appendChild(this.inputEl);
    this.inputEl.focus();

    this._setShapesInProgress(lc);
  };

  _exitEditingState = (lc: LiterallyCanvasModel): void => {
    this.currentShapeState = "selected";

    if (this.inputEl) {
      lc.containerEl.removeChild(this.inputEl);
      this.inputEl = null;
    }

    this._setShapesInProgress(lc);
    lc.repaintLayer("main");
  };

  _updateInputEl = (lc: LiterallyCanvasModel, withMargin: boolean = false) => {
    var br, transformString;
    if (withMargin == null) {
      withMargin = false;
    }
    if (!this.inputEl) {
      return;
    }
    br = this.currentShape.getBoundingRect(lc.ctx, true);
    this.inputEl.style.font = this.currentShape.font;
    this.inputEl.style.color = this.currentShape.color;
    this.inputEl.style.left =
      lc.position.x / lc.backingScale + br.x * lc.scale - 4 + "px";
    this.inputEl.style.top =
      lc.position.y / lc.backingScale + br.y * lc.scale - 4 + "px";
    if (withMargin && !this.currentShape.forcedWidth) {
      this.inputEl.style.width =
        br.width + 10 + this.currentShape.renderer.emDashWidth + "px";
    } else {
      this.inputEl.style.width = br.width + 12 + "px";
    }
    if (withMargin) {
      this.inputEl.style.height =
        br.height + 10 + this.currentShape.renderer.metrics.leading + "px";
    } else {
      this.inputEl.style.height = br.height + 10 + "px";
    }
    transformString = "scale(" + lc.scale + ")";
    this.inputEl.style.transform = transformString;
    this.inputEl.style.webkitTransform = transformString;
    //@ts-ignore
    this.inputEl.style.MozTransform = transformString;
    //@ts-ignore
    this.inputEl.style.msTransform = transformString;
    //@ts-ignore
    return (this.inputEl.style.OTransform = transformString);
  };
}
