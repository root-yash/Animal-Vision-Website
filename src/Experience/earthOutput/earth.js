import GUI from "lil-gui";
import { Group, PointLight } from "three";
import * as Three from "three";
import Experience from "../Experience";
import EventEmitter from "../Utils/EventEmitter";

export default class earth extends EventEmitter{
    constructor(){
        super()
        this.experience = new Experience
        this.experience.camera.instance.position.set(0, 0, 5)
        this.groupEarth = new Group()
        this.experience.light.intensity = 0.1
        this.experience.scene.add(this.groupEarth)
        this.pointLight = new PointLight("white", 5)
        this.pointLight.position.set(0, 15, 4)
        this.groupEarth.add(this.pointLight)
        console.log(this.experience.camera.instance)
        // when resources (model) is being loaded
        this.experience.resources.on('ready', () =>{
            const model = this.experience.resources.items.earth.scene
            this.groupEarth.add(model)
            this.groupEarth.rotation.x = -Math.PI*0.5
            this.groupEarth.rotation.z = Math.PI*0.8 
        })
        this.experience.camera.controls.enabled = false
        this.earthControls()
    }

    earthControls(){

        let isdragging = false
        let previousMousePosition = {
            x: 0,
            y: 0
        }

        addEventListener("mousedown", ()=>{
            isdragging = true
        })
        addEventListener("mouseup", ()=>{
            isdragging = false
        })
        addEventListener("mousemove", (event)=>{
            let deltaMove = {
                x: event.offsetX-previousMousePosition.x,
                y: event.offsetY-previousMousePosition.y
            }
            if (isdragging){

                var deltaRotationQuaternion = new Three.Quaternion()
                    .setFromEuler(new Three.Euler(
                        -(deltaMove.y * 0.05)*( Math.PI / 180 ),
                        0,
                        (deltaMove.x * 0.8)*( Math.PI / 180 ),
                        'XYZ'
                    ))
                this.groupEarth.children[1].quaternion.multiplyQuaternions(deltaRotationQuaternion, this.groupEarth.children[1].quaternion)
                
            }
            previousMousePosition = {
                x: event.offsetX,
                y: event.offsetY
            }
        })

    }
}