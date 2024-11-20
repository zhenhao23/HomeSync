import Background from "./Background.tsx";
import BottomNavbar from "./BottomNavbar.tsx";
import WeatherDisplay from "./WeatherDisplay.tsx";
import HomePage from "./HomePage/HomePage.tsx";

function App() {
  return (
    <Background>
      <WeatherDisplay />
      <HomePage />
      <BottomNavbar />
    </Background>
  );
}

export default App;
