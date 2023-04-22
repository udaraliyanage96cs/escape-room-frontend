import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";

import Home from './Page/Home'
import User from './Page/User'
import Test from './Page/Test'

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </div>
  );
}

export default App;
