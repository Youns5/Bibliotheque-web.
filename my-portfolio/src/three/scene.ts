import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class BackgroundScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private panorama: THREE.Object3D | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private targetX = 0;
  private targetY = 0;
  private scrollRotation = 0;
  private isLoaded = false;

  constructor(canvas: HTMLCanvasElement) {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Camera - will be positioned at center
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 0, 0.01);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Load Milky Way panorama
    this.loadPanorama();

    // Events
    window.addEventListener('resize', this.onResize.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('scroll', this.onScroll.bind(this));

    // Start animation
    this.animate();
  }

  private loadPanorama(): void {
    const loader = new GLTFLoader();

    loader.load('/milkyway.glb', (gltf) => {
      this.panorama = gltf.scene;

      // Process all meshes in the model
      this.panorama.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Make material double-sided so it's visible from inside
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              mat.side = THREE.DoubleSide;
              mat.depthWrite = false;
            });
          } else if (child.material) {
            child.material.side = THREE.DoubleSide;
            child.material.depthWrite = false;
          }

          // Flip the geometry to see it from inside
          // This inverts the normals so the texture faces inward
          const geometry = child.geometry;
          if (geometry) {
            geometry.scale(-1, 1, 1); // Flip X to invert the sphere
          }
        }
      });

      // Get bounds and scale appropriately
      const box = new THREE.Box3().setFromObject(this.panorama);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      console.log('Panorama size:', size);
      console.log('Panorama center:', center);

      // Center the panorama around origin
      this.panorama.position.sub(center);

      // Scale to a good viewing size
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1000 / maxDim;
      this.panorama.scale.setScalar(scale);

      this.scene.add(this.panorama);
      this.scene.background = null;
      this.isLoaded = true;

      console.log('Milky Way panorama loaded successfully');

    }, (progress) => {
      if (progress.total > 0) {
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Loading Milky Way: ${percent.toFixed(1)}%`);
      }
    }, (error) => {
      console.error('Error loading Milky Way:', error);
    });
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseY = (event.clientY / window.innerHeight) * 2 - 1;
  }

  private onScroll(): void {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

    // Rotate based on scroll (180 degrees through full page scroll)
    this.scrollRotation = scrollProgress * Math.PI;
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    // Smooth mouse following
    this.targetX += (this.mouseX - this.targetX) * 0.05;
    this.targetY += (this.mouseY - this.targetY) * 0.05;

    // Rotate panorama based on scroll
    if (this.panorama) {
      this.panorama.rotation.y = this.scrollRotation;
    }

    // Camera look direction based on mouse (parallax)
    const parallaxStrength = 0.4;
    this.camera.rotation.y = -this.targetX * parallaxStrength;
    this.camera.rotation.x = this.targetY * parallaxStrength * 0.3;

    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    window.removeEventListener('resize', this.onResize.bind(this));
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('scroll', this.onScroll.bind(this));
    this.renderer.dispose();
  }
}
