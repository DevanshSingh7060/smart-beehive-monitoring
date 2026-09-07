import React, { createContext, useContext, useState, useEffect } from 'react'

interface IntroContextType {
  showIntro: boolean
  playIntro: () => void
  dismissIntro: () => void
}

const IntroContext = createContext<IntroContextType>({
  showIntro: true,
  playIntro: () => {},
  dismissIntro: () => {},
})

export function IntroProvider({ children }: { children: React.ReactNode }) {
  // Always default to true so opening localhost directly shows the cinematic animation
  const [showIntro, setShowIntro] = useState<boolean>(true)

  const playIntro = () => {
    setShowIntro(true)
  }

  const dismissIntro = () => {
    setShowIntro(false)
  }

  return (
    <IntroContext.Provider value={{ showIntro, playIntro, dismissIntro }}>
      {children}
    </IntroContext.Provider>
  )
}

export function useIntro() {
  return useContext(IntroContext)
}
