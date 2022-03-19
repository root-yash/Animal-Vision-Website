import Experience from "../Experience.js";
import { PlaneBufferGeometry, Mesh, MeshBasicMaterial } from "three";
export default class RetroCom{
    constructor(){
        this.experience = new Experience()

        this.scene = this.experience.scene
        this.resource = this.experience.resources

        this.resource.on('ready', () =>{

            const plane_geometry = new PlaneBufferGeometry(10,10)
            const plane_material = new MeshBasicMaterial({
                color: "#FAC825"   
            })
            this.plane = new Mesh(plane_geometry, plane_material)
            this.plane.rotation.x = -Math.PI * 0.5
            this.model = this.resource.items.Computer_Model.scene
            this.scene.add(this.model, this.plane)
        })

    }

}