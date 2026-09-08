import React, { useEffect, useRef, useState } from 'react'

interface CinematicIntroProps {
  onComplete: () => void
  onSkip?: () => void
}

// Smooth cubic bezier easing for organic flight
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
}

interface BokehCircle {
  baseX: number
  baseY: number
  radius: number
  color: string
  alpha: number
  speed: number
  offset: number
}

interface MeadowFlower {
  x: number
  y: number
  size: number
  petalColor: string
  centerColor: string
  stemAngle: number
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isEnding, setIsEnding] = useState(false)

  // 2.8 second total cinematic duration (strictly within 2.5 - 3.0s requirement)
  const duration = 2.8

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let startTime: number | null = null

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    // Pre-calculate gentle bokeh lights
    const bokehParticles: BokehCircle[] = []
    const numBokeh = 24
    const bokehPalette = [
      'rgba(254, 243, 199, 0.45)', // Warm morning amber
      'rgba(253, 230, 138, 0.35)', // Golden glow
      'rgba(220, 252, 231, 0.40)', // Meadow green
      'rgba(252, 231, 243, 0.35)', // Soft petal rose
      'rgba(224, 242, 254, 0.45)', // Pale sky blue
      'rgba(255, 255, 255, 0.50)', // Pure sunlight highlight
    ]

    for (let i = 0; i < numBokeh; i++) {
      bokehParticles.push({
        baseX: Math.random() * window.innerWidth,
        baseY: Math.random() * window.innerHeight,
        radius: Math.random() * 50 + 25,
        color: bokehPalette[Math.floor(Math.random() * bokehPalette.length)],
        alpha: Math.random() * 0.35 + 0.15,
        speed: Math.random() * 0.7 + 0.3,
        offset: Math.random() * Math.PI * 2,
      })
    }

    // Small pastel flowers in the meadow background
    const meadowFlowers: MeadowFlower[] = []
    const flowerColors = [
      { petal: '#FBCFE8', center: '#FDE047' }, // pastel pink
      { petal: '#E0E7FF', center: '#FDE047' }, // pastel lilac
      { petal: '#FEF08A', center: '#F59E0B' }, // pastel buttercup
      { petal: '#FED7AA', center: '#EA580C' }, // pastel peach
      { petal: '#FFFFFF', center: '#FACC15' }, // daisy white
    ]
    for (let i = 0; i < 18; i++) {
      const col = flowerColors[Math.floor(Math.random() * flowerColors.length)]
      meadowFlowers.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight - (Math.random() * 70 + 15),
        size: Math.random() * 7 + 6,
        petalColor: col.petal,
        centerColor: col.center,
        stemAngle: (Math.random() - 0.5) * 0.25,
      })
    }

    // Subtle golden trail particles
    const trailParticles: Particle[] = []

    // Ambient floating pollen
    const ambientPollen: Particle[] = []
    for (let i = 0; i < 26; i++) {
      ambientPollen.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.3) * 0.35,
        vy: (Math.random() - 0.5) * 0.2 - 0.05,
        size: Math.random() * 2.2 + 0.9,
        alpha: Math.random() * 0.5 + 0.2,
        maxLife: 9999,
        life: 0,
        color: Math.random() > 0.4 ? 'rgba(245, 158, 11,' : 'rgba(254, 240, 138,',
      })
    }

    // Landing sparkles
    const landingSparkles: Particle[] = []
    let hasTriggeredLanding = false

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000
      setElapsedTime(Math.min(elapsed, duration))

      const rect = canvas.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      ctx.clearRect(0, 0, width, height)

      // ==========================================
      // 1. SOFT MORNING GARDEN BACKGROUND (IMMEDIATE AT 0.0s)
      // ==========================================
      // Pale sky-blue background blending into warm morning sunlight & meadow green
      const skyGrad = ctx.createLinearGradient(0, 0, width * 0.8, height)
      skyGrad.addColorStop(0, '#EAF4FC') // Pale sky blue
      skyGrad.addColorStop(0.32, '#FFFDF6') // Warm morning daylight
      skyGrad.addColorStop(0.72, '#F0F9EE') // Soft natural meadow
      skyGrad.addColorStop(1, '#E4F4E7')

      ctx.fillStyle = skyGrad
      ctx.fillRect(0, 0, width, height)

      // Warm golden sunlight rays from upper-right
      const sunGrad = ctx.createRadialGradient(
        width * 0.85,
        height * 0.06,
        0,
        width * 0.8,
        height * 0.1,
        width * 0.65
      )
      sunGrad.addColorStop(0, 'rgba(254, 243, 199, 0.6)')
      sunGrad.addColorStop(0.3, 'rgba(253, 230, 138, 0.24)')
      sunGrad.addColorStop(0.65, 'rgba(254, 249, 195, 0.08)')
      sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

      ctx.fillStyle = sunGrad
      ctx.fillRect(0, 0, width, height)

      // Gentle Bokeh Orbs
      bokehParticles.forEach(b => {
        const driftX = Math.sin(elapsed * b.speed + b.offset) * 16
        const driftY = Math.cos(elapsed * (b.speed * 0.8) + b.offset) * 12
        const curX = b.baseX + driftX
        const curY = b.baseY + driftY

        const bGrad = ctx.createRadialGradient(curX, curY, 0, curX, curY, b.radius)
        bGrad.addColorStop(0, b.color)
        bGrad.addColorStop(0.7, b.color.replace(/[\d.]+\)$/, `${b.alpha * 0.5})`))
        bGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = bGrad
        ctx.beginPath()
        ctx.arc(curX, curY, b.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Soft Green Rolling Meadow Foliage at the bottom
      ctx.save()
      // Layer 1 - back hill
      ctx.beginPath()
      ctx.moveTo(0, height)
      ctx.lineTo(0, height - 55)
      ctx.bezierCurveTo(width * 0.3, height - 75, width * 0.65, height - 35, width, height - 50)
      ctx.lineTo(width, height)
      ctx.fillStyle = 'rgba(187, 247, 208, 0.45)'
      ctx.fill()

      // Layer 2 - foreground meadow hill
      ctx.beginPath()
      ctx.moveTo(0, height)
      ctx.lineTo(0, height - 32)
      ctx.bezierCurveTo(width * 0.25, height - 48, width * 0.55, height - 20, width, height - 35)
      ctx.lineTo(width, height)
      ctx.fillStyle = 'rgba(134, 239, 172, 0.40)'
      ctx.fill()

      // Small pastel flowers scattered in meadow
      meadowFlowers.forEach(f => {
        ctx.save()
        ctx.translate(f.x, f.y)
        ctx.rotate(f.stemAngle)

        // Tiny stem
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, 14)
        ctx.strokeStyle = '#22C55E'
        ctx.lineWidth = 1.2
        ctx.stroke()

        // 5 small petals
        for (let p = 0; p < 5; p++) {
          const pAngle = (p / 5) * Math.PI * 2
          ctx.beginPath()
          ctx.arc(Math.cos(pAngle) * (f.size * 0.45), Math.sin(pAngle) * (f.size * 0.45), f.size * 0.4, 0, Math.PI * 2)
          ctx.fillStyle = f.petalColor
          ctx.fill()
        }

        // Flower center
        ctx.beginPath()
        ctx.arc(0, 0, f.size * 0.28, 0, Math.PI * 2)
        ctx.fillStyle = f.centerColor
        ctx.fill()

        ctx.restore()
      })

      // Subtle foliage accent in top-right corner
      ctx.beginPath()
      ctx.ellipse(width - 25, 20, 36, 15, -0.35, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(134, 239, 172, 0.30)'
      ctx.fill()
      ctx.restore()

      // Ambient floating pollen
      ambientPollen.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x > width) p.x = 0
        if (p.x < 0) p.x = width
        if (p.y > height) p.y = 0
        if (p.y < 0) p.y = height

        ctx.fillStyle = `${p.color} ${p.alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // ==========================================
      // 2. BEAUTIFUL FLOWER ON THE RIGHT
      // ==========================================
      const flowerX = width > 768 ? width * 0.82 : width * 0.80
      const flowerY = height * 0.58

      // Gentle dynamic spring physics when bee lands at ~1.85s
      let flowerBounce = 0
      let flowerAngle = 0
      if (elapsed >= 1.85) {
        const landingElapsed = elapsed - 1.85
        const decay = Math.exp(-landingElapsed * 3.8)
        flowerBounce = Math.sin(landingElapsed * 11) * 7.5 * decay
        flowerAngle = Math.sin(landingElapsed * 10) * 0.05 * decay

        // 1 or 2 tiny subtle sparkles on landing
        if (!hasTriggeredLanding && landingElapsed > 0.05) {
          hasTriggeredLanding = true
          for (let i = 0; i < 6; i++) {
            const angle = Math.random() * Math.PI * 2
            const spd = Math.random() * 1.8 + 0.6
            landingSparkles.push({
              x: flowerX - 16,
              y: flowerY - 20,
              vx: Math.cos(angle) * spd,
              vy: Math.sin(angle) * spd - 0.7,
              size: Math.random() * 2.2 + 1.0,
              alpha: 0.95,
              maxLife: 0.8,
              life: 0,
              color: 'rgba(245, 158, 11,',
            })
          }
        }
      }

      // Render Primary Flower
      ctx.save()
      ctx.translate(flowerX, flowerY + flowerBounce)
      ctx.rotate(flowerAngle - 0.05)

      // Flower Stem
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.bezierCurveTo(16, 65, -22, 140, -35, height - flowerY + 60)
      ctx.lineWidth = 5.5
      ctx.strokeStyle = '#22C55E'
      ctx.lineCap = 'round'
      ctx.stroke()

      // Leaf on Stem
      ctx.save()
      ctx.translate(-5, 90)
      ctx.rotate(-0.42)
      ctx.beginPath()
      ctx.ellipse(0, 0, 20, 8.5, 0.2, 0, Math.PI * 2)
      ctx.fillStyle = '#16A34A'
      ctx.fill()
      ctx.restore()

      // Layered pastel pink/cream petals
      const numPetals = 8
      const petalRadius = 50
      for (let p = 0; p < numPetals; p++) {
        ctx.save()
        const angle = (p / numPetals) * Math.PI * 2
        ctx.rotate(angle)

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.bezierCurveTo(-14, -16, -17, -petalRadius, 0, -petalRadius - 4)
        ctx.bezierCurveTo(17, -petalRadius, 14, -16, 0, 0)

        const petGrad = ctx.createLinearGradient(0, 0, 0, -petalRadius - 4)
        petGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)')
        petGrad.addColorStop(0.5, 'rgba(255, 241, 242, 0.95)')
        petGrad.addColorStop(0.85, 'rgba(254, 205, 211, 0.90)')
        petGrad.addColorStop(1, 'rgba(244, 114, 182, 0.85)')

        ctx.fillStyle = petGrad
        ctx.shadowColor = 'rgba(244, 114, 182, 0.2)'
        ctx.shadowBlur = 5
        ctx.fill()

        ctx.restore()
      }

      // Flower Center (florets disk)
      const centerGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 17)
      centerGrad.addColorStop(0, '#FEF08A')
      centerGrad.addColorStop(0.4, '#F59E0B')
      centerGrad.addColorStop(0.8, '#D97706')
      centerGrad.addColorStop(1, '#78350F')

      ctx.beginPath()
      ctx.arc(0, 0, 17, 0, Math.PI * 2)
      ctx.fillStyle = centerGrad
      ctx.shadowColor = 'rgba(217, 119, 6, 0.35)'
      ctx.shadowBlur = 8
      ctx.fill()

      // Center Pollen Ring Dots
      for (let s = 0; s < 14; s++) {
        const sAngle = (s / 14) * Math.PI * 2
        const sDist = (s % 2 === 0 ? 7.5 : 11.5)
        const sx = Math.cos(sAngle) * sDist
        const sy = Math.sin(sAngle) * sDist
        ctx.beginPath()
        ctx.arc(sx, sy, 1.3, 0, Math.PI * 2)
        ctx.fillStyle = '#FEF9C3'
        ctx.fill()
      }

      ctx.restore()

      // ==========================================
      // 3. CUTE HONEYBEE FLIGHT & LANDING
      // ==========================================
      let beeX = -80
      let beeY = -80
      let beeAngle = 0
      let beeScale = 1.3
      let wingSpeed = 54
      let beeAlpha = 0
      let legSpread = 0
      let antennaeTwitch = 0

      // Flight trajectory control points (from left to flower on right)
      const p0 = { x: -60, y: height * 0.36 }
      const p1 = { x: width * 0.28, y: height * 0.20 }
      const p2 = { x: width * 0.58, y: height * 0.48 }
      const p3 = { x: flowerX - 16, y: flowerY - 19 }

      if (elapsed < 0.2) {
        beeAlpha = 0
      } else if (elapsed < 1.85) {
        // Flight phase (0.2s -> 1.85s)
        const flightT = (elapsed - 0.2) / 1.65
        const easeT = flightT * flightT * (3 - 2 * flightT)
        const pt = getBezierPoint(easeT, p0, p1, p2, p3)
        const bob = Math.sin(elapsed * 14) * 4.2
        beeX = pt.x
        beeY = pt.y + bob
        beeAngle = pt.angle + Math.sin(elapsed * 9) * 0.05
        beeScale = 1.25 + easeT * 0.08
        beeAlpha = Math.min((elapsed - 0.2) / 0.25, 1)
        wingSpeed = 54
        antennaeTwitch = Math.sin(elapsed * 12) * 0.15

        // Very subtle golden pollen trail
        if (Math.random() > 0.3) {
          trailParticles.push({
            x: beeX - Math.cos(beeAngle) * 15 + (Math.random() - 0.5) * 5,
            y: beeY - Math.sin(beeAngle) * 15 + (Math.random() - 0.5) * 5,
            vx: -Math.cos(beeAngle) * 0.55 + (Math.random() - 0.5) * 0.35,
            vy: -Math.sin(beeAngle) * 0.3 + (Math.random() - 0.5) * 0.35,
            size: Math.random() * 2.2 + 0.9,
            alpha: 0.8,
            maxLife: 0.65,
            life: 0,
            color: 'rgba(245, 158, 11,',
          })
        }
      } else {
        // Landing & sitting on flower (1.85s -> 2.8s)
        const landT = Math.min((elapsed - 1.85) / 0.45, 1)
        beeX = p3.x
        beeY = p3.y + flowerBounce
        beeAngle = -0.1 + flowerAngle * 0.8
        beeScale = 1.33
        beeAlpha = 1
        legSpread = 1.0
        wingSpeed = Math.max(0, (1 - landT) * 10)
        // Gentle antennae movement while resting
        antennaeTwitch = Math.sin((elapsed - 1.85) * 6) * 0.08
      }

      // Draw subtle pollen trail
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

        ctx.fillStyle = `${p.color} ${currentAlpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * (1 - lifeRatio * 0.25), 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw landing sparkles
      for (let i = landingSparkles.length - 1; i >= 0; i--) {
        const p = landingSparkles[i]
        p.life += 1 / 60
        if (p.life >= p.maxLife) {
          landingSparkles.splice(i, 1)
          continue
        }
        p.x += p.vx
        p.y += p.vy
        const lifeRatio = p.life / p.maxLife
        const currentAlpha = (1 - lifeRatio) * p.alpha

        ctx.fillStyle = `${p.color} ${currentAlpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // ==========================================
      // 4. DRAW THE CUTE HONEYBEE
      // ==========================================
      if (beeAlpha > 0) {
        ctx.save()
        ctx.translate(beeX, beeY)
        ctx.rotate(beeAngle)
        ctx.scale(beeScale, beeScale)
        ctx.globalAlpha = beeAlpha

        // Bee soft shadow
        ctx.save()
        ctx.translate(0, 9 + (1 - legSpread) * 4)
        ctx.scale(1, 0.28)
        ctx.beginPath()
        ctx.arc(0, 0, 15, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 0, 0, ${0.16 * (0.4 + legSpread * 0.5)})`
        ctx.fill()
        ctx.restore()

        // 6 Legs
        const legColor = '#27170B'
        ctx.strokeStyle = legColor
        ctx.lineWidth = 1.5
        ctx.lineCap = 'round'

        // Front legs
        ctx.beginPath()
        ctx.moveTo(7, 2)
        ctx.lineTo(11, 5 + legSpread * 5)
        ctx.lineTo(13, 9 + legSpread * 7)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(5, -2)
        ctx.lineTo(8, -5 - legSpread * 3)
        ctx.lineTo(11, -7 - legSpread * 4)
        ctx.stroke()

        // Middle legs
        ctx.beginPath()
        ctx.moveTo(0, 3)
        ctx.lineTo(2, 6 + legSpread * 6)
        ctx.lineTo(5, 10 + legSpread * 8)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(-2, -3)
        ctx.lineTo(-1, -6 - legSpread * 3)
        ctx.lineTo(2, -8 - legSpread * 5)
        ctx.stroke()

        // Hind legs
        ctx.beginPath()
        ctx.moveTo(-7, 3)
        ctx.lineTo(-11, 8 + legSpread * 7)
        ctx.lineTo(-7, 13 + legSpread * 9)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(-9, -3)
        ctx.lineTo(-12, -7 - legSpread * 4)
        ctx.lineTo(-9, -11 - legSpread * 6)
        ctx.stroke()

        // Abdomen (fluffy golden yellow + natural black stripes)
        ctx.save()
        ctx.translate(-14, 0)
        ctx.rotate(-0.06)

        ctx.beginPath()
        ctx.ellipse(0, 0, 16.5, 10, 0, 0, Math.PI * 2)
        const abdGrad = ctx.createRadialGradient(2, -3, 2, 0, 0, 16.5)
        abdGrad.addColorStop(0, '#FBBF24')
        abdGrad.addColorStop(0.45, '#F59E0B')
        abdGrad.addColorStop(0.85, '#D97706')
        abdGrad.addColorStop(1, '#78350F')
        ctx.fillStyle = abdGrad
        ctx.fill()

        // Natural black stripes
        const stripePositions = [-7.5, -2.5, 2.5, 7.5, 11.5]
        stripePositions.forEach((sx, idx) => {
          ctx.beginPath()
          const sWidth = idx === 0 ? 3.6 : idx === 4 ? 2.4 : 3.6
          ctx.rect(sx - sWidth / 2, -9.5, sWidth, 19)
          ctx.fillStyle = idx % 2 === 0 ? '#1C1917' : '#292524'
          ctx.fill()

          ctx.beginPath()
          ctx.moveTo(sx + sWidth / 2, -9)
          ctx.lineTo(sx + sWidth / 2, 9)
          ctx.lineWidth = 0.5
          ctx.strokeStyle = '#FDE68A'
          ctx.stroke()
        })

        // Soft fluffy golden highlight on top of abdomen
        ctx.beginPath()
        ctx.ellipse(0, -5, 12, 2.8, 0, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(254, 240, 138, 0.45)'
        ctx.fill()
        ctx.restore()

        // Thorax (fuzzy warm dark honey brown)
        ctx.save()
        ctx.beginPath()
        ctx.ellipse(2, 0, 10.5, 8.5, 0, 0, Math.PI * 2)
        const thxGrad = ctx.createRadialGradient(2, -2, 1, 2, 0, 10.5)
        thxGrad.addColorStop(0, '#D97706')
        thxGrad.addColorStop(0.5, '#78350F')
        thxGrad.addColorStop(1, '#292524')
        ctx.fillStyle = thxGrad
        ctx.fill()
        ctx.restore()

        // Cute Head & Expressive Eyes
        ctx.save()
        ctx.translate(12, -0.5)
        ctx.beginPath()
        ctx.ellipse(0, 0, 6.8, 5.8, 0, 0, Math.PI * 2)
        ctx.fillStyle = '#292524'
        ctx.fill()

        // Eye with friendly specular catchlight
        ctx.beginPath()
        ctx.ellipse(2.4, -2.4, 3.4, 2.3, 0.4, 0, Math.PI * 2)
        ctx.fillStyle = '#0C0A09'
        ctx.fill()

        ctx.beginPath()
        ctx.arc(3.2, -3.0, 0.95, 0, Math.PI * 2)
        ctx.fillStyle = '#FFFFFF'
        ctx.fill()

        // Antennae (with gentle movement)
        ctx.save()
        ctx.rotate(antennaeTwitch)
        ctx.beginPath()
        ctx.moveTo(3.2, -1.8)
        ctx.bezierCurveTo(7, -5.5, 9.5, -9.5, 12.5, -10.5)
        ctx.lineWidth = 0.95
        ctx.strokeStyle = '#1C1917'
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(3.2, -0.8)
        ctx.bezierCurveTo(7, -2.8, 10, -6.5, 13.5, -6.5)
        ctx.lineWidth = 0.95
        ctx.strokeStyle = '#1C1917'
        ctx.stroke()
        ctx.restore()

        ctx.restore()

        // Translucent Wings with flutter
        const wingFlapPhase = Math.sin(elapsed * wingSpeed)
        const wingRestProgress = Math.max(0, Math.min((elapsed - 1.85) / 0.45, 1))

        // Forewing
        ctx.save()
        ctx.translate(1, -5)
        const flapAngle =
          wingRestProgress > 0.8
            ? -0.2
            : -0.65 + wingFlapPhase * 0.8 * (1 - wingRestProgress)
        ctx.rotate(flapAngle)

        ctx.beginPath()
        ctx.ellipse(12.5, -7.5, 16.5, 6.5, -0.4, 0, Math.PI * 2)
        const wingGrad = ctx.createLinearGradient(0, 0, 25, -13)
        wingGrad.addColorStop(0, 'rgba(255, 255, 255, 0.92)')
        wingGrad.addColorStop(0.35, 'rgba(224, 242, 254, 0.75)')
        wingGrad.addColorStop(0.7, 'rgba(254, 243, 199, 0.60)')
        wingGrad.addColorStop(1, 'rgba(255, 255, 255, 0.45)')
        ctx.fillStyle = wingGrad
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(24, -11)
        ctx.lineWidth = 0.55
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.45)'
        ctx.stroke()
        ctx.restore()

        // Hindwing
        ctx.save()
        ctx.translate(-2, -4)
        const hindFlapAngle =
          wingRestProgress > 0.8
            ? -0.28
            : -0.85 + Math.sin(elapsed * wingSpeed + 0.3) * 0.7 * (1 - wingRestProgress)
        ctx.rotate(hindFlapAngle)

        ctx.beginPath()
        ctx.ellipse(7.5, -5.5, 11.5, 4.8, -0.4, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
        ctx.fill()
        ctx.restore()

        ctx.restore()
      }

      // Smooth transition to website at duration limit
      if (elapsed >= duration && !isEnding) {
        setIsEnding(true)
        setTimeout(() => {
          onComplete()
        }, 350)
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

  // ==========================================
  // TIMING SCHEDULE:
  // 0.0 - 0.5s: Background visible immediately
  // 0.5 - 1.8s: "Welcome to HiveGuard" fades in quickly, followed by "SMART BEEHIVE MONITORING"
  // 1.8 - 2.5s: Bee lands on flower, text fully visible
  // 2.5 - 2.8s: Brief hold, then smooth fade/zoom directly to landing page
  // ==========================================
  const titleOpacity = Math.max(0, Math.min((elapsedTime - 0.4) / 0.6, 1))
  const subtitleOpacity = Math.max(0, Math.min((elapsedTime - 0.85) / 0.55, 1))

  return (
    <div
      onClick={() => {
        setIsEnding(true)
        setTimeout(onComplete, 200)
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-all duration-400 select-none cursor-pointer ${
        isEnding ? 'opacity-0 scale-[1.01] pointer-events-none' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #EAF4FC 0%, #FFFDF6 45%, #E4F4E7 100%)',
      }}
    >
      {/* High-Performance Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* ========================================== */}
      {/* TEXT DIRECTLY OVER NATURAL BACKGROUND */}
      {/* NO BOX, NO CARD, NO CONTAINER, NO OVERLAY */}
      {/* ========================================== */}
      <div className="relative z-10 max-w-xl mx-auto px-6 text-center pointer-events-none flex flex-col items-center">
        {/* "Welcome to HiveGuard" */}
        <div
          className="transition-all duration-500 transform"
          style={{
            opacity: titleOpacity,
            transform: `translateY(${(1 - titleOpacity) * 8}px)`,
          }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display drop-shadow-sm flex items-center justify-center flex-wrap gap-x-2.5">
            <span className="text-slate-800 font-bold">Welcome to</span>
            <span className="inline-flex items-center">
              {/* "Hive" in natural dark green */}
              <span className="text-[#064E3B]">Hive</span>
              {/* "Guard" in warm honey yellow */}
              <span className="text-[#D97706] drop-shadow-[0_2px_10px_rgba(217,119,6,0.3)]">Guard</span>
            </span>
          </h1>
        </div>

        {/* "SMART BEEHIVE MONITORING" */}
        <div
          className="mt-2.5 transition-all duration-500 transform"
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${(1 - subtitleOpacity) * 6}px)`,
          }}
        >
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-slate-700 font-display">
            SMART BEEHIVE MONITORING
          </p>
        </div>
      </div>
    </div>
  )
}
