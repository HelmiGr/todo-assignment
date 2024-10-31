import { pool } from '../helpers/db.js'
import { Router } from "express"
import { hash,compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
const { sign } = jwt

const router = Router()

router.post('/register',(req,res,next) => {
    hash(req.body.password,10,(error,hashedPassword) => {
        if (error) next(error) // Hash error.
        try {
            pool.query('insert into account (email,password) values ($1,$2) returning *',
                [req.body.email,hashedPassword],
                (error,result) => {
                    if (error) return next(error) // Database error.
                    return res.status(201).json({id: result.rows[0].id,email: result.rows[0].email})
                }
            )
        } catch (error) {
            return next(error)
        }
    })
})

export { router as userRouter };