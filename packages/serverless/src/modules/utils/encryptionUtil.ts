import bcrypt from 'bcryptjs'

export const encrypt = async(str: string): Promise<String> => {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(str, salt)
    return hashed;
}