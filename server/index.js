import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { todoRouter } from './routers/todoRouter.js' // added {} since we wanted a named export, and this would not work with default exporting
import { userRouter } from './routers/userRouter.js' 
import { deleteTask, getTasks, postTask } from './controllers/TaskController.js';

dotenv.config() // change

const port = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.get('/', getTasks)
app.post('/create', postTask)
app.delete('/delete/:id', deleteTask)
app.use('/user',userRouter)


app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({error: err.message})
})

app.listen(port)