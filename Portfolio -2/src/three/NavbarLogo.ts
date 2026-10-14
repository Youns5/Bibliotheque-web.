import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class NavbarLogo {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private model: THREE.Group | null = null;
  private isHovering: boolean = false;
  private targetRotationY: number = 0;
  private currentRotationY: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    this.camera.position.z = 3;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(45, 45);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 2);
    this.scene.add(directionalLight);

    const accentLight = new THREE.DirectionalLight(0x6366f1, 0.5);
    accentLight.position.set(-2, -1, 1);
    this.scene.add(accentLight);

    this.loadModel();

    const navBrand = document.getElementById('nav-brand');
    if (navBrand) {
      navBrand.addEventListener('mouseenter', () => {
        this.isHovering = true;
      });
      navBrand.addEventListener('mouseleave', () => {
        this.isHovering = false;
      });
      navBrand.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    this.animate();
  }

  private loadModel(): void {
    const loader = new GLTFLoader();
    loader.load('/logo.glb', (gltf) => {
      this.model = gltf.scene;

      const box = new THREE.Box3().setFromObject(this.model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1.8 / maxDim;

      this.model.position.sub(center);
      this.model.scale.setScalar(scale);

      this.scene.add(this.model);
    });
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    if (this.isHovering) {
      this.targetRotationY += 0.05;
    }

    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.1;

    if (this.model) {
      this.model.rotation.y = this.currentRotationY;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
