import { fetchToken } from "../Auth";
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/LogoBoliRegla.png'
import menu_icon from '../assets/menu-svgrepo-com.svg'
import axios from "axios"
import "../styles/MainPage.css"

export default function MainPage(){
    const location = useLocation();
    const token = fetchToken();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([])
    const [showSearchIcon, setShowSearchIcon] = useState(true);
    const URL = "http://127.0.0.1:8000"
    const URL_EXTENSION = "/profile/projects"

    const instance = axios.create({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });    

    useEffect(() => {
        if (!token) {
            // if no token redirect to root
            navigate("/")
        }

        async function fetch_project_data(){
            await instance.get(URL+URL_EXTENSION)
            .then(response => {
                setProjects(response.data)
                console.log(response.data)
            })
        }
        fetch_project_data()
    }, []);

    const handle_search_bar_change = (e) => {
        // setQuery(inputValue);
        if (e != "")
            setShowSearchIcon(false);
        else
            setShowSearchIcon(true)
    };

    // const projects = [
    //     {
    //         id: 1,
    //         name: "Proyecto A",
    //         last_edition: "2024-05-28",
    //         owner: "Usuario 1"
    //     },
    //     {
    //         id: 2,
    //         name: "Proyecto B",
    //         last_edition: "2024-05-27",
    //         owner: "Usuario 2"
    //     },
    //     {
    //         id: 3,
    //         name: "Proyecto C",
    //         last_edition: "2024-05-26",
    //         owner: "Usuario 3"
    //     }
    // ];

    return (<>
        <div className="main-page">
            <header className="app-header">
                <div className="header-left-container">
                    <img src={logo} alt="Logo" className="logo-image-header" />
                </div>

                <div className="header-right-container">
                    <img src={menu_icon} alt="menu" className="menu-image-header" />
                </div>
            </header>
            
            <div className="main-page-content">
                <div className="search-bar">
                    <form>
                        {showSearchIcon && <i className="fa fa-search" aria-hidden="true" />}
                        <input 
                            onChange= {e => handle_search_bar_change(e.target.value)}
                            placeholder="Buscar"
                            type="search"
                            className="search-bar-input"
                        />
                        <button className="new-project-button">Nuevo Proyecto</button>
                    </form>
                    
                </div>

                <div className="project-section">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre del Proyecto</th>
                                <th>Ultima Edición</th>
                                <th>Propietario</th>
                                <th></th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {projects.map(project =>
                                <tr key={project.id}>
                                    <td><a>{project.name}</a></td>
                                    <td>{project.last_edition_date}</td>
                                    <td>{project.owner}</td>
                                    <td><i className="fa fa-ellipsis-v" aria-hidden="true" /></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>)
}