import z from 'zod'
import Validator from '@/validation/Validator'
import { ValidationTarget } from '../Validator/types'

// Rules
import { Unique } from '@/validation/Rules/Unique'

export default class SignUpValidator extends Validator {
    protected target: ValidationTarget = 'body'
    protected key: string = 'signUp'

    protected schema() {
        return z.object({
            username: z.string({
                required_error: 'Username is required.'
            })
                .refine(
                    async value => await Unique.unique(
                        'User', 'username', value
                    ),
                    {
                        message: 'Username should be unique.'
                    }
                ),

            // ----------------------------------------------------------------

            email: z.string({
                required_error: 'Email is required.'
            })
                .email({
                    message: 'Invalid email address.'
                })
                .refine(
                    async value => await Unique.unique(
                        'Email', 'address', value
                    ),
                    {
                        message: 'Email should be unique.'
                    }
                ),

            // ----------------------------------------------------------------

            phone: z.string({
                required_error: 'Phone is required',
            })
                .refine(
                    async value => await Unique.unique(
                        'Phone', 'complete', value
                    ),
                    {
                        message: 'Phone should be unique.'
                    }
                ),

            // ----------------------------------------------------------------

            _password: z.string().min(8),
            _passwordConfirmation: z.string()
        })
            .refine(
                ({
                    _password,
                    _passwordConfirmation
                }) => _password === _passwordConfirmation,
                {
                    message: 'Passwords do not coincide'
                }
            )
    }
}