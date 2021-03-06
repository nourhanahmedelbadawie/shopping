import User from '../types/user.types'
import bcrypt from 'bcrypt'
import db from '../database'
import * as dotenv from 'dotenv'
dotenv.config()

class UserModel {
  // create
  async signUp(user: User): Promise<User> {
    try {
      const connection = await db.connect()
      const sql = `INSERT INTO users (email , user_name , first_name , last_name , password) values ($1 , $2 , $3 , $4 , $5) returning *`

      const result = await connection.query(sql, [
        user.email,
        user.user_name,
        user.first_name,
        user.last_name,
        hash_password(user.password)
      ])
      connection.release()

      return result?.rows[0]
    } catch (err: any) {
      throw new Error(`Error ${user.user_name} , ${err.message}an't create user ${user.user_name} `)
    }
  }

  // get all user

  // Jwt
  async loginUser(email: string, password: string): Promise<User | undefined> {
    try {
      const connection = await db.connect()
      const sql = `SELECT password FROM users WHERE email=$1`
      const result = await connection.query(sql, [email])
      if (result.rows.length) {
        const { password: hash_password } = result.rows[0].password
        const ispasswordValid = bcrypt.compare(
          `${password}${process.env.BCRYPT_PASSWORD}`,
          hash_password
        )
        if (ispasswordValid) {
          const userresult = await connection.query(
            `SELECT id ,user_name , first_name , last_name , password FROM users WHERE email=$1`,
            [email]
          )

          return userresult.rows[0]
        }
      }
      connection.release()
    } catch (err: any) {
      throw new Error(`Error  , ${err.message}an't create user ${email} `)
    }
  }

  // hash password
}
const hash_password = (pass: string) => {
  const salt_R = parseInt(process.env.SLART_ROUNDS as string, 10)
  return bcrypt.hash(`${pass}${process.env.BCRYPT_PASSWORD}`, salt_R)
}
export default UserModel
