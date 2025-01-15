import react from "react"
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Home from "./pages/Home"
import LandingPage from "./pages/LandingPage"
import NotificationCenter from "./pages/NotificationCenter"
import CreatePickupGame from "./pages/CreatePickupGame"
import UpdatePickupGame from "./pages/UpdatePickupGame"
import PickupGames from "./pages/PickupGames"
import PlayerPage from "./pages/PlayerPage"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import "./styles/App.css"
import styles from "./styles/LandingPage.module.css"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <div>
    
      <BrowserRouter>
        <Navbar />
        <div className={styles['full-screen-div']}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <LandingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications/"
              element={
                <ProtectedRoute>
                  <NotificationCenter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pickup/create/"
              element={
                <ProtectedRoute>
                  <CreatePickupGame />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/pickup/game/update/"
              element={
                <ProtectedRoute>
                  <UpdatePickupGame/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pickup/games/"
              element={
                <ProtectedRoute>
                  <PickupGames />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pickup/player/"
              element={
                <ProtectedRoute>
                  <PlayerPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />}/>
            <Route path="/logout" element={<Logout />}/>
            <Route path="*" element={<NotFound />}/>
          </Routes>
          </div>
      </BrowserRouter>
    </div>
  )
}

export default App
