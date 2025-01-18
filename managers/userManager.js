import bcrypt from 'bcrypt'
import db from '../config/db.js'
import {generateToken} from "../lib/paseto.js"


export const createUser = async (userData) => {
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const query = 'INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)'
        const values = [
            userData.email,
            userData.first_name,
            userData.last_name,
            hashedPassword
        ]

        return new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(result.insertId)
            })
        })

    } catch (error) {
        throw error
    }
}

export const login = async (userData) => {
    const [user] = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE email = ?', [userData.email], (err, results) => {
            if (err) {
                reject(err)
                return
            }
            resolve(results)
        })
    })

    let isValid = await bcrypt.compare(userData.password, user.password)
    if (!isValid){
        throw new Error('No such user')
    }

    return await generateToken({
        sub: String(user.id),
        exp: Date.now() + 3600000
    })
}

export const getUser = async (userId) => {
    const [user] = await new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
            if (err){
                reject(err)
                return
            }
            resolve(results)
        })
    })

    return user
}

export const updateUser = async (id, data) => {
    try {
        data.password && (data.password = await bcrypt.hash(data.password, 10))

        const setStatements = Object.keys(data).map(key => `${key} = ?`)
        const query = `UPDATE users SET ${setStatements.join(', ')} WHERE id = ?`

        const values = [...Object.values(data), id]

        return new Promise((resolve, reject) => {
            db.query(query, values, (err, result) => {
                if (err) {
                    reject(err)
                    return
                }
                resolve(result)
            })
        })

    } catch (error) {
        console.error('Error updating user:', error);
        throw error
    }
}