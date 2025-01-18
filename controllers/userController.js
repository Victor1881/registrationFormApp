import { createUser, login, getUser, updateUser } from '../managers/userManager.js'
import { validateUserData } from '../lib/validations.js'
import { isAuthenticated } from '../middleware/authMiddleware.js'
import express from 'express'
import {generateCaptcha} from "../lib/captcha.js"
const router = express.Router()

router.get('/register', (req, res) => {
    const captcha = generateCaptcha()
    req.session.captcha = captcha
    res.render('register', {captcha})
})

router.post('/register', async (req, res) => {
    const userData = req.body

    try{
        const error = validateUserData(userData)

        if(error){
            const newCaptcha = generateCaptcha()
            req.session.captcha = newCaptcha
            return res.render('register', {
                error,
                captcha: newCaptcha
            })
        }

        if (userData.password !== userData.repass){
            const newCaptcha = generateCaptcha()
            req.session.captcha = newCaptcha

            return res.render('register', {
                error: 'Password mismatch',
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                captcha: newCaptcha,
            })
        }

        if (!req.session.captcha || userData.captcha !== req.session.captcha) {
            const newCaptcha = generateCaptcha()
            req.session.captcha = newCaptcha

            return res.render('register', {
                error: 'Invalid captcha code',
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
                captcha: newCaptcha
            })
        }

        await createUser(userData)
        res.redirect('/')

    }catch (error) {
        const newCaptcha = generateCaptcha()
        req.session.captcha = newCaptcha
        res.render('register', {
            error: error.code === 'ER_DUP_ENTRY' ? 'An account with this email already exists'
                : 'Something went wrong while creating your profile',
            captcha: newCaptcha,
        })
    }
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res) => {
    const userData = req.body
    try{
        let token = await login(userData)
        res.cookie('authToken', token, {
            httpOnly: true, sameSite: 'lax'
        })
        res.redirect('/')

    }catch (error) {
        console.error(error)
        res.render('login', {
            error: 'Wrong credentials'
        })
    }
})

router.get('/logout', (req, res) => {
    res.clearCookie('authToken')
    res.redirect('/')
})

router.get('/edit', isAuthenticated, async (req, res) => {
    const userId = req.user
    const user = await getUser(userId)
    res.render('edit', {user})
})

router.post('/edit', isAuthenticated, async (req, res) => {
    const userId = req.user
    const userData = req.body
    const user = await getUser(userId)

    try{
        userData.password?.trim() === '' && delete userData.password

        if(userData.first_name === user.first_name && userData.last_name === user.last_name && !userData.password){
            return res.render('edit', {
                error: 'No changes were made',
                user
            })
        }

        let error = validateUserData(userData)

        if(error){
            return res.render('edit', {
                error,
                user: {
                    first_name: userData.first_name || user.first_name,
                    last_name: userData.last_name || user.last_name
                }
            })
        }

        await updateUser(userId, userData)

        res.redirect('/')
    }catch (error) {
        console.error(error)
        res.render('edit', {
            error: 'Something went wrong while updating your profile',
            user: user
        })
    }
})

export default router