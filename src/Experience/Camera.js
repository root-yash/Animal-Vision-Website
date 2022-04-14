import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        // const gui = new GUI();
        this.instance = new THREE.PerspectiveCamera(33, this.sizes.width / this.sizes.height, 0.1, 100)
        // gui.add(this.instance.position, "x", -8, 8, 0.001)
        // gui.add(this.instance.position, "y", -8, 8, 0.001)
        // gui.add(this.instance.position, "z", -8, 8, 0.001)
        // gui.hide = true
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
    }
}