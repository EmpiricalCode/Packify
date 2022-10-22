window.system.requestAppVersion().then((version) => {
    document.getElementById("app-version").innerHTML = version;
})