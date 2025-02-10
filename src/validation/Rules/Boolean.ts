import z from 'zod'

export class Boolean {
    public static parse(value: any) {
        return z.any().transform(value => {
            switch (value) {
                case undefined:
                case 0:
                case '0':
                case 'false':
                case '':
                case false:
                    return false

                case 1:
                case '1':
                case 'true':
                case true:
                    return true
            }
        })
            .safeParse(value)
            .data
    }
}