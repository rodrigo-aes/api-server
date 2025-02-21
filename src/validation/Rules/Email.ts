import z from 'zod'

export class Email {
    public static isEmail(value: string) {
        return z.string()
            .email()
            .safeParse(value)
            .success
    }
}