import express, { Request, Response } from 'express'
import env from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import Moralis from 'moralis'
import Evm from './routes/evm'

env.config()

const app = express()
const port = process.env.PORT || 8080

mongoose.connect(process.env.MONGODB_URI as string)
.then(() => app.listen(port, () => console.log('server listening on port ' + port)))
.catch(err => console.log(err))
Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
    // ...and any other configuration
  });
app.use(cors({
    origin: "*"
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/v1', Evm)

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Gamers wallet')
})