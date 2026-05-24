import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Characters from "./pages/Characters";
import ChooseCharacter from "./pages/ChooseCharacter";
import Fight from "./pages/Fight";
import TypeChartPage from "./pages/TypeChartPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/choose" element={<ChooseCharacter />} />
        <Route path="/fight/:id" element={<Fight />} />
        <Route path="/type-chart" element={<TypeChartPage />} />
      </Routes>
    </BrowserRouter>
  );
}
