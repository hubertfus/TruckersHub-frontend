import './App.css'
import LandingPage from "./pages/landingPage/LandingPage.tsx";

import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import Header from "./components/header/Header.tsx";
import RegisterPage from "./pages/registerPage/RegisterPage.tsx";
function App() {
    return (
        <>
           <Router>
               <Header/>
               <Routes>
                   <Route path="/" element={<LandingPage/>} />
                   <Route path="/register" element={<RegisterPage/>} />
               </Routes>
           </Router>
        </>
    )
}

export default App
