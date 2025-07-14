import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </Layout>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
