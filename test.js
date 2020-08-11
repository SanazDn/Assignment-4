function A(){
        return new Promise((resolve, reject)=>{
            setTimeout(function(){
                console.log("A");
                resolve();
            },1000);
        });
    }
    function B(){
        return new Promise((resolve, reject)=>{
            setTimeout(function(){
                console.log("B");
                resolve();
            },500);
        });
    }
    function C(){
        return new Promise((resolve, reject)=>{
            setTimeout(function(){
                console.log("C");
                resolve();
            },100);
        });
    }
//A B C Overall time 1.6sec total duration
A()
.then(B)
.then(C)
.then(()=>{console.log("All Finished");});











// function A(){
//     return new Promise((resolve, reject)=>{
//         setTimeout(function(){
//             console.log("A");
//             resolve();
//         },1000);
//     });
// }
// function B(){
//     return new Promise((resolve, reject)=>{
//         setTimeout(function(){
//             console.log("B");
//             resolve();
//         },500);
//     });
// }
// function C(){
//     return new Promise((resolve, reject)=>{
//         setTimeout(function(){
//             console.log("C");
//             resolve();
//         },100);
//     });
// }

//We expect it to print sequentially
// A()
// .then(B)
// .then(C)
// .then(()=>{
//     console.log("We have finished!");
// }); //print A after 1 sec
// B(); //print B after 1/2 sec
// C(); //print C after 1/10 sec

//A B C Overall time 1.6sec total duration












