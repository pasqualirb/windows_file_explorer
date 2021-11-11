import { BaseElement } from "./baseElement";

export class BaseButton extends BaseElement {

    constructor(cfg?: Partial<BaseButton>) {
        super(cfg);

        // if (!config.color)
        //     config.color = "transparent";

        // this.style.backgroundColor = config.color;
    
        // if (config.colorMouseOver)
        //     this.on("mouseover", () => this.style.backgroundColor = config.colorMouseOver);



        // if (config.icon) {
        //     let icon = new Icon(config.icon);
        //     this.append();
        // }

        this.registerEvents();
    }

    private _registerEvents(): void {
        // Register callbacks even if initially there is no alternative color.
        this.on("mouseover", () => this.style.backgroundColor = this.colorMouseOver);
        this.on("mousedown", () => this.style.backgroundColor = this.colorMouseDown);
        this.on("mouseup",   () => this.style.backgroundColor = this.color);
    }


    // Local configuration properties
    // ============================================================================================
    //
    // The local configuration properties store values in private variables for later use.
    // They MUST NOT set the values directly in the DOM.

    // --------------- Color of the button
    private _color: string;
    public get color(): string {
        return this._color;
    }
    public set color(value: string) {
        this._color = value;
    }

    // --------------- Color of the button when the mouse is over it
    private _colorMouseOver: string;
    public get colorMouseOver(): string {
        return this._colorMouseOver;
    }
    public set colorMouseOver(value: string) {
        this._colorMouseOver = value;
    }

    // --------------- Color of the button when the mouse is over it and the mouse button is pressed
    private _colorMouseDown: string;
    public get colorMouseDown(): string {
        return this._colorMouseDown;
    }
    public set colorMouseDown(value: string) {
        this._colorMouseDown = value;
    }

    // --------------- Icon of the button
    private _icon: string;
    public get icon(): string {
        return this._icon;
    }
    public set icon(value: string) {
        this._icon = value;
    }

    // --------------- Icon of the button when the mouse is over it
    private _iconMouseOver: string;
    public get iconMouseOver(): string {
        return this._iconMouseOver;
    }
    public set iconMouseOver(value: string) {
        this._iconMouseOver = value;
    }

    // --------------- Icon of the button when the mouse is over it and the mouse button is pressed
    private _iconMouseDown: string;
    public get iconMouseDown(): string {
        return this._iconMouseDown;
    }
    public set iconMouseDown(value: string) {
        this._iconMouseDown = value;
    }
}
