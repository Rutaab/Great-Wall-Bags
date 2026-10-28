import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, ContactShadows } from '@react-three/drei'
import BagModel from './BagModel'

interface Bag3DViewProps {
  className?: string
  autoRotate?: boolean
  showControls?: boolean
}

const Bag3DView: React.FC<Bag3DViewProps> = ({ className = '', autoRotate = false, showControls = true }) => {
  const [rotating, setRotating] = useState(autoRotate)

  return (
    <div className={`relative w-full h-full min-h-[300px] ${className}`}>
      <Canvas
        camera={{ position: [2.5, 1.8, 2.5], fov: 35, near: 0.1, far: 10 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        frameloop="demand"
        onPointerDown={() => setRotating(false)}
      >
        <Suspense fallback={null}>
          <BagModel rotating={rotating} />
          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.3}
            scale={3}
            blur={3}
            far={0.9}
            frames={1}
          />
          {showControls && (
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={1.5}
              maxDistance={5}
              minPolarAngle={0.3}
              maxPolarAngle={1.8}
              autoRotate={rotating}
              autoRotateSpeed={2}
            />
          )}
        </Suspense>
      </Canvas>

      {/* View controls overlay */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        <button
          onClick={() => setRotating(r => !r)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all text-xs shadow-md ${
            rotating ? 'bg-[#9e3c00] text-white' : 'bg-white text-[#805030]'
          }`}
          title={rotating ? 'Stop rotation' : 'Auto rotate'}
        >
          <span className="material-symbols-outlined text-sm">3d_rotation</span>
        </button>
        <button
          onClick={() => setRotating(false)}
          className="w-8 h-8 rounded-full bg-white text-[#805030] flex items-center justify-center shadow-md hover:bg-[#fff4f0] transition-all text-xs"
          title="Reset view"
        >
          <span className="material-symbols-outlined text-sm">center_focus_strong</span>
        </button>
      </div>
    </div>
  )
}

export default Bag3DView
