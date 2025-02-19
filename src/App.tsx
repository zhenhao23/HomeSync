import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Background from "./Background.tsx";
import BottomNavbar from "./BottomNavbar.tsx";
import HomePage from "./HomePage/HomePage.tsx";
import EnergyPage from "./EnergyPage/EnergyPage.tsx";
import EnergyLimit from "./EnergyPage/EnergyLimit.tsx";
import SolarPage from "./SolarPage/SolarPage.tsx";
import ProfilePage from "./ProfilePage/ProfilePage.tsx";

  return (
    <Background>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/welcome2" element={<Welcome2 />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register-role" element={<RegisterRole />} />
        <Route path="/register-acc" element={<Register />} />
        <Route path="/create-new-pw" element={<CreateNewPW />} />
        <Route path="/forgot-pw" element={<ForgotPW />} />
        <Route path="/join-home" element={<JoinHome />} />
        <Route path="/otp-ver" element={<OTPVerification />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/energy" element={<EnergyPage />} />
        <Route path="/energy-limit" element={<EnergyLimit />} />
        <Route path="/solar" element={<SolarPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      {shouldShowNavbar && <BottomNavbar />}
    </Background>
  );
};

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
