var jsonData = localStorage.getItem('formData');
var formValues = JSON.parse(jsonData);

var displayInfoDiv = document.getElementById("displayInfo");

for (key in formValues){
    let para = document.createElement("p");
    let val = `${key} : ${formValues[key]}`;
    para.innerText = val;
    displayInfoDiv.appendChild(para);
}