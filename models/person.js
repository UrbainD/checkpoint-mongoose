const mongoose=require('mongoose')
const Schema=mongoose.Schema; // schéma est utilisé pour définir la structure des données du document

//definir le schema
const personSchema=new Schema(
    {
        name:{
            type:String,
            required:true
        },
        age:Number,
        favoriteFoods : [String]
    }
)

//definir le modele

const Person=mongoose.model('Person',personSchema)
module.exports=Person;