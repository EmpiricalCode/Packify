// Variables
var rightClickMenuPromptArea = document.getElementById("right-click-menu-prompt-area");
var rightClickMenuShowing = false;

// Functions
function promptCreateFolder() {

}

function removeRightClickMenu() {
    for (var element of document.getElementsByClassName("right-click-menu")) {
        element.remove();
    }
}

function promptRightClickMenu(event) {

    removeRightClickMenu();

    var rightClickMenu = document.createElement("div");

    rightClickMenu.classList.add("right-click-menu");
    rightClickMenu.style.top = event.offsetY + "px";
    rightClickMenu.style.left = event.offsetX + "px";
    rightClickMenu.style.position = "absolute";

    // Clicking off menu
    rightClickMenu.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    setTimeout(() => {
        rightClickMenu.style.opacity = 1;
        rightClickMenu.style.marginTop = "0px";
        rightClickMenu.style.height = "200px";
    }, 10);

    filesContainer.appendChild(rightClickMenu);
}

function reloadStorage() {
    loaded = false;

    for (var tab of tabs) {
        if (tab.id.split("-")[0] == "files") {
            tab.classList.remove("tab-visible");
            tab.style.zIndex = -1;
        }
    }

    setTimeout(() => {

        loadStorage();
        loaded = true;

        for (var tab of tabs) {
            if (tab.id.split("-")[0] == "files") {

                tab.style.zIndex = 10;
                tab.classList.add("tab-visible");
            }
        }
    }, 200);
}

function spawnPathButton(currentPathSection) {

    if (pathContainer.innerHTML != "") {
        var pathButtonDivider = document.createElement("p");
        pathButtonDivider.classList.add("path-button-divider");
        pathButtonDivider.innerText = "/";
        pathContainer.appendChild(pathButtonDivider);
    }

    var pathButton = document.createElement("a");
    pathButton.classList.add("path-button");
    pathButton.innerHTML = currentPathSection;

    pathButton.onclick = () => {
        const num = Math.floor((Array.from(pathButton.parentNode.children).indexOf(pathButton) + 1) / 2);

        while (currentLocation.length > num) {
            currentLocation.pop();
        }

        reloadStorage();
    };

    pathContainer.appendChild(pathButton);
}

function loadStorage() {

    hideSection("recent-section");
    hideSection("folder-section");
    hideSection("files-section");
    hideSection("path-section");

    pathContainer.innerHTML = "";
    folderContainer.innerHTML = "";
    filesObjectContainer.innerHTML = "";

    var currentDirectory = userStorageMetadata;

    if (currentLocation.length > 0) {
        spawnPathButton("Files");
    }

    currentLocation.forEach((nextPath) => {

        // Updating path container
        spawnPathButton(nextPath);
        
        // Getting the current directory
        currentDirectory = currentDirectory[nextPath];
    });

    // Creating file and folder objects
    Object.entries(currentDirectory).forEach((pair) => {
        if (currentDirectory[pair[0]] == "file") {

            showSection("files-section");
            var fileObject = document.createElement("div");
            fileObject.innerHTML = pair[0];

            fileObject.classList.add("file");
            filesObjectContainer.appendChild(fileObject);
        } else {

            showSection("folder-section");
            var folderObject = document.createElement("div");

            folderObject.innerHTML = pair[0];
            folderObject.classList.add("folder");

            folderObject.onclick = () => {
                currentLocation.push(folderObject.innerHTML);
                reloadStorage();
            }

            folderContainer.appendChild(folderObject);
        }
    })

    if (pathContainer.innerHTML != "") {
        showSection("path-section");
    }

    if (currentLocation.length == 0) {
        showSection("recent-section");
    } 
}

// Main
// Prompting menu creation
rightClickMenuPromptArea.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    promptRightClickMenu(event);
}, false);

// Clicking off menu
document.body.addEventListener("click", (event) => {
    removeRightClickMenu();
});