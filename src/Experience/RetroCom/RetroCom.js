import Experience from "../Experience.js";
import { PlaneBufferGeometry, Mesh, MeshBasicMaterial, CanvasTexture, Group, Raycaster, Vector2, Vector3} from "three";
import GUI from 'lil-gui'
import EventEmitter from "../Utils/EventEmitter.js";
import ImageBrowse from "../Utils/ImageBrowse.js";
export default class RetroCom extends EventEmitter{
    constructor(){
        super()
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.group = new Group()
        this.resource = this.experience.resources

        this.scene.add(this.group)
        
        // when resources (model) is being loaded
        this.resource.on('ready', () =>{
            const plane_geometry = new PlaneBufferGeometry(4,4)
            const plane_material = new MeshBasicMaterial({
                color: "#FAC825"
            })
            this.plane = new Mesh(plane_geometry, plane_material)
            this.plane.rotation.x = -Math.PI * 0.5
            this.plane.position.z = -0.3
            this.model = this.resource.items.Computer_Model.scene
            this.group.add(this.model, this.plane)
        })
        
        // Wait 3 sec for computer to start 
        this.currentTime = Date.now()
        this.StartComputer()
        this.on("ClickOnDisplay", this.KeyboardListener())        
        
    }
    
    StartComputer(){
        let delta = 0
        window.requestAnimationFrame(() =>
        {
            delta = Date.now() - this.currentTime
            if(delta > 30){
                return this.screen()
            }
            this.StartComputer()       
        })
    }

    screen(){

        /**
         * Display the Screen of the Retro Computer it is a plane mesh 
         */
        
        const canvas = document.createElement("canvas")
        this.ctx = canvas.getContext("2d")
        this.MonitorTexture = new CanvasTexture(canvas)
        const plane_geometry = new PlaneBufferGeometry(1,1)
        const plane_material = new MeshBasicMaterial({
            map: this.MonitorTexture
        })
        this.MonitorScreen = new Mesh(plane_geometry, plane_material)
        this.MonitorScreen.position.set(-0.144, 0.694, 0.3)
        this.MonitorScreen.scale.set(0.749, 0.497)
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(-0.144,0.694,1000,1000)
        this.ctx.fillStyle = "White"
        this.ctx.font = "15px sans-serif"
        this.ctx.fillText("Click To Start", 10, 20)
        this.MonitorTexture.needsUpdate = true
        this.group.add(this.MonitorScreen)
        
        // this.group.position.set(2.479, 1.147, 3.526)
        // this.group.rotation.set(-0.19, 0.05, 0.128)
        this.UpdateScreen()
    }
    
    UpdateScreen(){
        /**
         * update The Text on the display according to the users input 
         */

        const raycaster = new Raycaster()
        const mouse = new Vector3()

        addEventListener("mousedown", (event) =>{

            event.preventDefault()
            mouse.x = (event.clientX / this.experience.renderer.sizes.width) * 2 - 1;
            mouse.y =  - (event.clientY / this.experience.renderer.sizes.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, this.experience.camera.instance);

            const meshObjects = this.MonitorScreen // three.js objects with click handlers we are interested in

            var intersects = raycaster.intersectObject(meshObjects);

            if(intersects.length > 0){
                this.word = ""
                this.ctx.clearRect(-0.144,0.694,1000,1000)
                this.ctx.fillText("#root >", 10, 20)
                this.MonitorTexture.needsUpdate = true
                this.trigger('ClickOnDisplay')
            }
             
        })        
    }

    KeyboardListener(){

        /**
         * take the input user and perform the operation
         */

        const start = "#root >"      
        addEventListener("keypress",(event) =>{
            if(event.key == "Enter"){
                return
            }
            else{
                this.word = this.word + event.key
            }    
            this.ctx.fillText(start+this.word, 10, 20)
            this.MonitorTexture.needsUpdate = true
        })
        addEventListener("keydown",(event)=>{
            if(event.key == "Backspace"){
                this.word = this.word.slice(0, -1)
                this.ctx.clearRect(-0.144,0.694,1000,1000)
                this.ctx.fillText(start+this.word, 10, 20)
                this.MonitorTexture.needsUpdate = true
            }
            else if(event.key == "Enter"){
                if(this.word == "upload"){
                    this.browse = new ImageBrowse() 
                    this.browse.on("imageUploaded",()=>{
                        this.trigger("readytosent")
                    })                         
                }
            }
            
        })
    }

    

}