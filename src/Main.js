import './Main.css'
import Experience from "./Experience/Experience.js"

function main(){
    const canvas0 = document.querySelector("#canvas0")
    const canvas1 = document.querySelector("#canvas1")
    const experience = new Experience(canvas0, canvas1)
}

main()

