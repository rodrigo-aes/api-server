import z from 'zod'
import Validator from '@/validation/Validator'
import { ValidationTarget } from '../Validator/types'

export default class SignInValidator extends Validator {
    protected target: ValidationTarget = 'body'
    protected key: string = 'signIn'

    protected schema(): z.AnyZodObject {
        return z.object({
            credential: z.string({
                required_error: 'É necessário usuário'
            }),

            password: z.string({
                required_error: 'É necessário senha'
            }),

            remember: z.boolean().default(false)
        })
    }
}