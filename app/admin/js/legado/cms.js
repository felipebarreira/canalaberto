function ginga_alert(msg){
	alert(msg);
}



$(document).ready(function(){

	/*
	$(window).resize(function() {
		cmsResize(true);	
	});	
	cmsResize(true);
	*/

	//window.onbeforeunload = confirmarSaida;

	//$(".cms-modulo").hide();
/* 	$(".cms-modulo iframe").load(function(){
		//$(this).show();
		//console.log("teste");
		$(this).parents(".cms-modulo").removeClass("--carregando");
	}); */

	
	
	//console.log("atualizado");
	$("#gBtSalvar, #gSalvarMais , #gBtRascunho").click(function(){
		var name = $(this).attr("name");
		var valo = $(this).attr("value");
		$("#btCoringa").attr("name",name).attr("value",valo);
	});
	
	$("#formCMS").submit(function(ev){
		var $this = $("#formCMS");
		if(CMSglobals.formAut) {
		}
		else{
			ev.preventDefault();
			if(checaModulos()){
				$.msgbox('<strong style="font-size:14px">Existem módulos não salvos nesta página.</strong><br/>Se você tiver feito alterações, sem clicar no botão "Salvar" de cada módulo, suas alterações serão perdidas.<br/><br/> O que você deseja fazer?', {
					type: "confirm",
					buttons: [{
						type: "cancel",
						value: "Permanecer na página"
					}, {
						type: "submit",
						value: "Descartar alterações"
					}]
				}, function(result){
					if(result == "Descartar alterações"){
						CMSglobals.formAut = true;
						$this.submit();
					}
				});
			}
			else{
				CMSglobals.formAut = true;
				$this.submit();
			}
		}
	});

	$("#cms-zona .cms-modulo__body .cmbTit").on("keyup",function(){
		var valor = $(this).val();
		$(this).parents(".cms-modulo").find(".cms-modulo__header p span").text(valor);
	});
	
	//$(".inputTags").tagsInput({width:"80%",height:"auto",defaultText:"separe com vírgula ou pressione 'enter'"});

	
	$("#cms-zona .cmExcluir").on("click",function(ev){
		ev.preventDefault();
	
		var elem = $(this);
		var modId = $(this).parents(".cms-modulo").attr("data-moduloid");

		
		$.ajax({
            url: "?rt=removeModuleItem",
			type: "get",
			data: "id-moduleitem="+modId,
			dataType: "json",
			beforeSend: function(){
               //ajaxCursor.show();
            },
            success: function(r){
            	if(!r.error){

					elem.parents("li:eq(0)").remove();
					checaColunasVazias();
					
					//ajaxCursor.hide();
					
					$().toastmessage("showToast", {
						text : "Módulo excluido com sucesso.",
						sticky : false,
						stayTime: 5300,
						position: "top-center",
						type : "success"
					});
					
				} 
				else ginga_alert("Erro <b>CMSJS44</b><br/> Ocorreu um erro. Por favor, tente novamente!"); //ajaxCursor.hide();
			},
			error:function(){
				ginga_alert("Erro <b>CMSJS47</b> <br/> Ocorreu um erro. Por favor, tente novamente!"); //ajaxCursor.hide();
			}
        });		
	});

	$("#cms-zona").on("click"," .cms-modulo .cmBts a",function(ev){
		
		ev.preventDefault();
		var url = $(this).attr("href");

		$.magnificPopup.open({
			items: {
				src:  url,
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
		url = $(this).attr("href");
		var t = $(this).parents(".cms-modulo").find(".cms-modulo__header span").text();
		$.gingaFrame({
			"url": url+"&addClass=moduloFull",
			"txt": "Editar módulo <i>"+t+"</i>",
			"modal": true,
			"width": "85%",
			"height": "92%",
			"auxButton":{
				"label":"Salvar",
				"funcao": function(){
					refreshaBt();
				}
			}
		});
		*/
	});
	$("#cms-zona .cms-modulo .cmBts .botao2").on("click",function(){
		var t = $(this).parents(".cms-modulo").attr("data-moduloid");
		iframe = document.getElementById("iframe"+t).contentWindow;
		iframe.salvaJa(); 
		
		var modulo = $(this).parents(".cms-modulo");
		
		modulo.addClass("--carregando");
		modulo.find("iframe"+t).load(function(){
			modulo.removeClass('--carregando');
		});
		
	});
	


	/*
	$("#cms-zona .cms-modulo")
		.on("mouseenter",function(){
			if(! $("#cms-zona").hasClass("busy")){
				$(this).find(".cmhBts").fadeIn("fast");
				$(this).find(".cmExcluir").fadeIn("fast");
			}
		})
		.on("mouseleave",function(){
			if(! $("#cms-zona").hasClass("busy")){
				$(this).find(".cmhBts").fadeOut("fast");
				$(this).find(".cmExcluir").fadeOut("fast");
			}
		});
	*/
	
	

	/*
	$("#encapTabs li").click(function(){
		var opt = $(this).attr("rel");
		
		if(opt != "conteudo") fecharBarraCMS();
		else abrirBarraCMS();
	});	
	*/
	
	
	
	$("#cms-zona").on("click",".cms-zona__seletor-coluna a",function(ev){
		ev.preventDefault();
		
		var opt = $(this).attr("rel");
		var formaDados = "item="+CMSglobals.itemId+"&pos=1"+"&cssClass="+opt;
		
		$.ajax({
            url: "?rt=addRow",
			type: "post",
			data: formaDados,
			dataType: "json",
			beforeSend: function(){
               //ajaxCursor.show();
            },
            success: function(r){
            	if(!r.error){

					$(CMStpl[opt]).attr("data-linhaId",r.row).appendTo("#cms-zona__grid");
					
					$("#cms-zona .cms-linha[data-linhaId='"+r.row+"'] .cms-coluna").each(function(index){
						$(this).attr("data-colunaId",r.columns[index]);
					});
					
					listenersModulos();
					
					$("#cms-zona .cms-selec").hide();
					$("#cms-zona .cms-breakable").show();
					$(".cms-breakable").appendTo("#cms-zona__grid");
					
					abrirBarraCMS();
					//ajaxCursor.hide();
				} 
				else ginga_alert("Erro <b>CMSJS62</b><br/> Ocorreu um erro. Por favor, tente novamente!"); //ajaxCursor.hide();
			},
			error:function(){
				ginga_alert("Erro <b>CMSJS65</b> <br/> Ocorreu um erro. Por favor, tente novamente!"); //ajaxCursor.hide();
			}
        });
		
		

	});
	
	
	$("#giTitulo, #giURL").keyup(function(){
		var valor = $(this).val();
		valor = valor.toLowerCase()
		valor = valor.replace(/[.!?,:;~<>{}()\[\]$_*"'%&#@+|\\/]/gi,"");
		valor = valor.replace(/[á]/gi,"a");
		valor = valor.replace(/[é]/gi,"e");
		valor = valor.replace(/[í]/gi,"i");
		valor = valor.replace(/[ó]/gi,"o");
		valor = valor.replace(/[ú]/gi,"u");
		valor = valor.replace(/[ý]/gi,"y");
		valor = valor.replace(/[ã]/gi,"a");
		valor = valor.replace(/[õ]/gi,"o");
		valor = valor.replace(/[â]/gi,"a");
		valor = valor.replace(/[ê]/gi,"e");
		valor = valor.replace(/[î]/gi,"i");
		valor = valor.replace(/[ô]/gi,"o");
		valor = valor.replace(/[û]/gi,"u");
		valor = valor.replace(/[ç]/gi,"c");
		valor = valor.replace(/[ ]/gi,"-");
		$("#giURL").val(valor);
		$("#span-gi-url").text(valor);
	});
	
	if(CMSglobals.abrirBarra){listenersModulos(); abrirBarraCMS();}
});
function CMSmoduloResponser(json,moduloID){
	if(json.msg){
	
		var typo = "";
		if(json.tipo=="vermelho") typo="error";
		else typo="success";
		
		$("#cms-zona #modulo"+moduloID+"").find(".cmBts .botao2").removeClass("botao3");
		
		$().toastmessage("showToast", {
			text : json.msg,
			sticky : false,
			stayTime: 5300,
			position: "top-center",
			type : typo
		});
	}
	else return false;
};

function refreshaBt(){
	var iframe = document.getElementById("gingaFrameIframe").contentWindow;
	iframe.salvaJa(); 
};

function atualizaTituloModulo(idModulo,titulo){
	var tit = titulo;
	if(tit.length > 22) tit = tit.slice(0,22)+"...";
	$("#modulo"+idModulo+" .cms-modulo__header p span").text(tit);
	$("#gfjT i").text(tit);
};
function abrirBarraCMS(){
	$("#encapForm").addClass("encapFormComBarra",900);
	//$("#cms-barra").show("fade");
	 $("#cms-barra").slideDown();
};
function fecharBarraCMS(){
	//$("#cms-barra").hide("fade");
	$("#cms-barra").animate({
		right: -50,
	  }, 630 );
	$("#encapForm").removeClass("encapFormComBarra",630);
};
function checaColunasVazias(){
	$("#cms-zona__grid .cms-coluna").each(function(){
		//console.log($(this).find(".cms-modulo").size());
		var num = $(this).find(".cms-modulo").length;
		
		if(num == 0)	$(this).find(".cms-droppable").addClass("cms-droppable__intact").show();
		else 			$(this).find(".cms-droppable").removeClass("cms-droppable__intact").hide(); 
		//else 			$(this).find(".cms-droppable").hide(); 
	});
};
function listenersModulos(){
	$( "#cms-zona ul").sortable({
			items: "li:not(.cms-droppable)",
			connectWith: "ul",
			placeholder: "cms-place",
			tolerance: "intersect",
			handle: ".cms-modulo__header",
			opacity: 0.5 ,
			//containment: "#content",
			start : function(event,ui){
				$("#cms-zona").addClass("busy");
				$("#cms-zona").addClass("cms-coluna-falsa");
				$("#cms-zona .cms-droppable").hide();
			},
			stop: function(event,ui){
				$("#cms-zona").removeClass("busy");
				$("#cms-zona").removeClass("cms-coluna-falsa");
				
				//$("#cms-zona iframe").show();
				$(ui.item).addClass("--carregando");
				
				/*
				$(ui.item).find("iframe").load(function(){
					$(ui.item).removeClass('--carregando');
				});
				*/

				organizaAModulos();
				checaColunasVazias();
				enviaOrdenacao();
				
				/*
				$().toastmessage("showToast", {
					text : "Posicionamento salvo com sucesso.",
					sticky : false,
					stayTime: 1400,
					position: "top-center",
					type : "success"
				});
				*/
			}
	});	
	$(".cms-droppable").droppable({
		drop: function(event, ui){
			var $this = $(this);
			adicionaModulo(event,ui,$this);
		}
	});

	function adicionaModulo(event,ui,$this){
			//console.log($(this).parents("ul:eq(0)"));
			var qualTpl = ui.draggable.attr("data-template");
			var qualModulo = ui.draggable.attr("data-moduloid");
			
			var formaDados;
			formaDados = {
				"item": CMSglobals.itemId+"", 
				"line": $this.parents(".cms-linha").attr("data-linhaid"),
				"column": $this.parent(".cms-coluna").attr("data-colunaid"),
				"module": qualModulo, 
			};

			//console.log(formaDados);
			
			formaDados = JSON.stringify(formaDados);

			console.log(formaDados);

			var atual = $this;
			
			$.ajax({
				url: "?rt=addModuleItem",
				type: "post",
				data: "json="+formaDados,
				dataType: "json",
				beforeSend: function(){
				   //ajaxCursor.show();
				},
				success: function(r){
					if(!r.error){

						var xeca = $(CMStpl[qualTpl](r.url+"&addClass=modoInline&display=inline&js=v")).attr("data-moduloid",r.module).attr("id","modulo"+r.module);
						xeca.appendTo(atual.parents("ul:eq(0)"));
						/*
						$(xeca).find("iframe").load(function(){
							$(xeca).removeClass('--carregando');
							$(this).attr("id","iframe"+r.module);
						});
						*/
						atual.appendTo(atual.parents("ul:eq(0)"));
						checaColunasVazias();
						
						//ajaxCursor.hide();
						enviaOrdenacao();
						
						/*
						$().toastmessage("showToast", {
							text : "Módulo adicionado com sucesso.",
							sticky : false,
							stayTime: 5300,
							position: "top-center",
							type : "success"
						});
						*/
						
					} 
					else ginga_alert("Erro <b>listenersModulos().$('.cms-droppable').droppable.ajax.success.else</b><br/> Ocorreu um erro. Por favor, tente novamente!"); //ajaxCursor.hide();
				},
				error:function(){
					ginga_alert("Erro <b>listenersModulos().$('.cms-droppable').droppable.ajax.error</b> <br/> Ocorreu um erro. Por favor, tente novamente!"); //ajaxCursor.hide();
				}
			});
	}

	
	$( "#cms-barra ul li.cms-barra__modulo").draggable({	
		//containment: "#container",
		scroll: true,
		cursor: "move",
		start: function(){
			$("#cms-zona .cms-droppable").show();
			//$("#cms-zona .cms-modulo").addClass("fechado");
			$("#cms-zona").addClass("busy")
			//.addClass("closedhand");
		},
		stop: function(){
			//$("#cms-zona .cms-modulo").removeClass("fechado");
			$("#cms-zona").removeClass("busy")
			//.removeClass("closedhand");
			
			enviaOrdenacao();
			checaColunasVazias();
			//$("#cms-barra ul li.cms-barra__modulo").draggable( "option", "containment", "body");
		},
		//helper: "clone",	
		//método default do helper sobrescrito
		//método original substituido por:
		helper: function (e,ui) {
			return $(this).clone().appendTo('body').show();
		},
		distance: 20
	});

	
	/*
	$('#cms-barra ul').disableSelection();
	$('#cms-barra ul li').disableSelection();
	$('#cms-barra img').disableSelection();
	*/

	
	$( "#cms-barra ul li.cms-barra__breakable").draggable({	
		scroll: true,
		//containment: "#container",
		cursor: "move",
		start: function(){
			$("#cms-zona .cms-breakable").show();
			$("#cms-zona").addClass("busy");
		},
		stop: function(){
			$("#cms-zona").removeClass("busy");
			//$("#cms-zona .cms-breakable").hide();
		},
		helper: function (e,ui) {
			return $(this).clone().appendTo('body').show();
		},
		distance: 20
	});
	
	
	$(".cms-breakable").droppable({
		accept: ".cms-barra__modulo ",
		drop: function(event, ui){
			/*var template = $('#cmsSelec').html();

			$(template).appendTo("#cms-zona__grid");
			$(".cms-breakable").appendTo("#cms-zona__grid");
			*/
			var $this = $(this);

			$(".cms-zona__seletor-coluna").last().find("a.btn-blue").trigger("click");

			setTimeout(function(){
				
				adicionaModulo(event,ui,$this);
			},1000);
		}
	});
	
	$("main").on("click",".cms-breakable",function(){
		/*
		var template = $('#cmsSelec').html();

		$(template).appendTo("#cms-zona__grid");
		$(".cms-breakable").appendTo("#cms-zona__grid");
		*/

		$("#cms-zona .cms-selec").slideDown();
		$("#cms-zona .cms-breakable").hide().appendTo("#cms-zona__grid");
			
	});
	
	
	
	
	
	
	
	
};


function ressaltaBotao(idModulo){
	$("#modulo"+idModulo+" .cmBts span").addClass("botao3");
	//$("#gfjT i").text(tit);
};

function checaModulos(){
	console.log("checaModulos");
	var ctrl = false;
	$("#cms-zona .cms-modulo").each(function(){

		var el = $(this).find(".cms-modulo__footer .botao2");
		if(el.hasClass("botao3")){
			ctrl = true;
		}
	});
	return ctrl;
};
function confirmarSaida(){
	if(checaModulos()){
		return "EXISTEM MÓDULOS NÃO SALVOS NESTA PÁGINA. \n\nSe você tiver feito alterações, sem clicar no botão 'Salvar' de cada módulo, suas alterações serão perdidas."
	}
};

function serializaModulos(){
	var atc3;
	var formaJson = "{";
	formaJson += '"item":'+CMSglobals.itemId+',';
	formaJson += '"rows":[';
	
	$("#cms-zona__grid .cms-linha").each(function(){
	
		formaJson += '{"idRow":'+$(this).attr("data-linhaid")+',';
		formaJson +='"columns":[';
		
		$(this).find(".cms-coluna").each(function(){
			formaJson +='{';
			formaJson += '"idColumn":'+$(this).attr("data-colunaid")+',';
			formaJson += '"modules":[';
			
			atc3 = false;
			$(this).find(".cms-modulo").each(function(){
				atc3= true;
				formaJson += $(this).attr("data-moduloid")+ ",";
			});
			if(atc3) formaJson = formaJson.slice(0,-1);
			
			formaJson +=']';
			formaJson +='},';
		});
		formaJson = formaJson.slice(0,-1);
		
		formaJson +="]";
		formaJson +='},';
	});
	formaJson = formaJson.slice(0,-1);

	formaJson += "]";
	formaJson += "}";
	
	//console.log(formaJson);
	return formaJson;
};
function enviaOrdenacao(){
	$.ajax({
		url: "?rt=orderModuleItem",
		type: "post",
		data: "json="+JSON.stringify(serializaModulos()),
		dataType: "json",
		beforeSend: function(){
		   //ajaxCursor.show();
		},
		success: function(r){
			if(!r.error){

			} 
			else{
				$().toastmessage("showToast", {
					text : "Um ou mais módulos desta página, não existe(m) mais. <br/> Ele(s) foram retirados da visualização.",
					sticky : false,
					stayTime: 8000,
					position: "top-center",
					type : "error"
				});
				var idm = $(r.msgError).html();
				$("#modulo"+idm).remove();
			}
		},
		error:function(){
			ginga_alert("Erro <b>CMSJS248</b> <br/> Ocorreu um erro. Por favor, tente novamente!"); 
		}
	});
};
function organizaAModulos(){
				
	$("#cms-zona .cms-coluna").each(function(){
		var aModulo = $(this).find(".cms-droppable");
		aModulo.appendTo($(this));
	});

};



function cmsResize(msg){
	/*
	var largAtual = $(window).width()-206-20-60;
	if( largAtual < 841){
		$("body").addClass("cmsColapsar");
		$("body").addClass("cmsColapsarMin");
	}
	else if( largAtual < 990){
		$("body").addClass("cmsColapsar");
		$("body").removeClass("cmsColapsarMin");
	}
	else{
		$("body").removeClass("cmsColapsar");
		$("body").removeClass("cmsColapsarMin");
	}
	*/
};













CMStpl=new Array();

CMStpl["texto"] = function(url){return '<!-- inicio :: módulo --> <li class="cms-modulo --carregando"> <div class="cms-modulo__header"> <p> Texto <span></span> </p> <div class="cmhBts"> <a href="#" class="mov">mover</a> </div> </div> <div class="cms-modulo__body"> </div> <div class="cms-modulo__footer"> <div class="cmBts"> <span class="botao2">Salvar</span> <a href="'+url+'&display=full&addClass=modoFull" target="_blank">mais opções</a> </div> <div class="cmExcluir"> <a href="#">Excluir</a> </div> </div> </li> <!-- fim :: módulo --> '}; 

CMStpl["imagem"] = function(url){return '<!-- inicio :: módulo --> <li class="cms-modulo --carregando"> <div class="cms-modulo__header"> <p> Imagem <span></span> </p> <div class="cmhBts"> <a href="#" class="mov">mover</a> </div> </div> <div class="cms-modulo__body">  </div> <div class="cms-modulo__footer"> <div class="cmBts"> <span class="botao2">Salvar</span> <a href="'+url+'&display=full&addClass=modoFull" target="_blank">mais opções</a> </div> <div class="cmExcluir"> <a href="#">Excluir</a> </div> </div> </li> <!-- fim :: módulo --> '}; 


CMStpl["anexo"] = function(url){return '<!-- inicio :: módulo --> <li class="cms-modulo --carregando"> <div class="cms-modulo__header"> <p> Anexo <span></span> </p> <div class="cmhBts"> <a href="#" class="mov">mover</a> </div> </div> <div class="cms-modulo__body">  </div> <div class="cms-modulo__footer"> <div class="cmBts"> <span class="botao2">Salvar</span> <a href="'+url+'&display=full&addClass=modoFull">mais opções</a> </div> <div class="cmExcluir"> <a href="#">Excluir</a> </div> </div> </li> <!-- fim :: módulo --> '}; 

CMStpl["listagem"] = function(url){return '<!-- inicio :: módulo --> <li class="cms-modulo --carregando"> <div class="cms-modulo__header"> <p> Listagem <span></span> </p> <div class="cmhBts"> <a href="#" class="mov">mover</a> </div> </div> <div class="cms-modulo__body">  </div> <div class="cms-modulo__footer"> <div class="cmBts"> <span class="botao2">Salvar</span> <a href="'+url+'&display=full&addClass=modoFull" target="_blank">mais opções</a> </div> <div class="cmExcluir"> <a href="#">Excluir</a> </div> </div> </li> <!-- fim :: módulo --> '}; 




CMStpl["cmsSeletor"] = '<div class="cms-selec" data-selID="1" style="padding: 25px 0"><div class="cms-zona__colunas"><p>Escolha o template das colunas</p><div class="cms-zona__seletor-coluna"><a href="#" title="Simples" rel="cL1"> <img src="img/cms/col1.png" alt=""/> </a><a href="#" title="2 colunas" rel="cL2"> <img src="img/cms/col2.png" alt=""/> </a><a href="#" title="Coluna lateral esquerda" rel="cL3"> <img src="img/cms/col3.png" alt=""/> </a><a href="#" title="Coluna lateral direita" rel="cL4"> <img src="img/cms/col4.png" alt=""/> </a><a href="#" title="3 colunas" rel="cL5"> <img src="img/cms/col5.png" alt=""/> </a><a href="#" title="Coluna central" rel="cL6"> <img src="img/cms/col6.png" alt=""/> </a><a href="#" title="Coluna esquerda dupla" rel="cL7"> <img src="img/cms/col7.png" alt=""/> </a><a href="#" title="Coluna direita dupla" rel="cL8"> <img src="img/cms/col8.png" alt=""/> </a><br class="clear"/></div></div></div>'; 



CMStpl["cL1"] = 	'<div class="cms-linha cL1"> <ul class="cms-coluna cC1"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> </div><!-- /.cms-linha -->' ;

CMStpl["cL2"] = 	'<div class="cms-linha cL2"> <ul class="cms-coluna cC1"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> <ul class="cms-coluna cC2"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> </div><!-- /.cms-linha -->' ;

CMStpl["cL3"] = 	'<div class="cms-linha cL3"> <ul class="cms-coluna cC1"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> <ul class="cms-coluna cC2"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> </div><!-- /.cms-linha -->' ;

CMStpl["cL4"] = 	'<div class="cms-linha cL4"> <ul class="cms-coluna cC1"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> <ul class="cms-coluna cC2"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> </div><!-- /.cms-linha -->' ;

CMStpl["cL5"] = 	'<div class="cms-linha cL5"> <ul class="cms-coluna cC1"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> <ul class="cms-coluna cC2"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> <ul class="cms-coluna cC3"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna -->  </div><!-- /.cms-linha -->' ;

CMStpl["cL6"] = 	'<div class="cms-linha cL6"> <ul class="cms-coluna cC1"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> <ul class="cms-coluna cC2"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> <ul class="cms-coluna cC3"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna -->  </div><!-- /.cms-linha -->' ;

CMStpl["cL7"] = 	'<div class="cms-linha cL7"> <ul class="cms-coluna cC1"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> <ul class="cms-coluna cC2"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> <ul class="cms-coluna cC3"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna -->  </div><!-- /.cms-linha -->' ;

CMStpl["cL8"] = 	'<div class="cms-linha cL8"> <ul class="cms-coluna cC1"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> <ul class="cms-coluna cC2"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna --> <ul class="cms-coluna cC3"> <li class="cms-droppable cms-droppable__intact"> <p>arraste um novo módulo aqui</p> </li> </ul><!-- /.cms-coluna -->  </div><!-- /.cms-linha -->' ;

