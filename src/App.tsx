import LandingPage from "./pages/landingPage/LandingPage.tsx";
import Header from "./components/header/Header.tsx";
import RegisterPage from "./pages/registerPage/RegisterPage.tsx";
import DriverViewPage from "./pages/DriverViewPage/DriverViewPage.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from './ctx/UserContext';  

function App() {
    return (
        <UserProvider> 
            <Router>
                <Header />
                <div className="pt-16">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/driver" element={<DriverViewPage />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
