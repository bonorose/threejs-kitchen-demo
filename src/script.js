import './bootstrap/css/bootstrap.min.css'
import './fontawesome/css/all.min.css'
import './style.css'
import * as THREE from 'three'
import * as GLTFLoader from 'three-gltf-loader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// ---- Three.js ---- //
// Loading
const textureLoader = new THREE.TextureLoader()
const modelLoader = new GLTFLoader()

// Debug
const gui = new dat.GUI( {closeOnTop: true, closed:true} )
// console.log(gui)

// Canvas
const canvas = document.querySelector('canvas.webgl')

// RGB Loader
const rgbeloader = new RGBELoader().setPath( 'lighting/' ).load( 'studio_1.hdr', function ( texture ) {
        texture.mapping = THREE.EquirectangularReflectionMapping
        // scene.background = texture
        scene.environment = texture
})

// Scene
const scene = new THREE.Scene()

// Material
const woodMat = new THREE.MeshStandardMaterial()
// woodMat.roughness = 0.1
textureLoader.load('models/furniture/textures/diff.jpg',

    // onLoad callback
    function ( texture ) {
        // in this example we create the material when the texture is loaded
        woodMat.map = texture
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function ( err ) {
        console.error( 'An error happened.' )
    }
)
textureLoader.load('models/furniture/textures/normal.jpg',

    // onLoad callback
    function ( texture ) {
        // in this example we create the material when the texture is loaded
        woodMat.normalMap = texture
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function ( err ) {
        console.error( 'An error happened.' )
    }
)
textureLoader.load('models/furniture/textures/rough.jpg',

    // onLoad callback
    function ( texture ) {
        // in this example we create the material when the texture is loaded
        woodMat.roughnessMap = texture
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function ( err ) {
        console.error( 'An error happened.' )
    }
)

const woodMatOptions = {
    color: 0x121212
}


const metalMat = new THREE.MeshStandardMaterial( {} )
metalMat.metalness = 1
metalMat.roughness = 0.1
// metalMat.envMap = scene.environment

const metalMatOptions = {
    roughness: 0.1,
    metalness: 0.1,
    color: 0x121212
}

// Load a glTF resource
modelLoader.load(
	// resource URL
	'models/furniture/drawer.gltf',
	// called when the resource is loaded
	function ( gltf ) {
        // gltf.scene.traverse( function ( child ) {
        //     if ( child.isMesh ) {
        //         child.geometry.center(); // center here
        //     }
        // });
        // gltf.scene.scale.set(0.003, 0.003, 0.003);
        gltf.scene.children[0].receiveShadow = true

        // const woodenMaterial = gltf.scene.children[0].children[0].material
        // const metalMaterial = gltf.scene.children[0].children[1].material

        gltf.scene.children[0].children[1].material = metalMat
        gltf.scene.children[0].children[0].material = woodMat

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

/*
 * Model Controls
 */
console.log(scene)

const modelOptions = gui.addFolder("Material Parameters")
const woodOptions = modelOptions.addFolder("Wood")
woodOptions.addColor(woodMatOptions, 'color')
    .onChange(() => {
        scene.children[3].children[0].children[0].material.color.set(woodMatOptions.color)
    })


const metalOptions = modelOptions.addFolder("Metal")
metalOptions.addColor(metalMatOptions, 'color')
    .onChange(() => {
        scene.children[3].children[0].children[1].material.color.set(metalMatOptions.color)
    })
metalOptions.add(metalMatOptions, 'roughness').min(0).max(1).step(.001)
    .onChange(() => {
        scene.children[3].children[0].children[1].material.roughness = metalMatOptions.roughness
    })
metalOptions.add(metalMatOptions, 'metalness').min(0).max(1).step(.001)
    .onChange(() => {
        scene.children[3].children[0].children[1].material.metalness = metalMatOptions.metalness
    })


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
const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820, 3);
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
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.outputEncoding = THREE.sRGBEncoding

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

// Canvas Event Listers
document.getElementById("wood1").addEventListener("click", updateWood1)

function updateWood1() {
    const woodMat = new THREE.MeshStandardMaterial()
    textureLoader.load('textures/furniture/wood/w_1_dirty/textures/diff.jpg',

    // onLoad callback
    function ( texture ) {
        // in this example we create the material when the texture is loaded
        woodMat.map = texture
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function ( err ) {
        console.error( 'An error happened.' )
    }
    )
    textureLoader.load('textures/furniture/wood/w_1_dirty/textures/normal.jpg',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            woodMat.normalMap = texture
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' )
        }
    )
    textureLoader.load('textures/furniture/wood/w_1_dirty/textures/rough.jpg',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            woodMat.roughnessMap = texture
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' )
        }
    )
    scene.children[3].children[0].children[0].material = woodMat   
}

document.getElementById("wood2").addEventListener("click", updateWood2)

function updateWood2() {
    const woodMat = new THREE.MeshStandardMaterial()
    textureLoader.load('textures/furniture/wood/w_2_ply/textures/diff.jpg',

    // onLoad callback
    function ( texture ) {
        // in this example we create the material when the texture is loaded
        woodMat.map = texture
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function ( err ) {
        console.error( 'An error happened.' )
    }
    )
    textureLoader.load('textures/furniture/wood/w_2_ply/textures/normal.jpg',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            woodMat.normalMap = texture
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' )
        }
    )
    textureLoader.load('textures/furniture/wood/w_2_ply/textures/rough.jpg',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            woodMat.roughnessMap = texture
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' )
        }
    )
    scene.children[3].children[0].children[0].material = woodMat   
}

document.getElementById("wood3").addEventListener("click", updateWood3)

function updateWood3() {
    const woodMat = new THREE.MeshStandardMaterial()
    textureLoader.load('textures/furniture/wood/w_3_kitchenwood/textures/diff.jpg',

    // onLoad callback
    function ( texture ) {
        // in this example we create the material when the texture is loaded
        woodMat.map = texture
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function ( err ) {
        console.error( 'An error happened.' )
    }
    )
    textureLoader.load('textures/furniture/wood/w_3_kitchenwood/textures/normal.jpg',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            woodMat.normalMap = texture
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' )
        }
    )
    textureLoader.load('textures/furniture/wood/w_3_kitchenwood/textures/rough.jpg',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            woodMat.roughnessMap = texture
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' )
        }
    )
    scene.children[3].children[0].children[0].material = woodMat   
}

document.getElementById("wood4").addEventListener("click", updateWood4)

function updateWood4() {
    const woodMat = new THREE.MeshStandardMaterial()
    textureLoader.load('textures/furniture/wood/w_4_table/textures/diff.jpg',

    // onLoad callback
    function ( texture ) {
        // in this example we create the material when the texture is loaded
        woodMat.map = texture
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function ( err ) {
        console.error( 'An error happened.' )
    }
    )
    textureLoader.load('textures/furniture/wood/w_4_table/textures/normal.jpg',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            woodMat.normalMap = texture
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' )
        }
    )
    textureLoader.load('textures/furniture/wood/w_4_table/textures/rough.jpg',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            woodMat.roughnessMap = texture
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' )
        }
    )
    scene.children[3].children[0].children[0].material = woodMat   
}

document.getElementById("wood5").addEventListener("click", updateWood5)

function updateWood5() {
    const woodMat = new THREE.MeshStandardMaterial()
    textureLoader.load('textures/furniture/wood/w_5_finegrain/textures/diff.jpg',

    // onLoad callback
    function ( texture ) {
        // in this example we create the material when the texture is loaded
        woodMat.map = texture
    },

    // onProgress callback currently not supported
    undefined,

    // onError callback
    function ( err ) {
        console.error( 'An error happened.' )
    }
    )
    textureLoader.load('textures/furniture/wood/w_5_finegrain/textures/normal.jpg',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            woodMat.normalMap = texture
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' )
        }
    )
    textureLoader.load('textures/furniture/wood/w_5_finegrain/textures/rough.jpg',

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            woodMat.roughnessMap = texture
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' )
        }
    )
    scene.children[3].children[0].children[0].material = woodMat   
}


document.getElementById("light1").addEventListener("click", updateLighting1)

function updateLighting1() {
    const rgbeloader = new RGBELoader().setPath( 'lighting/' ).load( 'ballroom_1.hdr', function ( texture ) {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
    })
}

document.getElementById("light2").addEventListener("click", updateLighting2)

function updateLighting2() {
    const rgbeloader = new RGBELoader().setPath( 'lighting/' ).load( 'studio_1.hdr', function ( texture ) {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
    })
}
document.getElementById("light3").addEventListener("click", updateLighting3)

function updateLighting3() {
    const rgbeloader = new RGBELoader().setPath( 'lighting/' ).load( 'studio_2.hdr', function ( texture ) {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
    })
}
document.getElementById("light4").addEventListener("click", updateLighting4)

function updateLighting4() {
    const rgbeloader = new RGBELoader().setPath( 'lighting/' ).load( 'studio_3.hdr', function ( texture ) {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
    })
}
document.getElementById("light5").addEventListener("click", updateLighting5)

function updateLighting5() {
    const rgbeloader = new RGBELoader().setPath( 'lighting/' ).load( 'hall_1.hdr', function ( texture ) {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
    })
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