import { Mesh, Program, Texture } from 'ogl'
import vertex from '../../shaders/vertex.glsl';
import fragment from '../../shaders/fragment.glsl';

export default class Media {
  constructor ({ gl, geometry, scene, renderer, screen, viewport, index, image }) {
    this.gl = gl
    this.geometry = geometry
    this.scene = scene
    this.renderer = renderer
    this.screen = screen
    this.viewport = viewport
    this.index = index
    this.image = image
    this.parent = image.parentElement
    this.scroll = 0

    this.createShader()
    this.createMesh()

    this.onResize()
  }
  createShader () {
    const texture = new Texture(this.gl, {
      generateMipmaps: false
    })

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      fragment,
      vertex,
      uniforms: {
        tMap: { value: texture },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        uViewportSize: { value: [this.viewport.width, this.viewport.height] },
        uTime: { value: 100 * Math.random() },
        uScroll: { value: 0 }
      },
      transparent: true
    })

    const image = new Image()

    image.src = this.image.src
    image.onload = _ => {
      texture.image = image

      this.program.uniforms.uImageSize.value = [image.naturalWidth, image.naturalHeight]
    }
  }
  createMesh () {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.plane.setParent(this.scene)
  }
  onScroll (scroll) {
    this.scroll = scroll
    this.program.uniforms.uScroll.value = (this.scroll / this.screen.height) * this.viewport.height
    this.setY(this.y)
  }
  update () {
    this.program.uniforms.uTime.value += 0.04
  }
  setScale () {
    this.plane.scale.x = this.viewport.width * this.parent.offsetWidth / this.screen.width
    this.plane.scale.y = this.viewport.height * this.parent.offsetHeight / this.screen.height

    this.plane.program.uniforms.uPlaneSize.value = [this.plane.scale.x, this.plane.scale.y]
  }
  setX(x = 0) {
    this.x = x
    this.plane.position.x = -(this.viewport.width / 2) + (this.plane.scale.x / 2) + (this.x / this.screen.width) * this.viewport.width
  }
  setY(y = 0) {
    this.y = y
    this.plane.position.y = (this.viewport.height / 2) - (this.plane.scale.y / 2) - ((this.y - this.scroll) / this.screen.height) * this.viewport.height
  }
  onResize ({ screen, viewport } = {}) {
    if (screen) {
      this.screen = screen
    }

    if (viewport) {
      this.viewport = viewport
      this.plane.program.uniforms.uViewportSize.value = [this.viewport.width, this.viewport.height]
    }
    this.setScale()

    this.setX(this.parent.offsetLeft)
    this.setY(this.parent.offsetTop)
  }
}