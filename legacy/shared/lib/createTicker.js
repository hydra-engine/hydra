export function createTicker(parameters) {
    const { fixedFps: fps, onTick } = parameters;
    let fixedFps = fps !== undefined && fps > 0 ? fps : undefined;
    let frameId = 0;
    let lastTime = performance.now();
    let lagSeconds = 0;
    const tick = (timestamp) => {
        frameId = requestAnimationFrame(tick);
        const deltaTime = (timestamp - lastTime) / 1000;
        if (deltaTime <= 0)
            return;
        lastTime = timestamp;
        if (fixedFps !== undefined) {
            const fixedStep = 1 / fixedFps;
            lagSeconds += deltaTime;
            if (lagSeconds >= fixedStep) {
                onTick(fixedStep);
                if (lagSeconds >= fixedStep * 2) {
                    onTick(deltaTime);
                    lagSeconds = 0;
                }
                else {
                    lagSeconds -= fixedStep;
                }
            }
        }
        else {
            onTick(deltaTime);
        }
    };
    frameId = requestAnimationFrame(tick);
    return {
        setFixedFps: (fps) => {
            fixedFps = fps !== undefined && fps > 0 ? fps : undefined;
        },
        destroy: () => {
            cancelAnimationFrame(frameId);
        }
    };
}
//# sourceMappingURL=createTicker.js.map