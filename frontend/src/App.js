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
import RequireAuth from "./components/RequireAuth";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import EmailVerify from "./components/EmailVerify";

const ROLES = {
  "User": 2001,
  "Editor": 1999,
  "Admin": 1001
}

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
          <Route path="forgetpassword" element={<ForgetPassword />} />
          <Route path="resetpassword/:userId/:resetString" element={<ResetPassword />} />
          <Route path="verify/:userId/:uniqueString" element={<EmailVerify />} />
          
          {/* özel izinli olmalı */}
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="/" element={ <Home /> } />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
            <Route path="editor" element={<Editor />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<Admin />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
            <Route path="lounge" element={<Lounge />} />
          </Route>

          
          {/* catch all */}
          <Route path="*" element={<Missing />} />

        </Route>
      </Routes>
    </div>
  );
}

export default App;
