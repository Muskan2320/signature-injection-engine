// src/utils/coordinate.js

export function pxToRatio(x, y, width, height) {
  return {
    xRatio: x / width,
    yRatio: y / height
  };
}

export function ratioToPx(field, width, height) {
  return {
    x: field.xRatio * width,
    y: field.yRatio * height,
    width: field.widthRatio * width,
    height: field.heightRatio * height
  };
}
