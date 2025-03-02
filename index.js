const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// chill-gamer
// 6OcQ8qx1Vz4iFpqU



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rsvt6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const doc = {
    title: "Record of a Shriveled Datum",
    content: "No bytes, no problem. Just insert a document, in MongoDB",
}

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const popularGameCollection = client.db("gameDB").collection("games");

        const games = [
            {
                "photoUrl": "https://i.ibb.co.com/4nGQqPBS/elden-ring.jpg",
                "title": "Elden Ring",
                "description": "An open-world action RPG by FromSoftware, combining intricate combat and a vast, mystical world. Players explore landscapes, battle fierce foes, and unravel complex lore, offering a unique and challenging experience for fans of fantasy and action.",
                "activeUsers": 5000000,
                "madeInCountry": "Japan",
                "madeInYear": 2022,
                "rating": 9.8
            },
            {
                "photoUrl": "https://i.ibb.co.com/3DThrwM/The-Legend-of-Zelda.jpg",
                "title": "The Legend of Zelda: Breath of the Wild",
                "description": "A groundbreaking open-world adventure from Nintendo, offering players unparalleled freedom to explore, solve puzzles, and defeat enemies. With stunning visuals and innovative gameplay mechanics, it redefines what it means to immerse yourself in a vast, interactive world.",
                "activeUsers": 8000000,
                "madeInCountry": "Japan",
                "madeInYear": 2017,
                "rating": 9.7
            },
            {
                "photoUrl": "https://i.ibb.co.com/v6Ckv1Rt/Red-Dead-Redemption.jpg",
                "title": "Red Dead Redemption 2",
                "description": "A Western action-adventure game from Rockstar, set in a detailed open world. Players take on the role of Arthur Morgan, navigating the final days of the Wild West while facing moral choices, epic gunfights, and a gripping story of survival and loyalty.",
                "activeUsers": 6000000,
                "madeInCountry": "USA",
                "madeInYear": 2018,
                "rating": 9.6
            },
            {
                "photoUrl": "https://i.ibb.co.com/Zps07N86/God-Of-War.jpg",
                "title": "God of War (2018)",
                "description": "A story-driven action game, following Kratos as he navigates Norse mythology with his son, Atreus. Combining intense combat with a deep emotional narrative, the game explores father-son relationships while facing gods, monsters, and other mythological beings.",
                "activeUsers": 5500000,
                "madeInCountry": "USA",
                "madeInYear": 2018,
                "rating": 9.5
            },
            {
                "photoUrl": "https://i.ibb.co.com/rGRNFqV1/The-Witcher.png",
                "title": "The Witcher 3: Wild Hunt",
                "description": "An expansive RPG that follows Geralt of Rivia, a monster hunter, as he embarks on a quest to find his adopted daughter. Featuring a vast world, compelling storylines, and dynamic combat, it offers deep immersion and decision-making that impacts the world.",
                "activeUsers": 7000000,
                "madeInCountry": "Poland",
                "madeInYear": 2015,
                "rating": 9.4
            },
            {
                "photoUrl": "https://i.ibb.co.com/zTKv1ZpR/gta-5.jpg",
                "title": "Grand Theft Auto V",
                "description": "A crime-filled open-world game by Rockstar that follows three protagonists in their criminal endeavors. The game features action-packed missions, exploration, and a dynamic multiplayer experience, all set in the fictional world of Los Santos, inspired by Los Angeles.",
                "activeUsers": 10000000,
                "madeInCountry": "USA",
                "madeInYear": 2013,
                "rating": 9.3
            }
        ]

        const options = { ordered: true };

        const result = await popularGameCollection.insertMany(games, options);

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