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


new Vue({

    el: '#principal',
  
    data: {
      contacto: {id: '', nombre: '', apellidos: '', fnacimiento: '', telefono: '' },
      agenda: [],
      contador: 0
    },
  
    mounted: function() {
      this.cargarAgenda();
    },
  
    methods: {
      cargarAgenda: function() {
        var agendaDatos = [
          {
            id: 1,
            nombre: 'Mario',
            apellidos: 'Brito Morales',
            fnacimiento: '19/01/1973',
            telefono: '699800461'
          },
          {
            id: 2,
            nombre: 'Juana',
            apellidos: 'Rodríguez  Pérez',
            fnacimiento: '29/11/1970',
            telefono: '659855461'
          },
          {
            id: 3,
            nombre: 'Vicente',
            apellidos: 'Roca Valido',
            fnacimiento: '22/07/1983',
            telefono: '698554781'
          }
        ];
  
        this.agenda = agendaDatos;
        this.contador=agendaDatos.length;
      },
  
      addContacto: function() {
        if(this.contacto.nombre) {
          this.contador++;
          this.contacto.id=this.contador;
          this.agenda.push(this.contacto);
          this.contacto = { nombre: '', apellidos: '', fnacimiento: '', telefono: '' };
        }
      },
  
      borrarContacto: function(index) {
        if(confirm("Etes vous sûr d'annuler la prise de rdv ?")) {
          this.agenda.splice(index, 1);        
        }
      }
    }
  });
  