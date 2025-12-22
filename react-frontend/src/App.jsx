import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Compare from "./pages/Compare";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/compare/:id" element={<Compare />} />
      </Routes>
    </BrowserRouter>
  );
}