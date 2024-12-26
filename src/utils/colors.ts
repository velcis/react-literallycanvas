export const getHSLAString = ({
  hue,
  sat,
  light,
  alpha,
}: {
  hue: number;
  sat: number;
  light: number;
  alpha: number;
}): string => `hsla(${hue}, ${sat}%, ${light}%, ${alpha})`;

export const parseHSLAString = (s: string | null): any => {
  if (s === "transparent") return { hue: 0, sat: 0, light: 0, alpha: 0 };
  if (!s || !s.startsWith("hsla")) return null;

  const components = s
    .slice(s.indexOf("(") + 1, s.lastIndexOf(")"))
    .split(",")
    .map((part) => part.trim());

  return {
    hue: parseInt(components[0], 10),
    sat: parseInt(components[1].replace("%", ""), 10),
    light: parseInt(components[2].replace("%", ""), 10),
    alpha: parseFloat(components[3]),
  };
};
