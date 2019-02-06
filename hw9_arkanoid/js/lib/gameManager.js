; 'use strict';

class GameManager {
    constructor() {
        this.two = null;
        this.panel = null;
        this.platform = null;

        this.blocks = [];
        this.balls = [];
    }

    initGame() {
        const elem = document.getElementById('canvas');
        this.two = new Two({
            height: 600,
            width: 600
        }).appendTo(elem);

        this.panel = new Panel();

        this.platform = new Platform();
        this.platform.setTwo(this.two);
        this.platform.setPosition(this.two.width / 2);

        this.genBlocks(1);
        this.updateBlocks();

        this.balls.push(new Ball(this));
        this.balls[0].setPosition({x: 300, y: 600 - (Platform.defaultHeight + Ball.defaultRadius)});
        this.balls[0].render();

        this.updateEventListeners();
    }

    reloadGame() {
        this.two.clear();
        this.panel.settings.score = 0;

        this.platform = new Platform();
        this.platform.setTwo(this.two);
        this.platform.setPosition(this.two.width / 2);


        this.blocks = [];
        this.genBlocks(1);
        this.updateBlocks();

        this.balls = [];
        this.balls.push(new Ball(this));
        this.balls[0].setPosition({x: 300, y: 600 - (Platform.defaultHeight + Ball.defaultRadius)});
        this.balls[0].render();
    }

    endGame() {
        this.balls.forEach((b) => {
            b.go = false;
        });

        alert(`Game over!\nYour score: ${this.panel.settings.score}`);
        this.reloadGame();
    }

    updateEventListeners() {
        window.addEventListener('mousemove', (e) => {
            if (this.panel.settings.enableMouse) {
                let factor = 600 / window.innerWidth;
                let pos = e.clientX * factor * (1 + (this.panel.settings.sens + 3) / 5);

                this.platform.setPosition(pos);
            }
        });

        window.addEventListener('click', (e) => {
            if(this.panel.settings.enableMouse) {
                for(let i = 0; i < this.balls.length; i++) {
                    this.balls[i].go = true;
                }
            }
        });

        window.addEventListener('keydown', (e) => {
            if(this.panel.settings.enableKeyboard) {
                if (e.defaultPrevented) {
                    return;
                }

                const step = 30 + this.panel.settings.sens * 10;
                switch (e.key) {
                    case 'ArrowLeft':
                        this.platform.setPosition(this.platform.x - step);
                        break;
                    case 'ArrowRight':
                        this.platform.setPosition(this.platform.x + step);
                        break;
                    default:
                        for(let i = 0; i < this.balls.length; i++) {
                            this.balls[i].go = true;
                        }
                        break;
                }

                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            console.log('up');
        });

        document.getElementById('new_game').addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.endGame();
        });
    }

    genBlocks(level) {
        switch (level) {
            case 1:
                const w = Block.defaultWidth;
                const h = Block.defaultHeight;
                const gap = Block.defaultGap;

                const rows = 6;
                const columns = 9;

                let marginLeft = (600 - (w * columns + gap * (columns - 1))) / 2;
                let marginTop = 50;

                for(let i = 0; i < rows; i++) {
                    for(let j = 0; j < columns; j++) {
                        let x = marginLeft + (w + gap) * j + w / 2;
                        let y = marginTop + (h + gap) * i + h / 2;

                        let block = new Block(this.two, {x: x, y: y}, 2);

                        this.blocks.push(block);
                    }
                }
                break;
        }
    }

    updateBlocks() {
        for(let i = 0; i < this.blocks.length; i ++) {
            this.blocks[i].render();
        }
    }

    handleCollision(block) {
        block.setType(block.type - 1);
        this.panel.settings.score++;
        if(block.type === 0) {
            this.blocks = this.blocks.filter(b => b !== block);
            this.panel.settings.score += 2;
        }
    }
}