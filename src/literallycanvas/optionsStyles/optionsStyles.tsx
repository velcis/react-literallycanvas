import React from "react";

type OptionsStyles = {
  [key: string]: React.ReactElement;
};

const optionsStyles: OptionsStyles = {};

const defineOptionsStyle = (name: string, style: React.ReactElement): void => {
  optionsStyles[name] = style;
};

export { optionsStyles, defineOptionsStyle };
