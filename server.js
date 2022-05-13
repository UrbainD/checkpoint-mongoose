const express=require('express')
const app=express()
const mongoose=require('mongoose')
const Person=require('./models/person')

//Se connecter to à la base de données atlas
const dbURI="mongodb+srv://urbain:passer@cluster0.rm3sz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(dbURI,{useNewUrlParser: true , useUnifiedTopology: true }, { useFindAndModify: false })
.then((response)=>{
    app.listen(3000,(err)=>{
        (err)?console.log("server not running",err):console.log("server running successfully")
    })
    
    })
.catch((err)=>{console.log("connection to database failed",err)})


//Création et enregistrement d'un document
app.get("/add",(req,res)=>{
//Création de la première instance du modele personne
const person1=new Person({
    name:"ami",
    age:20,
    favoriteFoods :['salade','cake','burger']
})
//enregistrement de la première personne à mongoDB atlas
person1.save((err)=>{
 (err)?console.log("error while saving",err):console.log("saved successfully")
})
})

//création et enregistrement plusieurs personnes (plusieurs instances de modèle) : cette méthode déclenche automatiquement l'enregistrement
app.get('/add_many',(req,res)=>{
    Person.create([
        {name:"adama",
        age:18,
        favoriteFoods :['nouille','burrito']},
        {name:"awa",
        age:24,
        favoriteFoods :['caldou','yassa']},
        {name:"jean",
        age:16,
        favoriteFoods :['fondé']},
        {name:"urbain",
        age:26,
        favoriteFoods :['lakh','riz']}
    ])
        
})

//search by name 
let name="urbain"
app.get('/search',(req,res)=>{
    Person.find({"name":name}).then((result)=>{
        res.send(result)
    })
    .catch((err)=>{console.log("error occured while searching",err)})
})
//search findOne
app.get('/findOne',(req,res)=>{
    Person.findOne({"favoriteFoods":{$in : ["yassa","nouille"]}})
    .then((result)=>{
        res.send(result)
    })
    .catch((err)=>{console.log("error occured while searching",err)})
})

//findById
let id="627e80f017728a86ce3cb97b"
app.get('/findById',(req,res)=>{
    Person.findById(id, function (err, doc) { 
        if (err){ 
            console.log(err); 
        } 
        else{ 
            console.log("Result : ", doc); 
        } 
    }); 
})

//mises à jour classiques en exécutant Rechercher, Modifier, puis Enregistrer

const personId="627e80f017728a86ce3cb97b"
app.get("/update",(req,res)=>{
   Person.findById(personId,(err,personFound)=>{
    if(err){
        console.log("error while searching",err)
    } 
    else{
        personFound.favoriteFoods.push('hamburger');
        personFound.save()
        .then(response=>{console.log("person saved successfully",personFound)})
        .catch(err=>console.log("error occured while saving",err))
    }
      
   })

})

//mises à jour sur un document à l'aide de model.findOneAndUpdate()
const personName="urbain"
app.get("/findOneAndUpdate",(req,res)=>{
    Person.findOneAndUpdate({"name":personName},{"age":23},{new:true},(err,personUpdated)=>{
        (err)?console.log("error while updating",err):console.log("the new updated person :",personUpdated)
    })
})

//Supprimer un document à l'aide de model.findByIdAndRemove
const personId2="627e80f017728a86ce3cb97b"
app.get('/findByIdAndRemove',(req,res)=>{
    Person.findByIdAndRemove(personId2,(err,deletedPerson)=>{
        (err)?console.log("error occured while deleting"):console.log("this object is deleted with succes",deletedPerson)
    })
})

//Supprimer de nombreux documents avec model.remove()
app.get('/deleteAllMary',(req,res)=>{
    Person.remove({"name":"Mary"},(err,result)=>{
          (err)?console.log("error while deleting"):console.log("deleted successfully",result)
    })
})


//Chain Search Query Helpers pour affiner les résultats de recherche
app.get('/LikeBurrito',(req,res)=>{
    Person.find({"favoriteFoods":{$in:"burrito"}}).sort('name').limit(2).select('-age').exec((err,data)=>{
    (err)?console.log("error while looking for people who like burrito",err):console.log("people who like burrito",data)
    })
})