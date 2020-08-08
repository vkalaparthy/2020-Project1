var searchSt = "";
var stateName = "";
var dogIdArray;

$("#search-button").on("click", function() {
    dogIdArray = [];
  
    $("#dogInfo").empty();
    $("#availList").empty();
    searchSt = $("#searchState").val();
    
    if(searchSt === "") {
      $('#inputModal').modal('show');
      
      return;
    }
    
    stateName = $("#searchState option:selected").text();
    var breedType = $("#searchType").val();
    var breedGroup = $("#searchGroup").val();
    var temperment = $("#searchTemperament").val();
  
    event.preventDefault();
  
    if (breedType === "" && breedGroup === "" && temperment === "") {
      $('#inputModal').modal('show');
      return;

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
              } 
            } else if (breedGroup != "" && temperment != "") {
              if (tempData !== undefined) {
                if ((breedGroup === dogData[i].breed_group) && (tempData.indexOf(temperment) >= 0) ) {
                  addDogInfoToDiv(dogData[i]);
                }
              }
            } else {
              if (breedGroup != "") {
                if(breedGroup === dogData[i].breed_group) {
                  addDogInfoToDiv(dogData[i]);
                }
              } else if (temperment != "") {
                if (tempData != undefined && tempData.indexOf(temperment) >= 0) {
                  addDogInfoToDiv(dogData[i]);
                }
              }
            }
          }
          for (var i=0; i<dogIdArray.length; i++) {
              addTheImage(dogIdArray[i]);
          }
          location.hash = "#row-dogInfo";
          resetFormInputs();
      })
    }
  })  

function addTheImage(dogId) {

  var queryUrl =  "https://api.thedogapi.com/v1/images/search?include_breed=1&breed_id="+dogId;
  $.ajax({
      url: queryUrl,
      method:"GET"
  }). then (function(imgData) {
      var dogImg = $("<img>");
      
      dogImg.addClass("card-img-top");
      dogImg.attr("src", imgData[0].url);
      var getId = "#id-" + dogId;
      
      $(getId).prepend(dogImg);
  })

}

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
    var newh5 = $("<h5>");
    newh5.text(dogData.name);
    newCardBody.append(newh5);
    var newP1 = $("<p>");
    newP1.addClass("card-text").append( " Group: " + dogData.breed_group + "<br>" + "<br>" + " Life span: " + dogData.life_span);
    newCardBody.append(newP1);
    var newP2 = $("<p>").addClass("card-text");
    newP2.append(tempData);
    newCardBody.append(newP2);
    newCardBody.append("<p><strong>Do you want Adopt a " + dogData.name + "?</strong></p> <a class='btn btn-dark' href='#available-dogList' role='button' id='pick-me' data-breed-name='" + dogData.name +"'>Yes</a> <a class='btn btn-dark' href='index.html' role='button'>No</a>");
    newCard.append(newCardBody);
    dogIdArray.push(dogData.id);
}

$("#clear-button").on("click", function() {
    $("#dogInfo").empty();
    $("#availList").empty();
})

$("#surpriseMe-button").on("click", function() {
  dogIdArray = [];
  $("#dogInfo").empty();
  $("#availList").empty();
  searchSt = $("#searchState").val();
  
  if(searchSt === "") {
    $('#inputModal').modal('show');
    return;
  }
  stateName = $("#searchState option:selected").text();

  event.preventDefault();

  $.ajax({
      url: "https://api.thedogapi.com/v1/breeds", 
      method: "GET",
  }).then ( function (randomDog) {
    breedDataLength = randomDog.length;
    var num = Math.floor(Math.random() * breedDataLength);
    addDogInfoToDiv(randomDog[num], dogIdArray);
    
    for (var i = 0; i<dogIdArray.length; i++) {
      addTheImage(dogIdArray[i]); 
    } 
    location.hash = "#row-dogInfo";
  });

});

function resetFormInputs() {
  $("#searchType").val("");
  $("#searchGroup").val("");
  $("#searchTemperament").val("");
}

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

  $.ajax(settings).done(function (response) {
    fetchPetFinderData(response.access_token, breed, searchState)
  });
}
  
function fetchPetFinderData(token, breedType, searchState) {
  var queryURL = "https://api.petfinder.com/v2/animals?type=dog&breed=" + breedType +"&location=" + searchState + "&page=2";
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
    
    if (response.animals.length === 0) {
      $("#noResponse").empty();
      $('#noResponse').append("<p>" + breedType + " is not available in " + stateName + ". Please search again </p>");
      $('#responseModal').modal('show');
      
      return;
    } 

    for (var n=0; n<response.animals.length; n++) {
      var state = response.animals[n].organization_id;
      console.log(response.animals[n]);
      var newCol = $("<div>");
      newCol.addClass("col mb-4");
      
      var newCard = $("<div>").addClass("card");
      var newCardBody = $("<div>").addClass("card-body pupBody");
      var dImg = $("<img>").addClass("card-img-top");
      
      if (response.animals[n].photos.length > 0) {
        dImg.attr("src", response.animals[n].photos[0].medium);
        newCardBody.append(dImg);
      } else {
        dImg.attr("src", "assets/images/image.png")
        newCardBody.append(dImg);
      }
      
      newCardBody.append("<p> Primary Breed: " + response.animals[n].breeds.primary + "</p>");
      if (response.animals[n].breeds.secondary != null) {
          newCardBody.append("<p> Secondary Breed: " + response.animals[n].breeds.secondary + "</p>");
      }
      
      newCardBody.append("<a class='btn btn-dark'  role='button' href='" + response.animals[n].url + "' target='_blank'" + response.animals[n].url + ">Pick me! Pick me!</a>");
      newCard.append(newCardBody);
      newCol.append(newCard);
      $("#availList").append(newCol);
    }
  
  },

    $.ajax(settings).error(function() {
      $("#noResponse").empty();
        $('#noResponse').append("<p>" + breedType + " is not available in " + stateName + ". Please search again </p>");
        $('#responseModal').modal('show');
        return;
    })
  );
}
  
$("#dogInfo").on("click",  "#pick-me", function() {
  var button = $(event.target);
  var breedType = button.attr("data-breed-name");
  
  if (breedType === "Poodle (Miniature)" || breedType === "Poodle (Toy)")
    breedType = "Poodle";
  
  getPetFinderToken(breedType, searchSt);
  location.hash = "#row-available-dogList";
});