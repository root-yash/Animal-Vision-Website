/**
 * Abhishek this Class is your responsibility
 * sending index of the image (in order of the csv file ) in constructor 
 * then fetching from mongo db server then making object of the info
 * I am expecting the Data in object 
 * you can check out the getData() function for the way the 
 * information is returned
 */


export default class Database{
    constructor(index){
        this.index = index
        console.log("initiated")
    }

    getData(){
        return {
            // csv file contains scientific name Please change it to common name 
            name : "indian cobra", 
            location : "India",
            continent : "Asia",
            Venomous : "1",
            length : "2-3 m",
            Description: "It is distinct from the king cobra which belong ...",
            latitude: 28,
            longitude: 77 
        }
    }

}