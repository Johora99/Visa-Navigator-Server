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


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const allVisaCollection = client.db('userCollection').collection('visaApplication');
    const visaUser = client.db('userCollection').collection('visaApplyUser');
    const myVisa = client.db('userCollection').collection('myVisaApplication');
    const myAddedVisa = client.db('userCollection').collection('myAddedVisa')

    app.get('/myAppliedVisa',async(req,res)=>{
    const cursor = myVisa.find()
        const result = await cursor.toArray();
        res.send(result)
    })
    app.get('/myAppliedVisa/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await myVisa.findOne(query);
      res.send(result)
    })


    app.get('/visaUser',async(req,res)=>{
        const cursor = visaUser.find()
        const result = await cursor.toArray();
        res.send(result)
    })


    app.get('/visaApplication/byId/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await allVisaCollection.findOne(query);
      res.send(result)
    })
    
    app.get('/visaApplication/byEmail/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {email : email};
      const result = await allVisaCollection.find(query).toArray();
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
   
     app.post('/myAddedVisa',async(req,res)=>{
      const myAddedNewVisa = req.body;
      const result = await myAddedVisa.insertOne(myAddedNewVisa);
      res.send(result)
     })

    app.post('/myAppliedVisa',async(req,res)=>{
      const myApply = req.body;
      const result = await myVisa.insertOne(myApply);
      res.send(result)
    })


    app.post('/visaApplication',async(req,res)=>{
      const newVisa = req.body;
      console.log(newVisa)
      const result = await allVisaCollection.insertOne(newVisa);
      res.send(result);
    })


    app.post('/visaUser',async(req,res)=>{
      const newUser = req.body;
      const result = await visaUser.insertOne(newUser);
      res.send(result)
    })
    app.put('/visaApplication/byEmail/:email',async(req,res)=>{
        const email = req.params.email;
      const filter = {email : email};
      const options = { upsert: true };
      const visa = req.body;
        const updateVisa = {
        $set : {
               image : visa.image,
               countryName : visa.countryName,
               visaType : visa.visaType,
               processingTime : visa.processingTime,
               description : visa.description,
               age : visa.age,
               fee : visa.fee,
               validity : visa.validity,
               applicationMethod : visa.applicationMethod,
               email : visa.email,
               documents: [
              visa.validPassport,
              visa.visaApplicationForm,
              visa.passportPhoto,
             visa.nidCardPhotocopy,
      ],  
        }
      }
        const result = await allVisaCollection.updateOne(filter,updateVisa,options);
      res.send(result)
    })
  app.delete('/visaApplication/byEmail/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {email : email};
      const result = await allVisaCollection.deleteOne(query);
      res.send(result)
     })


     app.delete('/myAppliedVisa/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await myVisa.deleteOne(query);
      res.send(result)
      console.log(result)
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