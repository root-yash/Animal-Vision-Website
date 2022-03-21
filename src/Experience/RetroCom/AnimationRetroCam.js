import Time from "../Utils/Time"
export default class AnimationRetroCam{
    constructor(experience, finalPosition){
        
        this.experience = experience
        const position = this.experience.camera.instance.position
        this.frame = 200
        const frame = this.frame
        this.xgap = ( finalPosition.x - position.x ) / frame
        this.ygap = ( finalPosition.y - position.y ) / frame 
        this.zgap = ( finalPosition.z - position.z ) / frame 
        this.time = new Time()

        if (this.experience.retrocom.AnimationCount == 1){
            this.animation()    
        }
          
    }

    animation(){

        this.time.on("tick", ()=>{
            if ( this.frame > 0){
                this.experience.camera.instance.position.x += this.xgap 
                this.experience.camera.instance.position.y += this.ygap
                this.experience.camera.instance.position.z += this.zgap
                this.frame-=1
            }
            else{
                this.experience.retrocom.AnimationCount = 0
                this.time.off("tick")
            }
            
        })   
    }
    
}