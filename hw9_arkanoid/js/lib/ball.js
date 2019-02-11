; 'use strict';

class Ball {
    constructor(gManager) {
        this.gManager = gManager;
        this.two = this.gManager.two;

        this.circle = null;

        this.position = {x: 0, y: 0};
        this.prevPosition = {x: -1, y: -1};
        this.go = false;

        this.dx = 0;
        this.dy = 0;

        this.speed = 8;
        this.angle = (rnd(10, 170)) * Math.PI / 180;

        this.updateBinding();
    }

    setPosition(pos) {
        this.prevPosition.x = this.position.x;
        this.prevPosition.y = this.position.y;
        this.position = {x: pos.x, y: pos.y};
    }

    genCircle() {
        this.circle = this.two.makeCircle(this.position.x, this.position.y, Ball.defaultRadius);

        this.circle.fill = '#426288';
        this.circle.stroke = '#008298';

    }

    render() {
        if(!this.circle) {
            this.genCircle();
        }

        this.two.play();
    }

    updateBinding() {
        this.two.bind('update', (nf) => {

        this.analysis();

        this.circle.translation.x = this.position.x;
        this.circle.translation.y = this.position.y;

        });
    }

    analysis() {
        // ball is based on the platform
        if(!this.go) {
            let platform = this.gManager.platform;
            this.position.x = platform.x;
        }
        // ball is flying
        else {
            // if this is the beginning of the game
            if(this.dx === 0 && this.dy === 0) {
                this.dx = this.speed * Math.cos(this.angle);
                this.dy = -1 * (this.speed * Math.sin(this.angle));
            }

            this.updateDxDy();

            this.setPosition({x: this.position.x + this.dx, y: this.position.y + this.dy});
        }
    }

    updateDxDy() {
        this.checkCollision();
    }

    checkCollision() {
        const blocks = this.gManager.blocks;
        const bw = Block.defaultWidth;
        const bh = Block.defaultHeight;
        const r = Ball.defaultRadius;
        const x = this.position.x;
        const y = this.position.y;

        const ph = Platform.defaultHeight;
        const pw = this.gManager.platform.width;
        const px = this.gManager.platform.x;


        //collision with walls
        if((x - r) < 0 || (x + r) > 600) {
            this.dx = -this.dx;
            return;
        }
        else if((y - r) < 0) {
            this.dy = -this.dy;
            return;
        }
        else if((y + r) > 600) {
            this.gManager.endGame();
        }


        //collision with platform
        if((y + r) > (600 - ph - Platform.defaultMargin) && (x >= px - pw / 2) && (x <= px + pw / 2)) {
            this.dy = -this.dy;
            return;
        }
        // else if(((x + r) > (px - pw / 2) || (x - r) < (px + pw / 2)) && (y > (600 - ph - Platform.defaultMargin))) {
        //     this.dx = -this.dx;
        //     this.dy = -this.dy;
        // }

        // collision with block
        for (let i = 0; i < blocks.length; i++) {
            let b = blocks[i];
            let bx = blocks[i].position.x;
            let by = blocks[i].position.y;


            if(((x - r) < (bx + bw / 2)) && ((x - r) > (bx - bw / 2)) && (y >= by - bh / 2) && (y <= by + bh / 2)) {
                this.gManager.handleCollision(b);
                this.dx = -this.dx;
                console.log('right');
            }
            else if(((x + r) > (bx - bw / 2)) && ((x + r) < (bx + bw / 2)) && (y >= by - bh / 2) && (y <= by + bh / 2)) {
                this.gManager.handleCollision(b);
                this.dx = -this.dx;
                console.log('left');
            }
            else if(((((y - r) < (by + bh / 2) && ((y - r) > (by - bh / 2))) && (x >= bx - bw / 2) && (x <= bx + bw / 2))) ||
                (((y + r) > (by - bh / 2) && ((y + r) < (by + bh / 2)) && (x >= bx - bw / 2) && (x <= bx + bw / 2)))) {
                this.gManager.handleCollision(b);
                this.dy = -this.dy;
                console.log('downup')
            }
        }
    }



}
Ball.defaultRadius = 5;
Ball.defaultColor = '#1d2b3b';


function rnd(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}