import type { ModelAttributes } from "@/models/Model"
import type { Optional } from "sequelize"

export interface UserAttributes extends ModelAttributes { }

export type UserCreationAttributes = Optional<UserAttributes, (
    'createdAt' |
    'updatedAt'
)>