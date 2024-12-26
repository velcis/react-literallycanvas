import { create } from "zustand";
//@ts-ignore
import LiterallyCanvasModel from "../literallycanvas/core/LiterallyCanvas";

interface LiterallyCanvasState {
  lc: LiterallyCanvasModel | undefined;
  imageURLPrefix: string;
  init: (lc: LiterallyCanvasModel, imageURLPrefix: string) => void;
}

const useLiterallyCanvasStore = create<LiterallyCanvasState>((set) => ({
  lc: undefined,
  imageURLPrefix: "",
  init: (lc, imageURLPrefix) => {
    console.log("updating");
    return set({ lc, imageURLPrefix });
  },
}));

export { useLiterallyCanvasStore };
