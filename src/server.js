import express from 'express'
import authorsRouter from './blog/authors.js'
import blogPostsRouter from './blog/posts.js'
import filesRouter from './files/index.js'
import { join } from 'path'
import cors from 'cors'
import { genericError, NotFoundError } from './errors.js'
import createHttpError from 'http-errors'

const server = express()
const port = process.env.PORT
const publicFolder = join(process.cwd(), './public')

const logger = (request, response, next) => {
  console.log(`Request Method ${request.method}`)
  next()
}

const whitelist = ['localhost:3001', 'https://strive-blog-fe-liart.vercel.app']

server.get('/', (request, response) => {
  response.send('Successful connection')
})

//Middleware
server.use(express.static(publicFolder))

server.use(
  cors({
    origin: (origin, corsNext) => {
      console.log('Origin: ', origin)
      if (!origin || whitelist.indexOf(origin) !== -1) {
        corsNext(null, true)
      } else {
        corsNext(createHttpError(400, `Cors Errors!`))
      }
    },
  }),
)

server.use(express.json())

//Endpoints

server.use('/authors', authorsRouter)
server.use('/posts', blogPostsRouter)
server.use('/files', filesRouter)

//Error handlers

server.use(NotFoundError)
server.use(genericError)

server.listen(port, () => {
  console.log('The server is running on port', port)
})
