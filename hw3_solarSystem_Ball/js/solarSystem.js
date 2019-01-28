'use strict';
/**
 * Parameters of all planets
 * @type {{duration: number, orbitRadius: number, ownRotation: number, dirRotation: number, drawOrbit: boolean}}
 */
const planetParam = {
    sun:        {duration: 0, orbitRadius: 0, ownRotation: 0, dirRotation: 0, drawOrbit: false},
    mercury:    {duration: 2000, orbitRadius: 50, ownRotation: 5, dirRotation: 1, drawOrbit: true},
    venus:      {duration: 7000, orbitRadius: 80, ownRotation: 8, dirRotation: 1, drawOrbit: true},
    earth:      {duration: 10000, orbitRadius: 150, ownRotation: 20, dirRotation: -1, drawOrbit: true},
    moon:       {duration: 2000, orbitRadius: 30, ownRotation: 1, dirRotation: 1, drawOrbit: false},
    mars:       {duration: 18000, orbitRadius: 250, ownRotation: 20, dirRotation: 1, drawOrbit: true},
    marssat1:   {duration: 1500, orbitRadius: 20, ownRotation: 3, dirRotation: -1, drawOrbit: false},
    marssat2:   {duration: 2300, orbitRadius: 27, ownRotation: 3, dirRotation: -1, drawOrbit: false},
    jupiter:    {duration: 40000, orbitRadius: 400, ownRotation: 3, dirRotation: 1, drawOrbit: true},
    jupsat1:    {duration: 1500, orbitRadius: 40, ownRotation: 3, dirRotation: -1, drawOrbit: false},
    jupsat2:    {duration: 1900, orbitRadius: 50, ownRotation: 4, dirRotation: -1, drawOrbit: false},
    jupsat3:    {duration: 2300, orbitRadius: 60, ownRotation: 5, dirRotation: -1, drawOrbit: false},
    jupsat4:    {duration: 4000, orbitRadius: 70, ownRotation: 6, dirRotation: -1, drawOrbit: false},
    saturn:     {duration: 60000, orbitRadius: 600, ownRotation: 1, dirRotation: 1, drawOrbit: true},
    uranus:     {duration: 85000, orbitRadius: 750, ownRotation: 4, dirRotation: -1, drawOrbit: true},
    neptune:    {duration: 130000, orbitRadius: 850, ownRotation: 8, dirRotation: 1, drawOrbit: true},
    pluto:      {duration: 180000, orbitRadius: 970, ownRotation: 20, dirRotation: 1, drawOrbit: true},
};

/**
 * window OnLoad
 */
window.onload = () => {
    const box = document.getElementById('box');
    const sun = document.getElementById('sun');

    const center = {
        x: sun.offsetLeft + sun.clientWidth / 2,
        y: sun.offsetTop + sun.clientHeight / 2
    };

    // scrolling to center
    const h = document.documentElement.clientHeight;
    const w = document.documentElement.clientWidth;
    window.scrollTo((box.clientWidth - w) / 2, (box.clientHeight - h) / 2);


    // draw orbits for some planets
    drawOrbits(box, center);


    const pSun = new Planet('sun', null);
    const pMercury = new Planet('mercury', pSun);
    const pVenus = new Planet('venus', pSun);
    const pEarth = new Planet('earth', pSun);
    const pMoon = new Planet('moon', pEarth);
    const pMars = new Planet('mars', pSun);
    const pMarssat1 = new Planet('marssat1', pMars);
    const pMarssat2 = new Planet('marssat2', pMars);
    const pJupiter = new Planet('jupiter', pSun);
    const pJupsat1 = new Planet('jupsat1', pJupiter);
    const pJupsat2 = new Planet('jupsat2', pJupiter);
    const pJupsat3 = new Planet('jupsat3', pJupiter);
    const pJupsat4 = new Planet('jupsat4', pJupiter);
    const pSaturn = new Planet('saturn', pSun);
    const pUranus = new Planet('uranus', pSun);
    const pNeptune = new Planet('neptune', pSun);
    const pPluto = new Planet('pluto', pSun);
};

//region === FUNCTIONS ===
/**
 * draw all orbits
 * @param boxElem {HTMLElement}
 * @param center {{x: number, y:number}}
 */
function drawOrbits(boxElem, center) {
    for(let key in planetParam) {
        if(planetParam[key].drawOrbit) {
            let circle = document.createElement('div');
            circle.style.position = 'absolute';
            circle.style.left = center.x - planetParam[key].orbitRadius + 'px';
            circle.style.top = center.y - planetParam[key].orbitRadius + 'px';

            circle.style.height = planetParam[key].orbitRadius * 2 + 'px';
            circle.style.width = planetParam[key].orbitRadius * 2 + 'px';

            circle.style.borderRadius = '50%';
            circle.style.border = 'solid 1px #1F1F1F';

            circle.style.zIndex = '-1';

            boxElem.appendChild(circle);
        }
    }
}

// /**
//  * Prototype Planet
//  * @param name {string}
//  * @param owner {HTMLElement}
//  * @constructor
//  */
function Planet(name, owner) {
    this.obj = document.getElementById(name);
    this.dur = planetParam[name].duration;
    this.radius = planetParam[name].orbitRadius;
    this.owner = owner;
    this.ownRotation = planetParam[name].ownRotation;
    this.dirRotation = planetParam[name].dirRotation;

    // get the current position of center of DOM element
    this.currentPos = () => {
        return {
            x: this.obj.offsetLeft + this.obj.clientWidth / 2,
            y: this.obj.offsetTop + this.obj.clientWidth / 2
        };
    };

    // animation process
    this.go = () => {
        animate({
            duration: this.dur,
            timing: linear,
            draw: (progress) => {
                let x = this.radius * Math.cos(360 * progress * Math.PI / 180),
                    y = this.radius * Math.sin(360 * progress * Math.PI / 180);

                const rotationCenter = this.owner.currentPos();
                this.obj.style.left = rotationCenter.x + x - this.obj.clientWidth / 2 + 'px';
                this.obj.style.top = rotationCenter.y + y - this.obj.clientHeight / 2 + 'px';

                this.obj.style.transform = 'rotate(' + this.dirRotation * (360 * this.ownRotation * progress) + 'deg)';
            },
            callBack: () => {return this.go();}
        });
    };

    // start the animation process
    if(this.owner) this.go();
}

/**
 * timing function for animation
 * @param timeFraction {number}
 * @returns {number}
 */
function linear (timeFraction) {
    return timeFraction;
}
//endregion