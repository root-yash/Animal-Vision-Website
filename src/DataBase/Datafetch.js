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
    
    fetchData(){
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb+srv://Abhishek:abhi78ek@cluster0.fozyi.mongodb.net/snakevision?retryWrites=true&w=majority";

        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("snakevision");
        dbo.collection("snakedata").findOne({ "Sr_No": this.index }, function(err, result) {
            if (err) throw err;
            Name = result.Name;
            Country = result.country;
            Genus = result.Genus;
            Venomous = result.Venomous;
            Size = result.Size;
            Details = result.Details;

            db.close();
        });
        });
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
