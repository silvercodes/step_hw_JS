; 'use strict';

class Panel {
    constructor() {
        this.settings = {
            enableMouse: false,
            enableKeyboard: true,
            sens: 0,
            score: 0
        };

        this.updateDefiBindings();
    }

    updateDefiBindings() {
        defi.bindNode(this.settings, 'enableMouse', '#enable_mouse', {
            on: 'click',
            getValue: ({ node }) => {
                return node.checked;
            },
            setValue: (v, {node}) => {
                node.checked = !!v;
            }
        });

        defi.bindNode(this.settings, 'enableKeyboard', '#enable_mouse', {
            on: 'click',
            getValue: ({ node }) => {
                return !node.checked;
            },
            setValue: (v, {node}) => {
                node.checked = !!!v;
            }
        });

        defi.bindNode(this.settings, 'sens', '#sens_mouse', {
            on: 'change',
            getValue: ({node}) => {
                return parseInt(node.value);
            },
            setValue: (v, {node}) => {
                node.value = v;
            }
        });

        defi.bindNode(this.settings, 'sens', '#sens_mouse_value', {
            on: 'input',
            setValue: (v, {node}) => {
                node.innerText = v + 3;
            }
        });

        defi.bindNode(this.settings, 'score', '.score', {
            on: 'change',
            getValue: ({node}) => {
                return node.value;
            },
            setValue: (v, {node}) => {
                node.innerText = `Score: ${v}`;
            }
        });
    }

}
