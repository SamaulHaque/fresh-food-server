const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middle wires
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pavt7kq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('freshFood').collection('services');
        const reviewCollection = client.db('freshFood').collection('reviews')
        
        //limited services api
        app.get('/services', async(req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        //all services api
        app.get('/my-all-services', async(req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service)
        });

        //add services post api
        app.post('/add-services', async(req, res) => {
            const service = req.body;
            const result = serviceCollection.insertOne(service);
            res.send(result);
        });

        //reviews api for load all reviews
        app.get('/reviews', async(req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query).sort({rating : -1});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        //reviews api for load specific email reviews
        app.get('/my-reviews', async(req, res) => {
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query).sort({rating : -1});
            const myReviews = await cursor.toArray();
            res.send(myReviews);
        })

        //specific reviews api for load specific email reviews
        app.get('/my-reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const review = await reviewCollection.findOne(query);
            res.send(review)
        })
         

        //review api for insert data in mongodb
        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        //my review update api
        app.put('my-reviews/:id' , async(req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const review = req.body;
            const option = {upsert: true}
            const updateReview = {
                $set : {
                    name: review.name,
                    image: review.image,
                    message: review.message
                }
            }
            const result = await reviewCollection.updateOne(filter, updateReview, option);
            res.send(result);
        })

        //my review delete api
        app.delete('/my-reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(error => console.error(error))


app.get('/', (req, res) => {
    res.send('food server is running')
})

app.listen(port, () => {
    console.log(`food server running on port: ${port}`)
})