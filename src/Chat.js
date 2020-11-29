import React,{useEffect,useState} from 'react'
import './Chat.css'
import ChatHeader from './ChatHeader'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard'
import GifIcon from '@material-ui/icons/Gif'
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions'
import Message from './Message'
import { selectChannelId, selectChannelName } from './features/appSlice'
import {useSelector} from 'react-redux'
import axios from './axios'
import { selectUser } from './features/userSlice'
import Pusher from 'pusher-js'


const  pusher = new Pusher('a6d076178156f7910a9b', {
    cluster: 'ap2'
  });
function Chat() {
    const user=useSelector(selectUser)
    const channelName=useSelector(selectChannelName)
    const channelId=useSelector(selectChannelId)
    const [messages,setMessages]=useState([])
    const[input,setInput]=useState('')

    const getConversation=(channelId)=>{
        if(channelId){
            axios.get(`/get/conversation?id=${channelId}`).then((res)=>{
                setMessages(res.data[0].conversation)
            })
        }
    }
    useEffect(()=>{
        getConversation(channelId)

        const channel = pusher.subscribe('conversation');
        channel.bind('newMessage', function(data) {
          getConversation(channelId)
        });
    },[channelId])


    const sendMessage=(e)=>{
        e.preventDefault()

        axios.post(`/new/message?id=${channelId}`,{
            message:input,
            timestamp:Date.now(),
            user:user
        })
        setInput('')
    }


    return (
        <div className="chat">
           <ChatHeader channelName={channelName}/>
           <div className="chat__messages">
           {messages.map((message) => {
            console.log(message)
        })}
        {messages.map(message => (
            <Message message={message.message} timestamp={message.timestamp} user={message.user} />
        ))}
             
           </div>
           <div className='chat__input'>
            <AddCircleIcon  fontSize='large' />
            <form>
               <input disabled={!channelId} type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Message #${channelName}`} />
               <button onClick={sendMessage} disabled={!channelId} className='chat__inputButton' type="submit"></button>
            </form>
            <div className='chat__inputIcons'>
                <CardGiftcardIcon fontSize='large' />
                <GifIcon fontSize='large'/>
                <EmojiEmotionsIcon fontSize='large' />
            </div>
           </div>
        </div>
    )
}

export default Chat
