import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SearchPage from "./pages/Search";
import Analysis from "./pages/Analysis";
import Tender from "./pages/Tender";
import Explorer from "./pages/Explorer";
import StandardDetails from "./pages/StandardDetails";
import Comparison from "./pages/Comparison";
import Recommendation from "./pages/Recommendation";
import Safety from "./pages/Safety";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import "./index.css";

function App() {
  return <BrowserRouter><Layout><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/search" element={<SearchPage/>}/>
    <Route path="/analysis" element={<Analysis/>}/>
    <Route path="/tender" element={<Tender/>}/>
    <Route path="/explorer" element={<Explorer/>}/>
    <Route path="/standard/:id" element={<StandardDetails/>}/>
    <Route path="/comparison" element={<Comparison/>}/>
    <Route path="/recommend" element={<Recommendation/>}/>
    <Route path="/safety" element={<Safety/>}/>
    <Route path="/dashboard" element={<Dashboard/>}/>
    <Route path="/settings" element={<Settings/>}/>
  </Routes></Layout></BrowserRouter>
}

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
