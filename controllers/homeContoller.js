import { isAuthenticated } from "../middleware/authMiddleware.js"
import express from 'express'
const router = express.Router()

router.get('/', isAuthenticated, (req, res) => {
    res.render('home')
})

export default router