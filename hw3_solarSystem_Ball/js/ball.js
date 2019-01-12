window.onload = () => {

    /**
     * Field
     * @type {HTMLElement}
     */
    const box = document.getElementById('box');

    /**
     * Ball object
     * @type {HTMLElement}
     */
    const ball = document.getElementById('ball');

    /**
     * Size of field
     * @type {number}
     */
    const boxSize = box.clientHeight;

    /**
     * Size of ball
     * @type {number}
     */
    const ballSize = ball.clientHeight;

    /**
     * Amend for processing of animation
     * @type {number}
     */
    const amend = ballSize / 2;

    /**
     * Begin coordinates
     * @type {{x: number, y: number}}
     */
    let from = {
        x: 0, y: 0
    };

    /**
     * End coordinates
     * @type {{x: number, y: number}}
     */
    let to = {
        x: 0, y: 0
    };

    /**
     * Coefficients of line equation
     * @type {{a: (number), b: (number), c: (number)}}
     */
    let coef = {
        a: 0, b: 0, c: 0,
        calculate: function() {
            this.a = from.y - to.y;
            this.b = to.x - from.x;
            this.c = (from.x * to.y) - (to.x * from.y);
        }
    };

    /**
     * Mouse click
     * @param e
     */
    box.onclick = (e) => {
        box.onclick = null;

        let x, y; //adjusted mouse click coordinates

        if(e.offsetX < amend) x = amend;
        else if(e.offsetX > boxSize - amend) x = boxSize - amend;
        else x = e.offsetX;

        if(e.offsetY < amend) y = amend;
        else if(e.offsetY > boxSize - amend) y = boxSize - amend;
        else y = e.offsetY;

        from.x = amend;
        from.y = amend;
        to.x = x;
        to.y = y;

        coef.calculate();
        to = nextPoint(from);

        console.log(from, to);

        process();
    };

    /**
     * Process of animation
     */
    function process() {
        animate({
            duration: calculatePathLength(from, to),
            timing: linear,
            draw: (progress) => {
                ball.style.left = from.x - amend + ((to.x - amend) - (from.x - amend)) * progress + 'px';
                ball.style.top = from.y - amend + ((to.y - amend) - (from.y - amend)) * progress + 'px';
            },
            callBack: animateCallBack
        });
    }

    /**
     * Call back function for animate
     */
    function animateCallBack() {

        let k1 = -(coef.a/coef.b);
        let k2 = -k1;

        coef.a = k2;
        coef.b = -1;
        coef.c = to.y - k2 * to.x;

        from.x = to.x;
        from.y = to.y;

        np = nextPoint(to);
        to.x = np.x;
        to.y = np.y;

        console.log(from, to);

        process();
    }

    /**
     * Calculate next point for animation
     * @param current
     * @returns {{x, y}}
     */
    function nextPoint(current) {
        let ph = checkHorizontal(current);
        let pv = checkVertical(current);
        if(ph)
            return ph;
        else
            return pv;
    }

    /**
     * Check collisions with vertical border
     * @param current
     * @returns {*}
     */
    function checkVertical(current) {
        let x1 = amend;
        let x2 = boxSize - amend;
        let y1 = -1 * (coef.a * x1 + coef.c) / coef.b;
        let y2 = -1 * (coef.a * x2 + coef.c) / coef.b;

        if(y1 >= amend && y1 <= boxSize - amend && y1 !== current.y && x1 !== current.x)
            return {x: x1, y: y1};
        else if(y2 >= amend && y2 <= boxSize - amend && y2 !== current.y && x2 !== current.x)
            return {x: x2, y: y2};
        else return null;
    }

    /**
     * Check collisions with horizontal border
     * @param current
     * @returns {*}
     */
    function checkHorizontal(current) {
        let y1 = amend;
        let y2 = boxSize - amend;
        let x1 = -1 * (coef.b * y1 + coef.c) / coef.a;
        let x2 = -1 * (coef.b * y2 + coef.c) / coef.a;

        if(x1 >= amend && x1 <= boxSize - amend && y1 !== current.y && x1 !== current.x)
            return {x: x1, y: y1};
        else if(x2 >= amend && x2 <= boxSize - amend && y2 !== current.y && x2 !== current.x)
            return {x: x2, y: y2};
        else return null;
    }
};

/**
 * Calculate length of animation path
 * @param from
 * @param to
 * @returns {number}
 */
function calculatePathLength(from, to) {
    return Math.sqrt(Math.pow((to.x - from.x), 2) + Math.pow((to.y - from.y), 2));
}

/**
 * Linear timing function for animation
 * @param progress
 * @returns {*}
 */
function linear(progress) {
    return progress;
}

function quad(progress) {
    return Math.pow(progress, 2)
}

function makeEaseInOut(timing) {
    return function(timeFraction) {
        if (timeFraction < .5)
            return timing(2 * timeFraction) / 2;
        else
            return (2 - timing(2 * (1 - timeFraction))) / 2;
    }
}

