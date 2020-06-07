import { Animations } from '../types'

/**
 * Player
 */
class Player {
  mixer: THREE.AnimationMixer | null
  name: string
  action: string

  root: any
  object: any
  cameras: any

  animatations: Animations

  constructor() {
    this.mixer = null
    this.root = null
    this.name = ''
    this.action = ''
    this.object = null
    this.cameras = null

    this.animatations = {
      walk: null,
      lookAround: null,
    }
  }
}

export default Player
