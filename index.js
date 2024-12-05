require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

app.get('/',(req,res)=>{
  res.send('Hello')
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3oeok.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const allVisaCollection = client.db('userCollection').collection('visaApplication');
    app.get('/visaApplication/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await allVisaCollection.findOne(query);
      res.send(result)
    })
    app.get('/visaApplication',async(req,res)=>{
        const cursor = allVisaCollection.find()
        const result = await cursor.toArray();
        res.send(result)
    })
    app.get('/newVisas',async(req,res)=>{
    const cursor = allVisaCollection.find().sort({ _id: -1 }).limit(8);
      const result = await cursor.toArray();
      res.send(result)
    })
    app.post('/visaApplication',async(req,res)=>{
      const newVisa = req.body;
      const result = await allVisaCollection.insertOne(newVisa);
      res.send(result);
    })
  
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);













app.listen(port,()=>{
  console.log(`My port is : ${port}`)
})