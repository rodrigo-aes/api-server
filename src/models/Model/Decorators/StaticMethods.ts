import type Model from ".."
import type { FindOptions } from "sequelize";

const addFindByPkGetterMethod = (constructor: typeof Model) => {
    Object.defineProperty(constructor, '_findByPk', {
        value: function (id: string) {
            return (constructor as any).findByPk(id)
        },
        writable: false,
        enumerable: false,
        configurable: false
    });
}

const addFindAllGetterMethod = (constructor: typeof Model) => {
    Object.defineProperty(constructor, '_findAll', {
        value: function (options: FindOptions<Model>) {
            return (constructor as any).findAll(options)
        },
        writable: false,
        enumerable: false,
        configurable: false
    });
}

const addCountGetterMethod = (constructor: typeof Model) => {
    Object.defineProperty(constructor, '_count', {
        value: function (options: FindOptions<Model>) {
            return (constructor as any).count(options)
        },
        writable: false,
        enumerable: false,
        configurable: false
    });
}

export default function StaticMethods(constructor: typeof Model) {
    addFindByPkGetterMethod(constructor)
    addCountGetterMethod(constructor)
    addFindAllGetterMethod(constructor)
}