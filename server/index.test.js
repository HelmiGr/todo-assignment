import { expect } from "chai"
const base_url = 'http://localhost:3001/'; // added on my own, might need to delete later?

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
    it ('should post a task',async() => {
        const response = await fetch(base_url + 'create',{
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

    // this doesn't work and gives an error of fetch failed
    it ('should not post a task without description',async () => {
        const response = await fetch(base_url + 'create',{ // teacher had /create in these, changed it
            method: 'post',                                // because it returned HTML with the / and not JSON
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'description':null})
        })  
        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
}) 

describe('DELETE task',() => {
    it ('should delete a task',async() => {
        const response = await fetch(base_url + 'delete/1', { 
            method: 'delete'
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    // this doesn't work and gives an error of fetch failed
    it ('should not delete a task with SQL injection',async() => {
        const response = await fetch(base_url + 'delete/id=0 or id > 0', {
            method: 'delete'
        })

        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
}) 

// gives error: relation "account" doesn't exist, maybe due to postgre?
describe('POST register', () => {
    const email = 'register@foo.com'
    const password = 'register123'
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