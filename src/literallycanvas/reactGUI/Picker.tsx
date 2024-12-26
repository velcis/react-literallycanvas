import React, { useState } from "react";
import { ClearButton } from "./ClearButton.tsx";
import UndoRedoButtons from "./UndoRedoButtons.tsx";
import ZoomButtons from "./ZoomButtons.tsx";
import ColorWell from "./ColorWell.tsx";
import { Tool } from "../tools/base.ts";

interface ColorPickersProps {
  lc: any;
}

const ColorPickers: React.FC<ColorPickersProps> = ({ lc }) => {
  return (
    <div className="lc-color-pickers">
      <ColorWell lc={lc} colorName="primary" label="cor" />
      <ColorWell lc={lc} colorName="secondary" label="conteudo" />
      <ColorWell lc={lc} colorName="background" label="fundo" />
    </div>
  );
};

interface PickerProps {
  lc?: any;
  toolButtonComponents?: JSX.Element[];
  imageURLPrefix?: string;
}

const Picker: React.FC<PickerProps> = ({
  lc,
  toolButtonComponents,
  imageURLPrefix,
}) => {
  const [selectedToolIndex, setSelectedToolIndex] = useState(0);

  const renderBody = () => (
    <div className="lc-picker-contents">
      {toolButtonComponents?.map((Component, idx) => {
        const isSelected = idx === selectedToolIndex;

        const Element = React.createElement(Component.type, {
          ...Component.props,
          lc,
          imageURLPrefix,
          key: idx,
          isSelected,
          onSelect: (tool: Tool) => {
            lc.setTool(tool);
            setSelectedToolIndex(idx);
          },
        });

        return Element;
      })}

      <div className="toolbar-button thin-button disabled"></div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <ColorPickers lc={lc} />
        <UndoRedoButtons imageURLPrefix={imageURLPrefix ?? ""} />
        <ZoomButtons imageURLPrefix={imageURLPrefix} />
        <ClearButton lc={lc} />
      </div>
    </div>
  );

  return <div className="lc-picker">{renderBody()}</div>;
};

export { Picker };
