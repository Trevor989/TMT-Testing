$(document).ready(function() {
    // Function to get random color
    function getRandomColor() {
        var r = Math.floor(Math.random() * 128) + 128;
        var g = Math.floor(Math.random() * 128) + 128;
        var b = Math.floor(Math.random() * 128) + 128;
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    // Function to add a card to the card container
    function addCard() {
        var truckNamePlaceholder = "License Plate Number";
        var mileagePlaceholder = "Enter Mileage";
        var datePlaceholder = "Select Date";
        var driverName = "Enter Driver Name";
        var randomColor = getRandomColor();
        var card = `
            <div class="col-md-4">
                <div class="card" data-toggle="modal" data-target="#cardDetailsModal" style="background-color: ${randomColor};">
                    <div class="card-body">
                        <h5 class="card-title">${truckNamePlaceholder}</h5>
                        <p class="card-text driver-text">Driver: ${driverName}</p>
                        <p class="card-text mileage-text">Mileage: ${mileagePlaceholder}</p>
                        <p class="card-text date-text">Date: ${datePlaceholder}</p>
                    </div>
                </div>
            </div>
        `;
        $("#cardContainer").append(card);
    }

    // Event handler for clicking "Add Card" button
    $("#addCardBtn").click(function(event) {
        event.preventDefault();
        addCard();
    });

    // Event handler for submitting card details form
    $("#cardDetailsForm").submit(function(event) {
        event.preventDefault();
        var truckName = $("#truckName").val();
        var mileage = $("#mileage").val();
        var date = $("#date").val();
        var driverName = $("#driverName").val();
        var editedCard = $(".card.editing");

        if (editedCard.length > 0) {
            var existingCard = editedCard.parent();
            existingCard.find(".card-title").text(truckName);
            existingCard.find(".mileage-text").text("Mileage: " + mileage);
            existingCard.find(".date-text").text("Date: " + date);
            existingCard.find(".driver-text").text("Driver: " + driverName); 
            existingCard.removeClass("editing");
        } else {
            var randomColor = getRandomColor();
            var card = `
                <div class="col-md-4">
                    <div class="card" data-toggle="modal" data-target="#cardDetailsModal" style="background-color: ${randomColor};">
                        <div class="card-body">
                            <h5 class="card-title">${truckName}</h5>
                            <p class="card-text mileage-text">Mileage: ${mileage}</p>
                            <p class="card-text date-text">Date: ${date}</p>
                            <p class="card-text driver-text">Driver: ${driverName}</p>
                        </div>
                    </div>
                </div>
            `;
            $("#cardContainer").append(card);
        }

        $("#cardDetailsForm")[0].reset();
        $('#cardDetailsModal').modal('hide'); 
    });

    // Event handler for clicking a card
    $("#cardContainer").on("click", ".card", function() {
        $(".card").removeClass("editing");
        $(this).addClass("editing");
        
        var truckName = $(this).find(".card-title").text();
        var mileage = $(this).find(".mileage-text").text().split(":")[1].trim();
        var date = $(this).find(".date-text").text().split(":")[1].trim();
        var driverName = $(this).find(".driver-text").text().split(":")[1].trim(); 
        $("#truckName").val(truckName);
        $("#mileage").val(mileage);
        $("#date").val(date);
        $("#driverName").val(driverName); 
    });

    // Event handler for deleting a card
    $("#deleteCardBtn").click(function() {
        var editedCard = $(".card.editing");
        editedCard.parent().remove();
        $("#cardDetailsForm")[0].reset();
        $('#cardDetailsModal').modal('hide');
    });

    // Event handler for showing "Deliver Truck Details" modal
    $("#deliverTruckBtn").click(function() {
        $('#cardDetailsModal').modal('hide'); 
        $('#deliverTruckModal').modal('show'); 
    });

    // Event handler for going back from "Deliver Truck Details" modal
    $("#goBackBtn").click(function() {
        $('#cardDetailsModal').modal('show'); 
        $('#deliverTruckModal').modal('hide'); 
    });

    // Event handler for calculating result
    $("#calculateBtn").click(function() {
        $('.modal').modal('hide');
        $('#calculationResultModal').modal('show').css('display', 'block');
    });

    // Event handler for going back from calculation result modal
    $("#goBackBtn").click(function() {
        $("#deliverTruckModal").modal("hide");
    });

    // Event handler for calculating result and displaying it
    $("#calculateBtn").click(function() {
        var currentMileage = parseFloat($("#Cmileage").val());
        var fuelAdded = parseFloat($("#AddedFuel").val());
        var mileage = parseFloat($("#mileage").val());
        var ratePerGallon = parseFloat($("#FuelPriceRate").val());

        var result = (fuelAdded - ((currentMileage - mileage) / 3))*ratePerGallon;
        var message;
        if (result >= 0) {
            message = $("#driverName").val() + " You will get " + result.toFixed(2) + "$ from the company.";
        } else {
            message = $("#driverName").val() + " You have to pay " + Math.abs(result).toFixed(2) + "$ for the company.";
        }
        $("#calculationResult").text(message);
        $('#calculationResultModal').modal('show');
    });

    // Store data in localStorage when unloading the page
    $(window).on('unload', function() {
        // Save data to localStorage
        var cardContainerHTML = $("#cardContainer").html();
        localStorage.setItem('cardContainerHTML', cardContainerHTML);

        // Save data from Deliver Truck Details modal to localStorage
        var truckDetails = {
            truckName: $("#truckName").val(),
            mileage: $("#mileage").val(),
            date: $("#date").val(),
            driverName: $("#driverName").val()
        };
        localStorage.setItem('truckDetails', JSON.stringify(truckDetails));

        // Save data for "Current Mileage", "Fuel Added", "Fuel Price Rate", and "Date" to localStorage
        var currentMileage = $("#Cmileage").val();
        var fuelAdded = $("#AddedFuel").val();
        var fuelPriceRate = $("#FuelPriceRate").val();
        var dDate = $("#DDate").val();
        localStorage.setItem('currentMileage', currentMileage);
        localStorage.setItem('fuelAdded', fuelAdded);
        localStorage.setItem('fuelPriceRate', fuelPriceRate);
        localStorage.setItem('DDate', dDate);
    });

    // Retrieve data from localStorage on page load
    var storedCardContainerHTML = localStorage.getItem('cardContainerHTML');
    if (storedCardContainerHTML) {
        $("#cardContainer").html(storedCardContainerHTML);
    }

    // Retrieve data for Deliver Truck Details modal from localStorage on page load
    var storedTruckDetails = localStorage.getItem('truckDetails');
    if (storedTruckDetails) {
        var truckDetails = JSON.parse(storedTruckDetails);
        $("#truckName").val(truckDetails.truckName);
        $("#mileage").val(truckDetails.mileage);
        $("#date").val(truckDetails.date);
        $("#driverName").val(truckDetails.driverName);
    }

    // Retrieve data for "Current Mileage", "Fuel Added", "Fuel Price Rate", and "Date" from localStorage on page load
    var storedCurrentMileage = localStorage.getItem('currentMileage');
    var storedFuelAdded = localStorage.getItem('fuelAdded');
    var storedFuelPriceRate = localStorage.getItem('fuelPriceRate');
    var storedDDate = localStorage.getItem('DDate');
    if (storedCurrentMileage) {
        $("#Cmileage").val(storedCurrentMileage);
    }
    if (storedFuelAdded) {
        $("#AddedFuel").val(storedFuelAdded);
    }
    if (storedFuelPriceRate) {
        $("#FuelPriceRate").val(storedFuelPriceRate);
    }
    if (storedDDate) {
        $("#DDate").val(storedDDate);
    }
    
});
