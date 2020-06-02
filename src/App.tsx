import './App.css'

import React, { useState, useEffect, useRef } from 'react'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import * as THREE from 'three'

import styled from 'styled-components'

// @ts-ignore
// import eve from './models/fbx/eve_j_gonzales.fbx'
// @ts-ignore
import kachujin from './models/fbx/sophie_thriller.fbx'
// import kachujin from './models/fbx/kachujin_g_rosales.fbx'
// @ts-ignore
// import sambaDancing from './models/fbx/samba-dancing.fbx'

const LoadingWrapper = styled.div`
  min-height: 100vh;

  background-color: transparent;

  display: flex;
  justify-content: center;
  align-items: center;
`

const LoadingText = styled.h1`
  color: white;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  padding: 15px;

  position: relative;

  background-color: grey;

  border-radius: 4px;

  margin: 0 auto;

  z-index: 0;
`

const StyledCanvas = styled.canvas`
  position: absolute;
  z-index: -1;
  min-height: 100vh;

  background-color: transparent;
`

const App = () => {
  const [loading, setLoading] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement>({
    // @ts-ignore
    current: { clientWidth: 0, clientHeight: 0 },
  })

  let frameId: number

  let mixer: THREE.AnimationMixer
  let renderer: THREE.WebGLRenderer
  let camera: THREE.PerspectiveCamera
  let scene: THREE.Scene

  const clock = new THREE.Clock()

  const sceneAdd = (item: THREE.Object3D) => scene.add(item)

  const createCam = () => {
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      2000,
    )
    camera.position.set(0, 200, 600)
  }

  const createScene = () => {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xa0a0a0)
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000)
  }

  const createLight = () => {
    let hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hemisphereLight.position.set(0, 200, 0)
    sceneAdd(hemisphereLight)

    let directionalLight = new THREE.DirectionalLight(0xffffff)
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

  const init = () => {
    createCam()
    createScene()
    createLight()
    createGround()

    const loader = new FBXLoader()

    loader.load(
      kachujin,
      (object: any) => {
        mixer = new THREE.AnimationMixer(object)

        const action = mixer.clipAction(object.animations[0])
        action.play()

        object.traverse(function (child: any) {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })

        sceneAdd(object)

        setTimeout(() => setLoading(false), 1000)
      },
      (event: ProgressEvent<EventTarget>) => console.log('onProgress ->', { event }),
      (error: ErrorEvent) => console.log('error = ', { error }),
    )

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
    if (mixer) mixer.update(delta)

    renderer.render(scene, camera)
  }

  useEffect(
    () => {
      init()
      animate()

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
