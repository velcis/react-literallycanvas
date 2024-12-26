import { getHSLAString } from "../../utils/colors";

function ColorGrid({
  rows,
  selectedColor,
  onChange,
}: {
  rows: any[][];
  selectedColor: string;
  onChange: any;
}) {
  return (
    <div>
      {rows.map((row, idx) => {
        return (
          <div
            key={idx}
            className="color-row"
            style={{ width: 20 * row.length }}
          >
            {row.map((cellColor, idx2) => {
              const update = (e) => {
                onChange(cellColor, colorString);
                e.stopPropagation();
                e.preventDefault();
              };
              // const { hue, sat, light, alpha } = cellColor
              const colorString = getHSLAString(cellColor);
              const colorStringNoAlpha = "hsl(#{hue}, #{sat}%, #{light}%)";

              const classname = `color-cell ${
                selectedColor == colorString && "selected"
              }`;
              return (
                <div
                  key={idx2}
                  className={classname}
                  onTouchStart={update}
                  onTouchMove={update}
                  onClick={update}
                  style={{ backgroundColor: colorString }}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default ColorGrid;
