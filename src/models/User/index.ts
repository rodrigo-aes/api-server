import Model, { StaticSelf } from "@/models/Model"
import {
    Table,
} from "sequelize-typescript"

// Types
import type { UserAttributes, UserCreationAttributes } from "./types"

@Table
@StaticSelf
class User extends Model<UserAttributes, UserCreationAttributes> {

}

export default User