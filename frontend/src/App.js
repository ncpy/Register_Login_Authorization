import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";
import LinkPage from "./components/LinkPage";
import Unauthorized from "./components/Unauthorized";

import Home from "./components/Home";
import Editor from "./components/Editor";
import Admin from "./components/Admin";
import Lounge from "./components/Lounge";
import Missing from "./components/Missing";



function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Layout /> } >
          
          {/* açık erişim */}
          <Route path="login" element={ <Login /> } />
          <Route path="signup" element={ <Register /> } />
          <Route path="linkpage" element={<LinkPage />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          
          {/* özel izinli olmalı */}
          <Route path="/" element={ <Home /> } />
          <Route path="editor" element={<Editor />} />
          <Route path="admin" element={<Admin />} />
          <Route path="lounge" element={<Lounge />} />
          
          {/* catch all */}
          <Route path="*" element={<Missing />} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;
