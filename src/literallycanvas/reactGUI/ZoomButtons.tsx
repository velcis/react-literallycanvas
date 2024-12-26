import React from "react";
import { create } from "zustand";

// Zustand store
interface ZoomState {
  scale: number;
  zoomMax: number;
  zoomMin: number;
  zoomStep: number;
  canZoomIn: () => boolean;
  canZoomOut: () => boolean;
  zoom: (step: number) => void;
}

const useZoomStore = create<ZoomState>((set, get) => ({
  scale: 1,
  zoomMax: 5,
  zoomMin: 0.5,
  zoomStep: 0.2,
  canZoomIn: () => get().scale < get().zoomMax,
  canZoomOut: () => get().scale > get().zoomMin,
  zoom: (step) =>
    set((state) => ({
      scale: Math.min(
        state.zoomMax,
        Math.max(state.zoomMin, state.scale + step)
      ),
    })),
}));

interface ZoomButtonProps {
  inOrOut: "in" | "out";
  imageURLPrefix: string;
}

const ZoomButton: React.FC<ZoomButtonProps> = ({ inOrOut, imageURLPrefix }) => {
  const { canZoomIn, canZoomOut, zoom, zoomStep } = useZoomStore();
  const isEnabled = inOrOut === "in" ? canZoomIn() : canZoomOut();
  const onClick = isEnabled
    ? () => zoom(inOrOut === "in" ? zoomStep : -zoomStep)
    : undefined;

  const src = `${imageURLPrefix}/zoom-${inOrOut}.png`;
  const style = { backgroundImage: `url(${src})` };
  const title = inOrOut === "in" ? "Zoom in" : "Zoom out";
  const className = `lc-zoom-${inOrOut} toolbar-button thin-button ${!isEnabled} && disabled`;

  return (
    <div
      className={className}
      onClick={onClick}
      title={title}
      style={style}
    ></div>
  );
};

const ZoomButtons: React.FC<{ imageURLPrefix: string }> = ({
  imageURLPrefix,
}) => {
  return (
    <div className="lc-zoom">
      <ZoomButton inOrOut="out" imageURLPrefix={imageURLPrefix} />
      <ZoomButton inOrOut="in" imageURLPrefix={imageURLPrefix} />
    </div>
  );
};

export default ZoomButtons;
