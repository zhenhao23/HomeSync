import Background from "./Background.tsx";
import BottomNavbar from "./BottomNavbar.tsx";
import WeatherDisplay from "./WeatherDisplay.tsx";

function App() {
  return (
    <Background>
      <WeatherDisplay />
      <BottomNavbar />
    </Background>
  );
}

export default App;
