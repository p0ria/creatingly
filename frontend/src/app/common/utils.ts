import { Shape, UiElement } from '../types';

export function isObj(x: any): boolean {
  return typeof x === 'object' && !Array.isArray(x) && x !== null;
}

export function lowercaseFirstLetter(str: string) {
  return `${str.charAt(0).toLowerCase()}${str.substring(1)}`;
}

export function now(): number {
  return +new Date();
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getStyleForShape(shape: Shape): UiElement['style'] {
  let style: UiElement['style'] = {
    left: '420px',
    top: '300px',
    width: '100px',
    height: '100px',
    'background-color': getRandomColor(),
  };

  switch (shape) {
    case Shape.Circle:
      style = { ...style, 'border-radius': '100%' };
      break;

    case Shape.Rect:
      style = { ...style, height: '200px' };
      break;
  }

  return style;
}
