import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { ProtectedRoute } from "./lib/auth";

import Home from "./pages/Home";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Projects from "./pages/Projects";
import PlanDetail from "./pages/PlanDetail";
import Education from "./pages/Education";
import ArticleDetail from "./pages/ArticleDetail";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className={isAdmin ? "min-h-screen" : "min-h-screen pt-[72px]"}>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/how-it-works" element={<Page><HowItWorks /></Page>} />
          <Route path="/projects" element={<Page><Projects /></Page>} />
          <Route path="/projects/:id" element={<Page><PlanDetail /></Page>} />
          <Route path="/education" element={<Page><Education /></Page>} />
          <Route path="/education/:id" element={<Page><ArticleDetail /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />

          {/* Admin */}
          <Route path="/admin/login" element={<Page><AdminLogin /></Page>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Page><AdminDashboard /></Page>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Page><Home /></Page>} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </div>
  );
}