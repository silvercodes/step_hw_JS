; 'use strict';

class Block {
    constructor(two, pos, type) {
        this.two = two;
        this.position = pos;
        this.type = type;
        this.rect = this.genRect();
    }

    genRect() {
        this.rect = this.two.makeRectangle(
            this.position.x,
            this.position.y,
            Block.defaultWidth,
            Block.defaultHeight);

        this.setType(this.type);
    }

    render() {
        if(!this.rect)
            this.genRect();

        this.two.update();
    }

    setType(type) {
        this.type = type;
        switch(this.type) {
            case 1:
                this.rect.fill = '#969496';
                this.rect.stroke = '#ffffff';
                break;
            case 2:
                this.rect.fill = '#323032';
                this.rect.stroke = '#ffffff';
                break;
            case 0:
                this.rect.fill = '#ffffff';
                this.rect.stroke = '#ffffff';
                break;
        }
    }
}
Block.defaultWidth = 50;
Block.defaultHeight = 30;
Block.defaultGap = 0;