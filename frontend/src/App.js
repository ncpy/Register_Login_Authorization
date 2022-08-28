import Login from "./components/Login";
import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout";
import Home from "./components/Home";
import Register from "./components/Register";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Layout /> } >
          <Route path="login" element={ <Login /> } />
          <Route path="signup" element={ <Register /> } />
          <Route path="/" element={ <Home /> } />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
