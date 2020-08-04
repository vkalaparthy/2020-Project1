var dogIdArray = [];
var searchSt = "";

$("#search-button").on("click", function() {

    console.log("Button-clicked");
    $("#dogInfo").empty();
    searchSt = $("#searchState").val();
    console.log(searchSt);

    event.preventDefault();  //This is commented as it blocks the href -- need to findout why?

    $.ajax({
        url: "https://api.thedogapi.com/v1/breeds", 
        method: "GET",
    }).done ( function(dogData) {
            var breedGroup = $("#searchGroup").val();
            var temperment = $("#searchTemperament").val();
            var breedType = $("#searchType").val();
            console.log($("#searchType").val());
            console.log(breedGroup, dogData.length);
            for(var i = 0; i<dogData.length; i++) {
              var tempData = dogData[i].temperament;
              if (breedType) {
                if (breedType === dogData[i].name) {
                    addDogInfoToDiv(dogData[i]);
                } 
              }else {
                    if (tempData !== undefined) {
                    //console.log(tempData);
                      if ((breedGroup === dogData[i].breed_group) && (tempData.indexOf(temperment) >= 0) ) {
                        addDogInfoToDiv(dogData[i]);
                      }
                    }
                } dI
            }
            for (var i=0; i<dogIdArray.length; i++) {
                addTheImage(dogIdArray[i]);
            }
    })
})  

function addTheImage(dogId) {

        console.log(" dogId: "+dogId);

        var queryUrl =  "https://api.thedogapi.com/v1/images/search?include_breed=1&breed_id="+dogId;
        $.ajax({
            url: queryUrl,
            method:"GET"
        }). then (function(imgData) {

            console.log("addTheImage" + queryUrl);
            console.log(dogId);
            
            var dogImg = $("<img>");
            //dogImg.css({'display': 'block', 'width': '1005'});
            //dogImg.css({'max-width': 'fit-content', 'margin-left': 'auto', 'margin-right':'auto'});
            dogImg.addClass("card-img-top");
            dogImg.attr("src", imgData[0].url);
            var getId = "#id-" + dogId;
            //setTimeout(function(){ console.log("Hello"); }, 3000);
            console.log(getId);
            $(getId).prepend(dogImg);
            //$(".dog-info").append(newDiv);
        })

}

function addDogInfoToDiv (dogData) {
    var tempData = dogData.temperament;
    var newCol = $("<div>");
    newCol.addClass("col mb-4");
    $("#dogInfo").append(newCol);
    var newCard = $("<div>");
    var dogId = dogData.id;
    newCard.addClass("card");
    newCard.attr("id", "id-"+dogId);
    newCol.append(newCard);
    
    var newCardBody = $("<div>");
    newCardBody.addClass("card-body");
    var newh5 = $("<h5>");
    newh5.text(dogData.name);
    newCardBody.append(newh5);
    var newP1 = $("<p>");
    newP1.addClass("card-text").append( "ID: " + dogData.id + ",  Group: " + dogData.breed_group + " Life span: " + dogData.life_span);
    newCardBody.append(newP1);
    var newP2 = $("<p>").addClass("card-text");
    newP2.append(tempData);
    newCardBody.append(newP2);
    //newCardBody.append("<button type='button' id='pick-me' data-breed-name='" + breedData[i].name + "' class='btn btn-primary'>Select Me</button>" );   //<a href="#" class="btn btn-primary">Go somewhere</a>)
    //newCardBody.append("<button id='pickMe' data-value='" + breedData[i].name + "' class='btn btn-primary'>Select Me</button>" );
    newCardBody.append("<a href='#available-dogList' class='btn btn-primary' id='pick-me' data-breed-name='" + dogData.name +"' >Select Me</a>");
    newCard.append(newCardBody);
    dogIdArray.push(dogData.id);
}

$("#clear-button").on("click", function() {
    $("#dogInfo").empty();
    $("#available-dogList").empty();
})

$("#surpiseMe-button").on("click", function() {

    console.log("Surprise Me .....");
})

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
      console.log(response);
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
      console.log(queryURL);
      console.log(response);
      console.log("******************");
      $("#available-dogList").empty();
      if (response.animals.length === 0) {
        $("#available-dogList").append("<h5> Sorry " + breedType + " is not avilable </h5>");
        return;
      };

      for (var n=0; n<response.animals.length; n++) {
          //console.log("*******" + n);
          console.log(response.animals[n]);
          var state = response.animals[n].organization_id;
          //console.log(state);
          if (state.indexOf("NJ") >= 0 ) {
            console.log("*******" + n);
            var newCard = $("<div>").addClass("card");
            var newCardBody = $("<div>").addClass("card-body");
            var dImg = $("<img>");
            if (response.animals[n].photos.length > 0) {
              dImg.attr("src", response.animals[n].photos[0].small);
              newCardBody.append(dImg);
            }
            newCardBody.append("<p> Primary: " + response.animals[n].breeds.primary + "</p>");
            if (response.animals[n].breeds.secondary != null) 
                newCardBody.append("<p> Secondary: " + response.animals[n].breeds.secondary + "</p>");
            newCardBody.append("<a href='" + response.animals[n].url + "' target='_blank'>" + response.animals[n].url + "</a>");
            newCard.append(newCardBody);
            $("#available-dogList").append(newCard);
            //$("#mainDiv").append("<p>" + "*************************" + "</p>");
            console.log(response.animals[n]);
            console.log(state);
            console.log(response.animals[n].breeds.primary);
            console.log(response.animals[n].breeds.secondary);
            console.log(response.animals[n].url);
          }
          //if(response.animals[n].organization_id)
      }
    });
  }
  
  $("#dogInfo").on("click",  "#pick-me", function() {
    console.log("pick me clicked");
    console.log(event);
    var button = $(event.target); 
    console.log(button);
    console.log(button.attr("id"));
    //console.log(button.attr("data-breed-name"));
    var breedType = button.attr("data-breed-name");
    console.log(breedType);
    //event.preventDefault();
    //console.log (this.data(value));
    getPetFinderToken(breedType, searchSt);
    //windows.location.replace("finalResults.html");

  });
