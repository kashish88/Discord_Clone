import { useDispatch,useSelector} from 'react-redux'
import React,{useEffect} from 'react'
import './App3.css'
import Sidebar from './Sidebar'
import Chat from './Chat'
import {selectUser} from './features/userSlice'
import Login from './Login'
import { auth } from './firebase'
import {login,logout} from './features/userSlice'


function App3() {
    const user=useSelector(selectUser)
    const dispatch= useDispatch()

    useEffect(() => {
      auth.onAuthStateChanged((authUser)=>{
         console.log("user is",authUser)
        if(authUser)
          {
               dispatch(login({
                 uid:authUser.uid,
                 photo:authUser.photoURL,
                 email:authUser.email,
                 displayName:authUser.displayName
               }))
          }else{
             dispatch(logout())
          }
      })
    }, [dispatch])



  return (
  
    <div className="app">
    
    {user ?(
      <>
      <Sidebar />
      <Chat />
      </>
    ):(
     <Login />
    )}
   
    </div>
    
   
  )
}

export default App3
