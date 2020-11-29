import React from 'react'
import './Login.css'
import {auth,provider} from './firebase'
import {Button} from '@material-ui/core'

function Login() {
    const signIn=()=>{
            auth.signInWithPopup(provider)
            .catch(error=> alert(error.message))
    }
    return (
        <div className='login'>
             
             <div className="login__logo">
                <img src="https://www.pngkit.com/png/detail/17-179788_discord-logo-01-discord-logo-png.png" alt="" />
             </div>
             <Button onClick={signIn}>Sign In</Button>
        </div>
    )
}

export default Login
