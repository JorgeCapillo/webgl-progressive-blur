import '../../styles/index.scss'
import '../../styles/pages/index.scss'
import Lenis from 'lenis';

import GL from '../components/GL.js';

export default class Index {
  constructor(options) {
    console.log('Index page');
    this.lenis = new Lenis();
    this.lenis.on('scroll', (e) => {
    })
    const raf = (time) =>{
      this.lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    this.gl = new GL();
    this.lenis.on('scroll', (e) => {
      this.gl.onScroll(e)
    })
  }
}
window.addEventListener('load', () => {
  new Index();
});