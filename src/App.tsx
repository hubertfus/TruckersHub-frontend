import LandingPage from "./pages/landingPage/LandingPage.tsx";
import Header from "./components/header/Header.tsx";
import RegisterPage from "./pages/registerPage/RegisterPage.tsx";
import DriverViewPage from "./pages/DriverViewPage/DriverViewPage.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from './ctx/UserContext';  
import DispatcherViewPage from "./pages/dispatcherViewPage/DispatcherViewPage.tsx";
import UserDetails from "./pages/userDetails/UserDetails.tsx";

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
                        <Route path="/dispatcher" element={<DispatcherViewPage />} />
                        <Route path="/users/:id" element={<UserDetails />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
