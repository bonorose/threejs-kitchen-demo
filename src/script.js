import './bootstrap/css/bootstrap.min.css'
import './fontawesome/css/all.min.css'
import './style.css'
import * as THREE from 'three'
import * as GLTFLoader from 'three-gltf-loader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Loading
const textureLoader = new THREE.TextureLoader()
const modelLoader = new GLTFLoader()

// Debug
const gui = new dat.GUI( {closeOnTop: true, closed:true} )
console.log(gui)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Load a glTF resource
modelLoader.load(
	// resource URL
	'models/l-shaped-4/scene.gltf',
	// called when the resource is loaded
	function ( gltf ) {
        // gltf.scene.traverse( function ( child ) {
        //     if ( child.isMesh ) {
        //         child.geometry.center(); // center here
        //     }
        // });
        // gltf.scene.scale.set(0.003, 0.003, 0.003);
        gltf.scene.position.set(-1, -2, 0)
		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object


	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened: ', error );

	}
);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth/1.5, 
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 5
camera.position.y = 4
camera.position.z = 7
scene.add(camera)

// const cameraSettings = gui.addFolder('Camera')
// cameraSettings.add(camera.position, 'x').step(0.01)
// cameraSettings.add(camera.position, 'y').step(0.01)
// cameraSettings.add(camera.position, 'z').step(0.01)
// cameraSettings.add(camera.rotation, 'x').step(0.01)
// cameraSettings.add(camera.rotation, 'y').step(0.01)
// cameraSettings.add(camera.rotation, 'z').step(0.01)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Lights
const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 7.54);
scene.add(ambient);
ambient.position.set(0,-1,0)

const ambientLightSettings = {
    intensity: 7.54,
    skyColor: 0xffffbb,
    groundColor: 0x080820
}

const ambientLight = gui.addFolder("Ambient Light")
ambientLight.add(ambientLightSettings, 'intensity').min(0).max(15).step(0.01)
 .onChange(() => {
     ambient.intensity = ambientLightSettings.intensity
 })

const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set( 1, 10, 6);
scene.add(light);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */

document.addEventListener('mousemove', onDocumentMouseMove)

let mouseX = 0
let mouseY = 0

let targetX = 0
let targetY = 0

let scale = 0
let targetScale = 0

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)
}

const clock = new THREE.Clock()

const tick = () =>
{

    targetX = mouseX * .001
    targetY = mouseY * .001
    targetScale = scale

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime

    // sphere.rotation.y += .25 * (targetX - sphere.rotation.y)
    // sphere.rotation.x += .05 * (targetY - sphere.rotation.x)
    // sphere.position.z += -.05 * (targetY - sphere.rotation.x)

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()