function openShelf(){
    console.log("opening");

    // menushelf.style.width = "80%";
    menushelf.style.transform = "translateX(0)";
    document.getElementsByTagName('main')[0].style.transform = "translateX(80%)";
    document.body.style.overflow = "hidden";
    
    navBurgerButton.setAttribute('data-state',"open");
}
function closeShelf() {
    console.log("closing");

    // menushelf.style.width = "0";
    menushelf.style.transform = "translateX(-105%)";
    document.getElementsByTagName('main')[0].style.transform = "translateX(0)";

    navBurgerButton.setAttribute('data-state',"closed");
}
function toggleMenuShelf(e) {

    console.log(document.getElementsByTagName("nav")[0])

    if(navBurgerButton.getAttribute('data-state') == "closed") {
        openShelf();
    } else {
        closeShelf();
    }
}


