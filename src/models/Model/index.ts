import {
    Model as SequelizeModel,
    Column,
    PrimaryKey,
    DataType,

    BeforeFind,
    BeforeValidate,
    BeforeBulkCreate
} from 'sequelize-typescript'

import RequestContext from '@/contexts/RequestContext';
import Pagination from './Pagination';

// Types
import type { Includeable, FindOptions } from 'sequelize'
import type { PaginateOptions, Paginated } from './types';

// Exceptions
import { NotImplementedMethodException } from '@/Exceptions/Common'

/**
 * Base Model class
 */
abstract class Model<
    TModelAttributes extends {} = any,
    TCreationAttributes extends {} = TModelAttributes
> extends SequelizeModel<TModelAttributes, TCreationAttributes> {
    // Columns ================================================================
    /**
     * Primary key _id
     */
    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false })
    public _id!: string;

    // Properties =============================================================
    /**
     * Array of keys to exclude in response toJSON method
     * @override
     */
    protected hidden: (keyof TModelAttributes)[] = []

    // -- Getters -------------------------------------------------------------
    /**
     * Model class name string
     */
    public get _modelName(): string {
        return this.constructor.name
    }

    // ------------------------------------------------------------------------

    /**
     * The _id primary key prefix
     */
    public get _prefix(): string {
        return this.constructor.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    /**
     * The _id primary key prefix
     */
    public static get _prefix(): string {
        return this.constructor.name.toLowerCase()
    }

    // Instance Methods =======================================================
    /**
     * Returns a JSON object with model fields and omit the fields passed
     * in hidden prop
     * @returns {TModelAttributes} - A JSON object with model fields and hidden
     */
    public override toJSON() {
        const json = super.toJSON()
        this.hidden.forEach(key => delete json[key])

        return json
    }

    // ------------------------------------------------------------------------

    /**
     * Fill the fields with value passed in data param
     * @param {TModelAttributes} data - A object containing data to fill
     */
    public fill(data: TModelAttributes) {
        Object.assign(this, data)
    }

    // Static Methods =========================================================
    /**
     * Fixed relations includes
     * @returns {Includeable[]} An array of fixed includeble relations
     * @override
     */
    protected static fixedRelations(): Includeable[] {
        return []
    }

    // ------------------------------------------------------------------------

    protected static async _findByPk(id: string): Promise<Model | null> {
        throw new NotImplementedMethodException('_findByPk')
    }

    // ------------------------------------------------------------------------

    protected static async _findAll(options: FindOptions<Model>): Promise<
        Model[]
    > {
        throw new NotImplementedMethodException('_findAll')
    }

    // ------------------------------------------------------------------------

    protected static async _count(options: FindOptions<Model>): Promise<
        number
    > {
        throw new NotImplementedMethodException('_count')
    }

    // ------------------------------------------------------------------------

    /**
     * 
     * @param {PaginateOptions<Model>} options
     * @returns {Promise<Paginated<Model>>} - Object containing data array
     * of model instances and pagination
     */
    public static async paginate(
        options: PaginateOptions<Model>
    ): Promise<Paginated<Model>> {
        const { perPage, ...rest } = options

        const page = this.parsePageParam()
        const limit = perPage
        const offset = (page - 1) * perPage

        const total = await this._count(rest)
        const data = await this._findAll({
            ...rest,
            limit,
            offset
        })

        const pagination = new Pagination(
            total,
            page,
            perPage
        )

        return {
            data,
            pagination
        }
    }

    // -- Privates ------------------------------------------------------------
    private static async genId() {
        let id: string

        do id = `${this._prefix}_${Str.UUIDV4()}`
        while (await this._findByPk(id))

        return id
    }

    // ------------------------------------------------------------------------

    private static parsePageParam() {
        const queryPage = RequestContext.req?.query.page as string | undefined
        return parseInt(queryPage ?? '1')
    }

    // Hooks ==================================================================
    /**
     * Add the fixed relations to consult
     * @param {FindOptions<Model>} options - Consult find options
     */
    @BeforeFind
    protected static includeFixedRelations(options: FindOptions<Model>) {
        if (options.include) options.include = Array.isArray(options.include)
            ? [...options.include, ...this.fixedRelations()]
            : [options.include, ...this.fixedRelations()]

        else options.include = this.fixedRelations()
    }

    // ------------------------------------------------------------------------

    @BeforeValidate
    protected static async handleId(instance: Model) {
        if (!instance._id) instance._id = await this.genId()
    }

    // ------------------------------------------------------------------------

    @BeforeBulkCreate
    protected static async handleIds(instances: Model[]) {
        for (const instance of instances) this.handleId(instance)
    }
}

export default Model

import { StaticMethods } from './Decorators'
export {
    StaticMethods
}