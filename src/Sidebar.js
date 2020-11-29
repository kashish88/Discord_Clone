import React,{useState,useEffect} from 'react'
import './Sidebar.css'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import AddIcon from '@material-ui/icons/Add'
import SidebarChannel from './SidebarChannel'
import { SignalCellularAlt } from '@material-ui/icons'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'
import CallIcon from '@material-ui/icons/Call'
import {Avatar} from '@material-ui/core'
import MicIcon from '@material-ui/icons/Mic'
import HeadsetIcon from '@material-ui/icons/Headset'
import SettingIcon from '@material-ui/icons/Settings'
import { selectUser } from './features/userSlice'
import {useSelector} from 'react-redux'
import db,{ auth } from './firebase'
import axios from './axios'
import Pusher from 'pusher-js'

const pusher = new Pusher('a6d076178156f7910a9b', {
    cluster: 'ap2'
  });

function Sidebar() {
    const user=useSelector(selectUser);
    const [channels,setChannels]=useState([]);


     const getChannels=()=>{
         axios.get('/get/channelList')
         .then((res)=>{
             console.log(res.data)
             setChannels(res.data)
         })
     }



    useEffect(()=>{
        getChannels()
          const channel = pusher.subscribe('channels');
          channel.bind('newChannel', function(data) {
            getChannels()
          });
    },[])

    const handleAddChannel = (e) => {
        e.preventDefault()

        const channelName = prompt('Enter a new channel name')

        if (channelName) {
           axios.post('/new/channel',{
               channelName:channelName
           })
        }
    }

    return (
        <div className="sidebar">
            <div className="sidebar__top">
                <h3>CodinGyaan</h3>
                <ExpandMoreIcon />
            </div>
            <div className="sidebar__channels">
               <div className="sidebar__channelsHeader">
                  <div className="sidebar__header">
                  <ExpandMoreIcon />
                  <h4>Text Channels</h4>
                  </div>
                  <AddIcon onClick={handleAddChannel}   className="sidebar__addChannel" />
               </div>
               <div className="sidebar__channelsList">
               {
                   channels.map(channel=>(
                    <SidebarChannel key={channel.id} id={channel.id} channelName={channel.name} />
                   ))
                
               }
               
              
               </div>
            </div>
           <div className="sidebar__voice">
               <SignalCellularAlt 
                  className="sidebar__voiceicon"
                  fontSize="large"
               />
               <div className="sidebar__voiceInfo">
                  <h3>Voice Connected</h3>
                  <p>Stream</p>
               </div>

               <div className="sidebar__voiceIcons">
                   <InfoOutlinedIcon />
                   <CallIcon />
               </div>
               <div className="sidebar__profile">
                  <Avatar src={user.photo} onClick={()=>auth.signOut()} />
                  <div className="sidebar__profileInfo">
                     <h3>{user.displayName}</h3>
                     <p>{user.uid.substring(0,5)}</p>
                  </div>

                  <div className="sidebar__profileIcons">
                      <MicIcon />
                      <HeadsetIcon />
                      <SettingIcon />
                  </div>
               </div>
           </div>
        </div>
    )
}

export default Sidebar
