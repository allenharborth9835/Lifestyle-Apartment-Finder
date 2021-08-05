//work address varible
let workAddress = "";
//radius varible
let radius = 20;
//apartment address varible
let apartmentAddress = "";
let apartmentAmount = 0;
//mpg varible
let mpg = 10;
//gas price
let gasPrice = 0


//function that handles income input
function incomeHandler(){
    event.preventDefault();
    if($("#job-address").val() === ""){
        alert("must put in work address")
        return;
    }
    workAddress = $("#job-address").val();
    radius = $("#radius").val();
    console.log(workAddress, radius)
    return;
}
//function that handles apartment input
function apartmentHandler(){
    event.preventDefault();
    if($("#apartment-address").val() === ""||$("#apartment-amount").val() === ""){
        alert("must put in apartment address and apartment cost")
        return;
    }
    apartmentAddress = $("#apartment-address").val();
    apartmentAmount = $("#apartment-amount").val();
    console.log(apartmentAddress, apartmentAmount)
    return;
}
//funtion that handles gas bill input
function gasCostHandler(){
    event.preventDefault();
    if($("#MPG").val() === ""||$("#gas-price").val() === ""){
        alert("must put in MPG and gas-price")
        return;
    }
    if(!isNaN($("#MPG").val()) || !isNaN($("#gas-price").val())){
        alert("MPG and gas-price have to be numbers")
        return;
    }
    mpg = $("#MPG").val();
    averagePrice = $("#gas-price").val();
    gasPrice = ((((radius/mpg) * averagePrice)*2)*20)
    console.log(mpg, averagePrice,gasPrice)
    return;
}

//function to load bills
function loadBills(){
    
}
$("#income-input-btn").on("click", incomeHandler)
$("#apartment-input-btn").on("click", apartmentHandler)
$("#gas-input-btn").on("click", gasCostHandler)
//function to display apartment listings

//function to display google maps

