import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class LoadingScreen {
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private model: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private clock: THREE.Clock;
  private progress: number = 0;
  private targetProgress: number = 0;
  private isComplete: boolean = false;
  private onCompleteCallback: (() => void) | null = null;
  private materials: THREE.MeshStandardMaterial[] = [];
  private originalColors: THREE.Color[] = [];

  constructor() {
    this.clock = new THREE.Clock();

    // Create loading overlay
    this.container = document.createElement('div');
    this.container.id = 'loading-screen';
    this.container.innerHTML = `
      <canvas id="loading-canvas"></canvas>
    `;
    document.body.prepend(this.container);

    this.canvas = document.getElementById('loading-canvas') as HTMLCanvasElement;

    // Setup Three.js
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000308); // Deep space

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 5);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;

    // Galaxy-themed lighting
    const ambientLight = new THREE.AmbientLight(0x1a1a2e, 0.3);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffeaa7, 1); // Star-like warm light
    mainLight.position.set(5, 5, 5);
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xa29bfe, 0.6); // Purple nebula
    fillLight.position.set(-5, 0, -5);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x74b9ff, 0.4); // Blue galaxy edge
    rimLight.position.set(0, -5, 0);
    this.scene.add(rimLight);

    const accentLight = new THREE.DirectionalLight(0x9b59b6, 0.3); // Nebula purple
    accentLight.position.set(-3, 3, -3);
    this.scene.add(accentLight);

    // Load GLB model
    this.loadModel();

    // Handle resize
    window.addEventListener('resize', this.onResize.bind(this));

    // Start animation
    this.animate();
  }

  private loadModel(): void {
    const loader = new GLTFLoader();
    loader.load('/logo.glb', (gltf) => {
      this.model = gltf.scene;

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.5 / maxDim;

      this.model.position.sub(center);
      this.model.scale.setScalar(scale);

      // Store materials and set to grayscale initially
      this.model.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.MeshStandardMaterial;
          if (material.isMeshStandardMaterial) {
            // Clone material to avoid affecting original
            const newMaterial = material.clone();
            child.material = newMaterial;
            this.materials.push(newMaterial);

            // Store original color
            this.originalColors.push(newMaterial.color.clone());

            // Set to grayscale initially
            const gray = this.getGrayscale(newMaterial.color);
            newMaterial.color.setRGB(gray, gray, gray);
          }
        }
      });

      this.scene.add(this.model);

      // Setup animations if any
      if (gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(this.model);
        gltf.animations.forEach((clip) => {
          this.mixer?.clipAction(clip).play();
        });
      }
    }, undefined, (error) => {
      console.error('Error loading logo:', error);
    });
  }

  private getGrayscale(color: THREE.Color): number {
    return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
  }

  private updateMaterialColors(): void {
    this.materials.forEach((material, index) => {
      const original = this.originalColors[index];
      const gray = this.getGrayscale(original);

      // Interpolate from grayscale to original color based on progress
      material.color.setRGB(
        gray + (original.r - gray) * this.progress,
        gray + (original.g - gray) * this.progress,
        gray + (original.b - gray) * this.progress
      );
    });
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    if (this.isComplete) return;

    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    // Smooth progress interpolation
    this.progress += (this.targetProgress - this.progress) * 0.05;

    // Update material colors based on progress (logo color = loading indicator)
    this.updateMaterialColors();

    // Rotate model
    if (this.model) {
      this.model.rotation.y += delta * 1.5;
    }

    // Update animations
    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.renderer.render(this.scene, this.camera);

    // Check if loading is complete
    if (this.progress > 0.99 && this.targetProgress >= 1) {
      this.completeLoading();
    }
  }

  public setProgress(value: number): void {
    this.targetProgress = Math.min(Math.max(value, 0), 1);
  }

  private completeLoading(): void {
    if (this.isComplete) return;
    this.isComplete = true;

    // Animate logo to navbar position
    const duration = 800;
    const startTime = performance.now();
    const startPos = { x: 0, y: 0, scale: 1, rotY: this.model?.rotation.y || 0 };
    const endPos = { x: -window.innerWidth / 2 + 80, y: window.innerHeight / 2 - 35, scale: 0.15, rotY: 0 };

    const animateOut = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      if (this.model) {
        // Move to corner
        this.model.position.x = startPos.x + (endPos.x - startPos.x) * eased * 0.01;
        this.model.position.y = startPos.y + (endPos.y - startPos.y) * eased * 0.01;

        // Scale down
        const scale = startPos.scale + (endPos.scale - startPos.scale) * eased;
        this.model.scale.setScalar(scale * 2.5);

        // Stop rotation
        this.model.rotation.y = startPos.rotY * (1 - eased);
      }

      // Fade out loading screen
      this.container.style.opacity = String(1 - eased);

      if (progress < 1) {
        requestAnimationFrame(animateOut);
      } else {
        // Remove loading screen
        this.container.style.display = 'none';
        this.renderer.dispose();

        // Trigger callback
        if (this.onCompleteCallback) {
          this.onCompleteCallback();
        }
      }
    };

    requestAnimationFrame(animateOut);
  }

  public onComplete(callback: () => void): void {
    this.onCompleteCallback = callback;
  }
}

// Resource loader to track progress
export class ResourceTracker {
  private totalResources: number = 0;
  private loadedResources: number = 0;
  private loadingScreen: LoadingScreen;

  constructor(loadingScreen: LoadingScreen) {
    this.loadingScreen = loadingScreen;
  }

  public trackResource(): void {
    this.totalResources++;
    this.updateProgress();
  }

  public resourceLoaded(): void {
    this.loadedResources++;
    this.updateProgress();
  }

  private updateProgress(): void {
    if (this.totalResources === 0) {
      this.loadingScreen.setProgress(0);
      return;
    }
    this.loadingScreen.setProgress(this.loadedResources / this.totalResources);
  }

  public complete(): void {
    this.loadingScreen.setProgress(1);
  }
}
