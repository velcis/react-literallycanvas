import React from "react";
import { create } from "zustand";

// Zustand store for stroke width
interface StrokeWidthState {
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
}

const useStrokeWidthStore = create<StrokeWidthState>((set) => ({
  strokeWidth: 1,
  setStrokeWidth: (width) => set({ strokeWidth: width }),
}));

interface StrokeWidthPickerProps {
  tool: { strokeWidth: number };
  lc: {
    opts: { strokeWidths: number[] };
    trigger: (event: string, value: any) => void;
  };
}

const StrokeWidthPicker: React.FC<StrokeWidthPickerProps> = ({ tool, lc }) => {
  const { strokeWidth, setStrokeWidth } = useStrokeWidthStore();

  const strokeWidths = lc.opts.strokeWidths;

  return (
    <div>
      {strokeWidths.map((width) => {
        const buttonClassName = `square-toolbar-button ${
          width === strokeWidth && "selected"
        }`;
        const buttonSize = 30;

        return (
          <div key={width}>
            <div
              className={buttonClassName}
              onClick={() => {
                setStrokeWidth(width);
                lc.trigger("setStrokeWidth", width);
              }}
            >
              <svg
                width={buttonSize - 2}
                height={buttonSize - 2}
                viewBox={`0 0 ${buttonSize} ${buttonSize}`}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx={Math.ceil(buttonSize / 2 - 1)}
                  cy={Math.ceil(buttonSize / 2 - 1)}
                  r={width / 2}
                ></circle>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StrokeWidthPicker;
