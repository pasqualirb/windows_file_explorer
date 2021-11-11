
type IEvents = GlobalEventHandlersEventMap;
type Events = keyof IEvents;
type EventCallback = <Tkey extends Events>(e: IEvents[Tkey]) => void;

export interface Size {
    width: number;
    height?: number;

    minWidth?: number;
    minHeight?: number;

    maxWidth?: number;
    maxHeight?: number;
}

export enum Style {
    Inherit = "inherit",
}
export type StyleStr = "inherit";

export type LayoutStr = "row" | "column";
export enum Layout {
    Row = "row",
    Column = "column",
}
export type AlignStr = "start" | "end" | "center" | "stretch";
export enum Align {
    Start = "start",
    End = "end",
    Center = "center",
    Stretch = "stretch",
}
export type JustifyStr = "start" | "end" | "center" | "space-between" | "space-around" | "space-evenly";
export enum Justify {
    Start = "start",
    End = "end",
    Center = "center",
    SpaceBetween = "space-between",
    SpaceAround = "space-around",
    SpaceEvenly = "space-evenly",
}

export class BaseElement extends HTMLElement {

    constructor(cfg?: Partial<BaseElement>) {
        super();

        // Font size in px defines the em unit size, which is used by all child elements

        this.join(cfg);

        this.style.display = "flex";

        // WARNING: Avoid storing local state that does not belong tot HTMLElement.
        //          This allows casting HTMLElement to BaseElement seamlessly.
        // When storing local state, use `this._nameOfStateProperty` and create a getter
        // `this.nameOfStateProperty` that initializes the state property if it does not exist.
    }

    // Event handling
    // ============================================================================================

    // By default, registering a callback with `this.on(EVENT, CALLBACK)` adds the CALLBACK to a
    // list/group of callbacks that will run sequentially/attomically when the EVENT is triggered.
    //
    // For registering the real callback that is responsible for calling all the other callbacks
    // in the group of an event, use `this.registerCallbacksUpToHere()`.
    //
    // When a component finished registering events, it must call this.registerEvents() which
    // registers only one callback for each type of event. The registered callback in turn is
    // responsible for calling all the other callbacks for that type of event.
    //
    // This is done to guarantee atomicity of rendering updates for callbacks registered by
    // component.

    // List of events, each one with an array of callbacks
    private __groupedCallbackList: Map<Events, Array<EventCallback>>;
    private get _groupedCallbackList() {
        return this.__groupedCallbackList || (this.__groupedCallbackList = new Map<Events, Array<EventCallback>>());
    }

    private _eventList: Map<Events, Array<EventCallback>>;
    private registerCallbacksUpToHere(eventName: Events) {
        const callbackList = this._groupedCallbackList.get(eventName);
        this._eventList.set(eventName, [ ...this._eventList.get(eventName) || [],  (e) => callbackList.forEach(callback => callback(e)) ]);
        // Clear _groupedCallbackList
        this._groupedCallbackList.delete(eventName);
    }

    // Register a callback
    public on = <T extends Events>(eventName: T, callback: EventCallback) => {
        this._groupedCallbackList.set(eventName, [ ...this._groupedCallbackList.get(eventName) || [], callback ]);
    }

    // Register the callbackList for each event
    public registerEvents = () => {
        this._groupedCallbackList.forEach((callbackList, eventName) => this.registerCallbacksUpToHere(eventName));
    }

    public clearAllCallbacks() {
        this._eventList.forEach((realCalbackList, eventName) => {
            realCalbackList.forEach(realCallback => this.removeEventListener(eventName, realCallback));
        });
        this._groupedCallbackList.clear();
    }


    // Dimensions handling
    // ============================================================================================
    //
    // You can (probably) safely ignore this code section as it's just a bunch of helper functions.

    // --------------- Size (in px) of `em` unit
    /** Size in pixels of the `em` CSS unit */
    public get unitSize() {
        return parseFloat(getComputedStyle(this).fontSize);
    }
    /** Size in pixels of the `em` CSS unit */
    public set unitSize(unitSize: number) {
        this.style.fontSize = `${unitSize}px`;
    }

    /** _read-only_ Size in pixels of the `rem` CSS unit */
    public get rootUnitSize() {
        // HACK: access to browser's global `document` (because `document.documentElement` is the root element)
        return parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    // --------------- Size (Width)
    public get width(): number {
        return this.clientWidth * this.unitSize;
    }
    public set width(width: number) {
        this.style.width = `${width}em`;
    }

    // --------------- Size (Height)
    public get height(): number {
        return this.clientHeight * this.unitSize;
    }
    public set height(height: number) {
        this.style.height = `${height}em`;
    }

    // --------------- Size
    public get size(): { width: number; height: number } {
        return {
            width: this.width,
            height: this.height,
        };
    }
    public set size(sz: { width: number, height: number }) {
        this.width = sz.width;
        this.height = sz.height;
    }

    // --------------- Position (X coordinate)
    public get x(): number {
        return this.offsetLeft * this.unitSize;
    }
    public set x(x: number) {
        this.style.left = `${x}em`;
    }

    // --------------- Position (Y coordinate)
    public get y(): number {
        return this.offsetTop * this.unitSize;
    }
    public set y(y: number) {
        this.style.top = `${y}em`;
    }

    // --------------- Position
    public get position(): { x: number; y: number } {
        return {
            x: this.x,
            y: this.y,
        };
    }
    public set position(pos: { x: number, y: number }) {
        this.x = pos.x;
        this.y = pos.y;
    }


    // Layout handling
    // ============================================================================================

    // --------------- Layout
    public get layout() {
        return this.style.flexDirection as Layout;
    }
    public set layout(layout: Layout|LayoutStr) {
        this.style.flexDirection = layout;
    }
    
    // --------------- Justify
    public get justify() {
        return this.style.justifyContent as Justify;
    }
    public set justify(justify: Justify|JustifyStr) {
        this.style.justifyContent = justify;
    }

    // --------------- Align
    public get align() {
        return this.style.alignItems as Align;
    }
    public set align(align: Align|AlignStr) {
        this.style.alignItems = align;
    }


    // Style handling
    // ============================================================================================

    // --------------- Show
    public show(cond: boolean = true) {
        this.style.display = cond ? "flex" : "none";
    }

    // --------------- Hide
    public hide(cond: boolean = true) {
        this.show(!cond);
    }


    // Neighbouring handling
    // ============================================================================================

    // --------------- Parent
    public get parent(): BaseElement {
        return super.parentElement as BaseElement;
    }

    // --------------- Children
    public get childArray(): BaseElement[] {
        return Array.from(super.children).map(el => el as BaseElement);
    }

    // --------------- Next sibling
    public get next(): BaseElement {
        return super.nextElementSibling as BaseElement;
    }

    // --------------- Previous sibling
    public get prev(): BaseElement {
        return super.previousElementSibling as BaseElement;
    }
}


// Configuration handling
// ============================================================================================

function join<T>(cfg: T, cfgToAdd: T): T {
    return { ...cfg, ...cfgToAdd };
}

function joinWithThis<T>(this: T, cfgToAdd: T): T {
    return Object.assign(this, join(this, cfgToAdd));
};

export interface BaseElement {
    join: typeof joinWithThis;
}

BaseElement.prototype.join = joinWithThis;
