import EventEmitter from "../Experience/Utils/EventEmitter";

export default class ApiResult extends EventEmitter{

    constructor(image_base64){
        
        super()
        image_base64 = image_base64.split(',')[1]

        const headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json"
           }
           
        const bodyContent = JSON.stringify({
            "img_base64": image_base64
        });
        
        fetch("https://snake-species-spi.herokuapp.com/",{
            method:"POST",
            body: bodyContent,
            headers: headersList
        }).then((response)=>{
            return response.text()
        }).then((data)=>{
            this.result = data
            this.trigger("resultRecieved")
        })
    } 
}