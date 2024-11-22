import './App.css'
import LandingPage from "./pages/landingPage/LandingPage.tsx";

import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Header from "./components/header/Header.tsx";
import RegisterPage from "./pages/registerPage/RegisterPage.tsx";
import DriverViewPage from "./pages/DriverViewPage/DriverViewPage.tsx";
function App() {
    return (
        <>
           <Router>
               <Header/>
               <div className="pt-16">
                   <Routes>
                       <Route path="/" element={<LandingPage/>} />
                       <Route path="/register" element={<RegisterPage/>} />
                       <Route path="/driver" element={<DriverViewPage/>} />
                   </Routes>
               </div>
           </Router>
        </>
    )
}

export default App
