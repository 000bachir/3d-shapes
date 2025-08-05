import './style.css'
import * as THREE from "three";
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import HTML from "/src/assets/HTML.webp";
import CSS from "/src/assets/css.webp";
import Javascript from "/src/assets/Js.webp";
import Typescript from "/src/assets/Ts.webp";
import Golang from "/src/assets/go.webp";
import Python from "/src/assets/pip.webp";
import Svelte from "/src/assets/svelte.webp";
import SQL from "/src/assets/sql.webp";
import Next from "/src/assets/nextjs.webp";
import deno from "/src/assets/deno.webp";
import tailwind from "/src/assets/tailwind.webp";
import react from "/src/assets/react.webp";

const IMAGES = [HTML,CSS,Javascript,Typescript,Golang,Python,Svelte,SQL,Next,deno ,react ,tailwind] as const;

interface SceneObjects {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  cubes: THREE.Mesh[];
  controls: OrbitControls;
}


class THREEJSScene {
  private objects: SceneObjects | null = null
  private textutreLoader: THREE.TextureLoader
  private disposed = false

  constructor() {
    this.textutreLoader = new THREE.TextureLoader()
  }

  private setupLight(scene: THREE.Scene): void {
    let pointLight = new THREE.PointLight(0xffffff, 1, 100)
    pointLight.position.set(10, 10, 5)
    let ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(pointLight, ambientLight)
  }


  private createSpheres(image: string, index: number, totaleSpheres: number): THREE.Mesh {
    let geometry = new THREE.BoxGeometry();
    let material = new THREE.MeshBasicMaterial({
      map: this.textutreLoader.load(image)
    })
    let cube = new THREE.Mesh(geometry, material)
    // position in a sphere shape
    let angle = (index / totaleSpheres) * Math.PI * 2
    let radius: number = 8
    cube.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    )
    return cube
  }




  /**
   * init
   :void*/
  public init(): void {
    const canvas = document.querySelector("#background") as HTMLCanvasElement
    if (!canvas) {
      throw new Error("canvas element has not been found")
    }
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    )
    camera.position.z = 15

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const controls = new OrbitControls(camera, renderer.domElement)

    controls.enableDamping = true
    controls.dampingFactor = 0.05

    let cubes = IMAGES.map((image: string | any, index:number) =>
      this.createSpheres(image, index, IMAGES.length)
    )

    cubes.forEach((cube) => scene.add(cube))
    this.setupLight(scene)

    this.objects = { scene, camera, renderer, cubes ,controls }

    window.addEventListener("resize", this.handleResize)
    this.animate()

  }

  private handleResize = (): void => {
    if (!this.objects) return

    let { camera, renderer } = this.objects
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  private animate = (): void => {
    if (this.disposed || !this.objects) return

    const { scene, camera, renderer, cubes, controls } = this.objects
    requestAnimationFrame(this.animate)

    controls.update()

    cubes.forEach((cube) => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    })

    renderer.render(scene, camera)

  }

  public dispose(): void {
    if (!this.objects) return

    const { renderer, scene, cubes  } = this.objects

    cubes.forEach((cube) => {
      let material = cube.material as THREE.MeshStandardMaterial
      material.map?.dispose()
      material.dispose()
      cube.geometry.dispose()
    })


    scene.clear()

    renderer.dispose()

    window.removeEventListener("resize", this.handleResize)
    this.disposed = true
    this.objects = null

  }
}
// usage
const scene = new THREEJSScene
scene.init()
//scene.dispose();


