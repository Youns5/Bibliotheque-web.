import * as THREE from 'three';

export class BackgroundScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private stars: THREE.Points;
  private galaxyCore: THREE.Points;
  private nebulaClouds: THREE.Points;
  private starCount = 5000;
  private galaxyCount = 3000;
  private nebulaCount = 1000;
  private mouseX = 0;
  private mouseY = 0;
  private targetX = 0;
  private targetY = 0;
  private clock: THREE.Clock;

  constructor(canvas: HTMLCanvasElement) {
    this.clock = new THREE.Clock();

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    this.camera.position.z = 100;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000308, 1);

    this.stars = this.createStars();
    this.galaxyCore = this.createGalaxySpiral();
    this.nebulaClouds = this.createNebula();

    this.scene.add(this.stars);
    this.scene.add(this.galaxyCore);
    this.scene.add(this.nebulaClouds);

    // Events
    window.addEventListener('resize', this.onResize.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('scroll', this.onScroll.bind(this));

    // Start animation
    this.animate();
  }

  private createStars(): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.starCount * 3);
    const colors = new Float32Array(this.starCount * 3);
    const sizes = new Float32Array(this.starCount);

    const starColors = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xe6f0ff),
      new THREE.Color(0xadd8e6),
      new THREE.Color(0x87ceeb),
      new THREE.Color(0xfff4e6),
      new THREE.Color(0xffe4b5),
    ];

    for (let i = 0; i < this.starCount; i++) {
      const i3 = i * 3;
      const radius = 200 + Math.random() * 800;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() < 0.95 ? Math.random() * 1.5 + 0.5 : Math.random() * 3 + 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geometry, material);
  }

  private createGalaxySpiral(): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.galaxyCount * 3);
    const colors = new Float32Array(this.galaxyCount * 3);

    const coreColor = new THREE.Color(0xffeaa7);
    const midColor = new THREE.Color(0xa29bfe);
    const edgeColor = new THREE.Color(0x74b9ff);

    const arms = 3;
    const armSpread = 0.5;

    for (let i = 0; i < this.galaxyCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 80;
      const spinAngle = radius * 0.5;
      const armAngle = ((i % arms) / arms) * Math.PI * 2;

      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * armSpread * radius;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * armSpread * 0.5;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * armSpread * radius;

      positions[i3] = Math.cos(armAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(armAngle + spinAngle) * radius + randomZ;

      const colorMix = radius / 80;
      const color = new THREE.Color();
      if (colorMix < 0.33) {
        color.lerpColors(coreColor, midColor, colorMix * 3);
      } else {
        color.lerpColors(midColor, edgeColor, (colorMix - 0.33) * 1.5);
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const galaxy = new THREE.Points(geometry, material);
    galaxy.rotation.x = Math.PI * 0.3;
    galaxy.position.z = -50;

    return galaxy;
  }

  private createNebula(): THREE.Points {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.nebulaCount * 3);
    const colors = new Float32Array(this.nebulaCount * 3);

    const nebulaColors = [
      new THREE.Color(0x9b59b6),
      new THREE.Color(0xe91e63),
      new THREE.Color(0x00bcd4),
      new THREE.Color(0x3498db),
      new THREE.Color(0x1abc9c),
    ];

    for (let i = 0; i < this.nebulaCount; i++) {
      const i3 = i * 3;
      const clusterX = (Math.random() - 0.5) * 300;
      const clusterY = (Math.random() - 0.5) * 200;
      const clusterZ = (Math.random() - 0.5) * 300 - 100;

      positions[i3] = clusterX + (Math.random() - 0.5) * 50;
      positions[i3 + 1] = clusterY + (Math.random() - 0.5) * 30;
      positions[i3 + 2] = clusterZ + (Math.random() - 0.5) * 50;

      const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.15,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    return new THREE.Points(geometry, material);
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
    const scrollProgress = scrollY / maxScroll;

    this.camera.position.z = 100 - scrollProgress * 50;
    this.galaxyCore.rotation.z = scrollProgress * Math.PI * 0.5;
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    const elapsedTime = this.clock.getElapsedTime();

    this.targetX += (this.mouseX - this.targetX) * 0.02;
    this.targetY += (this.mouseY - this.targetY) * 0.02;

    this.stars.rotation.y += 0.0001;
    this.stars.rotation.x = this.targetY * 0.1;
    this.galaxyCore.rotation.z += 0.0003;
    this.nebulaClouds.rotation.y += 0.0002;

    const starSizes = this.stars.geometry.attributes.size.array as Float32Array;
    for (let i = 0; i < this.starCount; i++) {
      const twinkle = Math.sin(elapsedTime * 2 + i) * 0.3 + 0.7;
      if (i % 10 === 0) {
        starSizes[i] = (Math.random() * 1.5 + 0.5) * twinkle;
      }
    }
    this.stars.geometry.attributes.size.needsUpdate = true;

    this.camera.position.x = this.targetX * 10;
    this.camera.position.y = -this.targetY * 10;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    window.removeEventListener('resize', this.onResize.bind(this));
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('scroll', this.onScroll.bind(this));
    this.renderer.dispose();
  }
}
