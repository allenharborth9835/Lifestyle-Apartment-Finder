//work address varible
let workAddress = "";
//radius varible
let radius = 20;
//apartment address varible
let apartmentAddress = "";
let apartmentAmount = 0;
//mpg varible
let mpg = 0;
//gas Cost
let gasCost = 0;
//price of gas
let averagePrice = 0;
//object to store local storage
let budgetTracker = {
    workAddress: null,
    radius: 20,
    apartmentAddress: null,
    apartmentAmount: null,
    mpg: null,
    averagePrice: null
}

$(document).ready(function(){
    $('select').formSelect();
  });

$(document).ready(function () {
    $('.modal').modal();
});

savedData = localStorage.getItem("budgetTracker");
if(!(savedData===null)){
    savedData = JSON.parse(savedData);
    budgetTracker = savedData;
    if(!(savedData.workAddress===null)){
        workAddress = savedData.workAddress;
        radius = savedData.radius;
        console.log(workAddress, radius);
        $("#apartment-search").html(`<h3>searching for apartments within ${radius} of ${workAddress}<h3>`);
        apartmentSearch();
    }
    if(!(savedData.apartmentAddress===null)){

        apartmentAddress = savedData.apartmentAddress;
        apartmentAmount = savedData.apartmentAmount;
        console.log(apartmentAddress, apartmentAmount);
        $("#apartment-pick").html(`<h3>you choose ${apartmentAddress} at ${apartmentAmount}$<h3>`);
    }
    if(!(savedData.mpg===null)){
        mpg = savedData.mpg;
        averagePrice = savedData.averagePrice;
        gasCost = ((((radius/mpg) * averagePrice)*2)*22);
        console.log(mpg, averagePrice, gasCost);
        $("#gas-bill").html(`<h3>the maximum you'll pay for gas is ${parseInt(gasCost)}$ a month<h3>`);
        $("#total-cost").html(`<h3>the average total price of apartment and gas could be as high as ${parseInt(apartmentAmount) + parseInt(gasCost)}$ a month<h3>`);
    }
}

function apartmentSearch(){
    for(let i = 0; i<50;i++){
        $("#apartment-listings").append(`${i+1}. apartment at  cost  <br>`);
    }
}

//function that handles income input
function workHandler(){
    event.preventDefault();
    $("#apartment-search").append('');
    if($("#job-address").val() === ""){
        alert("must put in work address");
        return;
    }
    workAddress = $("#job-address").val();
    budgetTracker.workAddress = workAddress;
    radius = $("#radius").val();
    budgetTracker.radius = radius;
    
    localStorage.setItem("budgetTracker", JSON.stringify(budgetTracker));
    console.log(workAddress, radius);
    $("#apartment-search").html(`<h3>searching for apartments within ${radius} of ${workAddress}<h3>`);
    if(!(mpg===0)){
        gasCost = ((((radius/mpg) * averagePrice)*2)*22);

        $("#gas-bill").html(`<h3>the maximum you'll pay for gas is ${parseInt(gasCost)}$ a month<h3>`);
        $("#total-cost").html(`<h3>the average total price of apartment and gas could be as high as ${parseInt(apartmentAmount) + parseInt(gasCost)}$ a month<h3>`);
    }
    apartmentSearch();
    return;
}

//function that handles apartment input
function apartmentHandler(){
    event.preventDefault();
    $("#apartment-pick").append('');
    if($("#apartment-address").val() === ""||$("#apartment-amount").val() === ""){
        alert("must put in apartment address and apartment cost");
        return;
    }
    if(isNaN($("#apartment-amount").val())){
        alert("apartment cost must be a number");
        return;
    }
    apartmentAddress = $("#apartment-address").val();
    budgetTracker.apartmentAddress = apartmentAddress;
    apartmentAmount = $("#apartment-amount").val();
    budgetTracker.apartmentAmount = apartmentAmount;

    localStorage.setItem("budgetTracker", JSON.stringify(budgetTracker));
    console.log(apartmentAddress, apartmentAmount);
    $("#apartment-pick").html(`<h3>you choose ${apartmentAddress} at ${apartmentAmount}$<h3>`);
    if(!(mpg===0)){
        $("#total-cost").html(`<h3>the average total price of apartment and gas could be as high as ${parseInt(apartmentAmount) + parseInt(gasCost)}$ a month<h3>`);
    }
    return;
}
//funtion that handles gas bill input
function gasCostHandler(){
    event.preventDefault();
    if($("#MPG").val() === ""||$("#gas-price").val() === ""){
        alert("must put in MPG and gas-price");
        return;
    }
    if(isNaN($("#MPG").val()) || isNaN($("#gas-price").val())){
        alert("MPG and gas-price have to be numbers");
        return;
    }
    mpg = $("#MPG").val();
    budgetTracker.mpg = mpg;
    averagePrice = $("#gas-price").val();
    budgetTracker.averagePrice = averagePrice;
    gasCost = ((((radius/mpg) * averagePrice)*2)*22);

    localStorage.setItem("budgetTracker", JSON.stringify(budgetTracker));
    console.log(mpg, averagePrice,gasCost);
    $("#gas-bill").html(`<h3>the maximum you'll pay for gas is ${parseInt(gasCost)}$ a month<h3>`);
    $("#total-cost").html(`<h3>the average total price of apartment and gas could be as high as ${parseInt(apartmentAmount) + parseInt(gasCost)}$ a month<h3>`);
    return;
}


$("#work-input-btn").on("click", workHandler);
$("#apartment-input-btn").on("click", apartmentHandler);
$("#gas-input-btn").on("click", gasCostHandler);
//function to display apartment listings

//function to display google maps

