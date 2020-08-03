var dogIdArray = [];
$("#search-button").on("click", function() {

    $.ajax({
        url: "https://api.thedogapi.com/v1/breeds", 
        method: "GET",
    }).done ( function(breedData) {

            $("#dogInfo").empty();
            var breedType = $("#breedGroup").val();
            var temperment = $("#searchTemperament").val();
            console.log(breedType);
            for(var i = 0; i<breedData.length; i++) {
                console.log(breedData[i].life_span);
                var tempData = breedData[i].temperament;
                if (tempData !== undefined) {
                    console.log(tempData);
                    if ((breedType === breedData[i].breed_group) && (tempData.indexOf(temperment) >= 0) ) {

                        var newCol = $("<div>");
                        newCol.addClass("col mb-4");
                        $("#dogInfo").append(newCol);
                        var newCard = $("<div>");
                        var dogId = breedData[i].id;
                        newCard.addClass("card");
                        newCard.attr("id", "id-"+dogId);
                        newCol.append(newCard);
                        
                        var newCardBody = $("<div>");
                        newCardBody.addClass("card-body");
                        var newh5 = $("<h5>");
                        newh5.css({'text-align':'center'});
                        newh5.text(breedData[i].name);
                        newCardBody.append(newh5);
                        var newP1 = $("<p>");
                        newP1.css({'text-align': "center"});
                        newP1.addClass("card-text").append( "ID: " + breedData[i].id + ",  Group: " + breedData[i].breed_group + " Life span: " + breedData[i].life_span);
                        newCardBody.append(newP1);
                        var newP2 = $("<p>").addClass("card-text");
                        newP2.css({'text-align': "center"});
                        newP2.append(tempData);
                        newCardBody.append(newP2);
                        newCardBody.append("<button class='btn btn-primary'>Select</button>" );   //<a href="#" class="btn btn-primary">Go somewhere</a>)
                        newCard.append(newCardBody);
                        dogIdArray.push(breedData[i].id);
                    }
                }
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

            console.log(queryUrl);
            console.log(dogId);
            
            var dogImg = $("<img>");
            //dogImg.css({'display': 'block', 'width': '1005'});
            //dogImg.css({'max-width': 'fit-content', 'margin-left': 'auto', 'margin-right':'auto'});
            dogImg.css({'width':'350px', 'height':'250px', 'margin-left': 'auto', 'margin-right':'auto'});
            dogImg.addClass("card-img-top");
            dogImg.attr("src", imgData[0].url);
            var getId = "#id-" + dogId;
            //setTimeout(function(){ console.log("Hello"); }, 3000);
            console.log(getId);
            $(getId).prepend(dogImg);
            //$(".dog-info").append(newDiv);
        })

}

function getPetFinderToken(breed, location) {
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
      fetchPetFinderData(response.access_token, breed, location)
    });
  }
  
  function fetchPetFinderData(token, breedType, location) {
    var queryURL = "https://api.petfinder.com/v2/animals?type=dog&breed=" + breedType +"&location=" + location + "&page=2";
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
      //console.log(response);
      for (var n=0; n<response.animals.length; n++) {
          //console.log("*******" + n);
          console.log(response.animals[n]);
          var state = response.animals[n].organization_id;
          //console.log(state);
          if (state.indexOf("NC") >= 0 ) {
            console.log("*******" + n);
            var newCard = $("<div>").addClass("card");
            var newCardBody = $("<div>").addClass("card-body");
            var dImg = $("<img>");
            dImg.attr("src", response.animals[n].photos[0].small);
            newCardBody.append(dImg);
            newCardBody.append("<p>" + response.animals[n].breeds.primary + "</p>");
            if (response.animals[n].breeds.secondary != null) 
                newCardBody.append("<p>" + response.animals[n].breeds.secondary + "</p>");
            newCardBody.append("<a href='" + response.animals[n].url + "' target='_blank'>" + response.animals[n].url + "</a>");
            newCard.append(newCardBody);
            $("#dogList").append(newCard);
            $("#mainDiv").append("<p>" + "*************************" + "</p>");
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
  
  getPetFinderToken("Terrier", "nc")



        // $.ajax({
        //     url: 'https://api.petfinder.com/v2/animals?type=dog&page=2',
        //     headers: { 'Authorization': 'Bearer XYtig7eQicL760dm4x2GjsLvhzshCZ8AsETvbxlb'}
        // }). then (function(response) {
        //     console.log(response);
        // });



        //"Authorization: Bearer XYtig7eQicL760dm4x2GjsLvhzshCZ8AsETvbxlb" https://api.petfinder.com/v2/animals?type=dog

        // import icajax from 'ic-ajax';
        // icajax({
        // url: 'https://api.petfinder.com/v2/animals?type=dog&page=2',
        // headers: {'Authorization': "RbjkyobxNXfD4Ey5eFqF3pAFvWYqccdWbf1QG5heK4KqDJiYmW"}
        // }). then (function(response) {
        //     console.log(response)
        // });
        // $.ajax({
        //     url: "https://api.petfinder.com/schemas/0.9/petfinder.js",
        //     method: "GET",
        //     dataType: "json"
        // }). then (function(response) {
        //     console.log(response);
        // })
