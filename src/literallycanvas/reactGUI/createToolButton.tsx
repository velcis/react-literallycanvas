import { useEffect } from "react";
import { useLiterallyCanvasStore } from "../../store/lc-store";
import { classNames } from "../../utils";

interface ToolButtonProps {
  isSelected: boolean;
  lc: any; // Replace `any` with the actual type of `lc` if available
  imageURLPrefix: string;
  onSelect: (tool: any) => void;
  iconName?: string;
  name?: string;
}

const ToolButton = (tool: ToolButtonProps) => {
  const { lc, imageURLPrefix } = useLiterallyCanvasStore((state) => state);

  const { isSelected = false, onSelect, iconName, name } = tool;

  useEffect(() => {
    if (isSelected && lc) {
      lc.setTool(tool);
    }
  }, []);

  const classes = classNames(
    "lc-pick-took toolbar-button thin-button",
    isSelected ? "selected" : ""
  );

  const src = `${imageURLPrefix}/${iconName}.png`;

  return (
    <div
      className={classes}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 22,
        backgroundRepeat: "no-repeat",
      }}
      onClick={() => onSelect(tool)}
      title={name}
    />
  );
};

export default ToolButton;
