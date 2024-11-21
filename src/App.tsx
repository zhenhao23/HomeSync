import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Background from "./Background.tsx";
import BottomNavbar from "./BottomNavbar.tsx";
// import WeatherDisplay from "./WeatherDisplay.tsx";
import HomePage from "./HomePage/HomePage.tsx";
import EnergyPage from "./EnergyPage/EnergyPage.tsx";
import SolarPage from "./SolarPage/SolarPage.tsx";
import ProfilePage from "./ProfilePage/ProfilePage.tsx";

function App() {
  return (
    <Router>
      <Background>
        {/* <WeatherDisplay /> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/energy" element={<EnergyPage />} />
          <Route path="/solar" element={<SolarPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        <BottomNavbar />
      </Background>
    </Router>
  );
}

export default App;
