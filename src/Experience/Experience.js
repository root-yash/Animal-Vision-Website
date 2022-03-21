import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import ResourceLoader from './Utils/ResourceLoader.js'

import sources from './Sources.js'
import { Color, WebGLRenderer } from 'three'
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import typefacefont from "three/examples/fonts/gentilis_regular.typeface.json"
import RetroCom from './RetroCom/RetroCom.js'
import ApiResult from '../API/ApiResult.js'
import EventEmitter from './Utils/EventEmitter.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
let instance = null

export default class Experience extends EventEmitter
{
    constructor(_canvas)
    {
        super()
        // Singleton
        if(instance)
        {
            return instance
        }

        instance = this
        
        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.scene.background = new Color("#FAC825")
        this.light = new THREE.AmbientLight({
            color: 0xffffff,
            intensity: 0.4
        })
        this.scene.add(this.light)
        this.resources = new ResourceLoader(sources)
        this.camera = new Camera({
            "position": [4.9, 2.9, 5.799]
        })
        this.retrocom = new RetroCom()
        this.renderer = new Renderer()

        // Resize event
        this.sizes.on('resize', () =>{
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>{
            this.update()
        })
        
        this.retrocom.on("readytosent", ()=>{
            this.retrocom.ctx.fillText("Computing the Result",10,60)
            this.retrocom.MonitorTexture.needsUpdate = true
            this.getResult()
        })

    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.renderer.update()
    }

    getResult()
    {
        this.image = this.retrocom.browse.image
        const apiresult = new ApiResult(this.image)
        apiresult.on("resultRecieved",()=>{
            this.result = JSON.parse(apiresult.result).result
            this.scene.background = new Color("red")
            this.scene.remove(this.retrocom.group)
            console.log(typefacefont)
            const fontloader = new FontLoader()
            fontloader.load("font/helvetiker_regular.typeface.json", (font)=>{
                const Geometry = new TextGeometry(
                    this.result, {
                        font: font,
                        size: 1,
                        height: 0.01,
                        curveSegments: 30,
                        bevelEnabled: true,
                        bevelThickness: 0.1,
                        bevelSize: 0.01,
                        bevelOffset: 0,
                        bevelSegments: 5                    
                    }
                )
                const material = new THREE.MeshBasicMaterial()
                this.scene.add(new THREE.Mesh(Geometry, material))
            })
            this.retrocom = null     
        })  
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        this.camera.controls.dispose()
        this.renderer.instance.dispose()
        if(this.debug.active)
            this.debug.ui.destroy()        
    }
}