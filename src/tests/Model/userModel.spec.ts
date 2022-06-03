import { users, userModel } from '../../models/userModel'
import db from '../../database'

const User = new userModel()
const testUser: users = {
  firstname: 'fname',
  lastname: 'lname',
  username: 'uname',
  password: 'psword'
}

describe('Test User Model', () => {
  beforeAll(async () => {
    const newUser = await User.create(testUser)
    testUser.id = newUser.id
  })
  afterAll(async () => {
    const dbCon = await db.connect()
    await dbCon.query('truncate table users cascade;')
    await dbCon.query('alter sequence users_id_seq RESTART WITH 1')
    await dbCon.release()
  })
  //test create method
  it('Should have create user method', async () => {
    expect(User.create).toBeDefined()
  })
  it('Test Create with a user', async () => {
    const createUser: users = {
      firstname: 'userFirstName',
      lastname: 'userLastName',
      username: 'userName',
      password: 'psword'
    }
    const user = await User.create(createUser)
    expect(user.firstname).toBe(createUser.firstname)
    expect(user.lastname).toBe(createUser.lastname)
    expect(user.username).toBe(createUser.username)
  })
  //test index method
  it('Should have index method', async () => {
    expect(User.index).toBeDefined()
  })
  it('test index with a user', async () => {
    const users = await User.index()
    expect(users.length).toBe(2)
  })
  //test show method
  it('Should have show user method', async () => {
    expect(User.show).toBeDefined()
  })
  it('test show with a user', async () => {
    const user = await User.show(testUser.username)
    expect(user.firstname).toBe(testUser.firstname)
    expect(user.lastname).toBe(testUser.lastname)
    expect(user.username).toBe(testUser.username)
  })

  //test authentication method
  it('Should have authenticate method', async () => {
    expect(User.authenticate).toBeDefined()
  })
  it('Test authenticate method with worng credentials', async () => {
    const user = await User.authenticate('1', '2')
    expect(user).toBe(null)
  })

  it('Test authenticate method with correct credentials', async () => {
    const authenticatedUser: users = {
      firstname: 'userFName',
      lastname: 'userLName',
      username: 'userUName',
      password: 'psword'
    }
    const newUser = await User.create(authenticatedUser)
    authenticatedUser.id = newUser.id
    const user = await User.authenticate(authenticatedUser.username, authenticatedUser.password)
    expect(user?.firstname).toBe(authenticatedUser.firstname)
    expect(user?.lastname).toBe(authenticatedUser.lastname)
    expect(user?.username).toBe(authenticatedUser.username)
  })
})
