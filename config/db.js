import dotenv from 'dotenv'

dotenv.config()

export default {
  DB_ID: process.env.MONGO_ID,
  DB_PW: process.env.MONGO_PW,
}
