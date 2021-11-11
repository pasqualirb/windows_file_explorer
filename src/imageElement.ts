import { BaseElement } from "./baseElements/baseElement"

export type ImageElement = BaseElement & HTMLImageElement;
export var ImageElement: new () => ImageElement = ImageElement;
