import { BaseElement } from "./baseElements/baseElement";
import { BaseButton } from "./baseElements/baseButton";

// [ - ][ = ][ x ]
//   ^    ^    ^
//   |    |    '- close
//   |    |
//   |    '- maximize/restore
//   |
//   '- minimize
//
// A Button event is forwarded as a WindowActionButton Event.
// This component simplifies the creation of the action buttons.

enum WindowActionButtonType {
    Minimize = "minimize",
    MaximizeRestore = "maximizeRestore",
    Close = "close",
}

//const closeIcon = require();
export class WindowActionButtons extends BaseElement {

    private baseWindowActionButtonConfig: Partial<BaseButton> = {
        size: { width: 3, height: 2 },

        color: "transparent",
        colorMouseOver: "#E9E9E988",
        colorMouseDown: "#EDEDED88",
    };

    private configs: { [key: string]: Partial<BaseButton> } = {
        minimize: this.baseWindowActionButtonConfig,
        maximize: this.baseWindowActionButtonConfig,
        close:    this.baseWindowActionButtonConfig.join({ colorMouseOver: "#C42B1CFF", colorMouseDown: "#C84031FF" }),
    }

    private actionButtons: {[key in WindowActionButtonType]: BaseButton};

    constructor() {
        super();

        for (const key in this.configs)
            this.appendChild(this.constructActionButton(key, this.configs[key]));
    }

    public setCompactMode(on: boolean) {
        this.actionButtons.minimize.hide(on);
        this.actionButtons.maximizeRestore.hide(on);
    }

    public reverseOrder() {
        this.style.flexDirection = "row-reverse";
    }

    private constructActionButton(eventName: string, config: Partial<BaseButton>) {
        const button = new BaseButton(config);
        button.on("click", (e) => this.dispatchEvent(new CustomEvent(eventName)));
        return button;
    }
}
