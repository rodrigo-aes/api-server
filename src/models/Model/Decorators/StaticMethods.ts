import type Model from ".."

export default function StaticSelf(constructor: typeof Model<any, any>) {
    Object.defineProperty(constructor, 'self', {
        get: function () {
            return this;
        },
        configurable: false,
        enumerable: false
    });
}