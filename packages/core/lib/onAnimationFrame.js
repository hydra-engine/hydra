export function onAnimationFrame(parametersOrListener, maybeListener) {
    let parameters;
    let listener;
    if (typeof parametersOrListener === 'function') {
        parameters = {};
        listener = parametersOrListener;
    }
    else {
        parameters = parametersOrListener ?? {};
        listener = maybeListener;
    }
    const baseCap = parameters.backgroundFps !== undefined && parameters.backgroundFps > 0
        ? parameters.backgroundFps : undefined;
    let frameId = 0;
    let lastTime = performance.now();
    let lagSeconds = 0;
    let fpsCap = document.hidden ? baseCap : undefined;
    const loop = (timestamp) => {
        frameId = requestAnimationFrame(loop);
        const deltaTime = (timestamp - lastTime) / 1000;
        if (deltaTime <= 0)
            return;
        lastTime = timestamp;
        if (fpsCap !== undefined) {
            const fixedStep = 1 / fpsCap;
            lagSeconds += deltaTime;
            if (lagSeconds >= fixedStep) {
                listener(fixedStep);
                if (lagSeconds >= fixedStep * 2) {
                    listener(deltaTime);
                    lagSeconds = 0;
                }
                else {
                    lagSeconds -= fixedStep;
                }
            }
        }
        else {
            listener(deltaTime);
        }
    };
    const onBlur = () => {
        fpsCap = baseCap;
    };
    const onFocus = () => {
        fpsCap = undefined;
    };
    const onPageshow = (event) => {
        if (event.persisted) {
            fpsCap = undefined;
        }
    };
    if (baseCap !== undefined) {
        if (!document.hasFocus()) {
            onBlur();
        }
        window.addEventListener('blur', onBlur);
        window.addEventListener('focus', onFocus);
        window.addEventListener('pageshow', onPageshow);
    }
    frameId = requestAnimationFrame(loop);
    // off
    return () => {
        cancelAnimationFrame(frameId);
        if (baseCap !== undefined) {
            window.removeEventListener('blur', onBlur);
            window.removeEventListener('focus', onFocus);
            window.removeEventListener('pageshow', onPageshow);
        }
    };
}
//# sourceMappingURL=onAnimationFrame.js.map