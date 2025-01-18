import {verifyToken} from "../lib/paseto.js"

export const auth = async (req, res, next) => {
    const token = req.cookies['authToken']
    if (token){
        try{
            const payload = await verifyToken(token)

            if (payload.exp < Date.now()) {
                res.clearCookie('authToken')
                return res.redirect('/login')
            }
            req.user = payload.sub
            res.locals.isAuthenticated = true
            next()
        }
        catch (err){
            res.clearCookie('authToken')
            return res.redirect('/login')
        }

    }else {
        next()
    }
}

export const isAuthenticated = (req, res, next) => {
    if (!req.user){
        return res.redirect('/login')
    }
    next()
}