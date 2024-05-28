import { useState } from 'react'
import {useNavigate} from 'react-router'
import of from '../assets/OficinistaFondoMorado.jpg'
import logo from '../assets/LogoBoliRegla.png'
import axios from "axios"
import '../styles/LoginPage.css'

export default function LoginPage() {
  const [count, setCount] = useState(0)
  const [emailValid, setEmailValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)

  const URL = "http://127.0.0.1:8000"
  const URL_EXTENSION = "/token"

  const navigate = useNavigate() 
  
  //json structure need for query
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  })

  //login verification function
  const login = async(event) => {
    event.preventDefault(); //prevent page to reload
    
    //check for not empty
    if(loginForm.username == ""){ 
        setEmailValid(false)
        if(loginForm.password == "")
            setPasswordValid(false)
        return;
    }

    if(loginForm.password == ""){
        setPasswordValid(false)
        return;
    }
    
    //close error message
    setEmailValid(true)
    setPasswordValid(true)

    //API call
    await axios
    .post(URL+URL_EXTENSION, loginForm, {
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then(response => {
        //save token in local storage
        if (response.data.access_token) {
            localStorage.setItem("auth_token", response.data.access_token)  //token
            localStorage.setItem("auth_token_type", response.data.token_type) //token type
            navigate(`/main_page`)
        }
    })
    .catch((error) => {
        console.log(error, "error");
        switch(error.response.status){
            case 400: //error invalid password
                setPasswordValid(false)
                break;
            
            case 404: //error user not found
                setEmailValid(false)
                break;

            default:
                break;
        }
    });
}


  return (
    <>
      <div className='login-page'>
        <header className='login-header'>
          {/* <div className="top-container"> */}
            {/* <h1>Archivos Sin Caos</h1> */}
          {/* </div> */}
        </header>
        
        <div className="center-container">
          <div className="left-center">
            <div className="image-container">
              <img src={of} className="office-girl" alt="Oficinista" />
            </div>
          </div>
          <div className="right-center">
            <div className="image-container">
              <img src={logo} alt="Logo" className="logo-image" />
            </div>
              
            <div className="login-container">
              <div>
                <form className='loginForm' onSubmit={login}>
                  <input  
                        type="email"
                        onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} //save email info in hook. username is for python understanding
                        className={`formInput ${emailValid ? '': 'invalidInput'}`} //apply styles when error message
                        placeholder='Correo eléctronico'
                        required
                  />
                  <input 
                      type='password'
                      onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}//save email info in hook. username is for python understanding
                      className= {`formInput ${passwordValid ? '': 'invalidInput'}`} //apply styles when error message
                      placeholder='Contraseña'
                  />
                  <a href='#' className='forgot-pass'>¿Olvidaste tu contraseña?</a>
                  <button className="btn" type='submit'>Iniciar Sesión</button>
                  <button className="btn">Registrarse</button>
                </form>
              </div>        
             
            </div>
          </div>
        </div>
        <footer className='login-footer'>
        </footer>
      </div>  
    </> 
  )
}
