"use client"

import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { HeaderBar } from "@/components/HeaderBar"
import { StepSidebar } from "@/components/StepSidebar"
import LandingPage from "@/pages/LandingPage"
import PredictionPage from "@/pages/PredictionPage"
import SuggestionsPage from "@/pages/SuggestionsPage"
import DraftPage from "@/pages/DraftPage"
import CritiquePage from "@/pages/CritiquePage"
import ExportPage from "@/pages/ExportPage"

function App() {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-white font-inter text-[#333333]">
      <StepSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderBar />
        <main className="flex-1 overflow-auto bg-[#F8F9FA]">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/predict" element={<PredictionPage />} />
              <Route path="/suggest" element={<SuggestionsPage />} />
              <Route path="/draft" element={<DraftPage />} />
              <Route path="/critique" element={<CritiquePage />} />
              <Route path="/export" element={<ExportPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default App
