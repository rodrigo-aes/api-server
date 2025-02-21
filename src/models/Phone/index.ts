import Model, { StaticSelf } from "@/models/Model"
import {
    Table,
    Column,
    DataType,
    AllowNull,
    Unique,

    // Relations
    BelongsTo,

    // Hooks
    BeforeValidate
} from "sequelize-typescript"

// Relations
import User from "../User"

// Types
import type { PhoneAttributes, PhoneCreationAttributes } from "./types"

@Table
@StaticSelf
class Phone extends Model<PhoneAttributes, PhoneCreationAttributes> {
    @AllowNull(false)
    @Column(DataType.STRING)
    declare public parentId: string

    @AllowNull(false)
    @Column(DataType.ENUM('User'))
    declare public parentKey: 'User';

    @BelongsTo(() => User, {
        as: 'user',
        foreignKey: '_id',
        constraints: false,
        foreignKeyConstraint: false,
        scope: {
            parentKey: 'User'
        },
        onDelete: 'CASCADE'
    })
    public user!: User | null

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING(64))
    public complete!: string

    @AllowNull(false)
    @Column(DataType.STRING(16))
    public countryCode!: string

    @AllowNull(false)
    @Column(DataType.STRING(16))
    public areaCode!: string

    @AllowNull(false)
    @Column(DataType.STRING(32))
    public number!: string

    // @AllowNull(false)
    // @Column(DataType.STRING(64))
    // public formated!: string

    // @AllowNull(false)
    // @Column(DataType.STRING(64))
    // public formatedLocal!: string

    // Static methods =========================================================
    // Privates ---------------------------------------------------------------
    private static splitParts(instance: Phone) {
        const [countryCode, areaCode, number] = instance.complete.split(' ')

        Object.assign(instance, {
            countryCode,
            areaCode,
            number,
        })
    }

    // Hooks ==================================================================
    protected static handleData(instance: Phone) {
        this.splitParts(instance)
    }
}

export default Phone