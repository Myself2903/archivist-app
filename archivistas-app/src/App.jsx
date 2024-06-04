import {Routes, Route, Navigate} from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import MainPage from "./pages/MainPage"
import OrgChartPage from "./pages/OrgChartPage"

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

                <Route 
                    path="/org_chart"
                    element={<><OrgChartPage/></>}
                />
            </Routes>

        </div>
    )
}

export default App