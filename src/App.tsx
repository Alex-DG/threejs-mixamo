import './App.css'

import React, { useState, useEffect, useRef } from 'react'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import * as THREE from 'three'

import FBXAnims, { animationKeys } from './animations'

import {
  LoadingWrapper,
  LoadingText,
  LoadingContainer,
  StyledCanvas,
} from './styles'

import Player from './models/Player'
import Overlay from './components/Overlay'

const App = () => {
  const player = new Player()

  let anims = [...animationKeys]

  const [loading, setLoading] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement>({
    // @ts-ignore
    current: { clientWidth: 0, clientHeight: 0 },
  })

  let frameId: number

  let renderer: THREE.WebGLRenderer
  let camera: THREE.PerspectiveCamera
  let scene: THREE.Scene

  const clock = new THREE.Clock()

  const sceneAdd = (item: THREE.Object3D) => scene.add(item)

  const createCamera = () => {
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      2000,
    )
    camera.position.set(0, 110, 230)
  }

  const createScene = () => {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xa0a0a0)
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000)
  }

  const createLight = () => {
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hemisphereLight.position.set(0, 200, 0)
    sceneAdd(hemisphereLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(0, 200, 100)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.top = 180
    directionalLight.shadow.camera.bottom = -100
    directionalLight.shadow.camera.left = -120
    directionalLight.shadow.camera.right = 120
    sceneAdd(directionalLight)
  }

  const createGround = () => {
    let mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(5000, 2000),
      new THREE.MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false,
      }),
    )
    mesh.rotation.x = -Math.PI / 3
    mesh.receiveShadow = true
    sceneAdd(mesh)

    let grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000)
    // @ts-ignore
    grid.material.opacity = 0.2
    // @ts-ignore
    grid.material.transparent = true
    sceneAdd(grid)
  }

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  const loadNextAnim = (loader: FBXLoader) => {
    const name = anims.pop() || ''
    const anim = FBXAnims[name] // Animation to load

    if (anim) {
      loader.load(anim, (object: any) => {
        player.animatations[name] = object.animations[0]
        loadNextAnim(loader)
      })
    } else {
      const lookAround = player.animatations.lookAround
      const action = player.mixer?.clipAction(lookAround)
      action?.play()

      setTimeout(() => setLoading(false), 500)
    }
  }

  const init = () => {
    createCamera()
    createScene()
    createLight()
    createGround()

    const loader = new FBXLoader()

    loader.load(
      FBXAnims.walk,
      (object: any) => {
        object.mixer = new THREE.AnimationMixer(object)
        object.name = 'Character'

        // Set player values
        player.mixer = object.mixer
        player.root = object.mixer.getRoot()
        player.object = object
        player.animatations.walk = object.animations[0]
        player.name = object.name

        object.traverse(function (child: any) {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        sceneAdd(object)
        loadNextAnim(loader)
      },
      (event: ProgressEvent<EventTarget>) => console.log('onProgress ->', { event }),
      (error: ErrorEvent) => console.log('error = ', { error }),
    )

    player.action = 'lookAround' // Default action

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasRef.current,
    })

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true

    window.addEventListener('resize', onWindowResize, false)
  }

  const animate = () => {
    frameId = requestAnimationFrame(animate)

    const delta = clock.getDelta()
    if (player.mixer) player.mixer.update(delta)

    renderer.render(scene, camera)
  }

  // IN PROGRESS!!
  const onPlayerMove = (move: string) => {
    if (move) {
      let action = move

      // if (action === player.action) {
      //   // Default
      //   action = 'lookAround'
      // }

      // Set action
      player.action = action

      // Stop all
      player.mixer?.stopAllAction()

      // Start new player action
      const anim: any = player.animatations[action]
      const playerAction = player.mixer?.clipAction(anim)
      playerAction?.play()
    }
  }

  function setupKeyControls() {
    let move: string

    document.onkeydown = function (event) {
      console.log({ event })
      switch (event.keyCode) {
        case 37: // left
          break
        case 38: // up
          move = 'walk'
          break
        case 39: // right
          break
        case 40: // down
          move = 'lookAround'
          break
        case 32: // space
          move = 'jump'
          break
        default:
          move = 'lookAround'
      }

      console.log({ move })

      onPlayerMove(move)
    }
  }

  useEffect(
    () => {
      init()
      animate()
      setupKeyControls()

      return () => {
        cancelAnimationFrame(frameId)
        window.removeEventListener('resize', onWindowResize)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <>
      <Overlay display={!loading} />
      <StyledCanvas ref={canvasRef} />
      <LoadingWrapper>
        {loading && (
          <LoadingContainer className="loading">
            <LoadingText>Loading...</LoadingText>
          </LoadingContainer>
        )}
      </LoadingWrapper>
    </>
  )
}

export default App
