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
