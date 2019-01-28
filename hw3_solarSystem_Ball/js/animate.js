/**
 * animate with options
 * @param {array} options
 */
function animate(options) {
    let start = performance.now();

    requestAnimationFrame(function nextFrame(time) {
        let timeFraction = (time - start) / options.duration;
        timeFraction = timeFraction > 1 ? 1 : timeFraction;

        let progress = options.timing(timeFraction);

        options.draw(progress);

        if(timeFraction < 1)
            requestAnimationFrame(nextFrame);
        else
            options.callBack();
    });
}