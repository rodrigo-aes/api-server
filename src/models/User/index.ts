import Model, { StaticSelf } from "@/models/Model"
import {
    Table,
    DataType,
    Column,
    Unique
} from "sequelize-typescript"

// Types
import type { UserAttributes, UserCreationAttributes } from "./types"

@Table
@StaticSelf
class User extends Model<UserAttributes, UserCreationAttributes> {
    @Unique
    @Column(DataType.STRING)
    public uniqueColumn!: string
}

export default User