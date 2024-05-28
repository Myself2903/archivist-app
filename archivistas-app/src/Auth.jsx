import {useLocation, Navigate} from 'react-router-dom'

export const fetchToken = () =>{
    const token = localStorage.getItem('auth_token'); // get token from localStorage

    if (!token) {
      return null; // No token storaged
    }
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(decodedToken.exp * 1000); // Convert from  UNIX expiration timestamp to date
  
      if (expirationDate < new Date()) {
        // token expired
        localStorage.removeItem('auth_token');
        return null;
      }
  
      return token; // valid token
    } catch (error) {
      // Remove if exception
      localStorage.removeItem('auth_token');
      return null;
    }
}

export function RequireToken({children}){
    let auth = fetchToken() //get current token
    let location = useLocation() 

    if(!auth){
        return <Navigate to = '/' state = {{from: location}} /> // if not logged redirect to root,
    }                        
    
    return children
}