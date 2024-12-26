import { useState } from "react";

interface ClearButtonProps {
  lc: {
    canUndo: () => boolean;
    clear: () => void;
  };
}

const ClearButton = ({ lc }: ClearButtonProps) => {
  const [isEnabled] = useState(lc.canUndo());

  const className = `lc-clear toolbar-button fat-button ${
    !isEnabled && "disabled"
  }`;

  const onClick = lc.canUndo() ? () => lc.clear() : undefined;

  return <div className={className} onClick={onClick}></div>;
};

export { ClearButton };
