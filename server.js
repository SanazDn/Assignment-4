const express = require("express");  
const app = express();  
const path = require("path");
const ds = require("./data.js");
const db = require("./db.js");
const exphbs = require("express-handlebars");
const multer = require("multer");
const bp = require("body-parser");
const clientSessions = require("client-sessions");


require('dotenv').config({path:"./config/keys.env"});

//load productModel 
const productModel = require("./models/product");

const product = require("./models/product");
const meal = require("./models/meal");


const HTTP_PORT = process.env.PORT || 3000;    

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}


app.use(clientSessions({
  cookieName: "session", 
  secret: "week10example_web322", 
  duration: 2 * 60 * 1000, 
  activeDuration: 1000 * 60 
}));


 const storage = multer.diskStorage({
  destination: "./public/photos/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
}); 

 const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    return cb(null, true);
  } else {
    return cb(new Error('Not an image! Please upload an image.', 400), false);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFilter }); 

app.use(bp.urlencoded({ extended: true }));

app.set("views", "./views");

app.engine(".hbs", exphbs({ extname: ".hbs"})),

app.set("view engine", ".hbs"); 

app.use(express.static('public'));


app.get("/", (req, res) => { 
  res.render("home");
    
});

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    res.redirect("/login");
  } 
  else {
    next();
  }
}

function ensureAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role!="admin") {
    res.redirect("/login");
  } else {
    next();
  }
}

app.get("/login",(req,res)=>{
  res.render("login");
});

app.post("/login",(req,res)=>{
  db.validateUser(req.body)
  .then((inData)=>{
    req.session.user = inData[0];  

    console.log(req.session.user);
    res.render("customerData",{students: inData, session: req.session.user});
  })
  .catch((message)=>{
    console.log(message);
    console.log("message");
    res.redirect("/login");
  });
});

app.get("/private", ensureLogin, (req,res)=>{
  res.render("private",{data: req.session.user});
});

app.get("/logout",(req,res)=>{
  req.session.reset();
  res.redirect("/login");
});


app.get("/customer",ensureLogin,ensureAdmin,(req,res)=>{
  res.render("register");
});

 app.get("/customer/add" ,ensureLogin,ensureAdmin,(req,res)=>{
   if (req.query.email){
     db.getStudentsByEmail(req.query.email).then((data)=>{
       res.render("customerData",{students: (data.length!=0)?data:undefined});
     }).catch((err)=>{
       res.render("customerData"); 
     });
   }
   else{
   db.getStudents().then((data)=>{
     res.render("customerData",{students: (data.length!=0)?data:undefined});
   }).catch((err)=>{
     res.render("customerData"); 
   });
   }
 });

app.post("/customer",(req,res)=>{
  db.addStudent(req.body).then(()=>{
    res.redirect("/customer/add");
  }).catch((err)=>{
    console.log("Error adding student: "+ err);
    res.redirect("/customer");
  });
});

app.get("/product",(req,res)=>{
  console.log("ssss");
      res.render("productList",{
          title:"Product Listing Page",
          
          products: productModel.getallproducts()
  
      });
  });

  app.get("/product/add",ensureLogin,ensureAdmin,(req,res)=>{
    
     
    res.render("productAdd",{
        title:"Product Add Form",
        //products: productModel.getallproducts()
    });
});

app.post("/product/add"  ,upload.single("photo") ,(req,res)=>{
  req.body.img = req.file.filename; 
 db.addmeal(req.body).then(()=>{
   res.redirect("/productedit");
 }).catch((err)=>{
   console.log("Error adding meal: "+ err);
   console.log("Error");
   res.redirect("/product/add");
 });

});


app.get("/productedit",(req,res)=>{
  
     if (req.query.title){
      db.getmealsBytitle(req.query.title).then((data)=>{
         res.render("productdata",{products: (data.length!=0)?data:undefined}
         );
       })
       .catch((err)=>{
         res.render("productdata"); 
       });
     }
     else{
     db.getmeals().then((data)=>{
       res.render("productdata",{products: (data.length!=0)?data:undefined});
    }).catch((err)=>{
       res.render("productdata"); 
     });
     }
   });


  
  

app.get("/contact-us",(req,res)=>{
  console.log("heloo");
      res.render("contactUs",{
          title:"Login"
      });
  });

  
app.post("/contact-us",(req,res)=>{

  const {firstName,lastName,email,message} = req.body;

  
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
  const msg = {
  to: `sdehghan822@gmail.com`,
  from: `${email}`,
  subject: 'Contact Us Form Submit',
  html: 
  `Vistor's Full Name: ${firstName} ${lastName} <br>
   Vistor's Email Address: ${email} <br>
   Vistor's message : ${message}<br>
  `,
  };

  
  sgMail.send(msg)
  .then(()=>{
      res.redirect("/");
  })
  .catch(err=>{
      console.log(`Error ${err}`);
  });

});


app.get("/edit",ensureAdmin,(req,res)=>{
  if (req.query.email){ 
    db.getStudentsByEmail(req.query.email).then((students)=>{
      res.render("EditStudent", {data:students[0]}); 
    }).catch(()=>{
      console.log("couldn't find the student");
      res.redirect("/");
    });
  }
  else
    res.redirect("/customer/add");
});

app.post("/customer/edit",(req,res)=>{
    db.editStudent(req.body).then(()=>{
      res.redirect("/customer/add");
    }).catch((err)=>{
      console.log(err);
      res.redirect("/customer/add");
    })
});

app.get("/delete" ,ensureAdmin,(req,res)=>{
  if(req.query.email){
    db.deleteStudentByEmail(req.query.email).then(()=>{
      res.redirect("/customer/add");
    }).catch(()=>{
      console.log("couldn't delete student");
      res.redirect("/customer/add");
    })
  }
  else{
    console.log("No Query");
    res.redirect("/customer/add");
  }
});


app.get("/editm" ,ensureAdmin,(req,res)=>{
  if (req.query.title){ 
    db.getmealsBytitle(req.query.title).then((products)=>{
      res.render("editmeal", {data:products[0]}); //using [0] because students is an array
    }).catch(()=>{
      console.log("couldn't find the student");
      res.redirect("/");
    });
  }
  else
    res.redirect("/productedit");
});

app.post("/productedit/edit",(req,res)=>{
    db.editmeal(req.body).then(()=>{
      res.redirect("/productedit");
    }).catch((err)=>{
      console.log(err);
      res.redirect("/productedit");
    })
});


app.get("/deletem" ,ensureAdmin,(req,res)=>{
  if(req.query.title){
    db.deleteMealtByTitle(req.query.title).then(()=>{
      res.redirect("/productedit");
    }).catch(()=>{
      console.log("couldn't delete student");
      res.redirect("/productedit");
    })
  }
  else{
    console.log("No Query");
    res.redirect("/productedit");
  }
});










app.get("/carsNP",(req,res)=>{
  var stuff = ds.getAllCarsNP();
  res.render("cars",{data: stuff});
});

app.get("/cars",(req,res)=>{
  ds.getAllCarsP().then((cars)=>{
     res.render("cars", {data: cars});
  }).catch((err)=>{
    res.render("cars", {message: err});
  });
})








app.get("/test/:name",(req,res)=>{
  ds.addName(req.params.name).then(()=>{
    res.redirect("/test");
  })
});

app.get("/test",(req,res)=>{
  ds.getVar().then((data)=>{
    res.render("test",{data:data});
  })
});

app.post("/validate", (req,res)=>{
  ds.checkValid(req.body).then(()=>{
    ds.storePerson(req.body).then(()=>{
      res.redirect("/profile");
    })
  }).catch((errmessage)=>{
    res.render("/registration",{message: req.body});
  })
})


var formData = {  
  uname: "BilyBob",
  email: "bo%^%^&%b@myseneca.ca",
  password: "P@ssw0rd"
};


app.get("/formPost", (req,res)=>{
  ds.validate(formData).then(()=>{
    res.send("It worked " + JSON.stringify(formData));  //res.send => res.render passing you data back
  }).catch((data)=>{
    res.send("It didn't work " + JSON.stringify(data));
  });
});


app.use((req, res) => {    
  res.status(404).send("<h3 style='color:red'>Page Not Found</h3>");
});


db.initialize().then(ds.initialize)
.then(()=>{
  console.log("Data read successfully");
  app.listen(HTTP_PORT, onHttpStart);
  
})
.catch((data)=>{
  console.log(data);
});


