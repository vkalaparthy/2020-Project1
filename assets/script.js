
        $.ajax({
            url: "https://api.thedogapi.com/v1/breeds",
            method: "GET"
        }). then (function(breedData){
          for(var i = 0; i<breedData.length; i++) {
            $(".main").append("<p>" + "ID: " + breedData[i].id + ",  Name: " + breedData[i].name + ",  Group: " + breedData[i].breed_group + "</p>");
          }
        });

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
    </script>