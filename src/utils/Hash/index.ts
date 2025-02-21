import bcrypt from 'bcrypt'

class Hash {
    public static make(data: string) {
        return bcrypt.hashSync(data, bcrypt.genSaltSync())
    }

    public static compare(data: string, encrypted: string) {
        return bcrypt.compareSync(data, encrypted)
    }
}

export default Hash