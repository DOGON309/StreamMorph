import React, { useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import './styles.css';
import Layout from "./Layout.jsx";
import Home from "./Home.jsx";
import Settings from "./Settings.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />} >
                    <Route index element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </Router >
    );
}

export default App;