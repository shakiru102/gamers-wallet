import express, { Request, Response } from 'express'
import env from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import Moralis from 'moralis'
import Evm from './routes/evm'
import MarketData from './routes/marketdata'

env.config()

const app = express()
const port = process.env.PORT || 8080

// mongoose.connect(process.env.MONGODB_URI as string)
// .then(() => )
// .catch(err => console.log(err))
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
app.use('/api/v1/market-data', MarketData)

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Gamers wallet')
})
app.listen(port, () => console.log('server listening on port ' + port))