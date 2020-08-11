// Global variable list
var searchSt = "";
var stateName = "";
var choiceOfBreedsForSupriseMe = ['German Shepherd Dog', 'Beagle', 'Boston Terrier', 'Golden Retriever', 'Australian Shepherd', 'Poodle (Toy)', 'Siberian Husky', 'American Bulldog', 'Labrador Retriever', 'American Pit Bull Terrier', 'Border Collie', 'Rottweiler', 'Boxer', 'Great Dane', 'Pomeranian', 'Shih Tzu', 'Cocker Spaniel', 'Australian Terrier'];

// Adding on-click event to the Submit button
$("#search-button").on("click", function() {
    event.preventDefault();
    var dogIdArray = [];
  
    $("#dogInfo").empty();
    $("#availList").empty();
    searchSt = $("#searchState").val();
    
    // Call the modal forward if the State value is empty & exit function within click event
    if(searchSt === "") {
      $('#inputModal').modal('show');
      
      return;
    }
    
    stateName = $("#searchState option:selected").text();
    var breedType = $("#searchType").val();
    var breedGroup = $("#searchGroup").val();
    var temparment = $("#searchTemperament").val();
  
    // Call modal if all other search areas are blank & exit function within click event
    if (breedType === "" && breedGroup === "" && temparment === "") {
      $('#inputModal').modal('show');
      return;

      // If not, begin AJAX call with series of if/else if to handle possible search combinations
    } else {
      $.ajax({
          url: "https://api.thedogapi.com/v1/breeds", 
          method: "GET",
      }).done ( function(dogData) {
          
          for(var i = 0; i<dogData.length; i++) {
            var tempData = dogData[i].temperament;
            if (breedType) {
                if (((dogData[i].name).toUpperCase()).indexOf(breedType.toUpperCase()) >= 0) {
                  addDogInfoToDiv(dogData[i]);
                  dogIdArray.push(dogData[i].id);
              } 
            } else if (breedGroup != "" && temparment != "") {
              if (tempData !== undefined) {
                if ((breedGroup === dogData[i].breed_group) && (tempData.indexOf(temparment) >= 0) ) {
                  addDogInfoToDiv(dogData[i]);
                  dogIdArray.push(dogData[i].id);
                }
              }
            } else {
              if (breedGroup != "") {
                if(breedGroup === dogData[i].breed_group) {
                  addDogInfoToDiv(dogData[i]);
                  dogIdArray.push(dogData[i].id);
                }
              } else if (temparment != "") {
                if (tempData != undefined && tempData.indexOf(temparment) >= 0) {
                  addDogInfoToDiv(dogData[i]);
                  dogIdArray.push(dogData[i].id);
                }
              }
            }
          }
          for (var i=0; i<dogIdArray.length; i++) {
              addTheImage(dogIdArray[i]);
          }
      })
      
      // Clear location.hash before setting it again to work with every #search-button click event
      location.hash = '';    
      location.hash = "#row-dogInfo";

    }
  })  

// Function to use an AJAX call to retrieve an img for searched dog from thedogapi
function addTheImage(dogId) {

  var queryUrl =  "https://api.thedogapi.com/v1/images/search?include_breed=1&breed_id="+dogId;
  $.ajax({
      url: queryUrl,
      method:"GET"
  }). then (function(imgData) {
      var dogImg = $("<img>");
      
      // Dynamically creating a card to hold this img and giving it an id associated with the APIs dog-ID
      dogImg.addClass("card-img-top");
      dogImg.attr("src", imgData[0].url);
      var getId = "#id-" + dogId;
      
      $(getId).prepend(dogImg);
  })

}

// Function to use the APIs dogData to dyanamically create a card and list elements with info on available dogs
function addDogInfoToDiv (dogData) {
    var tempData = dogData.temperament;
    var newCol = $("<div>");
    newCol.addClass("col mb-4");
    $("#dogInfo").append(newCol);
    var newCard = $("<div>");
    var dogId = dogData.id;
    newCard.addClass("card pupBody");
    newCard.attr("id", "id-"+dogId);
    newCol.append(newCard);
    
    var newCardBody = $("<div>");
    newCardBody.addClass("card-body");
    var cardTitle = $("<h5>");
    cardTitle.addClass("card-title");
    cardTitle.text(dogData.name);
    newCardBody.append(cardTitle);

    var cardText = $("<ul>");
    cardText.addClass("list-group list-group-flush pupBody");

    var li1 = $("<li>");
    var boldGroup = "Group: ";
    var bold1 = boldGroup.bold();
    li1.addClass("list-group-item");
    li1.append(bold1 + dogData.breed_group);
    cardText.append(li1);

    var li2 = $("<li>");
    var boldLife = "Lifespan: ";
    var bold2 = boldLife.bold();
    li2.addClass("list-group-item");
    li2.append(bold2 + dogData.life_span);
    cardText.append(li2);

    var li3 = $("<li>");
    var boldTemp = "Temperament: ";
    var bold3 = boldTemp.bold();
    li3.addClass("list-group-item");
    li3.append(bold3 + tempData);
    cardText.append(li3);

    newCardBody.append(cardText);
    
    newCardBody.append("<br><p><strong>Do you want Adopt a " + dogData.name + "?</strong></p> <a class='btn btn-dark' href='#available-dogList' role='button' id='pick-me' data-breed-name='" + dogData.name +"'>Yes</a> <a class='btn btn-dark' href='index.html' role='button'>No</a>");
    
    newCard.append(newCardBody);    
}

// Clear information-rows upon hitting Clear button
$("#clear-button").on("click", function() {
    $("#dogInfo").empty();
    $("#availList").empty();
})

// Function to randomally select a common dog breed for a user when "Surprise Me" button is clicked
$("#surpriseMe-button").on("click", function() {
  event.preventDefault();
  var dogIdArray = [];
  $("#dogInfo").empty();
  $("#availList").empty();
  searchSt = $("#searchState").val();
  
  // Call the modal forward if the State value is empty & exit function within click event
  if(searchSt === "") {
    $('#inputModal').modal('show');
    return;
  }
  stateName = $("#searchState option:selected").text();
  
  // AJAX call to use a randomally generated number & choiceOfBreedsForSurpriseMe to select and add a random dog
  $.ajax({
      url: "https://api.thedogapi.com/v1/breeds", 
      method: "GET",
  }).then ( function (randomDog) {
    breedDataLength = randomDog.length;
    var randomNum = Math.floor(Math.random() * choiceOfBreedsForSupriseMe.length);
    for(var i=0; i<randomDog.length; i++) {
      if (randomDog[i].name === choiceOfBreedsForSupriseMe[randomNum]) {
        addDogInfoToDiv(randomDog[i]);
        dogIdArray.push(randomDog[i].id);
      }
    }
    for (var i=0; i<dogIdArray.length; i++) {
        addTheImage(dogIdArray[i]);
    }

    // Clear location.hash before setting it again to work with every #search-button click event
    location.hash = '';
    location.hash = "#row-dogInfo";

    })
});

// Function to retrieve a token to access petfinder APIs information
function getPetFinderToken(breed, searchState) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.petfinder.com/v2/oauth2/token",
    "method": "POST",
    "headers": {
      "content-type": "application/json"
    },
    "processData": false,
    "data": "{\"grant_type\": \"client_credentials\",\"client_id\": \"RbjkyobxNXfD4Ey5eFqF3pAFvWYqccdWbf1QG5heK4KqDJiYmW\",\"client_secret\": \"XYtig7eQicL760dm4x2GjsLvhzshCZ8AsETvbxlb\"}"
  }

  // AJAX call using petfinder API token, as well as breed and state entered by user
  $.ajax(settings).done(function (response) {
    fetchPetFinderData(response.access_token, breed, searchState)
  });
}

// Function to access dogs which are available based on user search criteria
function fetchPetFinderData(token, breedType, searchState) {
  var queryURL = "https://api.petfinder.com/v2/animals?type=dog&breed=" + breedType +"&location=" + searchState + "&page=1";
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": queryURL,
    "method": "GET",
    "headers": {
      "authorization": "Bearer " + token
    }
  }

  $.ajax(settings).done(function (response) {
    $("#availList").empty();
    
    // Call modal if no dogs meet user's search criteria and exit function
    if (response.animals.length === 0) {
      $("#noResponse").empty();
      $('#noResponse').append("<p>" + breedType + " is not available in " + stateName + ". Please search again </p>");
      $('#responseModal').modal('show');
      
      return;
    } 

    // Dynamically create cards and list elemennts with information taken from petfinder API for each available dog
    for (var n=0; n<response.animals.length; n++) {
      var state = response.animals[n].organization_id;
      var newCol = $("<div>");
      newCol.addClass("col mb-4");
      
      var newCard = $("<div>").addClass("card");
      var newCardBody = $("<div>").addClass("card-body pupBody");
      var dImg = $("<img>").addClass("img-responsive card-img-top");
      
      // Add image to card; if no img available, use the self-created default img
      if (response.animals[n].photos.length > 0) {
        dImg.attr("src", response.animals[n].photos[0].medium);
        newCardBody.append(dImg);
      } else {
        dImg.attr("src", "assets/images/altimage.png")
        newCardBody.append(dImg);
      }
      
      var cardTitle = $("<h5>");
      cardTitle.addClass("card-title");
      cardTitle.text(response.animals[n].name);
      newCardBody.append("<br>")
      newCardBody.append(cardTitle);  

      var cardText = $("<ul>");
      cardText.addClass("list-group list-group-flush pupBody");
      cardText.css("list-style-type", "none");
  
      var li1 = $("<li>");
      var boldGender = "Gender: ";
      var bold1 = boldGender.bold();
      li1.append(bold1 + response.animals[n].gender);
      cardText.append(li1);

      var li2 = $("<li>");
      var boldBreed1 = "Primary Breed: ";
      var bold2 = boldBreed1.bold();
      li2.addClass("list-group-item");
      li2.append(bold2 + response.animals[n].breeds.primary);
      cardText.append(li2);
      
      if (response.animals[n].breeds.secondary != null) {
        var li3 = $("<li>");
        var boldBreed2 = "Secondary Breed: ";
        var bold3 = boldBreed2.bold();
        li3.addClass("list-group-item");
        li3.append(bold3 + response.animals[n].breeds.secondary);
        cardText.append(li3);

        newCardBody.append(cardText);
    }
    
    // Create button with text to take user to petfinder's website to officially adopt the dog
    newCardBody.append("<a class='btn btn-dark'  role='button' href='" + response.animals[n].url + "' target='_blank'" + response.animals[n].url + ">Pick me! Pick me!</a>");
    newCard.append(newCardBody);
    newCol.append(newCard);
    $("#availList").append(newCol);
    }
    
    // Clear location.hash before setting it again to work with every #search-button click event
    location.hash = '';
    location.hash = "#row-available-dogList";

  },

    // Call modal if we receive an Exception from API call, for now the exception is treated as no response
    $.ajax(settings).error(function() {
      $("#noResponse").empty();
        $('#noResponse').append("<p>" + breedType + " is not available in " + stateName + ". Please search again </p>");
        $('#responseModal').modal('show');
        return;
    })
  );
}

// Function to prevent errors between both APIs calling the same breed by different names so that results show
$("#dogInfo").on("click",  "#pick-me", function() {
  var button = $(event.target);
  var breedType = button.attr("data-breed-name");
  
  if (breedType === "Poodle (Miniature)" || breedType === "Poodle (Toy)")
    breedType = "Poodle";
  if (breedType === "American Pit Bull Terrier")
    breedType = "Pit Bull Terrier";
  if (breedType === "Olde English Bulldogge")
    breedType = "English Bulldog";
  getPetFinderToken(breedType, searchSt);
});