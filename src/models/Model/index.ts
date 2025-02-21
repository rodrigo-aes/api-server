import {
    Model as SequelizeModel,
    Column,
    DataType,
    PrimaryKey,
    AllowNull,
    CreatedAt,
    UpdatedAt,

    BeforeFind,
    BeforeValidate,
    BeforeBulkCreate,
    BeforeSync,
    AfterSync
} from 'sequelize-typescript'

import RequestContext from '@/contexts/RequestContext';
import Pagination from './Pagination';

// Types
import type { ModelStatic, Includeable, FindOptions } from 'sequelize'
import type {
    ModelAttributes,
    ModelCreationAttributes,
    ModelOptionalAttributes,
    PaginateOptions,
    Paginated,

    ModelWithPolymorphicParent
} from './types';
import type { Models } from '@/types/Models';

// Exceptions
import { NotImplementedMethodException } from '@/Exceptions/Common'

/**
 * Base Model class
 */
abstract class Model<
    TModelAttributes extends ModelAttributes = any,
    TCreationAttributes extends ModelCreationAttributes<
        ModelAttributes,
        ModelOptionalAttributes
    > = any
> extends SequelizeModel<
    TModelAttributes,
    TCreationAttributes
> {
    // Columns ================================================================
    /**
     * Primary key _id
     */
    @AllowNull(false)
    @PrimaryKey
    @Column(DataType.STRING)
    public _id!: string;

    @CreatedAt
    @Column(DataType.DATE)
    declare public readonly createdAt: Date;

    @UpdatedAt
    @Column(DataType.DATE)
    declare public readonly updatedAt: Date;

    public parentId?: string
    public parentKey?: string

    // Properties =============================================================
    /**
     * Self getter to base class Model access child sattic methods
     */
    protected static get self(): ModelStatic<Model> {
        throw new NotImplementedMethodException('self')
    }

    // ------------------------------------------------------------------------

    /**
     * Array of keys to exclude in response toJSON method
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
        return this.constructor.name
    }

    // ------------------------------------------------------------------------

    /**
     * The _id primary key prefix
     */
    public static get _prefix(): string {
        return this.constructor.name
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
    // Publics ----------------------------------------------------------------
    public static sepId(id: string): [keyof Models, string] {
        return id.split('_') as [keyof Models, string]
    }

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

        this.self.count()

        const total = await this.self.count(rest)
        const data = await this.self.findAll({
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

    // Protecteds -------------------------------------------------------------
    /**
     * Fixed relations includes
     * @returns {Includeable[]} An array of fixed includeble relations
     * @override
     */
    protected static fixedRelations(): Includeable[] {
        return []
    }

    // -- Privates ------------------------------------------------------------
    private static async genId() {
        let id: string

        do id = `${this._prefix}_${Str.UUIDV4()}`
        while (await this.self.findByPk(id))

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

    /**
     * Handle ID of the instance if not exists
     * @param {Model} instance - Model instance
     */
    @BeforeValidate
    protected static async handleId(instance: Model) {
        if (!instance._id) instance._id = await this.genId()
    }

    // ------------------------------------------------------------------------

    @BeforeValidate
    protected static handleOwnerKey(
        instance: Model
    ) {
        if (instance.parentId) {
            const [key] = this.sepId(instance.parentId)
            instance.parentKey = key
        }
    }

    // ------------------------------------------------------------------------

    /**
     * Handle ID of the instances if not exists
     * @param {Model[]} instances - Model instances 
     */
    @BeforeBulkCreate
    protected static async handleIds(instances: Model[]) {
        for (const instance of instances) this.handleId(instance)
    }

    // ------------------------------------------------------------------------

    /**
     * Log of init sync process
     */
    @BeforeSync
    protected static initSyncLog() {
        Log.out(`#[warning]Syncronizing model #[info]${this.self.name}#[warning]...`)
    }

    // ------------------------------------------------------------------------

    /**
     * Log of success sync process
     */
    @AfterSync
    protected static syncSuccessLog() {
        Log.out(`#[info]${this.self.name} #[success]model syncronized sucessfuly!`)
        Log.out('')
    }
}

export default Model

import { StaticSelf } from './Decorators'

export {
    StaticSelf
}

export type {
    ModelAttributes,
    ModelCreationAttributes
}