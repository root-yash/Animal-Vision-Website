export default class AnimationRetroCam{
    constructor(experienposition){
        let frame = 300
        const finalPosition = {
            x : 0,
            y : 1.935,
            z : 2.845
        }
        const xgap = ( finalPosition.x - position.x ) / frame
        const ygap = ( finalPosition.y - position.y ) / frame 
        const zgap = ( finalPosition.z - position.z ) / frame 
        
        return {
            frame: frame,
            xgap: xgap,
            ygap: ygap,
            zgap: zgap 
        }        
    }
    
}