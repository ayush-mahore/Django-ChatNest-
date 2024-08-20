import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoutes";
import EnterRoom from "./pages/EnterRoom";

const Messages = React.lazy(() => import("./pages/Messages"));

function Logout() {
  localStorage.clear();
  return <Navigate to="/" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/enter-room"
          element={
            <ProtectedRoute>
              <EnterRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/enter-room/:roomName"
          element={
            <ProtectedRoute>
              <Suspense fallback={<div>Loading...</div>}>
                <Messages />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
