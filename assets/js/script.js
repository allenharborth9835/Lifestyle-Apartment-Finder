//work address varible
let workAddress = "";
//radius varible
let radius = 50;
//apartment address varible
let apartmentAddress = "";
let apartmentAmount = 0;
//mpg varible
let mpg = 10;


//function that handles income input
function incomeHandler(){
    event.preventDefault();
    if($("#job-address").val() === ""){
        alert("must put in income and work address")
    }
    workAddress = $("#job-address").val();
    radius = $("#radius").val();
    console.log(workAddress, income, radius)
    return;
}
//function that handles apartment input
function apartmentHandler(){
    event.preventDefault();
    apartmentAddress = $("#apartment-address").val();
    apartmentAmount = $("#apartment-amount").val();
}
//funtion that handles gas bill input
function gasCostHandler(){
    event.preventDefault();
    mpg = $("#MPG").val();
    averagePrice = $("#gas-price").val();
}

//function to load bills
function loadBills(){
    
}

//function that calculate monthly output
function calculate(){

}
$("#income-input-btn").on("click", incomeHandler)

//function to display apartment listings

//function to display google maps

