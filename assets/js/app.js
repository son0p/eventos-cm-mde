$(document).ready(function($) {
  // Inicializar componentes
  new PersonaForm();
  // Definir formulario para crear persona
  function PersonaForm () {
    function getData() {
      var fields = ['nombre','telefonos','correo','institucionEducativa','nodos'];
      var data = {};
      fields.forEach(function(f) {
        var value = '';
        if(f == 'nodos') value = $('.selectpicker').val();
        else value= $("form[name='persona'] input[name="+f+"]").val();
        data[f] = value;
      });
      return data;
    }
    $("form[name='persona'] input[name='guardarPersona']").click(function(e){
      //console.log(getData());
      $.post("/persona/create", getData(), function(data) {
        if(data.error) {
          switch(data.error) {
          case "E_VALIDATION":
            alert("El formato de correo ingresado es inválido");
            break;
          case "E_UNKNOWN":
            alert("La dirección de correo ya se encuentra en la base de datos");
            break;
          }
        } else
        {
          window.location = '/';
        }
        //console.log(data);
        // Object.keys(data).forEach(function(v){
        //   if(data[v][0].rule == "email") console.log("el correo está mal");
        // });
      });
    });
  }
  // Definir formulario para crear talleres
  function TallerForm () {
    function getData() {
      var fields = ['telefonos','correo'];
      var data = {};
      fields.forEach(function(f) {
        var value= $("form[name='persona'] input[name="+f+"]").val();
        data[f] = value;
      });
      return data;
    }
    $("form[name='persona'] input[name='guardarPersona']").click(function(e){
      $.post("/persona/create", getData(), function(data) {
        console.log(data);
        Object.keys(data).forEach(function(v){
          if(data[v][0].rule == "email") console.log("el correo está mal");
        });
      });
    });
  }

});
