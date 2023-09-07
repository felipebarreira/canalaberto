$(document).ready(function(){

	$("#plBusca").undelegate( "#plbCampo", "keyup");
	buscaFinan();
	sparkReload();


	$("#plbFiltro .pfiltro-select").change(function(){
		var valo = $(this).val();
		$(this).closest("label").find("input").prop('checked', true);
		$("#plbCampo").val(valo).trigger("keyup");
	});

	$("#despejo-table-payments").delegate(".ark-checkbox input[type='checkbox']","click",function(){
		var par = $(this).closest(".ark-checkbox");
		var linha = $(this).closest("tr");
		var id = $(linha).find(".tb-id-pagto").text();
		var val = $(this).is(":checked");

		if(val){
			$(linha).addClass("linha-pago");
			$(par).addClass("pago").removeClass("aberto");
			$(par).find("span").text("pago");
			statusPgto(id,1);
		}
		else{
			$(linha).removeClass("linha-pago");
			$(par).addClass("aberto").removeClass("pago");
			$(par).find("span").text("aberto");
			statusPgto(id,0);
		}
	});

	var isVisualizarPgto = $("body").hasClass("visualizar-pagamentos") ? true : false;

	$("#despejo-table-payments").delegate(".link-notificacao","click",function(ev){
		ev.preventDefault();

		var wi_g , he_g;
		if(isVisualizarPgto){
			wi_g = "94%";
			he_g = "94%";
		} else {
			wi_g = "75%";
			he_g = "90%";
		}

		var _el = $(this);
		var url = _el.attr("href");
		url = url+"&addClass=visualizar-editar";
		url = GINGAglobals.urlAdmin+"index.php"+url+"";
		var data= _el.parents("tr").find(".tb-list-desc-tit").text();

		$.gingaFrame({
			"url": url,
			"txt": "Notificações — <strong>"+data+"</strong>",
			"modal": false,
			"width": wi_g,
			"height": he_g,
			"auxButton": {
				"label":"Salvar",
				"funcao": function(){
					var iframe = document.getElementById("gingaFrameIframe").contentWindow;
					iframe.enviaForm(); 
				}
			},
			"onOpen":{
				"funcao": function(){
					parent.darkGingaFrame();
					$("body").addClass("noscroll");
				}
			},
			"onClose":{
				"funcao": function(){
					parent.darkGingaFrame();
					$("body").removeClass("noscroll");
				}
			}
		});
	});


	$("#despejo-table-payments").delegate(".link-editar","click",function(ev){
		ev.preventDefault();

		var wi_g , he_g;
		if(isVisualizarPgto){
			wi_g = "94%";
			he_g = "94%";
		} else {
			wi_g = "75%";
			he_g = "90%";
		}

		var _el = $(this);
		var url = _el.attr("href");
		url = url+"&addClass=visualizar-editar";
		url = GINGAglobals.urlAdmin+"index.php"+url+"";
		var nome= _el.parents("tr").find(".tb-list-desc-tit").text();

		$.gingaFrame({
			"url": url,
			"txt": "Editar pagamento — <strong>"+nome+"</strong>",
			"modal": false,
			"width": wi_g,
			"height": he_g,
			"auxButton": {
				"label":"Salvar",
				"funcao": function(){
					var iframe = document.getElementById("gingaFrameIframe").contentWindow;
					iframe.enviaForm(); 
				}
			},
			"onOpen":{
				"funcao": function(){
					parent.darkGingaFrame();
					$("body").addClass("noscroll");
				}
			},
			"onClose":{
				"funcao": function(){
					parent.darkGingaFrame();
					$("body").removeClass("noscroll");
				}
			}
		});
	});

	$("#frb-link").click(function(){
		$("#frb-filtros").slideDown();
		$("#frb-filtros-links").slideUp();
	});
	$("#frb-link-cancelar").click(function(){
		$("#frb-filtros").slideUp();
		$("#frb-filtros-links").slideDown();
	});


	/*
	$(".data-filtro")
	.datepicker({
		changeMonth: true,
		changeYear: true
	})
	.css({'margin-right': -23,'width': 110})
	//.attr('readonly', 'readonly')
	.mask("99/99/9999",{placeholder:"dd/mm/aaaa"})
	.after('<img src="img/mini/data.png" alt="Selecionar uma data" />');
	*/



	$("#abames-menu .seta").click(function(){
		var tgt = $(this).attr("data-seta");
		var mesAtual , mesTgt = "";


		if(tgt=="prev"){
			mesAtual = $("#abames-menu-meses li:first-child").attr("data-aba-mes");
			mesTgt = moment(mesAtual,"MM YYYY").subtract(1, 'month');
			var mes = moment(mesTgt).format("MMMM");
			var mesNum = moment(mesTgt).format("MM");
			var ano = moment(mesTgt).format("YYYY");
			$('<li data-aba-mes="'+mesNum+' '+ano+'"><p> '+mes+' <br> <span>'+ano+'</span></p></li>').prependTo('#abames-menu-meses');
			$("#abames-menu-meses li:last-child").remove();
		}else{
			mesAtual = $("#abames-menu-meses li:last-child").attr("data-aba-mes");
			mesTgt = moment(mesAtual,"MM YYYY").add(1, 'month');
			var mes = moment(mesTgt).format("MMMM");
			var mesNum = moment(mesTgt).format("MM");
			var ano = moment(mesTgt).format("YYYY");
			$('<li data-aba-mes="'+mesNum+' '+ano+'"><p> '+mes+' <br> <span>'+ano+'</span></p></li>').appendTo('#abames-menu-meses');
			$("#abames-menu-meses li:first-child").remove();
		}

		checaMesSelec();	
	});

	$("#abames-menu-meses").delegate("li", "click", function(event) {
		var mesClick = $(this).attr("data-aba-mes");
		var mesDias = moment(mesClick, "MM YYYY").daysInMonth()

		$("#abames-menu-meses li").removeClass("selec");
		if($("#abames-seldata").hasClass("selec")) $("#abames-seldata").trigger("click");
		$(this).addClass("selec");
		$("#abames-menu-meses").attr("data-mes-selec",mesClick);

		var diaInicial = moment("01 "+mesClick,"DD MM YYYY").format("DD/MM/YYYY");
		var diaFinal = moment(mesDias+" "+mesClick,"DD MM YYYY").format("DD/MM/YYYY");
		//console.log(diaInicial + "" + diaFinal);
		$("#input-dateinit").val(diaInicial).attr("value",diaInicial);
		$("#input-enddate").val(diaFinal).attr("value",diaFinal);

		$("#label-data").text("de "+diaInicial+" a "+diaFinal);
		$("#input-seldata-dateinit").val(diaInicial);
		$("#input-seldata-enddate").val(diaFinal);

		ajaxCursor.show();
		atualizaTotais(function(){
			ajaxCursor.hide();
		});

	});

	$("#abames-seldata").click(function(){
		$("#abames-menu-meses li.selec").removeClass("selec");
		if(! $(this).hasClass("selec")){
			$(this).addClass("selec");
			$("#abames-menu-seldata").addClass("abames-hover");
		}else{
			$(this).removeClass("selec");
			$("#abames-menu-seldata").removeClass("abames-hover");
		}
		

	});


	$("#abames-menu-seldata *").click(function(ev){
		ev.stopPropagation();
	});
	$("#abames-menu-seldata .data-filtro").change(function(){
		var campo = $(this)[0].id;
		var valo = $(this).val();

		if(campo=="input-seldata-dateinit"){
			$("#input-dateinit").val(valo).attr("value",valo);
			$("#label-data").text("de "+valo+" a "+$("#input-seldata-enddate").val());
		}
		else{
			$("#input-enddate").val(valo).attr("value",valo);
			$("#label-data").text("de "+$("#input-seldata-dateinit").val()+" a "+valo);
		}
		ajaxCursor.show();
		atualizaTotais(function(){
			ajaxCursor.hide();
		});
	});

});

function checaMesSelec(){
	var mesSelec = $("#abames-menu-meses").attr("data-mes-selec");
	//console.log(mesSelec);
	if(!$("#abames-seldata").hasClass("selec")) $("#abames-menu-meses li[data-aba-mes='"+mesSelec+"']").addClass("selec");
};
function statusPgto(id,pago){
	try{
		ajaxAtualizando.onreadystatechange = function () {};
        ajaxAtualizando.abort();
    } 
	catch(err){}

	var url = GINGAglobals.urlAdmin+"index.php?rt=payments/updatestatus";

	$.ajax({
		type: "GET",
		url: url,
		data: "id-payment="+id,
		beforeSend: function( xhr ) {
		   ajaxCursor.show();
		}
	})
	.done(function( data ) {
		if(data.ok){
			$().toastmessage("showToast", {
				text : data.msg,
				sticky : false,
				stayTime: 2350,
				position: "top-center",
				type : "success"
			});
			atualizaTotais(function(){
				ajaxCursor.hide();
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
function atualizaTotais(callback){
	try{
		ajaxAtualizando.onreadystatechange = function () {};
        ajaxAtualizando.abort();
    } 
	catch(err){}

	var serializedFormFinan = $("#form-finan-busca").serialize();

	if($get("searchperiod")=="true"){
		//console.log();
	} else {
		serializedFormFinan = serializedFormFinan.replace("searchperiod=true&", "");
	}

	var serializedPlbForm = $("#plbForm").serialize();


	ajaxAtualizando = $.ajax({
		type: "GET",
		url: "index.php?"+serializedFormFinan+"&"+serializedPlbForm+"&type=ajax"
	})
	.done(function( data ) {

        $("#despejo-table-payments").html(data);
        tooltip();
        sparkReload();

		if (typeof callback == "function") { 
			callback.call(this); 
		}
	})
	.fail(function(){
	});
};

function buscaFinan(){
	$("#plBusca").delegate("#plbCampo","keyup",function(){

		var campoBusca =  $("input[name=opcao]:checked", "#plbFiltro").val();
		var valorBuscado = $(this).val();

		 $("#result-busca .filtro").text("");

		 if(valorBuscado != ""){
			switch (campoBusca) {
			    case "paytitle":
			        $("#result-busca .filtro").text("Descrição: "+valorBuscado);
			        break;
			    case "pay_status":
			        $("#result-busca .filtro").text("Status: "+valorBuscado);
			        break;
			    case "client_name":
			        $("#result-busca .filtro").text("Cliente: "+valorBuscado);
			        break;
			    case "ser_name":
			        $("#result-busca .filtro").text("Serviço: "+valorBuscado);
			        break;
			}	
			$("#plbHold").show();	 	
		 }
		 else{
		 	$("#plbHold").hide();	
		 }

		 var linkOriginal = $("#link-exportar-pagamentos").attr("data-original-href");
		 var novoLink = linkOriginal+"&busca="+valorBuscado+"&opcao="+campoBusca;

		ajaxCursor.show();
		atualizaTotais(function(){
			ajaxCursor.hide();
			$("#link-exportar-pagamentos").attr("href",novoLink);
		});

	});
};

function alteraTextoBtNotificacoes(txt){
	$("#gfBotoesAux").val(txt);
};

function sparkReload(){
/* 	$("#total-sparkline").sparkline("html",{
		type: "pie",
		sliceColors: ["#68ba08","#e03434","#D76700"]
	});  */
};