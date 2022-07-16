import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Favorites from "./components/Favorites";
import Error from "./components/Error";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
