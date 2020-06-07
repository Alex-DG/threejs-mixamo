import { Animations } from '../models/types'

// @ts-ignore
import walk from './fbx/girl-walk.fbx'
// @ts-ignore
import lookAround from './fbx/look-around.fbx'

const animationKeys = ['lookAround']

const FBXAnimations: Animations = {
  walk, // main
  lookAround,
}

export { animationKeys }
export default FBXAnimations
