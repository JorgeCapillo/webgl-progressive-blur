import '../../styles/index.scss'
import '../../styles/pages/index.scss'
import Lenis from 'lenis';

import GL from '../components/GL.js';

export default class Index {
  constructor(options) {
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
    const items = document.querySelectorAll('#list-section li');
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    });
    items.forEach(item => {
      observer.observe(item);
    });
  }
}
window.addEventListener('load', () => {
  new Index();
});