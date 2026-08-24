import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

/**
 * The hero waffle, loaded from a custom glTF instead of built procedurally.
 *
 * Model: "Belgian waffles draft" by **Rixael** (Sketchfab), licensed
 * **CC-BY-4.0** — attribution is required wherever this ships. See the Credits
 * note in the README.
 * https://sketchfab.com/3d-models/belgian-waffles-draft-a8d00d5e6f6f4703ae41fd146025cd2c
 *
 * It's fully self-contained: waffle segments with baked-in toast variation, the
 * syrup drizzle, and a butter pat are all part of the mesh — which is why the
 * old procedural `Syrup` and `Garnish` came out of the scene rather than sitting
 * on top of it.
 */
const MODEL_URL = '/models/scene.gltf'

/**
 * Target footprint in world units — the widest horizontal axis is scaled to
 * this. It's the old procedural slab's width (`SLAB_W`), on purpose: the rig
 * frames itself against a fixed `ENVELOPE`, so matching that width drops the
 * model into the exact box the whole procedural assembly used to fill, and the
 * camera, vertical offsets, and scroll parallax all carry over untouched.
 */
const TARGET_SIZE = 2.72

export function WaffleGLTF() {
  const { scene } = useGLTF(MODEL_URL)

  const { object, scale } = useMemo(() => {
    // `useGLTF` caches and shares the loaded graph by URL. Clone before we touch
    // any transform so a second mount (or a future second use) gets a clean copy
    // — geometries and materials stay shared with the cache, which is what we
    // want: they're never disposed here, so the cache stays valid.
    const object = scene.clone(true)

    // The export carries Sketchfab's FBX→glTF conversion matrices (a Y/Z axis
    // flip plus an offset) and its origin sits at a corner, so the raw accessor
    // bounds mean nothing in world space. Measure the *actual* box after every
    // baked transform is applied, recenter it on the origin, and scale the wider
    // of the two horizontal axes to `TARGET_SIZE`.
    //
    // Recentring on the parent's child (not the scaling group itself) is
    // deliberate: the outer group's `scale` multiplies this offset too, so the
    // measured centre lands exactly at the origin the rig spins around. Center
    // the corner instead and the model would orbit its own edge.
    const box = new THREE.Box3().setFromObject(object)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    object.position.sub(center)
    const scale = TARGET_SIZE / Math.max(size.x, size.z)

    // We light the scene with a Lightformer environment + a ground
    // `ContactShadows`, so the mesh itself neither casts nor receives real
    // shadows. Absolute assignments only — this runs twice under StrictMode and
    // must stay idempotent (no `*=` creep on the shared materials).
    object.traverse((node) => {
      const mesh = node as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = false
      mesh.receiveShadow = false
    })

    return { object, scale }
  }, [scene])

  return (
    <group scale={scale}>
      <primitive object={object} />
    </group>
  )
}

// Warm the fetch as soon as this lazy chunk evaluates, so the model is usually
// decoded by the time the capability probe flips the hero to 3D.
useGLTF.preload(MODEL_URL)
