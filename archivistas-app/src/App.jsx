import {Routes, Route, Navigate} from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import MainPage from "./pages/MainPage"

function App(){
    return(
        <div className="App">
            <Routes>
                <Route path="/"  element={<Navigate to="/login" />}/>
                <Route 
                    path="/login"
                    element={<><LoginPage/></>}
                />

                <Route 
                    path="/main_page" 
                    element={<><MainPage/></>}
                />
            </Routes>

        </div>
    )
}

export default App