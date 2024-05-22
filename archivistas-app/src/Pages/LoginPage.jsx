import { useState } from 'react'
import of from '../assets/OficinistaFondoMorado.jpg'
import logo from '../assets/LogoBoliRegla.png'
import '../styles/LoginPage.css'

export default function LoginPage() {
  const [count, setCount] = useState(0)
  const [emailValid, setEmailValid] = useState(true)
  const [passwordValid, setPasswordValid] = useState(true)

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
                <form className='loginForm'>
                  <input  
                        type="email"
                        // onChange={(e) => setLoginForm({...loginForm, username: e.target.value})} //save email info in hook. username is for python understanding
                        className={`formInput ${emailValid ? '': 'invalidInput'}`} //apply styles when error message
                        placeholder='Correo eléctronico'
                        required
                  />
                  <input 
                      type='password'
                      // onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}//save email info in hook. username is for python understanding
                      className= {`formInput ${passwordValid ? '': 'invalidInput'}`} //apply styles when error message
                      placeholder='Contraseña'
                  />
                  <a href='#' className='forgot-pass'>¿Olvidaste tu contraseña?</a>
                </form>
              </div>        
              <button className="btn" type='submit'>Iniciar Sesión</button>
              <button className="btn">Registrarse</button>
            </div>
          </div>
        </div>
        <footer className='login-footer'>
          {/* <div className="bottom-container"> */}
            {/* Aquí va el contenido del contenedor inferior */}
          {/* </div> */}
        </footer>
      </div>  
    </> 
  )
}
