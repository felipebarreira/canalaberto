$(document).ready(function(){

	$("#frb-link").click(function(){
		$("#frb-filtros").slideDown();
		$("#frb-filtros-links").slideUp();
	});
	$("#frb-link-cancelar").click(function(){
		$("#frb-filtros").slideUp();
		$("#frb-filtros-links").slideDown();
	});

	$("#CHECKBOX-filtrar-noperiodo").on("click",function(){
		var val = $(this).is(":checked");

		if(!val) $("#box-filtrar-periodo").slideDown();
		else $("#box-filtrar-periodo").slideUp();

	});

	
	setTimeout(function(){
		$("#msg").slideUp();
	}, 5000);

	$("#despejo-table-payments").delegate(".link-visualizar","click",function(ev){
		ev.preventDefault();

		var _el = $(this);
		var url = _el.attr("href");
		url = url+"&addClass=visualizar-editar";
		url = GINGAglobals.urlAdmin+"index.php"+url+"";

		$.gingaFrame({
			"url": url,
			"txt": "Visualizar inscrição",
			"modal": false,
			"width": "75%",
			"height": "90%"
			/*
			"auxButton": {
				"label":"Salvar",
				"funcao": function(){
					var iframe = document.getElementById("gingaFrameIframe").contentWindow;
					iframe.enviaForm(); 
				}
			}
			*/
		});
	});

	$("#despejo-table-payments").delegate(".link-formapgto","click",function(ev){
		ev.preventDefault();

		var _el = $(this);
		var url = _el.attr("href");
		url = url+"&addClass=visualizar-editar visualizar-pagamentos";
		url = GINGAglobals.urlAdmin+"index.php"+url+"";

		$.gingaFrame({
			"url": url,
			"txt": "Visualizar pagamentos da inscrição",
			"modal": false,
			"width": "75%",
			"height": "90%",
			"auxButton" :false,
			"onOpen": {
				"funcao": function(){
					//alert("Abriu");
				}
			},
			"onClose": {
				"funcao": function(){
					$("#gfJanela").removeClass('dark');
				}
			}
		});
	});

	$("#despejo-table-payments").delegate(".link-pgtoconfirmar","click",function(ev){
		ev.preventDefault();

		var _el = $(this);

		var actionUrl = _el.attr("href");
		actionUrl = GINGAglobals.urlAdmin+"index.php"+actionUrl+"";

		var url = _el.parents("tr").find(".link-formapgto").attr("href");
		url = url+"&addClass=visualizar-editar visualizar-pagamentos visualizar-confirmarpedido";
		url = GINGAglobals.urlAdmin+"index.php"+url+"";

		$.gingaFrame({
			"url": url,
			"txt": "Confirmar pedido",
			"modal": false,
			"width": "75%",
			"height": "90%",
			"auxButton" : {
				"label":"Confirmar pedido",
				"funcao": function(){
					window.location.href = actionUrl;
				}
			}
		});
	});

	$("#despejo-table-payments").delegate(".link-pgtocancelar","click",function(ev){
		ev.preventDefault();

		var _el = $(this);

		var actionUrl = _el.attr("href");
		actionUrl = GINGAglobals.urlAdmin+"index.php"+actionUrl+"";

		$.msgbox('<strong style="font-size:14px">Deseja cancelar essa inscrição?</strong><br/>Notifique o aluno que sua inscrição foi cancelada.', {
			type: "confirm",
			buttons: [{
				type: "submit",
				value: "Cancelar inscrição"
			},{
				type: "cancel",
				value: "Abortar"
			}]
		}, function(result){
			if(result == "Cancelar inscrição"){
				window.location.href = actionUrl;
			}
		});
	});



	$("#despejo-table-payments").delegate(".SELECT-substatus","change",function(ev){
		var _val = $(this).val();
		var idRequest = $(this).attr("data-id-request");
		ajaxSmartSubstatus("substatus",idRequest,_val);
	});

	$("#despejo-table-payments").delegate(".INPUT-subcomentario","change",function(ev){
		var _val = $(this).val();
		var idRequest = $(this).attr("data-id-request");
		ajaxSmartSubstatus("comment",idRequest,_val);
	});

});

function darkGingaFrame(){
	$("#gfJanela").toggleClass('dark');
};

function ajaxSmartSubstatus(tipo, idRequest, _val){
		var url = GINGAglobals.urlAdmin+"index.php?rt=requests/update&id-request="+idRequest;

		$.ajax({
			type: "POST",
			data: "id-request="+idRequest+"&"+tipo+"="+_val ,
			url: url
		})
		.done(function( data ) {
			if(data.ok){
				$().toastmessage("showToast", {
					text : data.msg,
					sticky : false,
					stayTime: 2500,
					position: "top-center",
					type : "success"
				});
			}
			else{
				ginga_alert(data.msg);
			}
		})
		.fail(function(){
			ginga_alert("Ocorreu um erro, tente novamente.");
		});		

};