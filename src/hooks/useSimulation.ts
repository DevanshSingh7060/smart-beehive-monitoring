import { useState, useEffect, useCallback, useRef } from "react"
import normalData from "../data/beehive_normal_demo.json"
import swarmingData from "../data/beehive_swarming_demo.json"

export interface TelemetryReading {
  timestamp: string
  brood_temp: number
  t_i_1: number
  t_i_2: number
  t_i_3: number
  t_i_4?: number
  t_i_5?: number
  ambient_temp: number
  humidity: number
  weight_kg: number
  pressure: number
  event?: string
}

export type SimulationMode = "normal" | "swarming"

export interface SimulationState {
  mode: SimulationMode
  playing: boolean
  currentIndex: number
  currentReading: TelemetryReading
  previousReading: TelemetryReading | null
  history: TelemetryReading[]
  dataset: TelemetryReading[]
  progress: number
  isSwarmEvent: boolean
  weightDelta: number
}

export interface SimulationControls {
  play: () => void
  pause: () => void
  reset: () => void
  setMode: (mode: SimulationMode) => void
  toggleMode: () => void
  seekTo: (index: number) => void
}

const TICK_INTERVAL_MS = 2000

export default function useSimulation(): SimulationState & SimulationControls {
  const [mode, setModeState] = useState<SimulationMode>("normal")
  const [playing, setPlaying] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const dataset: TelemetryReading[] =
    mode === "normal"
      ? (normalData as TelemetryReading[])
      : (swarmingData as TelemetryReading[])

  const currentReading = dataset[currentIndex] ?? dataset[0]
  const previousReading = currentIndex > 0 ? dataset[currentIndex - 1] : null
  const history = dataset.slice(0, currentIndex + 1)
  const progress =
    dataset.length > 1 ? (currentIndex / (dataset.length - 1)) * 100 : 0

  // Detect swarming event: current timestamp >= event field
  const isSwarmEvent = (() => {
    if (mode !== "swarming" || !currentReading.event) return false
    const currentTime = new Date(currentReading.timestamp).getTime()
    const eventTime = new Date(currentReading.event).getTime()
    return currentTime >= eventTime
  })()

  // Weight delta from previous reading
  const weightDelta = previousReading
    ? +(currentReading.weight_kg - previousReading.weight_kg).toFixed(2)
    : 0

  // Tick forward
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= dataset.length - 1) {
            setPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, TICK_INTERVAL_MS)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [playing, dataset.length])

  const play = useCallback(() => {
    // If at end, reset first
    if (currentIndex >= dataset.length - 1) {
      setCurrentIndex(0)
    }
    setPlaying(true)
  }, [currentIndex, dataset.length])

  const pause = useCallback(() => {
    setPlaying(false)
  }, [])

  const reset = useCallback(() => {
    setPlaying(false)
    setCurrentIndex(0)
  }, [])

  const setMode = useCallback(
    (newMode: SimulationMode) => {
      if (newMode !== mode) {
        setPlaying(false)
        setCurrentIndex(0)
        setModeState(newMode)
      }
    },
    [mode]
  )

  const toggleMode = useCallback(() => {
    setMode(mode === "normal" ? "swarming" : "normal")
  }, [mode, setMode])

  const seekTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, dataset.length - 1))
      setCurrentIndex(clamped)
    },
    [dataset.length]
  )

  return {
    mode,
    playing,
    currentIndex,
    currentReading,
    previousReading,
    history,
    dataset,
    progress,
    isSwarmEvent,
    weightDelta,
    play,
    pause,
    reset,
    setMode,
    toggleMode,
    seekTo,
  }
}
