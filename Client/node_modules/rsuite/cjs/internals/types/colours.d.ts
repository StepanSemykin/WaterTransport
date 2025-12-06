export declare enum Colours {
    Red = "red",
    Orange = "orange",
    Yellow = "yellow",
    Green = "green",
    Cyan = "cyan",
    Blue = "blue",
    Violet = "violet"
}
export type ShadeValue = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type Color = `${Colours}`;
export type ColorGray = 'gray';
export type ColorShade = `${Colours}.${ShadeValue}` | `${ColorGray}.${ShadeValue}`;
export type ColorScheme = Color | ColorShade;
