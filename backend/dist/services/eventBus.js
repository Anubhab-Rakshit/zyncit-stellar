import { EventEmitter } from "events";
const emitter = new EventEmitter();
export const emitPlatformEvent = (type, payload) => {
    const event = {
        type,
        payload,
        timestamp: new Date().toISOString(),
    };
    emitter.emit("platform_event", event);
};
export const onPlatformEvent = (listener) => {
    emitter.on("platform_event", listener);
    return () => emitter.off("platform_event", listener);
};
