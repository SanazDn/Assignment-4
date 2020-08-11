const meal =
{

    fakedb1 : [],

    initDB(){

this.fakedb1.push({
    title : "Weight Loss",
    description : "High protein, low-calorie meals with a nutrient profile tuned for weight loss",
     price : "$11.95",
     number : 2,
     featured : false,
     imgPath : "1.jpg"
})

this.fakedb1.push({
    title : "Butter Chicken with Mixed Vegetables",
    description : "Higher protein and calorie portions to support your muscle gain momentum",
     price : "$14.95",
     number : 3,
     featured : false,
     imgPath : "2.jpg"
})

this.fakedb1.push({
    title : "Muscle Gain",
    description : "Higher protein and calorie portions to support your muscle gain momentum",
    number : 3,
    price : "$13.95",
     featured : true,
     imgPath : "3.jpg"
})

this.fakedb1.push({
    title : "Keto",
    description : "High fat, low carb meals with moderate protein to achieve and sustain ketosis",
     price : "$17.95",
     number : 2,
     featured : false,
     imgPath : "4.jpg"
})


    },

    getallproducts(){

        return this.fakedb1;

    },

    getfeaturedproducts(){
       
        },

}

meal.initDB();
module.exports = meal;