import GUI from "lil-gui";
import { Group, PointLight } from "three";
import Experience from "../Experience";
import EventEmitter from "../Utils/EventEmitter";

export default class earth extends EventEmitter{
    constructor(){
        super()
        const gui = new GUI()
        this.experience = new Experience
        this.experience.camera.instance.position.set(0, 0, 5)
        this.groupEarth = new Group()
        this.experience.light.intensity = 0
        this.experience.scene.add(this.groupEarth)
        this.pointLight = new PointLight("white", 5)
        this.pointLight.position.set(0, -15, 4)
        this.groupEarth.add(this.pointLight)

        // when resources (model) is being loaded
        this.experience.resources.on('ready', () =>{
            const model = this.experience.resources.items.earth.scene
            this.groupEarth.add(model)
            this.groupEarth.rotation.x = -Math.PI*0.5
            this.groupEarth.rotation.z = Math.PI*0.8 
        })

    }
}