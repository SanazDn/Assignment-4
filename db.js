const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
var connectionString = "mongodb+srv://sanazdn:Aghahi822@cluster0.lldrj.mongodb.net/Web322c2020?retryWrites=true&w=majority";

let Schema = mongoose.Schema;

let studentSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    lname: String,
    name: String,
    password: String, 

});

 let mealSchema = new Schema({
    title: String,
      
    
    number: Number,
    price: Number,
    description:String,
    catagory: String,
    topmeal: Boolean,
   img: String
}); 


let Students;

let Meals;

module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{
        let db = mongoose.createConnection(connectionString,{ useNewUrlParser: true, useUnifiedTopology: true });
        
        db.on('error', (err)=>{
            reject(err);
        });

        db.once('open', ()=>{
            
            Students = db.model("students", studentSchema);
           Meals = db.model("products", mealSchema);
            resolve();
          });

    });}


    module.exports.addStudent = function(data){
        return new Promise((resolve,reject)=>{
            
            for (var formEntry in data){
                if (data[formEntry] == "") 
                    data[formEntry] = null;
            }
    
            var newStudent = new Students(data);   
            bcrypt.genSalt(10)  
            .then(salt=>bcrypt.hash(newStudent.password,salt)) 
            .then(hash=>{ 
               
                newStudent.password=hash;
                
                newStudent.save((err)=>{
                    if (err){
                        console.log("Woopsie there was an error: "+err);
                        reject(err);
                    }
                    else{
                        console.log("Saved that student: "+data.name);
                        resolve();
                    }
                });
            })
            .catch(err=>{
                console.log(err); 
                reject("Hashing Error");
            });
    
            
        });
    }
    
    module.exports.addmeal = function(data){
        return new Promise((resolve,reject)=>{
        
           data.topmeal = (data.topmeal)? true: false;
            
            for (var formEntry in data){
                if (data[formEntry] == "") 
                    data[formEntry] = null;
            }
    
            var newMeal = new Meals(data);   
        
                newMeal.save((err)=>{
                    if (err){
                        console.log("Woopsie there was an error: "+err);
                        reject(err);
                    }
                    else{
                        console.log("Saved that meal: "+data.title);
                        resolve();
                    }
                });
            })
            .catch(err=>{
                console.log(err); 
                reject("Hashing Error");
            });

    }
    
    

module.exports.getStudents = function(){
    return new Promise((resolve,reject)=>{
        Students.find() 
        .exec() 
        .then((returnedStudents)=>{
        
            resolve(returnedStudents.map(item=>item.toObject()));
        }).catch((err)=>{
                console.log("Error Retriving students:"+err);
                reject(err);
        });
    });
}


module.exports.getmeals = function(){
    return new Promise((resolve,reject)=>{
        Meals.find() 
        .exec() 
        .then((returnedMeals)=>{
            
            resolve(returnedMeals.map(item=>item.toObject()));
        }).catch((err)=>{
                console.log("Error Retriving students:"+err);
                reject(err);
        });
    });
}


module.exports.getStudentsByEmail = function(inEmail){
    return new Promise((resolve,reject)=>{
        
        Students.find({email: inEmail}) 
        .exec() 
        .then((returnedStudents)=>{
            if(returnedStudents.length !=0 )
            
                resolve(returnedStudents.map(item=>item.toObject()));
            else
                reject("No Students found");
        }).catch((err)=>{
                console.log("Error Retriving students:"+err);
                reject(err);
        });
    });
}

module.exports.getmealsBytitle = function(inTitle){
    return new Promise((resolve,reject)=>{
        
        Meals.find({title: inTitle}) 
        .exec() 
        .then((returnedMeals)=>{
            if(returnedMeals.length !=0 )
            
                resolve(returnedMeals.map(item=>item.toObject()));
            else
                reject("No Meals found");
        }).catch((err)=>{
                console.log("Error Retriving meals:"+err);
                reject(err);
        });
    });
}



module.exports.validateUser = (data)=>{
    return new Promise((resolve,reject)=>{
    if (data){
        this.getStudentsByEmail(data.email).then((retStudent)=>{
           
                bcrypt.compare(data.password, retStudent[0].password).then((result) => {
                    if (result){
                        
                        resolve(retStudent);
                        
                    }
                    else{
                        reject("password don't match");
                        return;
                        
                    }
                    
                });
        }).catch((err)=>{
            reject(err);
            return;
        });
    }
    });
}




module.exports.editStudent = (editData)=>{
    return new Promise((resolve, reject)=>{
        
        bcrypt.genSalt(10)  
        .then(salt=>bcrypt.hash(editData.password,salt)) 
        .then(hash=>{
            Students.updateOne(
            {email : editData.email}, 
            {$set: {  
                name: editData.name,
                lname: editData.lname,
                password: hash
            }})
            .exec() 
            .then(()=>{
                console.log(`Student ${editData.name} has been updated`);
                resolve();
            }).catch((err)=>{
                reject(err);
            });
        }).catch(()=>{
            reject("Hashing error");
        });
    });
}

module.exports.editmeal = (editData)=>{
    return new Promise((resolve, reject)=>{
        editData.topmeal = (editData.topmeal)? true: false;
        
            Meals.updateOne(
            {title : editData.title}, 
            {$set: {  
                price: editData.price,
                number: editData.number,
               description: editData.description,
               catagory: editData.catagory,
               
            }})
            .exec() 
            .then(()=>{
                console.log(`Meal ${editData.title} has been updated`);
                resolve();
            }).catch((err)=>{
                reject(err);
            });
        }).catch(()=>{
            reject("Hashing error");
        });
    
}



module.exports.deleteStudentByEmail = (inEmail)=>{
    return new Promise((resolve,reject)=>{
        Students.deleteOne({email: inEmail})
        .exec()
        .then(()=>{
            resolve();
        }).catch(()=>{
            reject();
        })
    });
}

module.exports.deleteMealtByTitle = (inTitle)=>{
    return new Promise((resolve,reject)=>{
        Meals.deleteOne({title: inTitle})
        .exec()
        .then(()=>{
            resolve();
        }).catch(()=>{
            reject();
        })
    });
}