const product =
{

    fakedb : [],

    init(){

this.fakedb.push({
    title : "Chicken Teriyaki",
   /* description : "To suit your much needed craving, this dish is sure to satisfy for either lunch or dinner! Subtle hints of ginger and teriyaki sauce paired with our seasoned chicken will have you feeling like you have your own personal chef!",
    */ price : "$11.95",
     featured : false,
     imgPath : "Chicken.jpg"
})

this.fakedb.push({
    title : "Butter Chicken with Mixed Vegetables",
    /*description : "A dish enthused by our chefs and cook’s ability to be diverse and passionate about cooking. With our sauce program we created this spice coconut tomato sauce to smother our chicken to create this inspired meal. It’ll leave the room smelling like you were in the kitchen cooking all day.",
     */price : "$14.95",
     featured : false,
     imgPath : "Bombay.jpg"
})

this.fakedb.push({
    title : "Sundried Tomato and Basil Pesto Chicken Linguini",
    /*description : "A fan favourite simple ingredients robust and bold flavours! Sundried Tomatoes, Basil Pesto, Blistered Cherry Tomatoes with Pan Roasted Chicken Linguini in Creamy Garlic Sauce.",
    */
    price : "$13.95",
     featured : true,
     imgPath : "Sun.jpg"
})

this.fakedb.push({
    title : "Roast Chicken and Homemade Pan Gravy",
    /*description : "One of our pride is training our cooks to understand the dynamic of cooking. Our Pan Roast gravy is an integral part training our cooks on basis of consistency, viscosity, emulsions and the list goes on! Authentic Pan Gravy is created with hints of tarragon, black pepper and house spices, Chicken Roasted to provide succulent flavour in each bite!",
     */price : "$17.95",
     featured : false,
     imgPath : "Bombay.jpg"
})


    },

    getallproducts(){

        return this.fakedb;

    },

    getfeaturedproducts(){

       
            return this.fakedb.filter( product => product.featured === true );
       
       
        },

}

product.init();
module.exports = product;