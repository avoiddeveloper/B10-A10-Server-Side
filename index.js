const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rsvt6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const popularGameCollection = client.db("gameDB").collection("games");
        const reviewCollection = client.db("reviewDB").collection("reviews");
        const userCollection = client.db("userDB").collection("user");

        // Read
        app.get('/popularGames', async (req, res) => {
            const cursor = popularGameCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // Read Only One Data
        app.get('/popularGames/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const game = await popularGameCollection.findOne(query);
            res.send(game)
        })


        // Review - POST/Create
        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result)
        })

        // Review - Read All
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // Review - Read Only One
        app.get("/review/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const review = await reviewCollection.findOne(query)
            res.send(review)
        })

        // Review - Update Review
        app.patch("/updateReview/:id", async (req, res) => {
            const id = req.params.id;
            const updateDoc = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    thumbnailURL: updateDoc.thumbnailURL,
                    gameTitle: updateDoc.gameTitle,
                    reviewDescription: updateDoc.reviewDescription,
                    publishDate: updateDoc.publishDate,
                    rating: updateDoc.rating,
                    genres: updateDoc.genres
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedUser, options)
            res.send(result)
        })

        // Review - Delete Review
        app.delete("/deleteReview/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await reviewCollection.deleteOne(query)
            res.send(result);
        })

        // User - Create User
        app.post("/user", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        // User - Read All 
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);


app.get('/', (req, res) => {
    res.send('Gamer server is running....')
})

app.listen(port, () => {
    console.log(`Chill Gamer Server Is Running at ${port}`)
})