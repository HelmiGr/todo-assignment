import { expect } from "chai"
import { initializeTestDb, insertTestUser, getToken } from "./helpers/test.js";
const base_url = 'http://localhost:3001/'; // added on my own, might need to delete later?
import dotenv from 'dotenv';
dotenv.config();

describe('GET Tasks',() => {
    it ('should get all tasks',async() => {
        const response = await fetch('http://localhost:3001/')
        const data = await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.be.an('array').that.is.not.empty
        expect(data[0]).to.include.all.keys('id', 'description')
    })
}) 

/*describe('POST task',() => {
    it ('should post a task',async() => {
        const response = await fetch(base_url + 'create', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'description':'Task from unit test'})
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })
})*/

describe('POST task',() => {

    const email = '44register@foo.com'
    const password = '44register123'

    it ('should post a task',async() => {
        const token = `Bearer ${getToken(email)}`;
        const response = await fetch(base_url + 'create',{
            method: 'post',
            headers: {
                'Content-Type':'application/json',
                'Authorization': token
            },
            body: JSON.stringify({'description':'Task from unit test'})
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    // this doesn't work and gives an error of fetch failed
    it ('should not post a task without description',async () => {
        const token = `Bearer ${getToken(email)}`;
        const response = await fetch(base_url + 'create',{ // teacher had /create in these, changed it
            method: 'post',                                // because it returned HTML with the / and not JSON
            headers: {
                'Content-Type':'application/json',
                'Authorization': token
            },
            body: JSON.stringify({'description':null})
        })  
        const data = await response.json()
        expect(response.status).to.equal(400,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

    it ('should not post a task with zero length description', async () => {
        const token = `Bearer ${getToken(email)}`;
        const response = await fetch(base_url + 'create',{
            method: 'post',
            headers: {
                'Content-Type':'application/json',
                'Authorization': token
            },
            body: JSON.stringify({'description':''})
        })
        const data = await response.json()
        expect(response.status).to.equal(400,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })

}) 

// model and controller for deletion?

describe('DELETE task',() => {

    const email = '44register@foo.com'
    const password = '44register123'
    insertTestUser(email, password);

    it ('should delete a task',async() => {
        const token = `Bearer ${getToken(email)}`;
        const response = await fetch(base_url + 'delete/1', { 
            method: 'delete',
            headers: { 'Authorization': token }
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    // this doesn't work and gives an error of fetch failed
    it ('should not delete a task with SQL injection',async() => {
        const token = `Bearer ${getToken(email)}`;
        const response = await fetch(base_url + 'delete/id=0 or id > 0', {
            method: 'delete',
            headers: { 'Authorization': token }
        })

        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
}) 

// gives error: relation "account" doesn't exist, maybe due to postgre?
describe('POST register', () => {
    const email = '47register@foo.com' // registration with 1 email can only be done once
    const password = '44register123'

    it ('should register with valid email and password',async() => {
        const response = await fetch(base_url + 'user/register',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        })
        const data = await response.json()
        expect(response.status).to.equal(201,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email')
    })
}) 

describe('POST login', () => {
    const email = '44register@foo.com' 
    const password = '44register123'
    insertTestUser(email, password);

    it ('should login with valid credentials',async() => {
        const response = await fetch(base_url + 'user/login',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email,'password':password})
        });
        const data = await response.json()
        expect(response.status).to.equal(200,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email', 'token')
    })
}) 