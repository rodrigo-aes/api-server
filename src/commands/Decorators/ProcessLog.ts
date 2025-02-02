import type Command from "../Command";

export default function ProccessLog(
    target: Command,
    key: string,
    descriptor: TypedPropertyDescriptor<(type: "command", name: string) => void>
) {
    const handle = descriptor.value as Function

    descriptor.value = function (...args: any[]) {
        (this as Command).initLog(...args)
        handle.call(this, ...args);
        (this as Command).successLog(...args)
    }

    return descriptor
}
