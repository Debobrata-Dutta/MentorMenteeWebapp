var x = document.getElementById("login");
var y = document.getElementById("register");
var z = document.getElementById("btn");
function signup(){
    x.style.left = "-400px";
    y.style.left = "6px";
    z.style.left = "110px";
}
function login(){
    x.style.left = "8px";
    y.style.left = "650px";
    z.style.left = "0px";
}
function myFunction() {
    var p = document.getElementById("pass");
    var p2 = document.getElementById("pass2");
    if (p.type === "password") {
        p.type = "text";
    } else {
        p.type = "password";
    }
    if (p2.type === "password") {
        p2.type = "text";
    } else {
        p2.type = "password";
    }
}