const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

// Database Configuration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4b6iz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('the_traveler');
        const servicesCollection = database.collection('services');
        const cartCollection = database.collection('cart');


        // GET API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // POST API
        app.post('/services', async (req, res) =>{
            const newService = req.body;
            const cursor = await servicesCollection.insertOne(newService);
            res.send(cursor) ;
        })

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

        // GET Single Data API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // Load Cart Data According To User ID
        app.get('/cart/:uid', async (req, res) => {
            const uid = req.params.uid;
            const query = {uid: uid}
            const result = await cartCollection.find(query).toArray();
            res.json(result);
        });

        // GET Cart Data
        app.get('/cart', async (req, res) => {
            const cursor = cartCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        // Add Data to cart collection
        app.post('/cart/add', async (req, res) => {
            const service = req.body;
            const result = await cartCollection.insertOne(service);
            res.json(result);
        })

        // DELETE From cart
        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.json(result);
        })





    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server from node server');
});

app.listen(port, () => {
    console.log('listing form port ', port);
});