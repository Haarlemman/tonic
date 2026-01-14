class GameLogger {
    static LOG_LEVELS = {
        DEBUG: 0,
        INFO: 1,
        WARN: 2,
        ERROR: 3
    };

    static currentLevel = GameLogger.LOG_LEVELS.INFO;

    static setLogLevel(level) {
        this.currentLevel = level;
    }

    static debug(message) {
        if (this.currentLevel <= this.LOG_LEVELS.DEBUG) {
            console.debug('[Game Debug]:', message);
        }
    }

    static log(message) {
        if (this.currentLevel <= this.LOG_LEVELS.INFO) {
            console.log('[Game Info]:', message);
        }
    }

    static warn(message) {
        if (this.currentLevel <= this.LOG_LEVELS.WARN) {
            console.warn('[Game Warning]:', message);
        }
    }

    static error(message) {
        if (this.currentLevel <= this.LOG_LEVELS.ERROR) {
            console.error('[Game Error]:', message);
        }
    }
} 