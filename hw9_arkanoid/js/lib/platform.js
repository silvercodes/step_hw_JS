; 'use strict';

class Platform {
    constructor() {
        this.two = null;
        this.width = Platform.defaultWidth;
        this.rect = null;
        this.x = 0;
    }

    setTwo(two) {
        this.two = two;
        this.updateBinding();
    }

    setPosition(x) {
        let half = this.width / 2 + Platform.defaultMargin;

        if(x >= half && x <= 600 - half) {
            this.x = x;
        }
        else if(x < half) {
            this.x = half;
        }
        else if(x > 600 - half) {
            this.x = 600 - half;
        }

        this.render();
    };


    render() {
        if(!this.rect)
            this.genRect();

        this.two.play();
    }

    genRect() {
        this.rect = this.two.makeRectangle(
            this.x,
            this.two.height - Platform.defaultHeight / 2 - Platform.defaultMargin,
            this.width,
            Platform.defaultHeight);
        // this.rect.fill = 'rgba(0, 200, 255, 0.75)';
        // this.rect.stroke = '#1C75BC';
        this.rect.fill = '#323032';
        this.rect.stroke = '#1C75BC';
    }

    updateBinding() {
        this.two.bind('update', () => {
            this.rect.translation.x = this.x;
        });
    }


}

Platform.defaultWidth = 100;
Platform.defaultHeight = 8;
Platform.defaultMargin = 0;