var data = {name: "fred",
age:17,
hobby: "",
favFood: "pizza"};

var data1 = ["food","is", "yummy"];

function change (){
    return new Promise((resolve, reject)=>{
        for(var prop in data1){
            console.log("Prop Was: "+prop.valueOf());
            if(prop.valueOf()=="is"){ //if value is blank
                prop.valueOf() = null; //change key to null
            }
            console.log("Prop is: "+prop.valueOf());
        }
        
        resolve();
    });
}

change().then(()=>{
    console.log("After function" +data1);
});


