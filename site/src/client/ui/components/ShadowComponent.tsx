import React = require("react");

const shadowAlpha = 0.8;
const shadowColor = `rgba(0, 0, 0, ${shadowAlpha})`;

export const ShadowComponentStyle: () => React.CSSProperties = () => ({
    backgroundColor: shadowColor,
    boxShadow: `0 0 20px 20px ${shadowColor}`,
});

export const ShadowComponentStyleSmall: () => React.CSSProperties = () => ({
    backgroundColor: shadowColor,
    boxShadow: `0 0 10px 10px ${shadowColor}`,
});
