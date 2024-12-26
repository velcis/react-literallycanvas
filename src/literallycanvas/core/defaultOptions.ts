import { Pencil } from "../tools/Pencil";

const defaultOptions = {
  imageURLPrefix: "/img",
  primaryColor: "hsla(0, 0%, 0%, 1)",
  secondaryColor: "hsla(0, 0%, 100%, 1)",
  backgroundColor: "transparent",
  strokeWidths: [1, 2, 5, 10, 20, 30],
  defaultStrokeWidth: 5,
  toolbarPosition: "top",
  keyboardShortcuts: false,
  backgroundShapes: [],
  watermarkImage: null,
  watermarkScale: 1,
  zoomMin: 0.2,
  zoomMax: 4.0,
  zoomStep: 0.2,
  snapshot: null,
  onInit: () => {},
  tools: [Pencil],
  imageSize: {
    width: 800,
  },
};

export default defaultOptions;
