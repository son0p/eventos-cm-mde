$(document).ready(function($) {
  // Inicializar componentes
  new PersonaForm();
  // Definir formulario para crear persona
  function PersonaForm () {
    function getData() {
      var fields = ['id','nombre','telefonos','correo','institucionEducativa','nodos','fechaNacimiento','estudiadoMusicaAntes','sabeTocarInstrumento','generosMusicales','instrumentoDePreferencia'];
      var data = {};
      fields.forEach(function(f) {
        var value = '';
        if(f == 'nodos') value = $('.selectpicker').val();
        else if(f == 'estudiadoMusicaAntes') value = $("form[name='persona'] input[name="+f+"]").is(":checked");
        else if(f == 'sabeTocarInstrumento') value = $("form[name='persona'] input[name="+f+"]").is(":checked");
        else if(f == 'generosMusicales') value = $("form[name='persona'] input[name="+f+"]").tagsinput('items');
        else if(f == 'instrumentoDePreferencia') value = $("form[name='persona'] input[name="+f+"]").tagsinput('items');
        else value= $("form[name='persona'] input[name="+f+"]").val();
        data[f] = value;
      });
      return data;
    }

    // procesa formulario registro.jade
    $("form[name='persona'] input[name='crearPersona']").click(function(e){
      console.log(getData());
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

    // procesa formularios conocerte.jade y edit.jade
    $("form[name='persona'] input[name='editarPersona']").click(function(e){
      console.log(getData());
      $.post("/persona/update", getData(), function(data) {
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
          console.log(data);
          //window.location = '/';
        }
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
    // $("form[name='persona'] input[name='guardarPersona']").click(function(e){
    //   $.post("/persona/create", getData(), function(data) {
    //     console.log(data);
    //     Object.keys(data).forEach(function(v){
    //       if(data[v][0].rule == "email") console.log("el correo está mal");
    //     });
    //   });
    // });
  }

});
