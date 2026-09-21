import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getImageUrl } from '../../services/api';
import {
  RotateCcw,
  Sparkles,
  Sun,
  Sunset,
  Zap,
  Maximize2,
  Minimize2,
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  Info
} from 'lucide-react';

/**
 * Product3DViewer
 * Renders an interactive 3D WebGL showcase of any grocery product with Three.js.
 * Supports 360° orbital rotation, realistic material shaders, studio lighting rigs,
 * floating callout pins, auto-spin, and full interactive control.
 */
export const Product3DViewer = ({
  product,
  height = '420px',
  interactive = true,
  showControls = true,
  autoRotateDefault = true,
  className = '',
  onFullscreenToggle = null,
  isFullscreen = false
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const modelGroupRef = useRef(null);
  const lightsGroupRef = useRef(null);
  const reqAnimRef = useRef(null);

  const [isAutoRotating, setIsAutoRotating] = useState(autoRotateDefault);
  const [lightPreset, setLightPreset] = useState('studio'); // 'studio' | 'sunset' | 'emerald' | 'daylight'
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hotspotPositions, setHotspotPositions] = useState([]);

  const imageUrl = getImageUrl(product?.image);

  // Setup Three.js Scene, Camera, Lighting, Mesh & Controls
  useEffect(() => {
    if (!mountRef.current || !product) return;

    const width = mountRef.current.clientWidth || 400;
    const heightPx = mountRef.current.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(0, 1.2, 3.8);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing and tone mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 1.8;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't flip upside down
    controls.minPolarAngle = 0.1;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 2.0;
    controlsRef.current = controls;

    // 5. Lights Group
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;

    // 6. Model Group (Product + Stage)
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Create 3D Pedestal Stage
    const stageGroup = new THREE.Group();
    modelGroup.add(stageGroup);

    // Glowing Neon Ring Base
    const ringGeo = new THREE.RingGeometry(1.25, 1.35, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = -0.98;
    stageGroup.add(ringMesh);

    // Podium Cylinder
    const podiumGeo = new THREE.CylinderGeometry(1.3, 1.4, 0.25, 48);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.3,
      metalness: 0.8,
      flatShading: false
    });
    const podiumMesh = new THREE.Mesh(podiumGeo, podiumMat);
    podiumMesh.position.y = -1.12;
    podiumMesh.receiveShadow = true;
    stageGroup.add(podiumMesh);

    // Ground Shadow Catcher
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.25;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // 7. Load Product Texture & Build 3D Geometric Mesh
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    textureLoader.load(
      imageUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = true;
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        // Build product mesh based on category
        const productCategory = (product.category || '').toLowerCase();
        let productMesh;

        if (
          productCategory.includes('beverage') ||
          productCategory.includes('drink') ||
          productCategory.includes('juice') ||
          productCategory.includes('oil')
        ) {
          // 3D Beverage Bottle / Can Mesh
          const canGroup = new THREE.Group();
          const canBodyGeo = new THREE.CylinderGeometry(0.62, 0.62, 1.4, 36);

          const canLabelMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.25,
            metalness: 0.3,
            bumpScale: 0.05
          });

          const metalMat = new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            metalness: 0.9,
            roughness: 0.15
          });

          const canBody = new THREE.Mesh(canBodyGeo, [canLabelMat, metalMat, metalMat]);
          canBody.castShadow = true;
          canGroup.add(canBody);

          // Top Neck and Cap
          const neckGeo = new THREE.CylinderGeometry(0.3, 0.62, 0.25, 36);
          const neckMesh = new THREE.Mesh(neckGeo, metalMat);
          neckMesh.position.y = 0.82;
          canGroup.add(neckMesh);

          const capGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.15, 36);
          const capMesh = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.4, roughness: 0.3 }));
          capMesh.position.y = 0.98;
          canGroup.add(capMesh);

          productMesh = canGroup;
        } else if (
          productCategory.includes('fruit') ||
          productCategory.includes('vegetable') ||
          productCategory.includes('fresh') ||
          productCategory.includes('produce')
        ) {
          // 3D Organic Produce Display
          const produceGroup = new THREE.Group();

          // Organic 3D Sphere / Apple form
          const sphereGeo = new THREE.SphereGeometry(0.78, 48, 48);
          // Slightly stretch for organic feel
          sphereGeo.scale(1, 0.95, 1);

          const produceMat = new THREE.MeshPhysicalMaterial({
            map: texture,
            roughness: 0.35,
            metalness: 0.05,
            clearcoat: 0.4,
            clearcoatRoughness: 0.15,
            reflectivity: 0.6
          });

          const sphereMesh = new THREE.Mesh(sphereGeo, produceMat);
          sphereMesh.castShadow = true;
          produceGroup.add(sphereMesh);

          // Organic Stem / Leaf on top
          const stemGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.22, 12);
          const stemMat = new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.8 });
          const stemMesh = new THREE.Mesh(stemGeo, stemMat);
          stemMesh.position.y = 0.82;
          stemMesh.rotation.z = -0.2;
          produceGroup.add(stemMesh);

          productMesh = produceGroup;
        } else {
          // 3D Packaged Box / Carton / Grocery Pouch
          const boxGroup = new THREE.Group();
          const boxGeo = new THREE.BoxGeometry(1.05, 1.45, 0.65);

          // Front and Back face get the texture, sides get matching theme
          const sideMat = new THREE.MeshStandardMaterial({
            color: 0x059669,
            roughness: 0.35,
            metalness: 0.1
          });

          const topBottomMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.4,
            metalness: 0.05
          });

          const faceMat = new THREE.MeshPhysicalMaterial({
            map: texture,
            roughness: 0.28,
            metalness: 0.12,
            clearcoat: 0.35,
            clearcoatRoughness: 0.2
          });

          const materials = [
            sideMat, // Right
            sideMat, // Left
            topBottomMat, // Top
            topBottomMat, // Bottom
            faceMat, // Front
            faceMat // Back
          ];

          const boxMesh = new THREE.Mesh(boxGeo, materials);
          boxMesh.castShadow = true;
          boxGroup.add(boxMesh);

          productMesh = boxGroup;
        }

        productMesh.position.y = -0.1;
        modelGroup.add(productMesh);
        setIsLoading(false);
      },
      undefined,
      (err) => {
        console.warn('3D Texture load fallback', err);
        // Fallback procedural box
        const fallbackGeo = new THREE.BoxGeometry(1.1, 1.4, 0.6);
        const fallbackMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          roughness: 0.3,
          metalness: 0.2
        });
        const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
        fallbackMesh.position.y = -0.1;
        fallbackMesh.castShadow = true;
        modelGroup.add(fallbackMesh);
        setIsLoading(false);
      }
    );

    // 8. Floating 3D Sparkle Dust Particles
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 4;
      particlePositions[i + 1] = (Math.random() - 0.5) * 3 + 0.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // 9. Resize Observer
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 10. Hotspots 3D Anchor Points
    const hotspotWorldPoints = [
      { id: 'freshness', pos: new THREE.Vector3(-0.6, 0.6, 0.4), title: '🌿 100% Quality Check', desc: 'Sourced directly from verified organic farms' },
      { id: 'price', pos: new THREE.Vector3(0.65, 0.2, 0.35), title: `🏷️ Best Price ₹${product.discountPrice || product.price}`, desc: 'Guaranteed best local price match' },
      { id: 'delivery', pos: new THREE.Vector3(0.0, -0.6, 0.5), title: '⚡ 10-Min Delivery', desc: 'Packed fresh & delivered in temperature-safe bags' }
    ];

    // 11. Animation Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      reqAnimRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Gentle floating animation
      if (modelGroupRef.current) {
        modelGroupRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.04;
      }

      // Rotating sparkle particles
      particlePoints.rotation.y = elapsedTime * 0.08;

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Calculate 2D Screen Positions for Hotspots
      if (mountRef.current && cameraRef.current) {
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        const newPositions = hotspotWorldPoints.map((hp) => {
          const v = hp.pos.clone();
          if (modelGroupRef.current) {
            v.applyMatrix4(modelGroupRef.current.matrixWorld);
          }
          v.project(cameraRef.current);

          // Check if behind camera
          const isVisible = v.z < 1;
          const x = ((v.x + 1) * w) / 2;
          const y = ((-v.y + 1) * h) / 2;

          return {
            ...hp,
            x,
            y,
            visible: isVisible && x > 20 && x < w - 20 && y > 20 && y < h - 20
          };
        });
        setHotspotPositions(newPositions);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.domElement.remove();
      }
      renderer.dispose();
    };
  }, [product, imageUrl]);

  // Handle Dynamic Studio Lighting Presets
  useEffect(() => {
    if (!lightsGroupRef.current) return;
    const group = lightsGroupRef.current;
    // Clear old lights
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    if (lightPreset === 'studio') {
      // High-End Studio Setup
      const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
      group.add(ambLight);

      const mainSpot = new THREE.SpotLight(0xffffff, 3.2, 15, Math.PI / 4, 0.4, 1);
      mainSpot.position.set(3, 4, 3);
      mainSpot.castShadow = true;
      mainSpot.shadow.mapSize.width = 1024;
      mainSpot.shadow.mapSize.height = 1024;
      group.add(mainSpot);

      const rimLight = new THREE.PointLight(0x6ee7b7, 2.0, 10);
      rimLight.position.set(-3, 2, -2);
      group.add(rimLight);

      const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
      fillLight.position.set(0, -2, 3);
      group.add(fillLight);
    } else if (lightPreset === 'sunset') {
      // Golden Hour Warm
      const ambLight = new THREE.AmbientLight(0xfef3c7, 0.9);
      group.add(ambLight);

      const sunSpot = new THREE.SpotLight(0xf59e0b, 4.5, 18, Math.PI / 3.5, 0.3);
      sunSpot.position.set(4, 3, 2);
      sunSpot.castShadow = true;
      group.add(sunSpot);

      const pinkRim = new THREE.PointLight(0xf43f5e, 2.8, 10);
      pinkRim.position.set(-3, 1, -3);
      group.add(pinkRim);
    } else if (lightPreset === 'emerald') {
      // Cyber Neon Emerald
      const ambLight = new THREE.AmbientLight(0x064e3b, 0.6);
      group.add(ambLight);

      const neonMain = new THREE.SpotLight(0x10b981, 5.0, 15, Math.PI / 3, 0.2);
      neonMain.position.set(2, 4, 3);
      neonMain.castShadow = true;
      group.add(neonMain);

      const cyanRim = new THREE.PointLight(0x06b6d4, 3.5, 12);
      cyanRim.position.set(-3, 2, -2);
      group.add(cyanRim);
    } else {
      // Clean Daylight
      const ambLight = new THREE.AmbientLight(0xffffff, 1.2);
      group.add(ambLight);

      const dayLight = new THREE.DirectionalLight(0xffffff, 2.5);
      dayLight.position.set(2, 5, 4);
      dayLight.castShadow = true;
      group.add(dayLight);

      const softFill = new THREE.DirectionalLight(0xf1f5f9, 1.0);
      softFill.position.set(-2, 1, 2);
      group.add(softFill);
    }
  }, [lightPreset]);

  // Sync auto-rotation
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  const handleResetCamera = useCallback(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 1.2, 3.8);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  }, []);

  const handleZoom = (delta) => {
    if (!cameraRef.current) return;
    const newZ = cameraRef.current.position.z + delta;
    if (newZ >= 1.8 && newZ <= 6.5) {
      cameraRef.current.position.z = newZ;
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden select-none bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl ${className}`}
      style={{ height }}
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-30">
          <div className="relative w-14 h-14">
            <div className="w-14 h-14 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
            <Sparkles className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
            Rendering 3D Mesh...
          </span>
        </div>
      )}

      {/* 3D Interactive Hotspot Pins */}
      {showHotspots && !isLoading && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {hotspotPositions.map((hp) => {
            if (!hp.visible) return null;
            const isSelected = activeHotspot === hp.id;
            return (
              <div
                key={hp.id}
                className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 transition-all duration-150"
                style={{ left: `${hp.x}px`, top: `${hp.y}px` }}
              >
                <div className="relative group">
                  {/* Glowing Radar Pulse */}
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(isSelected ? null : hp.id)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-400 text-slate-950 scale-125 shadow-[0_0_20px_#34d399]'
                        : 'bg-slate-900/90 text-emerald-400 border border-emerald-400/60 shadow-lg hover:scale-115 hover:bg-emerald-500 hover:text-slate-950'
                    }`}
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40" />
                    <Info className="w-3.5 h-3.5 relative z-10" />
                  </button>

                  {/* Hotspot Floating Tooltip / Info Card */}
                  {isSelected && (
                    <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-48 p-3 rounded-2xl bg-slate-900/95 border border-emerald-500/40 backdrop-blur-xl shadow-2xl text-left z-30 animate-in fade-in zoom-in-95 duration-200">
                      <div className="text-xs font-black text-emerald-400">{hp.title}</div>
                      <div className="text-[11px] text-slate-300 font-medium mt-1 leading-snug">
                        {hp.desc}
                      </div>
                      <div className="w-2.5 h-2.5 bg-slate-900 border-r border-b border-emerald-500/40 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Top Floating Badge Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
            360° Studio View
          </span>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Toggle Hotspot Callouts */}
          <button
            type="button"
            onClick={() => setShowHotspots(!showHotspots)}
            title="Toggle Feature Pins"
            className={`p-2 rounded-xl backdrop-blur-md border transition-all text-xs font-bold cursor-pointer ${
              showHotspots
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Expand if handler provided */}
          {onFullscreenToggle && (
            <button
              type="button"
              onClick={onFullscreenToggle}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D'}
              className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2 pointer-events-none z-10">
          {/* Lighting Presets */}
          <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-xl pointer-events-auto">
            <button
              type="button"
              onClick={() => setLightPreset('studio')}
              title="Studio Lighting"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                lightPreset === 'studio'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setLightPreset('sunset')}
              title="Warm Sunset"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                lightPreset === 'sunset'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setLightPreset('emerald')}
              title="Emerald Cyber"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                lightPreset === 'emerald'
                  ? 'bg-emerald-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setLightPreset('daylight')}
              title="Pure Daylight"
              className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                lightPreset === 'daylight'
                  ? 'bg-sky-400 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-sky-300'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action & Rotation Controls */}
          <div className="flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-xl pointer-events-auto">
            {/* Auto-Rotate Toggle */}
            <button
              type="button"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              title={isAutoRotating ? 'Pause Auto-Spin' : 'Start Auto-Spin'}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isAutoRotating
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="hidden sm:inline">{isAutoRotating ? 'Spinning' : 'Spin'}</span>
            </button>

            {/* Reset Camera */}
            <button
              type="button"
              onClick={handleResetCamera}
              title="Reset 3D Angle"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Zoom In / Out */}
            <button
              type="button"
              onClick={() => handleZoom(-0.5)}
              title="Zoom In"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleZoom(0.5)}
              title="Zoom Out"
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Subtle Drag Hint Overlay */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 pointer-events-none opacity-50 hover:opacity-0 transition-opacity">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-950/60 px-3 py-1 rounded-full backdrop-blur-sm border border-slate-800">
          ⇄ Drag to Rotate 360°
        </span>
      </div>
    </div>
  );
};

export default Product3DViewer;
