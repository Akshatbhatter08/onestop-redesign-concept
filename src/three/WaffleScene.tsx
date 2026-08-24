import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Float,
  Lightformer,
  PerformanceMonitor,
  Sparkles,
} from '@react-three/drei'
import type { MotionValue } from 'framer-motion'
import { WaffleGLTF } from './WaffleGLTF'

export type WaffleSceneProps = {
  /**
   * 0 → 1 as the hero scrolls away. Read once per frame inside `useFrame`, so
   * scroll parallax never triggers a React render.
   */
  scroll: MotionValue<number>
  /** Halt the render loop entirely once the hero is off-screen. */
  active: boolean
  /**
   * Which hero layout the DOM is in — see Hero.tsx.
   *
   * `phone`: stacked band on a tall phone, waffle overlapping the CTAs.
   * `tablet`: stacked band on portrait tablet, waffle in the lower canvas.
   * `wide`: still under `lg`, but landscape — waffle sits in the right half.
   * `side`: copy left, waffle filling the right column (`lg` / 1024px+).
   */
  layout: 'phone' | 'tablet' | 'wide' | 'side'
}

/**
 * Width of the waffle's envelope, in world units.
 *
 * Sized close to the spinning diagonal (~3.85) so the model fills its column
 * instead of floating in a halo of empty canvas.
 */
const ENVELOPE = 3.2

/** Sit in the lower phone band, clear of the body copy. */
const BAND_Y_PHONE = -0.28
/** Tablet portrait band: slightly above centre of the lower canvas. */
const BAND_Y_TABLET = 0.12
/** Landscape band: waffle lives in the right half, beside the copy. */
const BAND_Y_WIDE = 0.18
/**
 * Side column: a hair above centre so the contact shadow still grounds it
 * without leaving a vacant strip over the waffle.
 */
const SIDE_Y = 0.1
/** Small lift of the waffle inside the spin/tilt group. */
const MODEL_Y = 0.08
/**
 * Resting camera-relative pose: a shallow three-quarter, looking slightly down
 * onto the grid (food-shot angle) rather than a flat side-on slab.
 * 0.58 rad ≈ 33° pitch; 0.62 rad ≈ 35° yaw so a corner faces the camera.
 */
const REST_TILT_X = 0.58
const REST_YAW = 0.62

/** Radians per pixel while dragging. Yaw is a bit hungrier than pitch. */
const YAW_PER_PX = 0.0055
const PITCH_PER_PX = 0.0032
/** How far a touch must travel before we commit to rotate vs. page-scroll. */
const AXIS_LOCK_PX = 8
/** Manual pitch clamp — past ~0.45 the camera starts reading the underside. */
const PITCH_MAX = 0.42
const VEL_MAX = 5.2
const VEL_DEADZONE = 0.012

type DragAxis = 'pending' | 'rotate'

type DragSession = {
  pointerId: number
  axis: DragAxis
  startX: number
  startY: number
  lastX: number
  lastY: number
  lastT: number
}

/**
 * Pointer-drag on the canvas: rotate the waffle, then coast with a short
 * inertia decay. Touch is axis-locked so a vertical swipe still scrolls the
 * page (`touch-action: pan-y` is the CSS half of that contract).
 */
function useWaffleDrag() {
  const gl = useThree((s) => s.gl)
  const session = useRef<DragSession | null>(null)
  const yaw = useRef(0)
  const pitch = useRef(0)
  const velYaw = useRef(0)
  const velPitch = useRef(0)
  const grabbing = useRef(false)

  useEffect(() => {
    const el = gl.domElement
    el.style.touchAction = 'pan-y'
    el.style.cursor = 'grab'
    el.style.userSelect = 'none'

    const applyDelta = (dx: number, dy: number, dt: number) => {
      yaw.current += dx * YAW_PER_PX
      pitch.current = THREE.MathUtils.clamp(
        pitch.current + dy * PITCH_PER_PX,
        -PITCH_MAX,
        PITCH_MAX,
      )
      if (dt <= 0 || dt > 0.08) return
      const nextYaw = THREE.MathUtils.clamp((dx * YAW_PER_PX) / dt, -VEL_MAX, VEL_MAX)
      const nextPitch = THREE.MathUtils.clamp((dy * PITCH_PER_PX) / dt, -VEL_MAX, VEL_MAX)
      velYaw.current = velYaw.current * 0.55 + nextYaw * 0.45
      velPitch.current = velPitch.current * 0.55 + nextPitch * 0.45
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      if (session.current) return

      const touch = e.pointerType === 'touch'
      session.current = {
        pointerId: e.pointerId,
        axis: touch ? 'pending' : 'rotate',
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        lastT: performance.now(),
      }
      velYaw.current = 0
      velPitch.current = 0

      // Mouse can capture immediately. Touch waits for the axis lock so a
      // vertical flick is still a page scroll, not a captured rotate.
      if (!touch) {
        grabbing.current = true
        el.setPointerCapture(e.pointerId)
        el.style.cursor = 'grabbing'
      }
    }

    const onMove = (e: PointerEvent) => {
      const drag = session.current
      if (!drag || e.pointerId !== drag.pointerId) return

      if (drag.axis === 'pending') {
        const adx = Math.abs(e.clientX - drag.startX)
        const ady = Math.abs(e.clientY - drag.startY)
        if (adx < AXIS_LOCK_PX && ady < AXIS_LOCK_PX) return
        // Vertical-dominant: drop the session and let the browser scroll.
        if (ady >= adx) {
          session.current = null
          grabbing.current = false
          return
        }
        drag.axis = 'rotate'
        grabbing.current = true
        el.setPointerCapture(e.pointerId)
      }

      if (drag.axis !== 'rotate') return
      e.preventDefault()

      const now = performance.now()
      applyDelta(e.clientX - drag.lastX, e.clientY - drag.lastY, (now - drag.lastT) / 1000)
      drag.lastX = e.clientX
      drag.lastY = e.clientY
      drag.lastT = now
    }

    const onUp = (e: PointerEvent) => {
      const drag = session.current
      if (!drag || e.pointerId !== drag.pointerId) return
      if (drag.axis === 'rotate' && el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId)
      }
      // A pause before release is a stop, not a flick.
      if (performance.now() - drag.lastT > 80) {
        velYaw.current = 0
        velPitch.current = 0
      }
      session.current = null
      grabbing.current = false
      el.style.cursor = 'grab'
    }

    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove, { passive: false })
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)

    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [gl])

  return { yaw, pitch, velYaw, velPitch, grabbing }
}

function Rig({
  scroll,
  layout,
}: {
  scroll: MotionValue<number>
  layout: WaffleSceneProps['layout']
}) {
  const rig = useRef<THREE.Group>(null)
  const spinner = useRef<THREE.Group>(null)
  const tilt = useRef<THREE.Group>(null)
  const spin = useRef(0)
  const pointer = useRef({ x: 0, y: 0 })
  const { yaw, pitch, velYaw, velPitch, grabbing } = useWaffleDrag()

  // Cursor lean still reads from the window — the canvas only captures when
  // the visitor is actually dragging the waffle.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const viewport = useThree((s) => s.viewport)

  useFrame((_, delta) => {
    const r = rig.current
    const s = spinner.current
    const t = tilt.current
    if (!r || !s || !t) return

    // Clamp delta: a backgrounded tab otherwise returns a huge first frame and
    // the waffle snaps a quarter-turn.
    const d = Math.min(delta, 0.05)
    const p = scroll.get()
    const held = grabbing.current

    // Fit the model to whatever box it's been given (390px → 1440px+).
    const visW = viewport.width
    const visH = viewport.height
    const side = layout === 'side'
    const wideBand = layout === 'wide'
    const tabletBand = layout === 'tablet'

    const fit = side
      ? Math.min(1.02, (visW * 1.02) / ENVELOPE, (visH * 0.82) / ENVELOPE)
      : Math.min(
          wideBand ? 0.92 : tabletBand ? 0.9 : 0.98,
          (visW * (wideBand ? 0.95 : tabletBand ? 1.42 : 1.78)) / ENVELOPE,
          (visH * (wideBand ? 0.92 : 0.98)) / ENVELOPE,
        )

    // --- Pose ---
    // Phone: overlap the CTAs and fill down to the fold.
    // Tablet portrait: sit in the lower canvas, clear of the copy.
    // Landscape band: slide into the empty right half beside the copy.
    // Side: sit a little right of column-centre so the syrup isn't stranded
    // in a left-weighted gap.
    r.position.x = wideBand ? visW * 0.16 : side ? visW * 0.06 : 0
    r.position.y =
      (side
        ? SIDE_Y
        : wideBand
          ? BAND_Y_WIDE
          : tabletBand
            ? BAND_Y_TABLET
            : BAND_Y_PHONE) - p * 1.65
    r.scale.setScalar(fit * (1 - p * 0.2))

    // --- Manual drag + inertia, then idle spin fades back in ---
    if (!held) {
      yaw.current += velYaw.current * d
      pitch.current = THREE.MathUtils.clamp(pitch.current + velPitch.current * d, -PITCH_MAX, PITCH_MAX)
      velYaw.current = THREE.MathUtils.damp(velYaw.current, 0, 2.4, d)
      velPitch.current = THREE.MathUtils.damp(velPitch.current, 0, 2.8, d)
      if (Math.abs(velYaw.current) < VEL_DEADZONE) velYaw.current = 0
      if (Math.abs(velPitch.current) < VEL_DEADZONE) velPitch.current = 0
    }

    const coast = Math.hypot(velYaw.current, velPitch.current)
    const idle = held ? 0 : 1 - Math.min(1, coast / 1.4)
    spin.current += d * 0.26 * idle

    // --- Continuous turn, accelerated by scroll, offset by the drag ---
    // Pitched so the camera reads the pocketed top face (a slight 3/4 overhead),
    // not a flat side profile. Idle spin + drag yaw still orbit around that.
    s.rotation.y = spin.current + REST_YAW + p * 1.7 + yaw.current
    s.rotation.x = THREE.MathUtils.clamp(
      REST_TILT_X - p * 0.16 + pitch.current,
      0.28,
      0.72,
    )

    // --- Damped cursor lean, composed on top of the spin ---
    // Parked while the visitor is dragging so the two inputs don't fight.
    const lean = held ? 0 : 1
    t.rotation.z = THREE.MathUtils.damp(t.rotation.z, -pointer.current.x * 0.1 * lean, 4, d)
    t.rotation.x = THREE.MathUtils.damp(t.rotation.x, pointer.current.y * 0.08 * lean, 4, d)
  })

  return (
    <group ref={rig}>
      <group ref={spinner}>
        <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.7} floatingRange={[-0.08, 0.1]}>
          <group ref={tilt} position={[0, MODEL_Y, 0]}>
            <WaffleGLTF />
          </group>
        </Float>
      </group>

      {/* Sugar dust — one draw call, points-based. */}
      <Sparkles
        count={22}
        scale={[4.4, 2.9, 3.2]}
        size={2.8}
        speed={0.32}
        noise={0.35}
        color="#FFE7A8"
        opacity={0.6}
      />

      <ContactShadows
        position={[0, -1.4 + MODEL_Y, 0]}
        scale={7}
        blur={2.9}
        far={2.7}
        opacity={0.36}
        resolution={256}
        color="#5A351E"
      />
    </group>
  )
}

/**
 * The 3D hero.
 *
 * Loaded as its own lazy chunk (three.js never touches the critical path) and
 * only mounted after the capability probe passes — see Hero.tsx.
 *
 * Lighting is a fully procedural Lightformer environment baked once
 * (`frames={1}`), so the glossy syrup gets real reflections with zero HDR
 * downloads.
 */
export default function WaffleScene({ scroll, active, layout }: WaffleSceneProps) {
  const [dpr, setDpr] = useState(1.6)

  return (
    <Canvas
      // `never` fully parks the rAF loop once the hero leaves the viewport, so
      // the GPU is idle while the visitor reads the menu.
      frameloop={active ? 'always' : 'never'}
      dpr={dpr}
      camera={{ position: [0, 0.3, 5.4], fov: 30, near: 0.5, far: 26 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.NeutralToneMapping,
        toneMappingExposure: 1.06,
      }}
      // Don't re-measure on scroll — that's a forced layout on every frame.
      resize={{ scroll: false, debounce: { scroll: 60, resize: 0 } }}
      // `pan-y` keeps vertical page-scroll on touch; horizontal drags rotate.
      style={{ touchAction: 'pan-y', cursor: 'grab' }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.7)}
        threshold={0.7}
      />

      <ambientLight intensity={0.5} />
      <directionalLight position={[4.5, 6.5, 4]} intensity={2} color="#FFF0D4" />
      <directionalLight position={[-5, 2, -3.5]} intensity={0.7} color="#FFC98A" />
      <directionalLight position={[0, -2, 3]} intensity={0.35} color="#FFE9C9" />

      <Environment resolution={160} frames={1} background={false} environmentIntensity={0.9}>
        <Lightformer
          form="rect"
          intensity={2.6}
          color="#FFF2DA"
          position={[0, 5, 2]}
          scale={[9, 4, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          color="#FFCB6B"
          position={[-5.5, 1.2, 2]}
          scale={[4, 6, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1}
          color="#FF9FAC"
          position={[5.5, 0.6, 1.5]}
          scale={[4, 6, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="circle"
          intensity={0.9}
          color="#FFF8EC"
          position={[0, -3.5, 4]}
          scale={7}
          target={[0, 0, 0]}
        />
      </Environment>

      <Rig scroll={scroll} layout={layout} />
    </Canvas>
  )
}
