import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

jest.mock('../nats-wrapper')

let mongo: any
process.env.STRIPE_KEY =
  'sk_test_51LZ3DSJyhrJKMp6H4Ik2geXUrr4A5lUBgAuPnKAq6MmDAaiZPsgwTU5I9UYJEaCqqCYhMh4m4fWlJegNoecyRaZX00ecvrcmUc'

beforeAll(async () => {
  process.env.JWT_KEY = 'test'
  process.env.NODE_ENV = 'test'

  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri, {})
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()

  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.connection.close()

  if (mongo) {
    await mongo.stop()
  }
})

declare global {
  var login: (id?: string) => string[]
}

global.login = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  }

  const token = jwt.sign(payload, process.env.JWT_KEY!)

  const session = { jwt: token }

  const sessionJson = JSON.stringify(session)

  const base64 = Buffer.from(sessionJson).toString('base64')

  return [`session=${base64}`]
}
