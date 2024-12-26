import { useEffect } from "react";
import "./App.css";

import "../node_modules/literallycanvas/lib/css/literallycanvas.css";

import { LiterallyCanvas } from "./literallycanvas/reactGUI/LiterallyCanvas";
import {
  LiterallyCanvas as LiterallyCanvasModel,
  shapes,
} from "./literallycanvas/core";

import tools from "./literallycanvas/tools";
import "./literallycanvas/optionsStyles/stroke-width";
import defaultOptions from "./literallycanvas/core/defaultOptions";
import { useLiterallyCanvasStore } from "./store/lc-store";

function App() {
  const { init, lc } = useLiterallyCanvasStore((state) => state);

  useEffect(() => {
    let opts = defaultOptions;
    opts.imageURLPrefix = "/img";
    opts.tools = tools;

    opts.backgroundColor = "#FFF";

    const lc = new LiterallyCanvasModel(opts);
    init(lc, "/img");
  }, []);
  // console.log("LC", lc);

  return (
    <div style={{ width: 800 }}>
      <h1>Literally Canvas</h1>
      {lc && (
        <LiterallyCanvas
        // onInit={handleInit}
        // snapshot={snapshot}
        // backgroundShapes={generateBackgroundShapes()}
        // imageURLPrefix="/public/img"
        />
      )}
    </div>
  );
}

export default App;
