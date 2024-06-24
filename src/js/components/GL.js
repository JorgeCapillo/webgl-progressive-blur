import { Renderer, Camera, Transform, Plane } from 'ogl'
import Media from './Media.js';

export default class GL {
  constructor () {
    this.images = [...document.querySelectorAll('.media img')]
    
    this.createRenderer()
    this.createCamera()
    this.createScene()

    this.onResize()

    this.createGeometry()
    this.createMedias()

    this.update()

    this.addEventListeners()
  }
  createRenderer () {
    this.renderer = new Renderer({
      canvas: document.querySelector('#gl'),
      alpha: true
    })

    this.gl = this.renderer.gl
    this.gl.clearColor(255, 255, 255, 0)
  }
  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }
  createScene () {
    this.scene = new Transform()
  }
  createGeometry () {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    })
  }
  createMedias () {
    this.medias = this.images.map((image, index) => {
      return new Media({
        gl: this.gl,
        geometry: this.planeGeometry,
        scene: this.scene,
        renderer: this.renderer,
        screen: this.screen,
        viewport: this.viewport,
        index,
        image
      })
    })
  }
  onResize () {
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.renderer.setSize(this.screen.width, this.screen.height)

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.viewport = {
      height,
      width
    }
    if (this.medias) {
      this.medias.forEach(media => media.onResize({
        screen: this.screen,
        viewport: this.viewport
      }))
      this.onScroll({scroll: window.scrollY})
    }
  }
  easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }
  onScroll({scroll}) {
    if (this.medias) {
      this.medias.forEach(media => media.onScroll(scroll))
      this.checkHeroProgress(scroll)
    }
  }
  checkHeroProgress(scroll) {
    const p = this.easeInOut(Math.min(scroll / (this.screen.height * 0.5), 1))
    let height = this.medias[0].parent.offsetHeight
    const offsetTop = this.medias[0].parent.offsetTop
    let scale = (this.screen.height - offsetTop) / height
    scale *= 1.15
    this.medias[0].setScale(null, height - height * (1 - p) * (1 - scale))
    this.medias[0].blurStrength = 1 - 0.8 * (1 - p)
  }
  update() {
    if (this.medias) {
      this.medias.forEach(media => media.update())
    }

    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })
    window.requestAnimationFrame(this.update.bind(this))
  }
  addEventListeners () {
    window.addEventListener('resize', this.onResize.bind(this))
  }
}