import { fetchToken } from "../Auth";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import Footer from "../universal/footer/Footer"


export default function MainPage(){
    const token = fetchToken();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([])
    const [showSearchIcon, setShowSearchIcon] = useState(true);
    const URL = "http://127.0.0.1:8000"
    const URL_EXTENSION = "/profile/projects/active_state"

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

    return (<>
        <div className="main-page">
            <header className="app-header">
                <div className="header-left-container">
                </div>

                <div className="header-right-container">
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
                                    <td><label 
                                            onClick={() => navigate(`/org_chart/${project.id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                        {project.name}
                                        </label>
                                    </td>

                                    <td>{project.last_edition_date}</td>
                                    <td>{project.owner.username}</td>
                                    <td><i className="fa fa-ellipsis-v" aria-hidden="true" /></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Footer />
                </div>
            </div>
        </div>
    </>)
}