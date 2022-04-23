// import { Jwt } from 'jsonwebtoken'
// import UserModel from '../models/user.model'
// import * as dotenv from 'dotenv'

// dotenv.config()

// export const authunticate = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body
//     const userData = await UserModel.loginUser(email, password)
//     const token = Jwt.sign({ userData }, process.env.SECRET_TOKEN) as string
//     if (user)
//       return res.json({
//         status: 'success',
//         data: { user: user, token: token }
//       })
//     throw new Error(`Error  , ${email}not found `)
//   } catch (err) {
//     console.log(err)
//   }
// }
