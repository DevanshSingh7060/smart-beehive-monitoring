import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Sparkles, Volume2, VolumeX, FastForward } from 'lucide-react'

interface CinematicIntroProps {
  onComplete: () => void
  onSkip?: () => void
  autoStart?: boolean
}

// Cubic Bezier helper for smooth organic flight path
function getBezierPoint(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
) {
  const oneMinusT = 1 - t
  const x =
    Math.pow(oneMinusT, 3) * p0.x +
    3 * Math.pow(oneMinusT, 2) * t * p1.x +
    3 * oneMinusT * Math.pow(t, 2) * p2.x +
    Math.pow(t, 3) * p3.x
  const y =
    Math.pow(oneMinusT, 3) * p0.y +
    3 * Math.pow(oneMinusT, 2) * t * p1.y +
    3 * oneMinusT * Math.pow(t, 2) * p2.y +
    Math.pow(t, 3) * p3.y

  // Derivative for flight velocity tangent & natural banking angle
  const dx =
    3 * Math.pow(oneMinusT, 2) * (p1.x - p0.x) +
    6 * oneMinusT * t * (p2.x - p1.x) +
    3 * Math.pow(t, 2) * (p3.x - p2.x)
  const dy =
    3 * Math.pow(oneMinusT, 2) * (p1.y - p0.y) +
    6 * oneMinusT * t * (p2.y - p1.y) +
    3 * Math.pow(t, 2) * (p3.y - p2.y)

  const angle = Math.atan2(dy, dx)
  return { x, y, angle }
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  maxLife: number
  life: number
  color: string
  twinkleSpeed: number
  glowRadius?: number
}

interface BokehCircle {
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  color: string
  alpha: number
  speed: number
  offset: number
}

export default function CinematicIntro({ onComplete, onSkip }: CinematicIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isEnding, setIsEnding] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  const duration = 3.9 // Cinematic duration in seconds

  // Initialize Web Audio API for gentle ambient nature chime and soft wing hum
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        const ctx = new AudioCtx()
        audioContextRef.current = ctx

        // Master Gain
        const masterGain = ctx.createGain()
        masterGain.gain.setValueAtTime(0.01, ctx.currentTime)
        masterGain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 1.2)
        masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8)
        masterGain.connect(ctx.destination)

        // Soft melodic harmonic morning tones (chimes)
        const freqs = [261.63, 329.63, 392.0, 523.25, 659.25]
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator()
          const oscGain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(f, ctx.currentTime)
          oscGain.gain.setValueAtTime(0.018 / (idx + 1), ctx.currentTime)
          osc.connect(oscGain)
          oscGain.connect(masterGain)
          osc.start()
          osc.stop(ctx.currentTime + 3.8)
        })

        // Gentle bee wing flutter tone
        const wingOsc = ctx.createOscillator()
        const wingGain = ctx.createGain()
        wingOsc.type = 'triangle'
        wingOsc.frequency.setValueAtTime(185, ctx.currentTime)
        wingOsc.frequency.setValueAtTime(185, ctx.currentTime + 1.8)
        wingOsc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 2.8)
        wingOsc.frequency.linearRampToValueAtTime(0, ctx.currentTime + 3.4)

        const filter = ctx.createBiquadFilter()
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(400, ctx.currentTime)

        wingGain.gain.setValueAtTime(0.001, ctx.currentTime)
        wingGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.8)
        wingGain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 2.5)
        wingGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 3.3)

        wingOsc.connect(filter)
        filter.connect(wingGain)
        wingGain.connect(masterGain)

        wingOsc.start()
        wingOsc.stop(ctx.currentTime + 3.6)
      }
    } catch {
      // Autoplay fallback
    }
  }, [])

  const toggleSound = () => {
    if (isMuted) {
      setIsMuted(false)
      if (!audioContextRef.current) {
        initAudio()
      } else if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume()
      }
    } else {
      setIsMuted(true)
      if (audioContextRef.current && audioContextRef.current.state === 'running') {
        audioContextRef.current.suspend()
      }
    }
  }

  // Animation Engine
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let startTime: number | null = null

    // Setup canvas size with DPI scaling
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Pre-create Bokeh circles for soft depth-of-field
    const bokehParticles: BokehCircle[] = []
    const numBokeh = 32
    const palette = [
      'rgba(254, 243, 199, 0.45)', // soft amber
      'rgba(253, 230, 138, 0.35)', // golden yellow
      'rgba(220, 252, 231, 0.4)', // soft meadow green
      'rgba(252, 231, 243, 0.35)', // subtle petal rose
      'rgba(224, 242, 254, 0.45)', // morning sky blue
      'rgba(255, 255, 255, 0.5)', // morning sunlight
    ]

    for (let i = 0; i < numBokeh; i++) {
      bokehParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        baseX: Math.random() * window.innerWidth,
        baseY: Math.random() * window.innerHeight,
        radius: Math.random() * 70 + 25,
        color: palette[Math.floor(Math.random() * palette.length)],
        alpha: Math.random() * 0.4 + 0.15,
        speed: Math.random() * 0.7 + 0.3,
        offset: Math.random() * Math.PI * 2,
      })
    }

    // Dynamic golden particle trail behind bee
    const trailParticles: Particle[] = []

    // Gentle floating pollen motes in the air
    const ambientPollen: Particle[] = []
    for (let i = 0; i < 45; i++) {
      ambientPollen.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.3) * 0.35,
        vy: (Math.random() - 0.5) * 0.25 - 0.08,
        size: Math.random() * 2.8 + 1.2,
        alpha: Math.random() * 0.6 + 0.2,
        maxLife: 9999,
        life: 0,
        color: Math.random() > 0.4 ? 'rgba(245, 158, 11,' : 'rgba(254, 240, 138,',
        twinkleSpeed: Math.random() * 3 + 1,
      })
    }

    // Flower landing burst particles
    const burstParticles: Particle[] = []
    let hasTriggeredBurst = false

    // Main render loop
    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000
      setElapsedTime(Math.min(elapsed, duration))

      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      ctx.clearRect(0, 0, width, height)

      // ==========================================
      // 1. SKY & MORNING SUNLIGHT ENVIRONMENT
      // ==========================================
      const bgFade = Math.min(elapsed / 0.65, 1)

      // Soft morning pastel sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, width * 0.85, height)
      skyGrad.addColorStop(0, `rgba(235, 246, 253, ${bgFade})`) // Pale sky blue
      skyGrad.addColorStop(0.35, `rgba(255, 254, 245, ${bgFade})`) // Warm golden morning sunlight
      skyGrad.addColorStop(0.75, `rgba(242, 249, 240, ${bgFade})`) // Soft green morning meadow
      skyGrad.addColorStop(1, `rgba(230, 245, 233, ${bgFade})`)

      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, width, height)

      // Morning Sun Flare / Radial Glow from top-left
      const sunGrad = ctx.createRadialGradient(
        width * 0.12,
        height * 0.1,
        0,
        width * 0.18,
        height * 0.15,
        width * 0.8
      )
      sunGrad.addColorStop(0, `rgba(254, 243, 199, ${0.55 * bgFade})`)
      sunGrad.addColorStop(0.3, `rgba(253, 230, 138, ${0.25 * bgFade})`)
      sunGrad.addColorStop(0.65, `rgba(254, 249, 195, ${0.09 * bgFade})`)
      sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.fillStyle = sunGrad
      ctx.fillRect(0, 0, width, height)

      // Gentle volumetric sunlight beams with slow organic breathing
      ctx.save()
      ctx.translate(width * 0.08, 0)
      ctx.rotate(0.35)
      const rayAlpha = (0.08 + Math.sin(elapsed * 1.6) * 0.025) * bgFade
      const rayGrad = ctx.createLinearGradient(0, 0, width * 0.7, height * 0.95)
      rayGrad.addColorStop(0, `rgba(254, 240, 138, ${rayAlpha * 2.2})`)
      rayGrad.addColorStop(0.45, `rgba(254, 249, 195, ${rayAlpha})`)
      rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = rayGrad
      ctx.fillRect(-width * 0.2, 0, width * 1.3, height * 1.4)
      ctx.restore()

      // ==========================================
      // 2. DEPTH-OF-FIELD BOKEH & AMBIENT POLLEN
      // ==========================================
      bokehParticles.forEach(b => {
        const driftX = Math.sin(elapsed * b.speed + b.offset) * 25
        const driftY = Math.cos(elapsed * (b.speed * 0.75) + b.offset) * 18
        const curX = b.baseX + driftX
        const curY = b.baseY + driftY

        const bGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, b.radius)
        bGrad.addColorStop(0, b.color)
        bGrad.addColorStop(0.7, b.color.replace(/[\d.]+\)$/, `${b.alpha * 0.5 * bgFade})`))
        bGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = bGrad
        ctx.beginPath()
        ctx.arc(curX, curY, b.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Ambient floating pollen specks
      ambientPollen.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x > width) p.x = 0
        if (p.x < 0) p.x = width
        if (p.y > height) p.y = 0
        if (p.y < 0) p.y = height

        const twinkle = (Math.sin(elapsed * p.twinkleSpeed + p.x) * 0.35 + 0.65) * p.alpha * bgFade
        ctx.fillStyle = `${p.color} ${twinkle})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // ==========================================
      // 3. FLOWER ON THE RIGHT SIDE (FLOWER LANDING)
      // ==========================================
      const flowerX = width > 768 ? width * 0.77 : width * 0.73
      const flowerY = height * 0.58

      // Natural physical spring oscillation when bee lands (landing at ~2.8s)
      let flowerBounce = 0
      let flowerAngle = 0
      if (elapsed >= 2.8) {
        const landingElapsed = elapsed - 2.8
        const decay = Math.exp(-landingElapsed * 3.4)
        flowerBounce = Math.sin(landingElapsed * 9.5) * 10 * decay
        flowerAngle = Math.sin(landingElapsed * 8.5) * 0.07 * decay

        // Trigger golden landing burst once
        if (!hasTriggeredBurst && landingElapsed > 0.05) {
          hasTriggeredBurst = true
          for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2
            const spd = Math.random() * 2.6 + 0.9
            burstParticles.push({
              x: flowerX - 22,
              y: flowerY - 26,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd - 1.1,
              size: Math.random() * 3.0 + 1.4,
              alpha: 0.95,
              maxLife: 1.5,
              life: 0,
              color: 'rgba(245, 158, 11,',
              twinkleSpeed: Math.random() * 5 + 3,
            })
          }
        }
      }

      // Draw Blooming Flower
      ctx.save()
      ctx.translate(flowerX, flowerY + flowerBounce)
      ctx.rotate(flowerAngle - 0.08)

      // Flower Stem (gracefully curved vibrant green stem)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(20, 80, -30, 170, -50, height - flowerY + 80)
      ctx.lineWidth = 7
      ctx.strokeStyle = '#22C55E'
      ctx.lineCap = 'round'
      ctx.stroke()

      // Stem inner highlight
      ctx.beginPath()
      ctx.moveTo(2, 2)
      ctx.bezierCurveTo(22, 80, -28, 170, -48, height - flowerY + 80)
      ctx.lineWidth = 3
      ctx.strokeStyle = '#86EFAC'
      ctx.stroke()

      // Stem Leaf
      ctx.save()
      ctx.translate(-8, 110)
      ctx.rotate(-0.5)
      ctx.beginPath()
      ctx.ellipse(0, 0, 28, 11, 0.2, 0, Math.PI * 2)
      ctx.fillStyle = '#16A34A'
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(0, 0, 24, 7, 0.2, 0, Math.PI * 2)
      ctx.fillStyle = '#4ADE80'
      ctx.fill()
      ctx.restore()

      // Layered Blooming Petals (Soft Pink to Velvet White)
      const numPetals = 10
      const petalRadius = 58
      for (let p = 0; p < numPetals; p++) {
        ctx.save()
        const angle = (p / numPetals) * Math.PI * 2
        ctx.rotate(angle)

        // Petal silhouette
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(-18, -22, -22, -petalRadius, 0, -petalRadius - 6)
        ctx.bezierCurveTo(22, -petalRadius, 18, -22, 0, 0)

        // Soft pastel gradient
        const petGrad = ctx.createLinearGradient(0, 0, 0, -petalRadius - 6)
        petGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)')
        petGrad.addColorStop(0.45, 'rgba(255, 241, 242, 0.95)')
        petGrad.addColorStop(0.8, 'rgba(254, 205, 211, 0.9)')
        petGrad.addColorStop(1, 'rgba(244, 114, 182, 0.85)') // delicate pastel rose

        ctx.fillStyle = petGrad
        ctx.shadowColor = 'rgba(244, 114, 182, 0.22)'
        ctx.shadowBlur = 8
        ctx.fill()

        // Delicate micro vein lines on petals
        ctx.beginPath()
        ctx.moveTo(0, -8)
        ctx.lineTo(0, -petalRadius + 8)
        ctx.lineWidth = 0.9
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.3)'
        ctx.stroke()

        ctx.restore()
      }

      // Flower Center (Rich golden stamen disc with florets)
      const centerGrad = ctx.createRadialGradient(0, 0, 3, 0, 0, 20)
      centerGrad.addColorStop(0, '#FEF08A') // bright pollen yellow
      centerGrad.addColorStop(0.35, '#F59E0B') // warm honey amber
      centerGrad.addColorStop(0.7, '#D97706') // deep golden honey
      centerGrad.addColorStop(1, '#78350F') // rich velvet chestnut border

      ctx.beginPath()
      ctx.arc(0, 0, 20, 0, Math.PI * 2)
      ctx.fillStyle = centerGrad
      ctx.shadowColor = 'rgba(217, 119, 6, 0.45)'
      ctx.shadowBlur = 12
      ctx.fill()

      // Concentric stamen florets dots
      for (let s = 0; s < 20; s++) {
        const sAngle = (s / 20) * Math.PI * 2
        const sDist = (s % 2 === 0 ? 9 : 14) + Math.sin(s * 2) * 1.8
        const sx = Math.cos(sAngle) * sDist
        const sy = Math.sin(sAngle) * sDist
        ctx.beginPath()
        ctx.arc(sx, sy, 1.6, 0, Math.PI * 2)
        ctx.fillStyle = '#FEF9C3' // luminous pollen
        ctx.fill()
      }

      // Warm glowing ambient halo around flower & bee upon landing
      if (elapsed >= 2.2) {
        const haloFade = Math.min((elapsed - 2.2) / 0.8, 1)
        const flowerHalo = ctx.createRadialGradient(0, 0, 12, 0, 0, 80)
        flowerHalo.addColorStop(0, `rgba(251, 191, 36, ${0.4 * haloFade})`)
        flowerHalo.addColorStop(0.5, `rgba(245, 158, 11, ${0.15 * haloFade})`)
        flowerHalo.addColorStop(1, 'rgba(245, 158, 11, 0)')

        ctx.fillStyle = flowerHalo
        ctx.beginPath()
        ctx.arc(0, 0, 80, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()

      // ==========================================
      // 4. HONEYBEE FLIGHT TRAJECTORY & DYNAMICS
      // ==========================================
      // 0.0 - 0.7s: Garden reveals
      // 0.7 - 2.0s: Bee flies smoothly across
      // 2.0 - 2.8s: Bee approaches flower, hovers
      // 2.8 - 3.5s: Bee lands gently on petal, wings fold, flower bows
      // 3.5 - 3.9s: Hold final frame

      let beeX = -120
      let beeY = -120
      let beeAngle = 0
      let beeScale = 1.35 // Crisp, clear visibility
      let wingSpeed = 50 // Wing flap frequency
      let beeAlpha = 1
      let legSpread = 0 // 0 = tucked in flight, 1 = touching down

      // Trajectory Control Points
      const p0 = { x: -80, y: height * 0.36 } // Left entry
      const p1 = { x: width * 0.22, y: height * 0.16 } // Gentle upward swoop
      const p2 = { x: width * 0.46, y: height * 0.50 } // Smooth descent
      const p3 = { x: flowerX - 22, y: flowerY - 24 } // Petal target near flower center

      if (elapsed < 0.7) {
        beeAlpha = 0
      } else if (elapsed < 2.0) {
        // Flight phase (0.7s -> 2.0s: normalized 0 -> 0.78)
        const flightT = (elapsed - 0.7) / 1.3
        const easeT = flightT * flightT * (3 - 2 * flightT) * 0.78
        const pt = getBezierPoint(easeT, p0, p1, p2, p3)
        const bob = Math.sin(elapsed * 12) * 5.5
        beeX = pt.x
        beeY = pt.y + bob
        beeAngle = pt.angle + Math.sin(elapsed * 8) * 0.07
        beeScale = 1.25 + easeT * 0.2
        wingSpeed = 52
        beeAlpha = Math.min((elapsed - 0.7) / 0.25, 1)

        // Emit glowing golden particle trail
        for (let k = 0; k < 2; k++) {
          trailParticles.push({
            x: beeX - Math.cos(beeAngle) * 20 + (Math.random() - 0.5) * 8,
            y: beeY - Math.sin(beeAngle) * 20 + (Math.random() - 0.5) * 8,
            vx: -Math.cos(beeAngle) * (Math.random() * 1.0 + 0.3) + (Math.random() - 0.5) * 0.6,
            vy: -Math.sin(beeAngle) * 0.5 + (Math.random() - 0.5) * 0.6,
            size: Math.random() * 3.2 + 1.4,
            alpha: 0.9,
            maxLife: 1.0,
            life: 0,
            color: Math.random() > 0.3 ? 'rgba(245, 158, 11,' : 'rgba(251, 191, 36,',
            twinkleSpeed: Math.random() * 6 + 3,
          })
        }
      } else if (elapsed < 2.8) {
        // Approaching & hovering phase (2.0s -> 2.8s)
        const hoverT = (elapsed - 2.0) / 0.8
        const easeT = 0.78 + hoverT * 0.2
        const pt = getBezierPoint(easeT, p0, p1, p2, p3)
        const hoverBob = Math.sin((elapsed - 2.0) * 14) * (3.5 * (1 - hoverT))
        beeX = pt.x
        beeY = pt.y + hoverBob
        const targetRestAngle = -0.16
        beeAngle = pt.angle * (1 - hoverT) + targetRestAngle * hoverT
        beeScale = 1.45
        wingSpeed = 52 - hoverT * 32
        legSpread = hoverT * 0.7

        if (Math.random() > 0.3) {
          trailParticles.push({
            x: beeX + (Math.random() - 0.5) * 10,
            y: beeY + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 0.9,
            vy: Math.random() * 0.7 + 0.2,
            size: Math.random() * 2.6 + 1.2,
            alpha: 0.75,
            maxLife: 0.8,
            life: 0,
            color: 'rgba(251, 191, 36,',
            twinkleSpeed: 4,
          })
        }
      } else {
        // Landing & resting phase (2.8s -> 3.9s)
        const landT = Math.min((elapsed - 2.8) / 0.7, 1)
        beeX = p3.x
        beeY = p3.y + flowerBounce
        beeAngle = -0.14 + flowerAngle * 0.8
        beeScale = 1.45
        beeAlpha = 1
        legSpread = 1.0 // Fully planted on petal
        wingSpeed = Math.max(0, (1 - landT) * 16)
      }

      // Update and Draw Golden Trail Particles
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const p = trailParticles[i]
        p.life += 1 / 60
        if (p.life >= p.maxLife) {
          trailParticles.splice(i, 1)
          continue
        }
        p.x += p.vx
        p.y += p.vy
        const lifeRatio = p.life / p.maxLife
        const currentAlpha = (1 - lifeRatio) * p.alpha
        const currentSize = p.size * (1 - lifeRatio * 0.35)

        ctx.save()
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentSize * 2.8)
        pGrad.addColorStop(0, `${p.color} ${currentAlpha})`)
        pGrad.addColorStop(0.4, `${p.color} ${currentAlpha * 0.5})`)
        pGrad.addColorStop(1, `${p.color} 0)`)
        ctx.fillStyle = pGrad
        ctx.beginPath()
        ctx.arc(p.x, p.y, currentSize * 2.8, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Update and Draw Landing Burst Particles
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i]
        p.life += 1 / 60
        if (p.life >= p.maxLife) {
          burstParticles.splice(i, 1)
          continue
        }
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.02
        const lifeRatio = p.life / p.maxLife
        const currentAlpha = (1 - lifeRatio) * p.alpha

        ctx.fillStyle = `${p.color} ${currentAlpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.3), 0, Math.PI * 2)
        ctx.fill()
      }

      // ==========================================
      // 5. DRAW REALISTIC 3D HONEYBEE
      // ==========================================
      if (beeAlpha > 0) {
        ctx.save()
        ctx.translate(beeX, beeY)
        ctx.rotate(beeAngle)
        ctx.scale(beeScale, beeScale)
        ctx.globalAlpha = beeAlpha

        // Bee soft ground / flower shadow
        ctx.save()
        ctx.translate(0, 12 + (1 - legSpread) * 6)
        ctx.scale(1, 0.32)
        ctx.beginPath()
        ctx.arc(0, 0, 18, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 0, 0, ${0.2 * (0.4 + legSpread * 0.5)})`
        ctx.fill()
        ctx.restore()

        // --- 6 LEGS (coxa, femur, tibia, tarsi) ---
        const legColor = '#27170B'
        ctx.strokeStyle = legColor
        ctx.lineWidth = 1.8
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Front legs
        ctx.beginPath()
        ctx.moveTo(9, 2)
        ctx.lineTo(13, 7 + legSpread * 6)
        ctx.lineTo(16, 11 + legSpread * 9)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(7, -2)
        ctx.lineTo(10, -6 - legSpread * 3)
        ctx.lineTo(13, -8 - legSpread * 5)
        ctx.stroke()

        // Middle legs
        ctx.beginPath()
        ctx.moveTo(0, 4)
        ctx.lineTo(2, 9 + legSpread * 7)
        ctx.lineTo(6, 14 + legSpread * 10)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(-2, -3)
        ctx.lineTo(-1, -7 - legSpread * 4)
        ctx.lineTo(2, -10 - legSpread * 6)
        ctx.stroke()

        // Hind legs (longer with pollen corbicula highlight)
        ctx.beginPath()
        ctx.moveTo(-9, 4)
        ctx.lineTo(-14, 11 + legSpread * 8)
        ctx.lineTo(-9, 17 + legSpread * 12)
        ctx.stroke()

        // Pollen basket on hind leg
        if (legSpread > 0.4) {
          ctx.beginPath()
          ctx.ellipse(-13, 11 + legSpread * 8, 2.5, 1.8, 0.3, 0, Math.PI * 2)
          ctx.fillStyle = '#F59E0B'
          ctx.fill()
        }

        ctx.beginPath()
        ctx.moveTo(-11, -3)
        ctx.lineTo(-15, -9 - legSpread * 5)
        ctx.lineTo(-12, -14 - legSpread * 7)
        ctx.stroke()

        // --- ABDOMEN (Segmented golden yellow + black stripes) ---
        ctx.save()
        ctx.translate(-16, 0)
        ctx.rotate(-0.09)

        // Abdomen base shape
        ctx.beginPath()
        ctx.ellipse(0, 0, 18, 11, 0, 0, Math.PI * 2)
        const abdGrad = ctx.createRadialGradient(3, -3, 2, 0, 0, 18)
        abdGrad.addColorStop(0, '#FBBF24') // bright golden yellow
        abdGrad.addColorStop(0.45, '#F59E0B') // rich honey amber
        abdGrad.addColorStop(0.85, '#D97706') // deep amber
        abdGrad.addColorStop(1, '#78350F')
        ctx.fillStyle = abdGrad
        ctx.fill()

        // Natural velvet black stripes
        const stripePositions = [-9, -4, 2, 8, 14]
        stripePositions.forEach((sx, idx) => {
          ctx.beginPath()
          const sWidth = idx === 0 ? 4.0 : idx === 4 ? 2.8 : 4.2
          ctx.rect(sx - sWidth / 2, -10.5, sWidth, 21)
          ctx.fillStyle = idx % 2 === 0 ? '#1C1917' : '#292524'
          ctx.fill()

          // Golden fuzz highlight on stripe edges
          ctx.beginPath()
          ctx.moveTo(sx + sWidth / 2, -10)
          ctx.lineTo(sx + sWidth / 2, 10)
          ctx.lineWidth = 0.7
          ctx.strokeStyle = '#FDE68A'
          ctx.stroke()
        })

        // Golden fuzz highlight on abdomen crest
        ctx.beginPath()
        ctx.ellipse(0, -6, 14, 3.5, 0, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(254, 240, 138, 0.5)'
        ctx.fill()

        ctx.restore()

        // --- THORAX (Fuzzy golden-brown coat) ---
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(2, 0, 11.5, 9.5, 0, 0, Math.PI * 2)
        const thxGrad = ctx.createRadialGradient(2, -2, 1, 2, 0, 11.5)
        thxGrad.addColorStop(0, '#D97706')
        thxGrad.addColorStop(0.5, '#78350F')
        thxGrad.addColorStop(1, '#292524')
        ctx.fillStyle = thxGrad
        ctx.fill()

        // Thorax fuzzy hairs texture highlight
        ctx.beginPath()
        ctx.ellipse(2, -3.5, 8, 4, 0, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(251, 191, 36, 0.6)'
        ctx.fill()
        ctx.restore()

        // --- HEAD, ANTENNAE & COMPOUND EYES ---
        ctx.save()
        ctx.translate(13, -0.5)

        // Head base
        ctx.beginPath()
        ctx.ellipse(0, 0, 7, 6.2, 0, 0, Math.PI * 2)
        ctx.fillStyle = '#292524'
        ctx.fill()

        // Compound black eye with morning specular reflection
        ctx.beginPath()
        ctx.ellipse(2.5, -2.8, 3.6, 2.5, 0.4, 0, Math.PI * 2)
        ctx.fillStyle = '#0C0A09'
        ctx.fill()

        // Specular eye catchlight
        ctx.beginPath()
        ctx.arc(3.6, -3.6, 1.0, 0, Math.PI * 2)
        ctx.fillStyle = '#FFFFFF'
        ctx.fill()

        // Antennae (delicate curves)
        ctx.beginPath()
        ctx.moveTo(3.5, -2)
        ctx.bezierCurveTo(8, -7, 10, -11, 14, -12)
        ctx.lineWidth = 1.0
        ctx.strokeStyle = '#1C1917'
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(3.5, -1)
        ctx.bezierCurveTo(8, -4, 11, -8, 15, -8)
        ctx.lineWidth = 1.0
        ctx.strokeStyle = '#1C1917'
        ctx.stroke()
        ctx.restore()

        // --- DETAILED TRANSLUCENT WINGS ---
        const wingFlapPhase = Math.sin(elapsed * wingSpeed)
        const wingRestProgress = Math.max(0, Math.min((elapsed - 2.8) / 0.6, 1))

        // Wing 1 (Forewing top)
        ctx.save()
        ctx.translate(1, -6)
        const flapAngle =
          wingRestProgress > 0.8
            ? -0.22
            : -0.65 + wingFlapPhase * 0.8 * (1 - wingRestProgress)
        ctx.rotate(flapAngle)

        // Wing shape
        ctx.beginPath()
        ctx.ellipse(14, -9, 19, 7.5, -0.4, 0, Math.PI * 2)
        const wingGrad = ctx.createLinearGradient(0, 0, 28, -16)
        wingGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
        wingGrad.addColorStop(0.35, 'rgba(224, 242, 254, 0.75)')
        wingGrad.addColorStop(0.7, 'rgba(254, 243, 199, 0.6)')
        wingGrad.addColorStop(1, 'rgba(255, 255, 255, 0.45)')
        ctx.fillStyle = wingGrad
        ctx.fill()

        // Wing venation
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(28, -14)
        ctx.moveTo(9, -5)
        ctx.lineTo(19, -13)
        ctx.moveTo(14, -7)
        ctx.lineTo(23, -8)
        ctx.lineWidth = 0.7
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)'
        ctx.stroke()
        ctx.restore()

        // Wing 2 (Hindwing lower)
        ctx.save()
        ctx.translate(-2, -5)
        const hindFlapAngle =
          wingRestProgress > 0.8
            ? -0.3
            : -0.85 + Math.sin(elapsed * wingSpeed + 0.3) * 0.7 * (1 - wingRestProgress)
        ctx.rotate(hindFlapAngle)

        ctx.beginPath()
        ctx.ellipse(9, -7, 13, 5.5, -0.4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(19, -9)
        ctx.lineWidth = 0.6
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)'
        ctx.stroke()
        ctx.restore()

        // Wing Motion Blur Ghost during high-speed flight
        if (wingSpeed > 20 && wingRestProgress < 0.5) {
          ctx.save()
          ctx.translate(1, -6)
          ctx.rotate(flapAngle + 0.38)
          ctx.beginPath()
          ctx.ellipse(13, -9, 18, 7, -0.4, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'
          ctx.fill()
          ctx.restore()
        }

        ctx.restore()
      }

      // Check for completion transition
      if (elapsed >= duration && !isEnding) {
        setIsEnding(true)
        setTimeout(() => {
          onComplete()
        }, 400)
      } else {
        animationFrameId = requestAnimationFrame(render)
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [duration, isEnding, onComplete])

  // Clean up Web Audio on unmount
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
      }
    }
  }, [])

  // Timing helpers for DOM elements
  // 0.0 - 0.7s: Garden reveals
  // 0.7 - 2.0s: Bee flies, Logo begins fading in
  // 2.0 - 2.8s: Bee approaches flower, HiveGuard fully visible, Tagline fades in
  // 2.8 - 3.5s: Bee lands, loading bar finishes (100%), final branding clear
  // 3.5 - 3.9s: Hold final frame, smooth transition

  const welcomeOpacity = Math.max(0, Math.min((elapsedTime - 0.5) / 0.6, 1))
  const logoOpacity = Math.max(0, Math.min((elapsedTime - 0.9) / 0.7, 1))
  const subtitleOpacity = Math.max(0, Math.min((elapsedTime - 1.5) / 0.6, 1))
  const taglineOpacity = Math.max(0, Math.min((elapsedTime - 1.9) / 0.6, 1))
  const loadingBarOpacity = Math.max(0, Math.min((elapsedTime - 1.1) / 0.5, 1))

  // Smooth loading progression (0% to 100% between 1.1s and 3.5s)
  const progressPercent = Math.max(0, Math.min(((elapsedTime - 1.1) / 2.4) * 100, 100))

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-600 select-none ${
        isEnding ? 'opacity-0 scale-[1.02] pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #EBF5FC 0%, #FFFDF5 45%, #E8F5E9 100%)',
      }}
    >
      {/* High Performance Canvas Layer (Lighting, Bokeh, Flower, Realistic Honeybee, Particles) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Top Action Bar (Audio Toggle & Skip Button) */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-white/80 shadow-sm text-xs font-medium text-slate-700 hover:bg-white hover:text-amber-700 transition-all duration-200 cursor-pointer"
            title={isMuted ? 'Enable natural ambient audio' : 'Mute audio'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Ambient Sound</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span className="text-amber-700 font-semibold">Audio On</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => {
            if (onSkip) onSkip()
            else onComplete()
          }}
          className="group flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-white/80 shadow-sm text-xs font-semibold text-slate-700 hover:bg-white hover:text-emerald-700 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <span>Skip</span>
          <FastForward className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
        </button>
      </div>

      {/* ========================================== */}
      {/* CENTER BRANDING & TYPOGRAPHY REVEAL LAYER */}
      {/* ========================================== */}
      <div className="relative z-10 max-w-xl mx-auto px-6 text-center pointer-events-none flex flex-col items-center">
        {/* Soft frosted glass ambient backing for clean readability */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/70 backdrop-blur-md border border-white/85 shadow-[0_10px_35px_rgba(0,0,0,0.05)] flex flex-col items-center">
          {/* "Welcome to" */}
          <div
            className="transition-all duration-700 transform"
            style={{
              opacity: welcomeOpacity,
              transform: `translateY(${(1 - welcomeOpacity) * 8}px)`,
            }}
          >
            <span className="inline-block text-xs md:text-sm font-semibold uppercase tracking-[0.28em] text-slate-700 font-display">
              Welcome to
            </span>
          </div>

          {/* Main Logo: “HiveGuard” */}
          <div
            className="my-2 transition-all duration-700 transform"
            style={{
              opacity: logoOpacity,
              transform: `translateY(${(1 - logoOpacity) * 10}px) scale(${0.96 + logoOpacity * 0.04})`,
            }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-display drop-shadow-sm flex items-center justify-center">
              {/* "Hive" in dark green */}
              <span className="text-[#064E3B] transition-colors">Hive</span>
              {/* "Guard" in warm golden-yellow */}
              <span className="text-[#D97706] drop-shadow-[0_4px_16px_rgba(217,119,6,0.35)]">Guard</span>
            </h1>
          </div>

          {/* “SMART BEEHIVE MONITORING” */}
          <div
            className="transition-all duration-700 transform"
            style={{
              opacity: subtitleOpacity,
              transform: `translateY(${(1 - subtitleOpacity) * 6}px)`,
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-amber-600/60" />
              <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-slate-900 font-display">
                Smart Beehive Monitoring
              </p>
              <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-amber-600/60" />
            </div>
          </div>

          {/* Tagline: “Small Wings. A Healthier World.” */}
          <div
            className="mt-3.5 transition-all duration-700 transform"
            style={{
              opacity: taglineOpacity,
              transform: `translateY(${(1 - taglineOpacity) * 6}px)`,
            }}
          >
            <p className="text-sm md:text-base font-semibold text-slate-700 tracking-wide">
              “Small Wings. A Healthier World.”
            </p>
          </div>

          {/* Minimal Elegant Loading Line & Status */}
          <div
            className="mt-8 w-64 md:w-80 transition-all duration-500 transform"
            style={{
              opacity: loadingBarOpacity,
              transform: `translateY(${(1 - loadingBarOpacity) * 8}px)`,
            }}
          >
            {/* Progress Bar Track */}
            <div className="relative h-2 w-full bg-slate-200/90 backdrop-blur-sm rounded-full overflow-hidden p-[1px] border border-white shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-100 ease-out relative shadow-[0_0_8px_rgba(245,158,11,0.6)]"
                style={{ width: `${progressPercent}%` }}
              >
                {/* Luminous leading dot on progress bar */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_6px_#F59E0B]" />
              </div>
            </div>

            {/* Loading status text */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Loading a sweeter future...</span>
              </span>
              <span className="font-mono text-[10px] text-amber-800 font-bold">
                {Math.round(progressPercent)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom environmental aesthetic badge */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-700 text-center pointer-events-none"
        style={{ opacity: Math.max(0, (elapsedTime - 2.5) / 0.8) }}
      >
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/70 text-[10px] text-slate-600 font-medium tracking-wider uppercase shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          AI & IoT Precision Apiculture
        </span>
      </div>
    </div>
  )
}
