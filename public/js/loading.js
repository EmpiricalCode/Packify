// Variables
var bodyContainer = document.getElementById("body-container");
var loadingIcon = document.getElementById("loading-icon");
var logo = document.getElementById("logo");

// Main
setTimeout(() => {
    logo.style.top = "-40px";
    logo.classList.add("visible");
    loadingIcon.classList.add("visible");

    logo.classList.remove("hidden");
    loadingIcon.classList.remove("hidden");
}, 500);