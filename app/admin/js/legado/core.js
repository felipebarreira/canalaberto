
/* 
 * ### Variáveis e objetos globais
 * Use com moderação :)
 * 
 */
var ajaxCursor = new MouseAjax;
/* 	
 * ### MAIN
 * OPTIMIZE: Otimizar verificação de navegadores
 * 
 */
$(document).ready(function () {


	$("#mmListTree .mmExpand").click(function () {
		var el = $("#mmListTree .lvS[data-catid='" + $(this).parents(".cat").attr("rel") + "']");
		var stat = el.hasClass("lvsAberto") ? true : false;

		if (!stat) {
			$(this).addClass("mmeAberto");
			el.show().addClass("lvsAberto").removeClass("lvsFechado");
		}
		else {
			$(this).removeClass("mmeAberto");
			el.hide().removeClass("lvsAberto").addClass("lvsFechado");
		}
	});
	//head.js();
	capable = isCapable();

	if (capable) submenu();
	tooltip();
	calendar();
	if (capable) confirmarExclusao();
	//lineDestaque();
	adma();
	abasForms();
	dragTabela();
	nicedit();
	if (capable) ajaxPag();
	// if(capable) formControl();
	focusCampo();
	buscaTabelas();
	buscaTabelasAjax();
	// linksTabelasAjax();
	//superAjax();
	visualizar();
	travaVisualizar();
	checaSessao();
	trackingErrors();


	if (!capable) ie6nomore();

	ajaxCursor.init();
	// ajaxCursor.show();

	seletorContexto();

});

function superAjax() {
	if ($cookie("aut").get() == "ok") lol = 0;
	else return false;

	$("#col a, .sublinksFaixa a, .lt-acoes a, .lt-cab a, .bread a").live("click", function (ev) {
		ev.preventDefault();

		//regras de bloqueio
		if ($(this).attr("rel") == "Excluir") return false;
		if ($(this).attr("href") == "#") return false;

		try {
			ajaxVerificando.onreadystatechange = function () { }; /*isso será depreciado nas versões do jQuery > 1.5*/
			ajaxVerificando.abort();
		}
		catch (err) { }

		//var valBuscado = $("#plbCampo").val();
		var pag = $(this).attr("href");


		ajaxVerificando = $.ajax({
			url: pag,
			beforeSend: function () {
				ajaxCursor.show();
				$("#mid").addClass("opac");
			},
			success: function (data) {
				data = $(data).find("#midA");
				$("#mid").html(data);
				ajaxCursor.hide();
				tooltip();
				$("#mid").removeClass("opac");
				//$("#plbCampo").val(valBuscado);
				//$("#plbCampo").putCursorAtEnd(); 

				//$("#plbHold").show();
			}
		});

	});




};


function superAjaxForm() {

	$('#midA form').ajaxForm({
		// target identifies the element(s) to update with the server response 
		//target: '#mid', 

		// success identifies the function to invoke when the server response 
		// has been received; here we apply a fade-in effect to the new content 
		beforeSubmit: function () {
			ajaxCursor.show();
			$("#mid").addClass("opac");
		},
		success: function (responseText) {
			//console.log("");
			data = $(responseText).find("#midA");
			$("#mid").html(data);
			ajaxCursor.hide();
			tooltip();
			$("#mid").removeClass("opac");
		}
	});
};

/*
 * ### FormControl
 * Faz o controle e a comunicação das funções formControl e formReveal.
 * 
 */
function formControl() {
	$("#mid form input[type='submit']").click(
		function (event) {
			formStore();
		}
	);

	var local = $get("sessao");
	if ($cookie("FR_" + local).get() != null) {
		if ($("#mid").has("#msg.aviso", "#msg.erro").length != 0) {
			formReveal();
		}
		else $cookie("FR_" + local).erase();
	}
};
/*
 * ### FormReveal
 * Função que retorna os campos memorizados em um formulário válido.
 * 
 */
function formReveal() {
	var local = $get("sessao");
	var x = $cookie("FR_" + local).get();
	var zx = x.split(",");

	$("#mid fieldset input[type='text'],#mid fieldset select,#mid fieldset textarea,#mid fieldset input[type='radio'],input[type='checkbox']").each(function (index) {
		if ($(this).attr("type") == "radio" || $(this).attr("type") == "checkbox") {
			if (zx[index] == "checked") {
				$(this).attr("checked", "checked");
			}
			else {
				$(this).removeAttr("checked");
			}
		}
		else {
			var valor = zx[index];
			valor = valor.replace(/_&n_/gi, "\n");
			valor = valor.replace(/_&vgl_/gi, ",");
			$(this).val(valor);
		}

	});
	//$cookie("FR_"+local).erase();
};

/*
 * ### FormStore
 * Função que armazena dados de um formulário em cookie, para serem recuperados em caso de erro do usuário.
 *
 */
function formStore() {
	var tval = [];
	$("#mid fieldset input[type='text'],#mid fieldset select,#mid fieldset textarea,#mid fieldset input[type='radio'],input[type='checkbox']").each(function (index) {
		if ($(this).attr("type") == "radio" || $(this).attr("type") == "checkbox") {
			var cx = $(this).attr("checked");
			if (cx == true) {
				tval[index] = "checked";
			}
			else
				tval[index] = "unchecked";
		}
		else
			if ($(this).val() == "") {
				tval[index] = "";
			}
			else {
				tval[index] = $(this).val().replace(/,/gi, "_&vgl_");
				tval[index] = tval[index].replace(/\n/gi, "_&n_");
			}
	});
	//alert(tval);

	var local = $get("sessao");
	$cookie("FR_" + local).set(tval);
};

/*
 * ### Alerta IE6
 * Alerta usuários do "Internet Explorer 6" sobre incompatibilidade com o Ginga.
 * 
 */
function ie6nomore() {
	$("#mid").prepend('<div id="msg" class="ie6"><span id="msg-ico"></span><p><strong>ATENÇÃO</strong><br/>Identificamos que você está utilizando o navegador "Internet Explorer 6".<br/>A plataforma administrativa "GinGa 3" não oferece suporte ao seu navegador, pois o mesmo é considerado obsoleto e não segue os modernos padrões no qual o "GinGa 3" foi desenvolvido.<br/><br/>Atualize seu navegador, assim você terá mais segurança e terá uma melhor experiência ao navegar na internet.<br/>Você pode obter ajuda para atualizar seu navegador, consultando nossa seção de ajuda.<br/><br/>Você pode continuar utilizando o painel, mas não há garantia que tudo funcionará corretamente.<br/><br/></p></div>');
};

/*
 * ### Submenu - Gerenciador
 * Gerencia eventos do submenu e guarda seu status
 * 
 */
function submenu() {


	function abre(valor) {
		$("ul.menu a.submenu").each(function (index) {
			if (index == valor) {
				$(this).toggleClass("aberto");
				var elem = $(this).parent().find("ul");
				elem.show();
			}
		});
	}


	function serializeState() {
		var lista = "";
		$("ul.menu a.submenu").each(function (index) {
			lista += $(this).hasClass("aberto") + ",";
		});
		return lista;
	}


	function saveState() {
		var temp = serializeState();
		$cookie("submenu").set(temp);
	}

	var cookie = $cookie("submenu").get();

	if (cookie == null) {
		saveState();
		cookie = $cookie("submenu").get();
	}
	else cookie = cookie.split(",");

	$("ul.menu a.submenu").click(function () {
		$(this).toggleClass("aberto");
		var elem = $(this).parent().find("ul");
		elem.slideToggle("fast");
		saveState();
		return false;
	});

	$.each(cookie, function (key, value) {
		if (value == "true") abre(key);
	});

};
/*
 * ### Tooltips - Tabelas
 * Adiciona tooltips nos botões de ações das tabelas
 */
function tooltip() {

	$("#listagem td.lt-acoes a").tooltip({
		track: true,
		delay: 0,
		showURL: false,
		left: -10
	});

	$("#mid .bread a").tooltip({
		track: true,
		delay: 0,
		showURL: false,
		left: -10
	});


	return true;

	/*
		$('#foo-logo').tooltip({
			track: true, 
			 showURL: false,
			 left: -10,
		});
	*/

};


/*
 * ### Sistema de Abas 
 * Controla o comportamento das abas do GinGa4
 * 
 */
function abasForms() {
	$("#encapTabs ul li").live("click", function () {
		var target = $(this).attr("rel");

		$("#encapTabs ul li").removeClass("selec");
		$(this).addClass("selec");

		$("#encapForm .encapArea").hide();
		$("#encapForm .encapArea[rel='" + target + "']").show();

	});
};
function irAba(aba) {
	$("#encapForm").ready(function () {
		$("#encapTabs ul li[rel='" + aba + "']").trigger("click");
	});
};

/*
 * ### Modal Confirm - Generator
 * Gera janela modal de confirmação
 * 
 */
function ginga_confirm(msg, elem) {

	$.msgbox(msg, {
		type: "confirm",
		buttons: [{
			type: "submit",
			value: "Sim"
		}, {
			type: "cancel",
			value: "Não"
		}]
	}, function (result) {
		if (result == "Sim") {
			window.location = elem.attr("href");
		}
	});
	return false;

};
/*
 * ### Modal OK - Generator
 * Gera janela modal de ok
 * 
 */
function ginga_alert(msg) {
	$.msgbox(msg);
	return false;
};
/*
 * ### Destaque linha
 * Ao clicar numa linha de tabela, ela é ressaltada.
 * OPTIMIZE: Otimizar com nova regra de delegação de eventos
 */
function lineDestaque() {
	if ($get("js") == "drag") return false;

	$("#listagem").live("click", function (e) {
		var elem = $(e.target).parent();

		var vacampo = elem.hasClass("line-destaque");
		if (!vacampo) {
			elem.addClass("line-destaque");
		}
		else {
			elem.removeClass("line-destaque");
		}
	});
};

/*
 * ### Confirmar exclusão
 * Ao clicar em um botão de 'Excluir', emite um alert de confirmação
 * 
 */
function confirmarExclusao() {

	var item = "de";
	var compl = ""

	if (typeof PAGEglobals != "undefined" && PAGEglobals.msgExcluir != "undefined") {
		item = (PAGEglobals.msgExcluir.item) ? PAGEglobals.msgExcluir.item : "de";
		compl = (PAGEglobals.msgExcluir.compl) ? "<br/><br/>" + PAGEglobals.msgExcluir.compl : "";
	}

	$("td.lt-acoes a[rel='Excluir']").live("click", function () {
		var element = $(this);
		var l2 = $(element.parents().get(1));
		var link = l2.children().get(0);

		ginga_confirm("Você confirma a exclusão " + item + " " + $(link).text() + "?" + compl + "", element);
		return false;
	});
};
/*
 * ### Calendário
 * Adiciona um calendário em todos os inputs com a classe '.data' e máscara inteligente de horário em inputs com a classe '.horario'
 */
function calendar() {
	$('.data')
		.datepicker({
			changeMonth: true,
			changeYear: true,
			minDate: '+0D',
			maxDate: '+24M'
		})
		.css({ 'margin-right': -23, 'width': 110 })
		//.attr('readonly', 'readonly')
		.mask("99/99/9999", { placeholder: "dd/mm/aaaa" })
		.after('<img src="img/mini/data.png" alt="Selecionar uma data" class="ico"/>');


	$(".horario").not(".hasHorario")
		.css({ 'margin-right': -23, 'width': 110 })
		.timeEntry({ spinnerImage: '' })
		.after('<img src="img/mini/clock.png" alt="Selecionar um horário" />')
		.addClass("hasHorario");

	$('.data-livre')
		.datepicker({
			changeMonth: true,
			changeYear: true,
			maxDate: '+24M'
		})
		.css({ 'margin-right': -23, 'width': 110 })
		//.attr('readonly', 'readonly')
		.mask("99/99/9999", { placeholder: "dd/mm/aaaa" })
		.after('<img src="img/mini/data.png" alt="Selecionar uma data" />');

	$(".mmoeda").priceFormat();
	$("input.numeric").numeric();
};
/*
 * ### Adicionar mais (ADMA)
 * Permite que uma área de um formulário seja 'clonada'
 *  
 */
function adma() {
	$('.adicionar-mais').live("click", function () {
		var molde = $(this).prev().find(".adma-molde");
		var container = $(this).prev();
		//alert(molde.html());
		$(container).append(molde.html());
	});

};
/*
 * ### Paginação em Ajax (ajaxPag)
 * Faz com que todas as listagens sejam paginadas em ajax automaticamente.
 */
ajaxPag = function () {
	//desativa nos ie7 e 8
	if ($browser("code") == 5 && (getBrowserVersion() == 8.0 || getBrowserVersion() == 7.0)) { return false }
	var pag;

	$("#listagem-paginacao a").live("click", function () {
		//alert($(this).attr("href"));
		pag = $(this).attr("href");
		pagina();
		return false;
	});

	function pagina() {
		//$("#mid").css("opacity",0.5);
		// $.ajax({


		$.ajax({
			url: pag,
			beforeSend: function () {
				ajaxCursor.show();
			},

			success: function (data) {
				var table = $(data).find("#despejo-ajax").contents();
				var result = $(data).find("#preListagem .result").contents();



				$("#despejo-ajax").html(table);
				$("#preListagem .result").html(result);


				ajaxCursor.hide();
				tooltip();
				//window.history.pushState( pag, "GinGaaaaaaaa", pag );
			}



		});


	}
};

/*
 * ### TinyMCE Controller
 * Faz o controle dos TinyMCE.
 * 
 */
nicedit = function () {

	var confPadrao =
	{
		language: "pt",

		theme: "advanced",
		mode: "textareas",
		editor_selector: "mceEditor",
		skin: "o2k7",
		skin_variant: "silver",

		content_css: GINGAglobals.urlSite + "css/reset.tiny.css",

		plugins: "pdw,autolink,lists,style,layer,table,advimage,advlink,inlinepopups,insertdatetime,preview,media,searchreplace,contextmenu,paste,fullscreen,noneditable,nonbreaking,xhtmlxtras,template,advlist,gsynuhimgupload,autoresize",

		theme_advanced_buttons1: "bold,italic,underline,strikethrough,|,formatselect,fontselect,fontsizeselect,|,forecolor,backcolor,",
		theme_advanced_buttons2: "justifyleft,justifycenter,justifyright,justifyfull,|,bullist,numlist,outdent,indent,|,undo,redo,|,advlink,link,unlink,|,image,gsynuhimgupload,|,hr, media,|,removeformat,|,fullscreen,|,pdw_toggle",
		theme_advanced_buttons3: "tablecontrols,|,anchor,sub,sup,charmap,|,cite,abbr,acronym",
		theme_advanced_buttons4: "template,|,styleprops,attribs,|,insertlayer,moveforward,movebackward,absolute,|,del,ins,|,insertdate,inserttime,|,cleanup,code,",
		theme_advanced_toolbar_location: "top",
		theme_advanced_toolbar_align: "left",
		theme_advanced_statusbar_location: "bottom",
		theme_advanced_resizing: true,
		theme_advanced_resizing_use_cookie: false,
		theme_advanced_resize_horizontal: false,
		convert_urls: false,
		autoresize_max_height: 550,
		pdw_toggle_on: 1,
		pdw_toggle_toolbars: "3,4",
		paste_preprocess: function (pl, o) {
			if (/<img.*\ssrc\s*=\s*"data:/i.test(o.content)) {
				o.content = "<div/>";
				alert("Não é possível colar imagens!\nUtilize o botão 'Inserir imagens' ou faça o upload clicando em 'Enviar/upload de imagem'.");
			}
		}
	};

	var confInline =
	{
		language: "pt",

		theme: "advanced",
		mode: "textareas",
		editor_selector: "mceEditorInline",
		skin: "o2k7",
		skin_variant: "silver",


		content_css: GINGAglobals.urlSite + "css/reset.tiny.css",
		plugins: "autolink,lists,style,layer,table,advhr,advimage,advlink,inlinepopups,insertdatetime,preview,media,searchreplace,contextmenu,paste,fullscreen,noneditable,nonbreaking,xhtmlxtras,template,advlist,gsynuhimgupload",

		theme_advanced_buttons1: "bold,italic,underline,strikethrough,fontsizeselect",
		theme_advanced_buttons2: "",
		theme_advanced_buttons3: "",
		theme_advanced_buttons4: "",
		theme_advanced_toolbar_location: "top",
		theme_advanced_toolbar_align: "center",
		theme_advanced_statusbar_location: "none",
		theme_advanced_resizing: true,
		convert_urls: false,

		setup: function (ed) {
			ed.onChange.add(function (ed) {
				if (MODULOglobals.moduloModo == "full") return false;
				parent.ressaltaBotao(MODULOglobals.moduloId);
			});
		}
	};


	tinyMCE.init(confPadrao);
	tinyMCE.init(confInline);
	//tinyMCE.init($.extend(confInline,confInline2));
};
/*
 * ### Tabelas Drag
 * Para tabelas de ordenação. Só funciona quando tiver uma tabela com ID=listagem e CLASS=ordenar, além de um get js=drag
 * FIXME: <<GRAVE>> Gerando erro de script no IE7. Solução provisória desabilita drag no IE7
 */
/*
 * ### Tabelas Drag
 * Para tabelas de ordenação. Só funciona quando tiver uma tabela com ID=listagem e CLASS=ordenar, além de um get js=drag
 * FIXME: <<GRAVE>> Gerando erro de script no IE7. Solução provisória desabilita drag no IE7
 */
function dragTabela() {
	if ($get("js") != "drag") return false;

	$("#listagem td.lt-acoes img").hide();
	$("#listagem td.lt-acoes").css("background", "transparent url(img/mini/mover.png) no-repeat center center");
	$("#listagem-paginacao a").hide();

	$("#listagem").tableDnD({
		onDragClass: "myDragClass",
		onDrop: function (table, row) {
			var rows = table.tBodies[0].rows;
			var debugStr = "{";
			for (var i = 0; i < rows.length; i++) {
				if (rows[i].id != "") {
					debugStr += "\"" + i + "\":" + rows[i].id.slice(3) + ",";
				}
			}
			debugStr = debugStr.slice(0, -1);
			debugStr += "}";
			//console.log(debugStr);
			//console.error("Erro aqui");
			envia(debugStr);

			$("#listagem").removeClass("closedhand");

		},
		onDragStart: function (table, row) {
			$("#listagem").addClass("closedhand");
		}
	});


	$("#listagem").addClass("openhand");
	function envia(dados) {
		//console.log($get("ordenar"));
		//console.log(window.CMSglobals.orderStructureMenu);
		var aUrl;
		if (window.CMSglobals != undefined) {
			if (CMSglobals.orderStructureMenu) aUrl = "index.php?rt=orderStructureMenu";
			else aUrl = "ginga-requisicoes/ginga-ordenacao.php?ordernar=" + $get("ordenar");
		}
		else {
			aUrl = "ginga-requisicoes/ginga-ordenacao.php?ordernar=" + $get("ordenar");
		}
		var gOid = $get("oid");
		if (gOid != "") aUrl += "&oid=" + gOid;
		//console.log(aUrl);
		$.ajax({
			url: aUrl,
			type: "post",
			data: "listaid=" + dados,
			dataType: "json",
			beforeSend: function () {
				ajaxCursor.show();
			},
			success: function (r) {
				if (r.verificado == true) {

					$().toastmessage("showToast", {
						text: "Ordenação salva com sucesso.",
						sticky: false,
						stayTime: 3000,
						position: "top-center",
						type: "success"
					});

					ajaxCursor.hide();
				}
				else ginga_alert("Erro <b>dragTabela.envia.ajax.success.else</b><br/>Ocorreu um erro. Por favor, tente novamente!"); ajaxCursor.hide();
			},
			error: function () {
				ginga_alert("Erro <b>dragTabela.envia.ajax.error</b><br/>Ocorreu um erro. Por favor, tente novamente!")
			}
		});;
	}
};
/*
 * ### focusCampo
 * Dá focos no primeiro input de um formulário
 *  
 */
function focusCampo() {
	if ($('.form')[0]) { //verifica se form existe
		$('.form input, .form textarea').each(function (i) {
			if (i == 0) {
				$(this).focus();
			}
		});

		$("#gBtSalvaGrupo").hover(function () {
			if ($("#gBtSalvar").hasClass("aberto")) return false;
			$("#gSalvarMais").animate({ marginLeft: "-6px" }, 500)
			$("#gBtSalvar").addClass("aberto");
		}, function () {
			if ($("#gBtSalvar").hasClass("aberto")) {
				$("#gSalvarMais").animate({ marginLeft: "-30px" }, 500);
				$("#gBtSalvar").removeClass("aberto");
			}
		});

	}

};
/*
 * ### validaForm
 * 
 *  
 */
function validaForm(val) {
	console.log(val)

};
/*
 * ### Mecanismo de buscas em tabelas
 * Inicialização
 *  
 */
function buscaTabelas() {
	$("#plBusca")
		.live("mouseenter", function () { $(this).find("#plbFiltro").show(); })
		.live("mouseleave", function () { $(this).find("#plbFiltro").hide(); });

	$("#plbCampo").live("blur", function () {







		if ($(this).val() == "") {

			$("#plbHold").hide();
		}

	});

	$("#plbHold").live("click", function () {
		$("#plbCampo").val("").trigger("keyup");


	});
};
/*
 * ### Mecanismo de buscas em tabelas
 * Requisição AJAX
 *  
 */
function buscaTabelasAjax() {
	$("#plBusca").delegate("#plbCampo", "keyup", function () {

		try {
			ajaxVerificando.onreadystatechange = function () { }; /*isso será depreciado nas versões do jQuery > 1.5*/
			ajaxVerificando.abort();
		}
		catch (err) { }

		var valBuscado = $("#plbCampo").val();
		var pag = "index.php?" + $("#plbForm").serialize() + "&type=ajax";


		ajaxVerificando = $.ajax({
			url: pag,
			beforeSend: function () {
				ajaxCursor.show();
			},
			success: function (data) {
				var table = $(data).find("#despejo-ajax").contents();
				var result = $(data).find("#preListagem .result").contents();
				$("#despejo-ajax").html(table);
				$("#preListagem .result").html(result);


				ajaxCursor.hide();
				tooltip();
				if (valBuscado) $("#plbHold").show()




				else $("#plbHold").hide();
			}
		});


	});

};

/*
 * ### Mecanismo de links de ordenação em tabelas
 * Requisição AJAX
 *  
 */
function linksTabelasAjax() {
	$("#listagem .lt-cab a").click(function () {

	});
};
/*
 * ### Mecanismo de disparo de Visualização
 *  
 */
function visualizar() {
	$("td.lt-acoes a[rel='Visualizar']").live("click", function (ev) {
		ev.preventDefault();
		var element = $(this);

		var l2 = $(element.parents().get(1));
		var link = l2.children().get(0);

		var url = $(this).attr("href");
		url = GINGAglobals.urlAdmin + "index.php" + url + "&addClass=visualizar&js=visualizar";



		$.gingaFrame({
			"url": url,
			"txt": "Visualizar ",
			"modal": true,
			"width": "85%",
			"height": "85%",
			"auxButton": false
		});

		return false;
	});
};
function travaVisualizar() {
	if ($get("js") != "visualizar") return false;
	$("input, select, textarea").attr("disabled", "disabled");
	$(".adicionar-mais").hide();
	$(".box-miniimgs a").hide();
	$("a").attr("target", "_blank");
};
/*
 * ### Mecanismo de verificação de status da sessão do GinGa
 *  
 */
function checaSessao(tempo) {
	if (tempo === undefined) tempo = GINGAglobals.sessaoTimer;
	tempo = (tempo * 1000) + 10;
	setTimeout(function () {
		$.ajax({
			url: GINGAglobals.urlAdmin + "?rt=index/status",
			dataType: "json",
			success: function (data) {
				//console.log(data.efetuarLogout);
				if (data.efetuarLogout) window.location = GINGAglobals.urlAdmin;
				else checaSessao(data.novoTimer);
			}
		});
	}, tempo);
};

/*
* ### Seletor de Contexto do Ginga
*  
*/
function seletorContexto() {
	$("#seletorContexto select").live("change", function () {
		var tgt = $(this).val();
		window.location = tgt;
		//console.log(tgt);
	});
};


/*
* ### Tracking de erros - Google Analytics
*  
*/
function trackingErrors() {
	if ($("#msg").length) {
		var _el = $("#msg");
		var msg, act, label;

		if (_el.hasClass("ok")) {
			msg = "Sucesso";
		} else if (_el.hasClass("erro")) {
			msg = "Erro";
		} else if (_el.hasClass("aviso")) {
			msg = "Alerta";
		} else if (_el.hasClass("info")) {
			msg = "Informação";
		}

		act = _el.find("p strong").text();
		//label = _el.find("p").text().trim();
		var user = $("#header .header-links").text();
		user = user.replace("[ Logout ]", "");
		user = user.replace(/(\r\n|\n|\r)/gm, "");
		user = user.trim();

		label = "Usuário: " + user;
		label += " | Horário: " + new Date();
		label += " | Browser: " + head.browser.name;
		label += " | Versão: " + head.browser.version;

		console.info("Mensagem > " + msg + " , " + act + " , " + label);
		ga('send', 'event', 'Mensagem > ' + msg, act, label);
	}
};