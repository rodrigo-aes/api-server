// Authenticables
import User from "@/models/User"
import Email from "@/models/Email"
import Phone from "@/models/Phone"

// Validation Rules
import { Email as EmailRule } from "@/validation/Rules/Email"

const authConfig = {
    sources: {
        User: () => ({
            model: User,
            credentialProps: {
                username: (_: string) => true
            },
            credentialRelations: [
                {
                    model: Email,
                    as: 'emails',
                    props: {
                        address: (value: string) => EmailRule.isEmail(value)
                    }
                },
                {
                    model: Phone,
                    as: 'phones',
                    props: {
                        complete: (value: string) => value.startsWith('+')
                    }
                }
            ]
        })
    },

    defaultSource: () => ({
        model: User,
        key: 'User'
    })
}

export const defaultAcceptedSources: (keyof AuthConfig['sources'])[] = ['User']

export type AuthConfig = typeof authConfig

export default authConfig