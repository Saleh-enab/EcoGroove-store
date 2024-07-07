import dotenv from 'dotenv'
dotenv.config();

const port = Number(process.env.PORT || 3000)
const dbURI = process.env.mongoURI

export { port, dbURI }