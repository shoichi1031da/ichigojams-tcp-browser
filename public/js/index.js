const command = document.getElementById("command");
const IPaddress = document.getElementById("IPaddress");
const btn = document.getElementById("btn");
const form = document.getElementsByTagName("form");
    
if(localStorage.getItem("ichigojam_IPaddress")){
    IPaddress.innerHTML = localStorage.getItem("ichigojam_IPaddress");
}

const save = () => {
    let ichigojam_IPadress = IPaddress.value;
    localStorage.setItem("ichigojam_IPaddress",ichigojam_IPadress);
}

btn.onclick = () => {
    save();
    setTimeout(()=>command.value = "",100);
}