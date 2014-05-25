$(document).ready(function($) {
  // Inicializar componentes
  new PersonaForm();
  // Definir formulario para crear persona
  function PersonaForm () {
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
