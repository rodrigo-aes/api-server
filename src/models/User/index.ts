import { StaticSelf } from "@/models/Model"
import Authenticable from "@/utils/Auth/Authenticable"
import {
    Table,
    DataType,
    Column,
    Unique,
    AllowNull,

    // Relations
    HasMany,
} from "sequelize-typescript"

// Relations
import Email from "../Email"
import Phone from "../Phone"

// Types
import type {
    UserAttributes,
    UserCreationAttributes,
    UserStoreAtrributes
} from "./types"
import type { IncludeOptions } from "sequelize"

@Table
@StaticSelf
class User extends Authenticable<UserAttributes, UserCreationAttributes> {
    // Columns ================================================================
    @AllowNull(false)
    @Unique
    @Column(DataType.STRING)
    declare public username: string

    // Relations ==============================================================
    @HasMany(() => Email, {
        foreignKey: 'parentId',
        as: 'emails',
        constraints: false,
        foreignKeyConstraint: false
    })
    public emails!: Email[]

    @HasMany(() => Phone, {
        foreignKey: 'parentId',
        as: 'phones',
        constraints: false,
        foreignKeyConstraint: false
    })
    public phones!: Phone[]

    // Static Methods =========================================================
    public static async register(
        { email, phone, ...values }: UserStoreAtrributes,
    ) {
        const instance = await this.create(values)

        instance.push('emails', await instance.$create<Email>('Email', {
            address: email
        }))

        instance.push('phones', await instance.$create<Phone>('Phone', {
            complete: phone
        }))

        return instance
    }

    // Protecteds -------------------------------------------------------------
    protected static override fixedRelations(): IncludeOptions[] {
        return [
            {
                model: Email,
                as: 'emails',
                required: false
            },
            {
                model: Phone,
                as: 'phones',
                required: false
            }
        ]
    }
}

export default User