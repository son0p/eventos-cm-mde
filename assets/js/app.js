function allow(obj, group_id, action_id) {

  $("#container  table").mask("Espere...");
  var strAlertSuccess = '<div class="alert alert-success" style="position: fixed; right:0px; top:215px; display: none;">'
        + '<button data-dismiss="alert" class="close" type="button">×</button>'
        + '<strong> Ha cambiado con éxito el permiso</strong>'
        + '</div>';
  $.post('/auth_acl/permissions/allow', {
    data: {
      groupId: group_id,
      actionId: action_id
    }
  }, function(o) {
    $('#container').load('/auth_acl/permissions');
    var alertSuccess = $(strAlertSuccess).appendTo('body');
    alertSuccess.show();
    setTimeout(function() {
      alertSuccess.remove();
    }, 2000);
  }, 'json');
}

$(document).ready(function($) {
  // Inicializar componentes
  new PersonaForm();
  new LoginForm();
  new TallerForm();
  new InscribeTallerForm();

  $('.inscribir_en_taller').click(function(e) {
    var id = $(this).data("id");
    var frameSrc = "/persona/"+ id + "/inscribirEnTaller";
    // Evento en bootstrap 3 es shown.bs.modal http://stackoverflow.com/questions/12190119/bootstrap-modal-show-event
    $('#myModal').on('shown.bs.modal', function() {
      $('iframe').attr("src", frameSrc);
    });
    $('#myModal').modal({show: true});
  });


  $('.lista_inscritos_taller').click(function(e) {
    var id = $(this).data("id");
    var frameSrc = "/persona/"+ id + "/inscribirEnTaller";
    // Evento en bootstrap 3 es shown.bs.modal http://stackoverflow.com/questions/12190119/bootstrap-modal-show-event
    $('#myModal').on('shown.bs.modal', function() {
      $('iframe').attr("src", frameSrc);
    });
    $('#myModal').modal({show: true});
  });

  // Define procesamiento de formulario de incripción
  function InscribeTallerForm ()
  {
    function getData() {
      var fields = ['persona_id','inscripcion_taller'];
      var data = {};
      fields.forEach(function(f) {
        var value = '';
        // obtengo todas las opciones y solo quiero la seleccionada
        // http://stackoverflow.com/questions/19597127/jquery-get-actual-data-id-from-selector
        if(f == 'inscripcion_taller') value = $('.selectpicker[name="inscripcion_taller"]').find('option:selected').data('id');
        else value= $("form[name='inscripcion_taller'] input[name="+f+"]").val();
        data[f] = value;
      });
      return data;
    };
    // procesa formulario de inscripcion a curso
    $("form[name='inscripcion_taller'] input[name='inscripcion_taller']").click(function(e){
      console.log(getData());
      $.post("/persona/:id/inscribirEnTaller", getData(), function(data) {
        console.log(data);
        console.log('/persona/'+data.persona_id+'/inscribirEnTaller');
        window.location = '/persona/'+data.persona_id+'/inscribirEnTaller';
      });
    });
  };
  // Definir formulario para crear persona
  function PersonaForm () {
    function getData() {
      var fields = ['id','nombre','telefonos','correo','institucionEducativa','nodos','fechaNacimiento','estudiadoMusicaAntes','sabeTocarInstrumento','generosMusicales','instrumentoDePreferencia','sexo'];
      var data = {};
      fields.forEach(function(f) {
        var value = '';
        if(f == 'nodos') value = $('.selectpicker[name="nodos"]').find('option:selected').data('id');
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
      var fields = ['id','nombre','descripcion','lugar','fecha','fechaFinaliza','periodicidad','hora','requerimientos','publicar','eventoInterno'];
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
