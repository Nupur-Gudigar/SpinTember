import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdventureSelection from "./pages/AdventureSelection";
import ChaoticWheel from "./pages/ChaoticWheel";
import CozyWheel from "./pages/CozyWheel";
import AcademicWheel from "./pages/AcademicWheel";
import CreativeWheel from "./pages/CreativeWheel";
import BoardOfHonor from "./pages/BoardOfHonor";
import VictoryPhoto from "./pages/VictoryPhoto";
import LoadingScreen from "./pages/LoadingScreen";
import BackgroundMusic from "./components/BackgroundMusic";
import { CursorProvider } from "./context/CursorContext";
import CursorToggle from "./components/CursorToggle";
import SoundToggle from "./components/SoundToggle";

function App() {
  return (
    <CursorProvider>
      <Router>
        {/* 🎶 Background music runs globally and reacts to route changes */}
        <BackgroundMusic />  

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/AdventureSelection" element={<AdventureSelection />} />
          <Route path="/ChaoticWheel" element={<ChaoticWheel />} />
          <Route path="/CozyWheel" element={<CozyWheel />} />
          <Route path="/victory" element={<VictoryPhoto />} />
          <Route path="/AcademicWheel" element={<AcademicWheel />} />
          <Route path="/CreativeWheel" element={<CreativeWheel />} />
          <Route path="/BoardOfHonor" element={<BoardOfHonor />} />
          <Route path="/LoadingScreen" element={<LoadingScreen />} />
        </Routes>

        {/* Global toggle buttons */}
        <CursorToggle />
        <SoundToggle />
      </Router>
    </CursorProvider>
  );
}

export default App;
