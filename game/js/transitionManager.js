class TransitionManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.isTransitioning = false;
        this.transitionProgress = 0;
        this.transitionDuration = 1000; // ms
        this.onTransitionComplete = null;
    }

    startTransition(callback) {
        this.isTransitioning = true;
        this.transitionProgress = 0;
        this.onTransitionComplete = callback;
        this.startTime = performance.now();
    }

    update() {
        if (!this.isTransitioning) return;
        const currentTime = performance.now();
        this.transitionProgress = (currentTime - this.startTime) / this.transitionDuration;
        if (this.transitionProgress >= 1) {
            this.isTransitioning = false;
            if (this.onTransitionComplete) {
                this.onTransitionComplete();
            }
        }
    }

    draw(ctx) {
        if (!this.isTransitioning) return;
        const alpha = Math.sin(this.transitionProgress * Math.PI) * 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
}