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
import WelcomePage from "./LoginRegisterPage/WelcomePage.tsx";
import Welcome2 from "./LoginRegisterPage/Welcome2.tsx";
import SignIn from "./LoginRegisterPage/SignIn.tsx";
import RegisterRole from "./LoginRegisterPage/RegisterRole.tsx";
import Register from "./LoginRegisterPage/Register.tsx";
import OTPVerification from "./LoginRegisterPage/OTPVerification.tsx";
import JoinHome from "./LoginRegisterPage/JoinHome.tsx";
import ForgotPW from "./LoginRegisterPage/ForgotPW.tsx";
import CreateNewPW from "./LoginRegisterPage/CreateNewPW.tsx";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

const AppLayout = () => {
  const location = useLocation();

  // Define routes that should show the navbar
  const routesWithNavbar = [
    "/home",
    "/energy",
    "/energy-limit",
    "/solar",
    "/profile",
  ];

  // Check if current route should show navbar
  const shouldShowNavbar = routesWithNavbar.includes(location.pathname);

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
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
};

export default App;
