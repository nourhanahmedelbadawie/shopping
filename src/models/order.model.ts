import Order from '../types/order.types'
import db from '../database'

class OrderModel {
  // create
  async createOrder(user: User): Promise<User> {
    try {
      const connection = await db.connect()
      const sql = `INSERT INTO users (email , user_name , first_name , last_name , password) values ($1 , $2 , $3 , $4 , $5) returning *`

      const result = await connection.query(sql, [
        user.email,
        user.user_name,
        user.first_name,
        user.last_name,
        user.password
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
      const result = await connection.query(`SELECT password FROM users WHERE email=$1`, [email])
      if (result.rows.length) {
        const datapassword = result.rows[0].password
        if (datapassword === password) {
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
}

export default OrderModel
