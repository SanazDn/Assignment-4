var email = "bob@myseneca.ca";

var emailCheck = new RegExp('^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$');

if (emailCheck.test(email)){
    console.log("Matched");
}
else{
    console.log("Not matched");
}
