const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const mongoData=require('./mongoData.js')
const Pusher =require('pusher')



const app=express();
const port=process.env.PORT||8002

const pusher = new Pusher({
    appId: "1102706",
    key: "a6d076178156f7910a9b",
    secret: "0f72f09d806e3dc3b02e",
    cluster: "ap2",
    useTLS: true
  });

app.use (express.json())
app.use(cors())

const mongoURI='mongodb+srv://admin:bkashish784@cluster0.gnz4v.mongodb.net/discordDB?retryWrites=true&w=majority'


mongoose.connect(mongoURI,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

mongoose.connection.once('open',()=>{
    console.log('DB Connected')

    const changeStream=mongoose.connection.collection('conversations').watch()

    changeStream.on('change',(change)=>{
        if(change.operationType=='insert'){
            pusher.trigger("channels", "newChannel", {
                'change': change
              });
        }
        else if(change.operationType=='update'){
            pusher.trigger("conversation", "newMessage", {
                'change': change
              });
        }else{
            console.log('Event triggering Pusher')
        }
    })

})

app.get('/',(req,res)=>res.status(200).send('Hello World'))

app.post('/new/channel',(req,res)=>{
    const dbData=req.body
    mongoData.create(dbData,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }

    })
})

app.get('/get/channelList',(req,res)=>{
    mongoData.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            let channels=[]
            data.map((channelData)=>{
                const channelInfo={
                    id:channelData._id,
                    name:channelData.channelName
                }
                channels.push(channelInfo)
            })
            res.status(200).send(channels)
        }
    })
})

app.post('/new/message',(req,res)=>{
    
    const newMessage=req.body

    mongoData.update(
        {_id:req.query.id},
        {$push:{conversation :req.body}},
        (err,data)=>{
            if(err){
                console.log('Error saving message...')
                console.log(err)

                res.status(500).send(err)
            }else
            {
                res.status(201).send(data)
            }
        }
    )
})

app.get('/get/data',(req,res)=>{
    mongoData.find((err,data)=>{
        if(err){
            res.status(500).send(err)
        } else{
            res.status(200).send(data)
        }
    })
})

app.get('/get/conversation',(req,res)=>{
   const id=req.query.id
   
    mongoData.find({_id:id},(err,data)=>{
        if(err){
            res.status(500).send(err)
        } else{
            res.status(200).send(data)
        }
    })
})



app.listen(port,()=>console.log(`listening on localhost:${port}`))