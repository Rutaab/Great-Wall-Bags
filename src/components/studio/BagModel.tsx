import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { useCustomization } from '../../contexts/CustomizationContext'

interface BagModelProps {
  rotating?: boolean
}

const BagModel: React.FC<BagModelProps> = React.memo(({ rotating }) => {
  const { state } = useCustomization()
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (rotating && groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }
  })

  const hardwareColor = useMemo(() => {
    const map: Record<string, string> = {
      gold: '#D4A017', silver: '#C0C0C0', 'matte-black': '#2F2F2F',
      brass: '#B5A642', 'rose-gold': '#B76E79',
    }
    return map[state.hardwareFinish] || '#D4A017'
  }, [state.hardwareFinish])

  const materialProps = useMemo(() => {
    const roughnessMap: Record<string, number> = {
      'full-grain': 0.7, 'top-grain': 0.6, saffiano: 0.8,
      suede: 0.9, canvas: 0.85, 'vegan-leather': 0.5,
    }
    return {
      roughness: roughnessMap[state.exteriorMaterial] || 0.7,
      clearcoat: state.exteriorMaterial === 'vegan-leather' ? 0.3 : 0.05,
    }
  }, [state.exteriorMaterial])

  const bodyColor = useMemo(() => new THREE.Color(state.exteriorColor), [state.exteriorColor])
  const interiorColorObj = useMemo(() => new THREE.Color(state.interiorColor), [state.interiorColor])
  const hardwareColorObj = useMemo(() => new THREE.Color(hardwareColor), [hardwareColor])

  const dims = useMemo(() => {
    const map: Record<string, { w: number; h: number; d: number }> = {
      tote: { w: 1.2, h: 1.0, d: 0.6 },
      crossbody: { w: 1.1, h: 0.9, d: 0.5 },
      backpack: { w: 1.0, h: 1.4, d: 0.7 },
      clutch: { w: 1.6, h: 0.6, d: 0.4 },
    }
    return map[state.bagShape] || map.tote
  }, [state.bagShape])

  const handlePositions = useMemo(() => {
    if (state.bagShape === 'clutch') return []
    if (state.bagShape === 'backpack') {
      return [
        { pos: [-0.3, dims.h / 2 + 0.05, 0] as [number, number, number], rot: [0, 0, 0.2] as [number, number, number] },
        { pos: [0.3, dims.h / 2 + 0.05, 0] as [number, number, number], rot: [0, 0, -0.2] as [number, number, number] },
      ]
    }
    return [{ pos: [0, dims.h / 2 + 0.05, 0] as [number, number, number], rot: [0, 0, 0] as [number, number, number] }]
  }, [state.bagShape, dims.h])

  const handleCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(-0.25, dims.h / 2, 0),
      new THREE.Vector3(-0.3, dims.h / 2 + 0.4, 0),
      new THREE.Vector3(0, dims.h / 2 + 0.55, 0),
      new THREE.Vector3(0.3, dims.h / 2 + 0.4, 0),
      new THREE.Vector3(0.25, dims.h / 2, 0),
    ]
    return new THREE.CatmullRomCurve3(points)
  }, [dims.h])

  const strapCurve = useMemo(() => {
    if (state.strapType === 'standard') return null
    const len = state.bagShape === 'crossbody' ? 1.2 : 0.9
    const points = [
      new THREE.Vector3(0, dims.h / 2 + 0.1, -dims.d / 2),
      new THREE.Vector3(0.4, dims.h / 2 + len, -dims.d / 2 - 0.1),
      new THREE.Vector3(0.7, dims.h / 2 + len * 0.6, -dims.d / 2 - 0.2),
      new THREE.Vector3(0.7, -dims.h / 2 + 0.1, -dims.d / 2 - 0.1),
      new THREE.Vector3(0.7, -dims.h / 2 - 0.1, -dims.d / 2),
    ]
    return new THREE.CatmullRomCurve3(points)
  }, [dims.h, dims.d, state.bagShape, state.strapType])

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.0} />
      <directionalLight position={[-3, 4, -3]} intensity={0.3} />
      <hemisphereLight args={['#ffd4bb', '#805030', 0.2]} />

      {/* Main body */}
      <RoundedBox args={[dims.w, dims.h, dims.d]} radius={0.08} smoothness={3}>
        <meshPhysicalMaterial
          color={bodyColor}
          roughness={materialProps.roughness}
          metalness={0.02}
          clearcoat={materialProps.clearcoat}
          clearcoatRoughness={0.4}
        />
      </RoundedBox>

      {/* Interior lip (top rim visible inside) */}
      <mesh position={[0, dims.h / 2 - 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[dims.w * 0.4, dims.w * 0.48, 24]} />
        <meshPhysicalMaterial color={interiorColorObj} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Front pocket */}
      {state.bagShape !== 'clutch' && (
        <RoundedBox
          args={[dims.w * 0.7, dims.h * 0.35, 0.04]}
          position={[0, -dims.h * 0.12, dims.d / 2 + 0.025]}
          radius={0.04}
          smoothness={2}
        >
          <meshPhysicalMaterial color={bodyColor} roughness={materialProps.roughness} metalness={0.01} />
        </RoundedBox>
      )}

      {/* Hardware rivets at handle attachments */}
      {handlePositions.map((h, i) => (
        <group key={i} position={h.pos} rotation={h.rot}>
          <mesh position={[0, 0, dims.d / 2]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshPhysicalMaterial color={hardwareColorObj} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, -dims.d / 2]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshPhysicalMaterial color={hardwareColorObj} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Handle */}
      {state.bagShape !== 'clutch' && (
        <mesh>
          <tubeGeometry args={[handleCurve, 16, 0.035, 6, false]} />
          <meshPhysicalMaterial color={bodyColor} roughness={materialProps.roughness} metalness={0.01} />
        </mesh>
      )}

      {/* Crossbody strap */}
      {state.strapType !== 'standard' && strapCurve && (
        <mesh>
          <tubeGeometry args={[strapCurve, 20, 0.025, 5, false]} />
          <meshPhysicalMaterial
            color={state.strapType === 'chain' ? hardwareColorObj : bodyColor}
            roughness={state.strapType === 'chain' ? 0.2 : materialProps.roughness}
            metalness={state.strapType === 'chain' ? 0.8 : 0.01}
          />
        </mesh>
      )}

      {/* Bottom feet (hardware) */}
      {[
        [-0.3, -dims.h / 2, -0.2],
        [0.3, -dims.h / 2, -0.2],
        [-0.3, -dims.h / 2, 0.2],
        [0.3, -dims.h / 2, 0.2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshPhysicalMaterial color={hardwareColorObj} metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* Monogram */}
      {state.monogramText && (
        <group position={[0, dims.h / 2 - 0.2, dims.d / 2 + 0.005]}>
          <mesh>
            <planeGeometry args={[0.5, 0.2]} />
            <meshBasicMaterial color={hardwareColor} transparent opacity={0.3} />
          </mesh>
        </group>
      )}
    </group>
  )
})

BagModel.displayName = 'BagModel'

export default BagModel
