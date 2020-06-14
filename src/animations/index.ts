import { Animations } from '../models/types'

// @ts-ignore
import walk from './fbx/girl-walk.fbx'
// @ts-ignore
import lookAround from './fbx/look-around.fbx'
// @ts-ignore
import jump from './fbx/jump.fbx'

const animationKeys = ['lookAround', 'jump']

const FBXAnimations: Animations = {
  walk, // main
  lookAround,
  jump,
}

export { animationKeys }
export default FBXAnimations
