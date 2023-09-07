$(document).ready(function(){

	$("#plBusca").undelegate( "#plbCampo", "keyup");
	buscaAulas();

	$("section").on("click","a.aulalinks--cancelar",function(ev){
		ev.preventDefault();

		var element = $(this);
		var msg = "";
		var _realizada = $(this).parents(".smart-seletor").find(".ss-atual").hasClass("ssl-r");

		if(_realizada){
			ginga_confirm("<strong>Esta aula está marcada como 'realizada'. Se você cancela-la toda a lista de presença e notas serão descartadas.</strong> <br><br>Você deseja mesmo cancelar esta aula?",element);
		}
		else{
			//ginga_confirm("Você deseja mesmo cancelar esta aula?",element);
		
			$.confirm({
				theme: 'ignite',
				title: 'Quem cancelou esta aula?',
				content: '<span style="font-size:13px"><br> Professor → nunca expira <br> Aluno →  até 60 dias <br> Cancelar sem reposição → expira instantaneamente <br> Suspender → aula é suspensa</span>',
				boxWidth: '40%',
   				useBootstrap: false,
				buttons: {
					professor: {
						text: 'Professor',
						btnClass: 'btn --blue --small',
						keys: ['enter', 'shift'],
						action: function(){
							var link =  element.attr("data-comrepo");
							msg = "A aula foi marcada como cancelada pelo professor.";
							cancelaAula(link,msg);
						}
					},
					aluno: {
						text: 'Aluno',
						btnClass: 'btn --blue --small',
						action: function(){
							var link =  element.attr("data-comrepodias");
							msg = "A aula foi marcada como cancelada pelo aluno.";
							cancelaAula(link,msg);
						}
					},
					cancelarsemrepo: {
						text: 'Cancelar sem reposição',
						btnClass: 'btn --red --small',
						action: function(){
							var link =  element.attr("data-semrepo");
							msg = "A aula foi marcada como cancelada sem reposição.";
							cancelaAula(link,msg);
						}
					},
					suspender: {
						text: 'Suspender',
						btnClass: 'btn --orange --small',
						action: function(){
							var link =  element.attr("data-suspender");
							msg = "A aula foi marcada como suspensa.";
							cancelaAula(link,msg);
						}
					},
					cancelar: {
						text: 'Não cancelar',
						btnClass: 'btn-one --small',
						action: function(){

						}
					}
				}
			});

		}
		return false;
	});


	//$('.acao-editaraula').magnificPopup({type:'iframe'});
	$("section").on("click",".acao-editaraula",function(ev){
		ev.preventDefault();

		var $el = $(this);
		var url = $el.attr("href");

		$.magnificPopup.open({
			items: {
				src:  url+"&addClass=compact",
				type: 'iframe'
			},
			preloader: true,
			removalDelay: 50,
			mainClass: 'mfp-fade mfp-no-margins',
			callbacks : {
				close : function(){
					
				}
			}
		});


		/*
		var _el = $(this);
		var url = _el.attr("href");
		url = url+"&addClass=visualizar-editar";
		url = GINGAglobals.urlAdmin+"index.php"+url+"";
		var aulaID= _el.closest("tr").find("td").eq(1).text();

		$.gingaFrame({
			"url": url,
			"txt": "Editar aula — Nº <strong>"+aulaID+"</strong>",
			"modal": false,
			"width": "90%",
			"height": "90%",
			"auxButton": {
				"label":"Salvar",
				"funcao": function(){
					var iframe = document.getElementById("gingaFrameIframe").contentWindow;
					iframe.enviaForm(); 
				}
			}
		});
		*/
	});

	$("section").on("click",".aulalinks--realizarrepor",function(ev){
		ev.preventDefault();

		var $el = $(this);
		var url = $el.attr("href");

		$.magnificPopup.open({
			items: {
				src:  url+"&addClass=compact",
				type: 'iframe'
			},
			preloader: true,
			removalDelay: 50,
			mainClass: 'mfp-fade mfp-no-margins',
			callbacks : {
				close : function(){
					
				}
			}
		});
	});

	$(".aulalinks--excluir").on("click",function(ev){
		ev.preventDefault();

		var link = $(this).attr("href");

		$.msgbox('<strong>Você deseja excluir esta aula?</strong>', {
			type: "confirm",
			buttons: [{
				type: "submit",
				value: "Sim"
			},{
				type: "cancel",
				value: "Não"
			}]
		}, function(result){
			if(result == "Sim"){
				ajaxCursor.show();
				$.get( link , function( data ) {
					$().toastmessage("showToast", {
						text : data.msg,
						sticky : false,
						stayTime: 5000,
						position: "top-center",
						type : "success"
					});
					atualizaAulas(function(){
						ajaxCursor.hide();
					});
				});
			}
			else if(result=="Não"){
			}
		});

	});

	$("section").on("click",".aulalinks--criaraula",function(ev){
		ev.preventDefault();
		var _el = $(this);
		var url = _el.attr("href");
		var preData = _el.hasClass("aulalinks--criaraulapre")? true : false;


		url = url+"&addClass=visualizar-editar";
		if(preData) url = url+"&date="+_el.attr("data-predate");
		url = IGNITE.globals.urlAdmin+"index.php"+url+"";

		console.log(url);

		var aulaID= _el.closest("tr").find("td").eq(1).text();
		var labelAcao = _el.attr("data-title");

		/*
		$.gingaFrame({
			"url": url,
			"txt": "Criar aula",
			"modal": false,
			"width": "75%",
			"height": "60%",
			"auxButton": {
				"label":"Salvar",
				"funcao": function(){
					var iframe = document.getElementById("gingaFrameIframe").contentWindow;
					iframe.enviaForm(); 
				}
			}
		});
		*/
		$.magnificPopup.open({
			items: {
				src:  url+"&addClass=compact",
				type: 'iframe'
			},
			preloader: true,
			removalDelay: 50,
			mainClass: 'mfp-fade mfp-no-margins',
			callbacks : {
				close : function(){
					
				}
			}
		});
	});


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
		var mesSelec = $("#abames-menu-meses").attr("data-mes-selec");
		//console.log(mesSelec);
		if(!$("#abames-seldata").hasClass("selec")) $("#abames-menu-meses li[data-aba-mes='"+mesSelec+"']").addClass("selec");
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
		
		$("#input-seldata-dateinit").val(diaInicial).attr("value",diaInicial);
		$("#input-seldata-enddate").val(diaFinal).attr("value",diaFinal);
		$("#inputdays").val("");

		//ajaxCursor.show();
		atualizaAulas(function(){
			//ajaxCursor.hide();
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

		$("#inputdays").val("all");
		//ajaxCursor.show();
		atualizaAulas(function(){
			//ajaxCursor.hide();
		});
	});

	$("section").on("click","#calendario-aulas table tbody td",function(){
		if($(this).hasClass("next-month") || $(this).hasClass("prev-month")) return false;

		$("#calendario-aulas table td").removeClass("selec");
		$(this).addClass("selec");

		var dia = $(this).text();
		var mes = $("#calendario-aulas .month").text();

		$(".aulalinks--criaraulapre span").text(dia+" de "+mes);
		$(".aulalinks--criaraulapre").attr("data-predate",$(this).attr("data-dateday"));
		$(".aulalinks--criaraulapre").fadeIn();
	});

});

function atualizaAulas(callback){
	var url = "index.php?"+$("#plbForm").serialize()+"&type=ajax";
	console.log(url);

	try{
		ajaxAtualizando.onreadystatechange = function () {};
		ajaxAtualizando.abort();
	} 
	catch(err){}

	ajaxAtualizando = $.ajax({
		type: "GET",
		url: url
	})
	.done(function( data ) {

			$("#despejo-ajax").html(data);
	        //ajaxCursor.hide();
			//tooltip();

			var qtd = $("#listagem tbody tr").length;
			$("#prelistagem-counter").text(qtd-1);

		if (typeof callback == "function") { 
			callback.call(this); 
		}
	})
	.fail(function(){
	});
};


function buscaAulas(){
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

		//ajaxCursor.show();
		atualizaAulas(function(){
			//ajaxCursor.hide();
			$("#link-exportar-pagamentos").attr("href",novoLink);
		});

	});
};

function cancelaAula(link,msg){
	$.get( link , function( data ) {
		
		$.confirm({
		    title: msg,
		    type: 'blue'
		});

		atualizaAulas(function(){
			//ajaxCursor.hide();
		});
	});
};