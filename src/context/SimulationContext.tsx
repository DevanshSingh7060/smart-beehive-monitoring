import React, { createContext, useContext, ReactNode } from "react"
import useSimulationHook from "../hooks/useSimulation"
import type { SimulationState, SimulationControls } from "../hooks/useSimulation"

const SimulationContext = createContext<(SimulationState & SimulationControls) | null>(null)

export function SimulationProvider({ children }: { children: ReactNode }) {
  const sim = useSimulationHook()
  return (
    <SimulationContext.Provider value={sim}>
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulationContext() {
  const context = useContext(SimulationContext)
  if (!context) {
    throw new Error("useSimulationContext must be used within a SimulationProvider")
  }
  return context
}
