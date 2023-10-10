"use strict";

let x, y, r;
window.onload = function () {
    loadTableFromLocalStorage();
    let buttons = document.querySelectorAll("input[name=R-button]");
    buttons.forEach(click);

    function click(element) {
        element.onclick = function () {
            r = this.value;
            buttons.forEach(function (element) {
                element.style.boxShadow = "";
                element.style.transform = "";
            });
            this.style.boxShadow = "0 0 40px 5px #10ddc2";
        }
    }

};

function saveTableToLocalStorage(){
    const records = document.querySelectorAll("#tablebody tr");
    const last7Records = Array.from(records).slice(-7); 
    const recordsHTML = last7Records.map(record => record.outerHTML).join("");
    localStorage.setItem("table",recordsHTML);
}

function loadTableFromLocalStorage(){
    const savedRecords = localStorage.getItem("table");
    if(savedRecords !== null){
        document.getElementById("tablebody").innerHTML = savedRecords;
    }
}

document.getElementById("checkButton").onclick = function () {
    if (validateX() && validateY() && validateR()) {
        fetch("calc.php", {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
            body: "x=" + encodeURIComponent(x) + "&y=" + encodeURIComponent(y) + "&r=" + encodeURIComponent(r) +
                "&timezone=" + encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone)
        }).then(response => response.text()).then(function (serverAnswer) {
            document.getElementById("tablebody").innerHTML = document.getElementById("tablebody").innerHTML + serverAnswer;
            saveTableToLocalStorage();
        }).catch(err => createNotification("Ошибка HTTP. Повторите попытку позже. " + err));
    }
};


function createNotification(message) {
    let outputContainer = document.getElementById("outputContainer");
    if (outputContainer.contains(document.querySelector(".notification"))) {
        let stub = document.querySelector(".notification");
        stub.textContent = message;
        stub.classList.replace("outputStub", "errorStub");
    } else {
        let notificationTableRow = document.createElement("h4");
        notificationTableRow.innerHTML = "<span class='notification errorStub'></span>";
        outputContainer.prepend(notificationTableRow);
        let span = document.querySelector(".notification");
        span.textContent = message;
    }
}

function validateX(){
    try{
        x = document.querySelector("input[type=checkbox]:checked").value;
        var count = document.querySelectorAll('input[type="checkbox"]:checked').length;
        if(count>1){
            createNotification("Выберите только один checkBox");
            return false;
        }
        return true;
    }catch(err){
        createNotification("Значение x не выбрано");
        return false;
    }
}

function validateY(){
    y = document.querySelector("input[name=Y-input]").value.replace(",",".");
    if(y === undefined){
        createNotification("y не введён");
        return false;
    }else if(!isNumeric(y)){
        createNotification("y не число");
        return false;
    }else if (!((y > -5) && (y < 5))){
        createNotification("y не входит в область допустимых значений");
        return false;
    }else return true;
    
}

function validateR(){
    if(isNumeric(r)) return true;
    else{
        createNotification("r не выбран");
        return false;
    }
}

document.getElementById("clearButton").onclick = function () {
    clearTableAndLocalStorage();
};

function clearTableAndLocalStorage() {
    document.getElementById("tablebody").innerHTML = "";
    localStorage.removeItem("table");
    
    let notificationElement = document.querySelector(".notification");
    if (notificationElement) {
        notificationElement.remove();
    }
}

function isNumeric(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
}