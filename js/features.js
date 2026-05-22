_menuShelfOpen = false;

let displayWidth = window.innerWidth;

function openShelf(){

    menushelf.style.transform = "translateX(0)";
    if (displayWidth < 765) {   
        document.getElementsByTagName('main')[0].style.transform = "translateX(80%)";
    } else if (displayWidth < 1250) {
        document.getElementsByTagName('main')[0].style.transform = "translateX(55%)";
    } else {
        document.getElementsByTagName('main')[0].style.transform = "translateX(30%)";
    }
    document.body.style.overflow = "hidden";

    _menuShelfOpen = true;
}
window.addEventListener('click',(e)=>{
    if(_menuShelfOpen == true && (!e.composedPath().includes(menushelf) || e.composedPath().includes(navBurgerButton))) closeShelf();
})
function closeShelf() {
    console.log("closing");

    menushelf.style.transform = "translateX(-105%)";
    document.getElementsByTagName('main')[0].style.transform = "translateX(0)";

    document.body.style.overflow = "";

    _menuShelfOpen = false;
}
function toggleMenuShelf(e) {
    e.stopPropagation();

    if(!_menuShelfOpen) openShelf();
    else closeShelf();
}