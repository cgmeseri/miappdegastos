
const form = document.getElementById("transactionForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();
    if(form.transactionAmount.value > 0) {                                         // Si agregamos un if
        let transactionFormData = new FormData(form);
        let transactionObj = convertFormDataToTransactionObj(transactionFormData)
        saveTransactionObj(transactionObj)      
        insertRowInTransactionTable(transactionObj);
        form.reset();
    }else {
        alert("estas ingresando un numero menor a 0")
    }                                    
})


function draw_category() {                                                                     // Creamos esta funcion para dibujar las categorias 
    let allCategories = ["Salario", "Alquiler", "Comida", "Diversion", "Gasto imprevisto", "Tramsporte"];
    for(let index = 0; index < allCategories.length; index++) {
        insertCategory(allCategories[index]);
    }

}


function insertCategory(categoryName) {                                     // Como agregar Categorias dinamicamente, utilizaremos un metodo llamado interpolacion de strings, creo una funcion
    const selectElement = document.getElementById("transactionCategory");
    //  let category = "option",>" + categoryName + "</option>"              Esta es una forma valida
    let htmlToInsert = `<option> ${categoryName} </option>`;                    
    selectElement.insertAdjacentHTML("beforeend", htmlToInsert);            //Esta es una forma mejor, con las comillas invertidas, interpolamos un string
}


document.addEventListener("DOMContentLoaded", function(event){
    draw_category();                                                                // le agrego que cuando inicie dibuje categorias
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
    transactionObjArr.forEach(
        function(arrayElement){
            insertRowInTransactionTable(arrayElement);
        }
        )
    }
)


function getNewTransactionId() {                                                
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1";   
    let newTransactionId = JSON.parse(lastTransactionId) + 1;                  
    localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId));
    return newTransactionId;
}


function convertFormDataToTransactionObj(transactionFormData) {
    let transactionType = transactionFormData.get("transactionType");
    let transactionDescription = transactionFormData.get("transactionDescription");
    let transactionAmount = transactionFormData.get("transactionAmount");
    let transactionCategory = transactionFormData.get("transactionCategory");
    let transactionId = getNewTransactionId();
        return {
            "transactionType": transactionType,
            "transactionDescription": transactionDescription,
            "transactionAmount": transactionAmount,
            "transactionCategory": transactionCategory,
            "transactionId": transactionId
    }
}


function insertRowInTransactionTable(transactionObj) {
    let transactionTableRef = document.getElementById("transactionTable");
    
    let newTransactionRowRef = transactionTableRef.insertRow(-1);
        
    newTransactionRowRef.setAttribute("data-transaction-Id", transactionObj["transactionId"]);  

    let newTypeCellRef = newTransactionRowRef.insertCell(0);                 
    newTypeCellRef.textContent = transactionObj["transactionType"];

    newTypeCellRef = newTransactionRowRef.insertCell(1);        
    newTypeCellRef.textContent = transactionObj["transactionDescription"];

    newTypeCellRef = newTransactionRowRef.insertCell(2);        
    newTypeCellRef.textContent = transactionObj["transactionAmount"];

    newTypeCellRef = newTransactionRowRef.insertCell(3);        
    newTypeCellRef.textContent = transactionObj["transactionCategory"];


    let newDeleteCell = newTransactionRowRef.insertCell(4);
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    newDeleteCell.appendChild(deleteButton);

    deleteButton.addEventListener("click",(event) => {
        let transactionRow = event.target.parentNode.parentNode;    
        let transactionId = transactionRow.getAttribute("data-transaction-Id")                      
        transactionRow.remove() ;  
        deleteTransactionObj(transactionId);                                                               
    })                                                                                                               
}
 


function deleteTransactionObj(transactionId) {
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"));
    let transactionIndexInArr = transactionObjArr.findIndex(element => element.transactionId == transactionId);
    transactionObjArr.splice(transactionIndexInArr, 1);                                                        
    let transactionArrayJSON = JSON.stringify(transactionObjArr);  
    localStorage.setItem("transactionData", transactionArrayJSON);   
}


function saveTransactionObj(transactionObj) {
    let myTransactionArray = JSON.parse(localStorage.getItem("transactionData")) || [];  
    myTransactionArray.push(transactionObj);
    let transactionArrayJSON = JSON.stringify(myTransactionArray);  
    localStorage.setItem("transactionData", transactionArrayJSON);  
}


/* Validar: basicamente es controlar que no pasen cosas raras (es un control) */
