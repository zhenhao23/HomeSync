import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Background from "./Background.tsx";
import BottomNavbar from "./BottomNavbar.tsx";
import HomePage from "./HomePage/HomePage.tsx";
import EnergyPage from "./EnergyPage/EnergyPage.tsx";
import EnergyLimit from "./EnergyPage/EnergyLimit.tsx";
import SolarPage from "./SolarPage/SolarPage.tsx";
import ProfilePage from "./ProfilePage/ProfilePage.tsx";
// import WelcomePage from "./LoginRegisterPage/WelcomePage.tsx";
// import WelcomeBackground from "./LoginRegisterPage/WelcomeBackground.tsx";
// hello

function App() {
  return (
    <Router>
      {/* IMPORTANT: COMMENT THE PAGES YOU ARE NOT WORKING ON */}
      {/* WebApp Pages (zhen hao, wai yau, umar) */}
      <Background>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/energy" element={<EnergyPage />} />
          <Route path="/energy-limit" element={<EnergyLimit />} />
          <Route path="/solar" element={<SolarPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <BottomNavbar />
      </Background>

      {/* IMPORTANT: COMMENT THE PAGES YOU ARE NOT WORKING ON */}
      {/* Login register Pages (Darshan, Alif) */}
      {/* <WelcomeBackground>
        <WelcomePage />
      </WelcomeBackground> */}
    </Router>
  );
}

export default App;
