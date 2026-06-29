/**
 * Model3DViewer.jsx — v3 "Cinematic Orbital"
 *
 * INSTALLATION:
 *   npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
 */

import { useRef, useState, useEffect, Suspense, Component } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

class GLTFErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.warn("[Model3DViewer] 3D model failed to load:", error.message || error);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/* ══════════════════════════════════════════════════════════
   1.  CAMERA MODEL
   ══════════════════════════════════════════════════════════ */
function CameraModel({ modelPath, isHovered, mousePos }) {
  const groupRef = useRef();
  const { scene }  = useGLTF(modelPath);

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      // Let the original baked texture drive the color — don't override it
      child.material.vertexColors      = false;
      child.material.metalness         = 0.4;   // less metallic = less shine
      child.material.roughness         = 0.30;  // more matte surface
      child.material.envMapIntensity   = 0.3;   // very subtle env reflection
      // No emissive override — texture already has the right color baked in
      child.material.emissiveIntensity = 0;
      child.material.needsUpdate       = true;
      child.castShadow                 = true;
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Slow elegant auto-rotation on Y only (globe-feel handled by orbital rings)
    groupRef.current.rotation.y += delta * 0.25;

    // Mouse tilt — fast & smooth (lerp 0.12)
    if (isHovered) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, mousePos.y * 0.35, 0.12
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z, -mousePos.x * 0.2, 0.12
      );
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, 0, 0.06
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z, 0, 0.06
      );
    }
  });

  return (
    <group ref={groupRef} dispose={null}>
      <primitive object={scene} scale={1} position={[0, -0.15, 0]} />
    </group>
  );
}



/* ══════════════════════════════════════════════════════════
   3.  CINEMATIC LIGHTING
   ══════════════════════════════════════════════════════════ */
function CinematicLighting({ transparent }) {
  return (
    <>
      {/* Key — warm top-left, softer */}
      <directionalLight position={[4, 7, 4]} intensity={transparent ? 1.4 : 1.1} color="#fff8ee" castShadow />
      {/* Fill — cool blue-purple */}
      <directionalLight position={[-5, 3, -3]} intensity={0.3} color="#b0c8ff" />
      {/* Rim — warm orange from below-back */}
      <directionalLight position={[0, -3, -6]} intensity={transparent ? 0.9 : 0.7} color="#d4882a" />
      {/* Top accent */}
      <directionalLight position={[0, 8, 0]} intensity={0.2} color="#ffffff" />
      {/* Ambient */}
      <ambientLight intensity={transparent ? 0.35 : 0.2} />
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   4.  FULL SCENE
   ══════════════════════════════════════════════════════════ */
function Scene({ modelPath, isHovered, mousePos, transparent, setIsLoaded }) {
  const { scene } = useGLTF(modelPath);
  useEffect(() => { setIsLoaded(true); }, []);

  return (
    <>
      <CinematicLighting transparent={transparent} />

      {/* Studio environment for reflections */}
      <Environment preset="night" />

      {/* Subtle float */}
      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.3} floatingRange={[-0.04, 0.04]}>
        <CameraModel modelPath={modelPath} isHovered={isHovered} mousePos={mousePos} />
      </Float>

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.65}
          luminanceSmoothing={0.8}
          intensity={0.8}
          mipmapBlur
          radius={0.5}
        />
      </EffectComposer>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   5.  MAIN EXPORT
   ══════════════════════════════════════════════════════════ */
export default function Model3DViewer({
  modelPath     = "/camera_optimized.glb",
  height        = "600px",
  width         = "100%",
  backgroundColor = "#0a0a0f",
  transparent   = false,
  floatEffect   = true,
  showShadow    = false,
}) {
  const containerRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos,  setMousePos]  = useState({ x: 0, y: 0 });
  const [isLoaded,  setIsLoaded]  = useState(false);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width)  * 2 - 1,
      y: -(((e.clientY - rect.top)  / rect.height) * 2 - 1),
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
      style={{
        width, height,
        position: "relative",
        backgroundColor: transparent ? "transparent" : backgroundColor,
        borderRadius:    transparent ? "0" : "16px",
        overflow:        "hidden",
        cursor:           "none",
        filter:          isHovered && transparent
          ? "drop-shadow(0 0 40px hsl(43 80% 55% / 0.2))"
          : "none",
        transition: "filter 0.4s ease",
      }}
    >
      <Canvas
        style={{ position: "absolute", inset: 0 }}
        camera={{ position: [0, 0.15, 2.4], fov: 42 }}
        shadows
        gl={{
          antialias:           true,
          alpha:               transparent,
          toneMapping:         THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
          outputColorSpace:    THREE.SRGBColorSpace,
        }}
        onCreated={({ gl }) => {
          if (transparent) gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <GLTFErrorBoundary>
            <Scene
              modelPath={modelPath}
              isHovered={isHovered}
              mousePos={mousePos}
              transparent={transparent}
              setIsLoaded={setIsLoaded}
            />
          </GLTFErrorBoundary>
        </Suspense>
      </Canvas>
    </div>
  );
}
