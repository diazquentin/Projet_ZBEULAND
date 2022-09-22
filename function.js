const BASE_URL = "https://fhir.alliance4u.io/api/"

function getPractitioner() {
    $.get(BASE_URL + "practitioner", function (result) {
        for (let i = 0; i < result.length; i++) {
            let clone = $("#template-practitioner").clone();
            if (result[i].name[0]) clone.find(".name").text(result[i].name[0].text);
            if (result[i].telecom && result[i].telecom[0]) clone.find(".telecom").text(result[i].telecom[0].value);
            clone.appendTo("#list-practitioner");
        }
        $("#template-practitioner").remove();
    })
}

function getDossier() {
    $.get(BASE_URL +"patient/007", function (result) {
        $( "#nom" ).text(result.name[0].family);
        $( "#prenom" ).text(result.name[0].given[0]);
        $( "#date" ).text(result.birthDate);
        $( "#adresse" ).text(result.address[0].line[1] + " " + result.address[0].line[0] + ", " + result.address[0].city + ", " + result.address[0].country );
        $( "#tel" ).text(result.telecom[1].value);
        $( "#mail" ).text(result.telecom[2].value);
        console.log(result);

    })
}


function getMessagePatient() {
    $.get(BASE_URL +"communication?sender.reference=Patient/632b11f2337d8800190ca297&recipient.reference=Practitioner/7", function (result) {
        
        for(let i=0; i < result.length; i++){
            let clone = $( "#template-conversation" ).clone();
            if(result[i].payload) clone.find(".message").text(result[i].payload[0].contentString);
            if(result[i].sent) clone.find(".heureMessage").text(result[i].sent);
            clone.find(".nomPersonne").text("Patient");
            clone.appendTo( "#conversation" );
        }
        console.log(result);
        $( "#template-conversation" ).remove();
    })
}

function getMessageMedecin() {
    $.get(BASE_URL +"communication?sender.reference=Practitioner/7&recipient.reference=Patient/632b11f2337d8800190ca297", function (result) {
        
        for(let i=0; i < result.length; i++){
            let clone = $( "#template-conversation" ).clone();
            if(result[i].payload) clone.find(".message").text(result[i].payload[0].contentString);
            if(result[i].sent) clone.find(".heureMessage").text(result[i].sent);
            clone.find(".nomPersonne").text("Médecin");
            clone.appendTo( "#conversation" );
        }
        console.log(result);
        $( "#template-conversation" ).remove();
    })
}

function postMessage() {

    
    let message = {
        "resourceType": "Communication",
        "sent": new Date().toISOString(),
        "recipient": [
            {
                "reference": "Practitioner/7"
            }
        ],
        "sender": {
            "reference": "Patient/632b11f2337d8800190ca297"
        },
        "payload": [
            {
                "contentString": document.getElementById("input").value
            }
        ]
    };

    console.log(message);

    $.post(BASE_URL + "communication", message, function (result) {
        console.log(result);
    });
}

function getNbPractitioner() {
    $.get(BASE_URL + "practitioner", function (result) {
        $("#nombre-practicien").text(result.length);
    })
}

function getNbRdv() {
    $.get(BASE_URL + "appointment?participant.actor.identifier.value=6322e3bf76c6f7001a59728d", function (result) {
        $("#nombre-rdv").text(result.length);
    })
}

function getNbMess() {
    $.get(BASE_URL + "communication?sender.reference=Practitioner/7&recipient.reference=Patient/632b11f2337d8800190ca297", function (result) {
        $("#nombre-mess").text(result.length);
    })
}


new Vue({

    el: '#principal',

    data: {
        contact: { id: '', nom: '', prenom: '', debutRdv: '', finRdv: '', tel: '' },
        agenda: [],
        cpt: 0
    },

    mounted: function () {
        this.chargerAgenda();
    },

    methods: {
        chargerAgenda: function () {
            var agendaDate = [];

            // Récupération des données du patient
            $.get(BASE_URL + "patient/6322e3bf76c6f7001a59728d", function (result) {
                let patient = result;

                $.get(BASE_URL + "appointment?participant.actor.identifier.value=6322e3bf76c6f7001a59728d", function (result) {
                    for (let i = 0; i < result.length; i++) {
                        let rdv = { id: i };
                        if (patient.name && patient.name[0] && patient.name[0].family) rdv.nom = patient.name[0].family;
                        if (patient.name && patient.name[0] && patient.name[0].given && patient.name[0].given[0]) rdv.prenom = patient.name[0].given[0];
                        if (patient.telecom && patient.telecom[0]) rdv.tel = patient.telecom[0].value;

                        rdv.debutRdv = result[i].start;
                        rdv.finRdv = result[i].end;

                        if (rdv.nom && rdv.prenom && rdv.debutRdv && rdv.finRdv) {
                            agendaDate.push(rdv);
                        }
                    }
                });
            });

            this.agenda = agendaDate;
            this.cpt = agendaDate.length;
        },

        addAppointment: function () {

            let appointment = {
                "resourceType": "Appointment",
                "status": "pending",
                "start": this.contact.debutRdv + "T10:08:00Z",
                "end": this.contact.finRdv + "T10:38:00Z",
                "participant": [
                    {
                        "actor": {
                            "type": "Patient",
                            "identifier": {
                                "value": "6322e3bf76c6f7001a59728d"
                            }
                        }
                    },
                    {
                        "actor": {
                            "type": "Practitioner",
                            "identifier": {
                                "value": "7"
                            }
                        }
                    }
                ]
            };

            $.post(BASE_URL + "appointment", appointment, function (result) {
                console.log(result);
            });
        },

        suppRdv: function (index) {
            if (confirm("Etes vous sûr d'annuler la prise de rdv ?")) {
                this.agenda.splice(index, 1);
            }
        }
    }
});
