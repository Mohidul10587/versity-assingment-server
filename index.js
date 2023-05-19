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

// All routes are describing here

    try {
        await client.connect()
        console.log('connected')
        const usersCollection = client.db('thesis').collection('users');
        const reviewCollection = client.db('thesis').collection('reviews');
        // create a user 
        app.post('/createUser', async (req, res) => {
            const user = req.body;
            const result = usersCollection.insertOne(user);
            res.send(result)
        })
        // get all user
        app.get('/allUsers', async (req, res) => {
            const cursor = usersCollection.find({})
            const result = await cursor.toArray();
            res.send(result)
        })
        // check a user admin or not
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email
            const user = await usersCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin'
            res.send({ admin: isAdmin })
        })
        // get the current user
        app.get('/currentUser/:currentUsersEmail', async (req, res) => {
            const email = req.params.currentUsersEmail
            const result = await usersCollection.findOne({ email: email })
            res.send(result)
        })
        // post a review
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = reviewCollection.insertOne(review);
            res.send(result)
        })
        // get all review
        app.get('/review', async (req, res) => {
            const allReview = await reviewCollection.find({}).toArray()
            const reverseAllReview = allReview.reverse()
            const arrayOfEmailOfReviewer = reverseAllReview.map(user => user.email);
            const uniqueArrayOfEmailOfReviewer = Array.from(new Set(arrayOfEmailOfReviewer));
            const newArrOfReview = []
            for (let i = 0; i < uniqueArrayOfEmailOfReviewer.length; i++) {
                const element = uniqueArrayOfEmailOfReviewer[i];
                const foundsReview = reverseAllReview.find(r => r.email == element)
                newArrOfReview.push(foundsReview)
            }
            res.send(newArrOfReview)
        })

    } finally {

    }

}


run().catch(console.dir)


app.get('/', async (req, res) => {
    res.send('This is the testing api')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})








