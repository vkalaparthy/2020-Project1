
var dogIdArray = [];
$("#search-button").on("click", function() {

    $.ajax({
        url: "https://api.thedogapi.com/v1/breeds", 
        method: "GET",
    }).done ( function(breedData) {

            $("#dogInfo").empty();
            var breedType = $("#searchType").val();
            console.log(breedType);
            for(var i = 0; i<breedData.length; i++) {
                if (breedType === breedData[i].breed_group) {

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
                    var newP = $("<p>");
                    newP.css({'text-align': "center"});
                    newP.addClass("card-text").append( "ID: " + breedData[i].id + ",  Group: " + breedData[i].breed_group);
                    newCardBody.append(newP);
                    newCardBody.append("<button class='btn btn-primary'>Select</button>" );   //<a href="#" class="btn btn-primary">Go somewhere</a>)
                    newCard.append(newCardBody);
                    dogIdArray.push(breedData[i].id);
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
            dogImg.css({'width':'300px', 'height':'200px', 'margin-left': 'auto', 'margin-right':'auto'});
            dogImg.addClass("card-img-top");
            dogImg.attr("src", imgData[0].url);
            var getId = "#id-" + dogId;
            //setTimeout(function(){ console.log("Hello"); }, 3000);
            console.log(getId);
            $(getId).prepend(dogImg);
            //$(".dog-info").append(newDiv);
        })

}

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
