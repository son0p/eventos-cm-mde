$(document).ready(function($) {
  // Inicializar componentes
  new PersonaForm();
  new LoginForm();
  new TallerForm();

  // Definir formulario para crear persona
  function PersonaForm () {
    function getData() {
      var fields = ['id','nombre','telefonos','correo','institucionEducativa','nodos','fechaNacimiento','estudiadoMusicaAntes','sabeTocarInstrumento','generosMusicales','instrumentoDePreferencia','sexo','documento'];
      var data = {};
      fields.forEach(function(f) {
        var value = '';
        if(f == 'nodos') value = $('.selectpicker[name="nodos"]').val();
        else if(f == 'sexo') value = $('.selectpicker[name="sexo"]').val();
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
          window.location = '/';
        }
      });
    });
  }
  // Definir formulario para crear talleres
  function TallerForm () {
    function getData() {
      var fields = ['id','nombre','descripcion','lugar','fecha','hora','requerimientos','publicar','eventoInterno'];
      var data = {};
      fields.forEach(function(f) {
        if(f == 'eventoInterno') value = $("form[name='taller'] input[name="+f+"]").is(":checked");
        else if(f == 'publicar') value = $("form[name='taller'] input[name="+f+"]").is(":checked");
        else if(f == 'descripcion') value = $("form[name='taller'] textarea[name="+f+"]").val();
        else var value= $("form[name='taller'] input[name="+f+"]").val();
        data[f] = value;
      });
      return data;
    }
    $("form[name='taller'] input[name='crearTaller']").click(function(e){
      console.log(getData());
    $.post("/taller/create", getData(), function(data) {
        console.log(data);
      switch(data.type) {
      case 'error' :
        alert(data.message);
        break;
      case 'success' :
        window.location = '/';
        break;
      }
      });
    });

    $("form[name='taller'] input[name='editarTaller']").click(function(e){
      console.log(getData());
    $.post("/taller/edit", getData(), function(data) {
        console.log(data);
      switch(data.type) {
      case 'error' :
        alert(data.message);
        break;
      case 'success' :
        window.location = '/';
        break;
      }
    });
    });
  }

  // Definir formulario para authenticación
  function LoginForm () {
    function getData() {
      var fields = ['username','password'];
      var data = {};
      fields.forEach(function(f) {
        var value= $("form[name='login'] input[name="+f+"]").val();
        data[f] = value;
      });
      return data;
    }
    $("form[name='login'] input[name='submitLogin']").click(function(e){
      $.post("/login", getData(), function(data) {
        switch(data.type) {
        case 'error' :
          alert(data.message);
          break;
        case 'success' :
          window.location = '/';
          break;
        }
          // Object.keys(data).forEach(function(v){
        //   if(data[v][0].rule == "email") console.log("el correo está mal");
        // });
      });
    });
  }

});
