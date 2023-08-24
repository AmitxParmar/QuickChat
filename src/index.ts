import dotenv from 'dotenv-safe'
import express from 'express'
import http from 'http'
import bodyparser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose from 'mongoose'

// Load environment variables
dotenv.config({ path: '.env' })

// Define env var interface
interface EnvironmentVariables {
  MONGO_KEY: string
  // other environment variables as needed
}

const env = process.env as unknown as EnvironmentVariables
const MONGO_URL: string = env.MONGO_KEY

const app = express()

app.use(
  cors({
    credentials: true,
  }),
)

app.use(compression())
app.use(cookieParser())
app.use(bodyparser.json())

const server = http.createServer(app)

server.listen(8000, () => {
  console.log('Server running: 8080 Port')
})

mongooseConnection().catch((e) => {
  console.log(e)
})

async function mongooseConnection(): Promise<void> {
  if (MONGO_URL === '') {
    throw new Error('MONGO_KEY is not defined in the environment')
  }

  mongoose
    .connect(MONGO_URL)
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error)
    })

  const kittySchema = new mongoose.Schema({
    name: String,
  })

  console.log(kittySchema)
}
