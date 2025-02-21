import { StaticSelf } from "@/models/Model"
import Authenticable from "@/utils/Auth/Authenticable"
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
class User extends Authenticable<UserAttributes, UserCreationAttributes> {
    @Unique
    @Column(DataType.STRING)
    public uniqueColumn!: string
}

export default User