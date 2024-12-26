import ToolButton from "./createToolButton";
import Options from "./Options";

import LiterallyCanvasModel from "../core/LiterallyCanvas";

import { Picker } from "./Picker";
import { useEffect, useRef, useState } from "react";
import { useLiterallyCanvasStore } from "../../store/lc-store";

interface LiterallyCanvasProps {
  lc?: LiterallyCanvasModel;
  imageSize?: { width?: number; height?: number };
  toolbarPosition?: "top" | "bottom" | "hidden";
  imageURLPrefix?: string;
  onInit?: (lc: LiterallyCanvasModel) => void;
  tools?: Array<typeof LiterallyCanvasModel>;
}

export const LiterallyCanvas = () => {
  const { lc } = useLiterallyCanvasStore((state) => state);

  if (!lc) return;
  const canvasRef = useRef(null);
  const [toolButtonComponents, setToolButtonComponents] = useState<
    JSX.Element[]
  >([]);

  const { imageURLPrefix, toolbarPosition, imageSize } = lc.opts;
  const pickerProps = { lc, toolButtonComponents, imageURLPrefix };
  const topOrBottomClassName = `${
    toolbarPosition === "top" && "toolbar-at-top"
  } ${toolbarPosition === "bottom" && "toolbar-at-bottom"} ${
    toolbarPosition === "hidden" && "toolbar-hidden"
  }`;

  const style: React.CSSProperties = {};
  if (imageSize?.height) {
    style.height = imageSize.height;
  }

  function bindToModel() {
    if (canvasRef.current) {
      lc.bindToElement(canvasRef.current);
    }
  }

  useEffect(() => {
    bindToModel();

    return () => lc._teardown();
  }, []);

  useEffect(() => {
    console.log(lc);
    // var backgroundImage = new Image();
    // backgroundImage.src = "/public/img/bgg.jpg";
    // lc.createShape([
    //   "Image",
    //   { x: -10, y: 0, image: backgroundImage, scale: 1.0 },
    // ]);
  }, [lc]);

  useEffect(() => {
    console.log("opts", lc?.opts?.tools);
    const tools = lc?.opts?.tools?.map((ToolClass) => {
      const toolClass = new ToolClass(lc);

      return <ToolButton {...toolClass} />;
    });

    setToolButtonComponents(tools);
  }, []);

  return (
    <div className={`literally ${topOrBottomClassName}`} style={style}>
      <div ref={canvasRef} className="lc-drawing with-gui" />
      <Picker {...pickerProps} />
      <Options lc={lc} imageURLPrefix={imageURLPrefix} />
    </div>
  );
};
