import express from 'express'
const app = express()
import handlebars from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import db from './config/db.js'
import homeController from './controllers/homeContoller.js'
import userController from './controllers/userController.js'
import cookieParser from 'cookie-parser'
import { auth } from './middleware/authMiddleware.js'
import session from "express-session"
import { sessionSecret } from "./lib/secret.js/"

db.query('SELECT 1', (err, results) => {
    if (err) throw err
    console.log('Database connected!')
})

app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    })
    next()
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(session({
    secret: sessionSecret.secret,
    resave: false,
    saveUninitialized: true,
}))

app.use(cookieParser())
app.use(auth)
app.use('/static', express.static('static'))
app.use(express.static('app'))
app.use(express.urlencoded({extended: false}))

app.engine('hbs', handlebars.engine({extname: 'hbs',}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.use('/', homeController)
app.use('/', userController)

app.listen(3000, () => console.log('Server is running!'))

