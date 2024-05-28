import { fetchToken } from "../Auth";
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MainPage(){
    const location = useLocation();
    const token = fetchToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            // Si no hay token, redirige a la página de inicio de sesión
            navigate("/")
        }
    }, []);

    return (<>
        <div>
            Hello world!
        </div>
    </>)
}