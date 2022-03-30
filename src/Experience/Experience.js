import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import ResourceLoader from './Utils/ResourceLoader.js'

import sources from './Sources.js'
import { Color, EqualStencilFunc, WebGLRenderer } from 'three'
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import typefacefont from "three/examples/fonts/gentilis_regular.typeface.json"
import RetroCom from './RetroCom/RetroCom.js'
import ApiResult from '../API/ApiResult.js'
import EventEmitter from './Utils/EventEmitter.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import earth from './earthOutput/earth.js'
let instance = null

export default class Experience extends EventEmitter
{
    constructor(canvas0, canvas1)
    {
        super()
        this.whichScene = 0
        // Singleton
        if(instance)
        {
            return instance
        }

        instance = this

        // if the 
        
        // Global access
        window.experience = this

        // Options
        this.canvas = canvas0
        this.tempcanvas = canvas1
        
        // Resource Loader
        this.resources = new ResourceLoader(sources)

        // setup 
        this.setup()

    }

    setup(){
        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.light = new THREE.AmbientLight({
            color: 0xffffff,
            intensity: 0.4
        })
        this.scene.add(this.light)
        this.camera = new Camera()

        if(this.whichScene == 0){
            this.computerScene()
        }
        else{
            this.earthScene()
        }
        
        this.renderer = new Renderer()

        // Resize event
        this.sizes.on('resize', () =>{
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>{
            this.update()
        })
    }

    computerScene(){
        this.scene.background = new Color("#FAC825")
        this.camera = new Camera()
        this.retrocom = new RetroCom()
        this.retrocom.on("readytosent", ()=>{
            this.retrocom.ctx.fillText("Computing the Result",10,60)
            this.retrocom.MonitorTexture.needsUpdate = true
            this.getResult()       
        })
    }

    earthScene(){
        this.scene.background = new Color("black")
        this.camera = null
        this.camera = new Camera()
        this.earth = new earth()
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
            //this.scene.background = new Color("red")
            this.scene.remove(this.retrocom.group)
 
            //remove first canvas
            document.body.removeChild(this.canvas)

            //change canvas
            this.canvas = this.tempcanvas

            // which scene comp or earth 
            this.whichScene = 1
            this.setup()
            //this.retrocom = null     
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