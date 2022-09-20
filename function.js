const BASE_URL = "https://fhir.alliance4u.io/api/"

function getPractitioner() {
    $.get(BASE_URL +"practitioner", function (result) {
        for(let i=0; i < result.length; i++){
            let clone = $( "#template-practitioner" ).clone();
            if(result[i].name[0]) clone.find(".name").text(result[i].name[0].text);
            if(result[i].telecom && result[i].telecom[0]) clone.find(".telecom").text(result[i].telecom[0].value);
            clone.appendTo( "#list-practitioner" );
        }
        $( "#template-practitioner" ).remove();
    })
}

function getNbPractitioner() {
    $.get(BASE_URL +"practitioner", function (result) {
        console.log(result.length);
        let count = find(".nbPractitioner");
        count.replace(/5,245/i, result.length);
    })
}

