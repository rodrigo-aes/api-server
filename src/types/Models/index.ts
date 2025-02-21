import type AuthToken from "@/models/AuthToken/index";
import type Email from "@/models/Email/index";
import type Phone from "@/models/Phone/index";
import type User from "@/models/User/index";

export type Models = {
    AuthToken: typeof AuthToken;
    Email: typeof Email;
    Phone: typeof Phone;
    User: typeof User;
};


export type PolymorphicRelationParentKey = keyof Models