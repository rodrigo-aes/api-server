import type Command from "../Command";

export default function ProccessLog(
    target: (...args: any[]) => void,
    context: ClassMethodDecoratorContext<Command>
) {
    return function (...args: any[]) {
        const commandInstance = args.pop()
        args.pop()

        commandInstance.initLog(...args)
        target.call(commandInstance, ...args)
        commandInstance.successLog(...args)
    }
}
