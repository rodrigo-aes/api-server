import Model, { StaticSelf } from "@/models/Model"
import {
    Table,
    Column,
    DataType,
    Unique,
    AllowNull,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,

    // Relations
    BelongsTo,

    // Hooks
    BeforeValidate
} from "sequelize-typescript"

// Relations
import User from "../User"

// Types
import type { EmailAttributes, EmailCreationAttributes } from "./types"
import type { PolymorphicRelationParentKey } from "@/types/Models"
import type { AssociationScope } from "sequelize"

@Table
@StaticSelf
class Email extends Model<EmailAttributes, EmailCreationAttributes> {
    @AllowNull(false)
    @Column(DataType.STRING)
    declare public parentId: string

    @AllowNull(false)
    @Column(DataType.ENUM('User'))
    declare public parentKey: 'User'

    @BelongsTo(() => User, {
        as: 'user',
        foreignKey: '_id',
        scope: {
            parentKey: 'User'
        },
        constraints: false,
        foreignKeyConstraint: false,
    })
    public user?: User

    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    declare public address: string

    @AllowNull(false)
    @Column(DataType.STRING)
    declare public local: string

    @AllowNull(false)
    @Column(DataType.STRING)
    declare public domain: string

    // Static Methods =========================================================
    // Privates ---------------------------------------------------------------
    private static handleAddress(instance: Email) {
        const [local, domain] = instance.address.split('@')
        instance.fill({ local, domain })
    }

    // Hooks ==================================================================
    @BeforeValidate
    protected static hadleData(instance: Email) {
        this.handleAddress(instance)
    }
}

export default Email