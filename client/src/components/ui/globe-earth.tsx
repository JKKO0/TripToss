import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { cn } from '@/lib/utils';

interface GlobeEarthProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function GlobeEarth({ className, ...props }: GlobeEarthProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isClient) return;

    const scene = new THREE.Scene();
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    containerRef.current.appendChild(renderer.domElement);

    // Background gradient
    const backgroundTexture = new THREE.CanvasTexture(generateBackgroundTexture());
    scene.background = backgroundTexture;

    // Earth
    const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x0a0a23,
      emissive: 0x0a0a23,
      shininess: 5,
      specular: 0x111111,
      flatShading: false,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color(0x3a9cff) } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(glowColor, intensity * 0.5);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    const destinations = [
      { lat: 40.7128, lng: -74.006 },    // New York
      { lat: 51.5074, lng: -0.1278 },    // London
      { lat: 35.6762, lng: 139.6503 },   // Tokyo
      { lat: -33.8688, lng: 151.2093 },  // Sydney
      { lat: 37.7749, lng: -122.4194 },  // San Francisco
      { lat: 55.7558, lng: 37.6173 },    // Moscow
      { lat: 19.4326, lng: -99.1332 },   // Mexico City
      { lat: 48.8566, lng: 2.3522 },     // Paris
      { lat: 1.3521, lng: 103.8198 },    // Singapore
      { lat: -23.5505, lng: -46.6333 },  // São Paulo
    ];


    const latLongToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    destinations.forEach((point) => {
      const pos = latLongToVector3(point.lat, point.lng, 1.01);

      // Core dot (bigger)
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.02, 16, 16), // Increased core size
        new THREE.MeshBasicMaterial({ color: 0x3a9cff })
      );
      sphere.position.copy(pos);

      // Glow layer (bigger)
      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 16, 16), // Increased glow size
        new THREE.ShaderMaterial({
          uniforms: { glowColor: { value: new THREE.Color(0x3a9cff) } },
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 glowColor;
            varying vec3 vNormal;
            void main() {
              float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
              gl_FragColor = vec4(glowColor, intensity);
            }
          `,
          blending: THREE.AdditiveBlending,
          transparent: true,
        })
      );
      sphere.add(glow);
      earth.add(sphere);
    });

    // Arcs with glow
    const arcPairs = [
      { start: 0, end: 2 }, // NY -> Tokyo
      { start: 0, end: 3 }, // NY -> Sydney
      { start: 0, end: 6 }, // NY -> Mexico City
      { start: 1, end: 4 }, // London -> SF
      { start: 1, end: 8 }, // London -> Singapore
      { start: 2, end: 5 }, // Tokyo -> Moscow
      { start: 2, end: 7 }, // Tokyo -> Paris
      { start: 3, end: 9 }, // Sydney -> São Paulo
      { start: 5, end: 8 }, // Moscow -> Singapore
      { start: 6, end: 9 }, // Mexico City -> São Paulo
    ];



    arcPairs.forEach(({ start, end }) => {
      const startVec = latLongToVector3(destinations[start].lat, destinations[start].lng, 1.01);
      const endVec = latLongToVector3(destinations[end].lat, destinations[end].lng, 1.01);
      const midVec = new THREE.Vector3().addVectors(startVec, endVec).normalize().multiplyScalar(1.2);
      const curve = new THREE.QuadraticBezierCurve3(startVec, midVec, endVec);

      const arcGeometry = new THREE.TubeGeometry(curve, 64, 0.001, 8, false);

      const arcMaterial = new THREE.ShaderMaterial({
        uniforms: { glowColor: { value: new THREE.Color(0x3a9cff) } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.8 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
            gl_FragColor = vec4(glowColor, intensity);
          }
        `,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });

      const arc = new THREE.Mesh(arcGeometry, arcMaterial);
      earth.add(arc);
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, [isClient]);

  return <div ref={containerRef} className={cn("relative w-full aspect-square", className)} {...props} />;
}

function generateBackgroundTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, '#0a0a23');
  gradient.addColorStop(1, '#000000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return canvas;
}
