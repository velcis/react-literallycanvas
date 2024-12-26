import { LiterallyCanvas, Shape } from ".";

// maybe add checks to these in the future to make sure you never double-undo or
// double-redo

class ClearAction {
  lc: LiterallyCanvas;
  oldShapes: Shape[];
  newShapes: Shape[];

  constructor(lc: LiterallyCanvas, oldShapes: Shape[], newShapes: Shape[]) {
    this.lc = lc;
    this.oldShapes = oldShapes;
    this.newShapes = newShapes;
  }

  do() {
    this.lc.shapes = this.newShapes;
    this.lc.repaintLayer("main");
  }

  undo() {
    this.lc.shapes = this.oldShapes;
    this.lc.repaintLayer("main");
  }
}

class MoveAction {
  lc: LiterallyCanvas;
  selectedShape: Shape;
  previousPosition: { x: number; y: number };
  newPosition: { x: number; y: number };

  constructor(
    lc: LiterallyCanvas,
    selectedShape: Shape,
    previousPosition: { x: number; y: number },
    newPosition: { x: number; y: number }
  ) {
    this.lc = lc;
    this.selectedShape = selectedShape;
    this.previousPosition = previousPosition;
    this.newPosition = newPosition;
  }

  do() {
    this.selectedShape.setUpperLeft({
      x: this.newPosition.x,
      y: this.newPosition.y,
    });
    this.lc.repaintLayer("main");
  }

  undo() {
    this.selectedShape.setUpperLeft({
      x: this.previousPosition.x,
      y: this.previousPosition.y,
    });
    this.lc.repaintLayer("main");
  }
}

class AddShapeAction {
  lc: LiterallyCanvas;
  shape: Shape;
  previousShapeId: string | null;

  constructor(
    lc: LiterallyCanvas,
    shape: Shape,
    previousShapeId: string | null = null
  ) {
    this.lc = lc;
    this.shape = shape;
    this.previousShapeId = previousShapeId;
  }

  do() {
    // common case: just add it to the end
    if (
      !this.lc.shapes.length ||
      this.lc.shapes[this.lc.shapes.length - 1].id === this.previousShapeId ||
      this.previousShapeId === null
    ) {
      this.lc.shapes.push(this.shape);
      // uncommon case: insert it somewhere
    } else {
      const newShapes: Shape[] = [];
      let found = false;
      for (let shape of this.lc.shapes) {
        newShapes.push(shape);
        if (shape.id === this.previousShapeId) {
          newShapes.push(this.shape);
          found = true;
        }
      }
      if (!found) {
        // given ID doesn't exist, just shove it on top
        newShapes.push(this.shape);
      }
      this.lc.shapes = newShapes;
    }
    this.lc.repaintLayer("main");
  }

  undo() {
    // common case: it's the most recent shape
    if (this.lc.shapes[this.lc.shapes.length - 1].id === this.shape.id) {
      this.lc.shapes.pop();
      // uncommon case: it's in the array somewhere
    } else {
      const newShapes: Shape[] = [];
      for (let shape of this.lc.shapes) {
        if (shape.id !== this.shape.id) {
          newShapes.push(shape);
        }
      }
      this.lc.shapes = newShapes;
    }
    this.lc.repaintLayer("main");
  }
}

export { ClearAction, MoveAction, AddShapeAction };
