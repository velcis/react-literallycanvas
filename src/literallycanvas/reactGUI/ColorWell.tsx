import React, { useState, useEffect, useCallback } from "react";
import ColorGrid from "./ColorGrid.tsx";
import { getHSLAString, parseHSLAString } from "../../utils/colors.ts";

// Helper functions

interface ColorWellProps {
  lc: any;
  colorName: string;
  label: string;
}

const ColorWell: React.FC<ColorWellProps> = ({ lc, colorName, label }) => {
  const initialColorString = lc.colors[colorName];
  const initialHSLA = parseHSLAString(initialColorString) || {
    hue: 0,
    sat: 100,
    light: 50,
    alpha: 1,
  };

  const [colorString, setColorString] = useState<string>(initialColorString);
  const [hsla, setHSLA] = useState<any>(initialHSLA);
  const [alpha, setAlpha] = useState<number>(initialHSLA.alpha);
  const [sat, setSat] = useState<number>(initialHSLA.sat);
  const [isPickerVisible, setIsPickerVisible] = useState<boolean>(false);

  // Sync color state with lc
  useEffect(() => {
    const updateColor = () => {
      const updatedColor = lc.colors[colorName];
      setColorString(updatedColor);
      setHSLA(parseHSLAString(updatedColor) || initialHSLA);
    };

    lc.on(`${colorName}ColorChange`, updateColor);
    return () => {
      lc.off(`${colorName}ColorChange`, updateColor);
    };
  }, [lc, colorName, initialHSLA]);

  const togglePicker = useCallback(() => {
    setIsPickerVisible((visible) => !visible);
  }, []);

  const handleAlphaChange = useCallback(
    (value: number) => {
      setAlpha(value);
      const updatedHSLA = { ...hsla, alpha: value };
      setHSLA(updatedHSLA);
      setColorString(getHSLAString(updatedHSLA));
      lc.setColor(colorName, getHSLAString(updatedHSLA));
    },
    [hsla, lc, colorName]
  );

  const handleSatChange = useCallback(
    (value: number) => {
      setSat(value);
      const updatedHSLA = { ...hsla, sat: value };
      setHSLA(updatedHSLA);
      setColorString(getHSLAString(updatedHSLA));
      lc.setColor(colorName, getHSLAString(updatedHSLA));
    },
    [hsla, lc, colorName]
  );

  const handleColorSelect = useCallback(
    (selectedHSLA: any, colorString: string) => {
      setColorString(colorString);
      setHSLA(selectedHSLA);
      lc.setColor(colorName, colorString);
    },
    [lc, colorName]
  );

  const renderPicker = () => {
    if (!isPickerVisible) return null;

    const checkerboardURL = `${lc.opts.imageURLPrefix}/checkerboard-8x8.png`;
    const rows = [
      Array.from({ length: 11 }, (_, i) => ({
        hue: 0,
        sat: 0,
        light: i * 10,
        alpha,
      })),
      ...[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((hue) =>
        Array.from({ length: 11 }, (_, i) => ({
          hue,
          sat,
          light: 10 + i * 8,
          alpha,
        }))
      ),
    ];

    return (
      <div className="color-picker-popup">
        <div
          className="color-row"
          key="color"
          style={{
            position: "relative",
            backgroundImage: `url(${checkerboardURL})`,
            backgroundRepeat: "repeat",
            height: 24,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: colorString,
            }}
          ></div>
          <div className="color-row label" key="alpha">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={alpha}
              onChange={(e) => handleAlphaChange(parseFloat(e.target.value))}
            />
          </div>
          <div className="color-row label" key="saturation">
            <input
              type="range"
              min={0}
              max={100}
              value={sat}
              onChange={(e) => handleSatChange(parseFloat(e.target.value))}
            />
          </div>
          <ColorGrid
            rows={rows}
            selectedColor={colorString}
            onChange={handleColorSelect}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className={`color-well ${isPickerVisible && open}`}
      onMouseLeave={() => setIsPickerVisible(false)}
      style={{ float: "left", textAlign: "center" }}
    >
      <label style={{ float: "center" }}>{label}</label>
      <br />
      <div
        className={`color-well-color-container ${
          isPickerVisible && "selected"
        }`}
        style={{ backgroundColor: "white" }}
        onClick={togglePicker}
      >
        <div className="color-well-checker color-well-checker-top-left"></div>
        <div
          className="color-well-checker color-well-checker-bottom-right"
          style={{ left: "50%", top: "50%" }}
        ></div>
        <div
          className="color-well-color"
          style={{ backgroundColor: colorString }}
        ></div>
      </div>
      {renderPicker()}
    </div>
  );
};

export default ColorWell;
