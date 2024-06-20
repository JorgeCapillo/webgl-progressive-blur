import '../../styles/index.scss'
import '../../styles/pages/index.scss'
import Lenis from 'lenis';

import Util from '../util/util.js';

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

  }
}
window.addEventListener('load', () => {
  new Index();
});