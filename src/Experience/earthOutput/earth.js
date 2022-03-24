import { Group } from "three";
import Experience from "../Experience";
import EventEmitter from "../Utils/EventEmitter";

export default class earth extends EventEmitter{
    constructor(){
        super()
        this.experience = new Experience
        this.groupEarth = new Group()

        this.experience.scene.add(this.groupEarth)

        // when resources (model) is being loaded
        this.experience.resources.on('ready', () =>{
            const model = this.experience.resources.items.earth.scene
            this.groupEarth.add(model)
            
            console.log(this.experience.resources.items.earth.scene.children[0])
        })

    }
}