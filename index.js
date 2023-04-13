const express = require('express')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');


require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const uri = 'mongodb+srv://thesis:MQlhlkspL8Z7pDES@cluster0.1xcbzje.mongodb.net/?retryWrites=true&w=majority'

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect()
        console.log('connected')
        const usersCollection = client.db('thesis').collection('users');


        app.post('/createUser', async (req, res) => {
            const user = req.body;
            const result = usersCollection.insertOne(user);
            res.send(result)
        })

        app.get('/allUsers', async (req, res) => {
            const cursor = usersCollection.find({})
            const result = await cursor.toArray();
            res.send(result)
        })


        app.get('/currentUser/:currentUsersEmail', async (req, res) => {
            const email = req.params.currentUsersEmail
            const result = await usersCollection.findOne({email:email})
            res.send(result)
        })


    } finally {

    }

}


run().catch(console.dir)



app.get('/', async (req, res) => {
    res.send('This is first deployment in heroku')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})








