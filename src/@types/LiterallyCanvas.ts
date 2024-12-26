export type LCProps = {
  saveShape: any;
  getColor: any;
  setColor: (location: string, color: string) => void;
  drawShapeInProgress: any;
  opts: {
    defaultStrokeWidth: number;
  };
  getDefaultImageRect: any;
  getImage: any;

  position: any;
  backingScale: any;
  setPan: any;
  on: any;

  canvas: {
    width: number;
    height: number;
  };

  setShapesInProgress: any;

  drawingCoordsToClientCoords: any;
  repaintLayer: any;
};
