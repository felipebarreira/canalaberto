

var Ignite = (function() {

	var version = 3.86; /** data: 23.11.2019 **/

	function init() {
		/**  iniciando funçòes de interface **/
		headerTools();
		sideMenu();
		stickMainBar();
		tooltips();
		ckeditor();
		adma();
		confirm();
		checaSessao();
		dispatchIgniteFrame();
		searchListAux();
		fireSelectors();
		tabrox();

		/**  verificando carregamento **/
		$("body").removeClass("loading");
		window.onunload = window.onbeforeunload = (function(){
			$("body").addClass("loadexit");
		});

		/** verificando se página é uma busca **/
		if(getURLParam("busca")!="") highlightWord(getURLParam("busca"));


		/** aplicando classes de validator nos forms **/
		$("form").each(function(){
			var form = $(this);

			form.get(0).addEventListener(
				"invalid",
				function(event) {
					form.addClass("validator");
				},
				true
			);
		});

	}

	function headerTools(){

		/*** colapse aside ***/
		$("#header-tools").on("click",".header-tools__collap-side",function(){
			var $this = $(this);
			var $body = $("body");

			if($this.hasClass("selec")){
				$this.removeClass("selec");
				$body.removeClass("compact-side");
				sessionStorage.compactSide = false;
			} else {
				$this.addClass("selec");
				$body.addClass("compact-side");
				sessionStorage.compactSide = true;
			}
			$("#side-menu .selec").removeClass("selec");
		});
		if (sessionStorage.compactSide == "true"){
			$("#header-tools .header-tools__collap-side").trigger("click");
		}

		/*** header menu ***/
		$("#header-notif").on("click",".header-notif__avatar",function(){
			$("#header-menu").fadeToggle();

			$(document).on("click.header-menu--outside", function(e){ 
				//console.log("teste propagation");
				e.stopPropagation();
				var $container = $("#header-notif__avatar");

				if ($container.has(e.target).length === 0) {
					$("#header-menu").fadeOut();
					$(document).off("click.header-menu--outside");
				}
			});
		});
	

	}


	function sideMenu(){
		$("#side-menu").on("click","li.submenu > a",function(){
			var $rootLi = $(this).closest("li"); 
			var $parentUl = $rootLi.find("ul");
			var isOwnSelec = $rootLi.hasClass("selec");

			$("#side-menu li.selec").removeClass("selec");
			$("#side-menu li.submenu > ul").slideUp();

			if(isOwnSelec) return false;
			
			$rootLi.addClass("selec");
			$parentUl.addClass("selec").slideDown();

			var indexMenu = $("#side-menu li.submenu > a").index( this );
			sessionStorage.sideMenuOpen = indexMenu;
		});

		if (sessionStorage.sideMenuOpen) {
			var $submenu = $("#side-menu li.submenu:eq('"+sessionStorage.sideMenuOpen+"')");
			$submenu.addClass("selec");
			if($("body").hasClass("compact-side")) $submenu.find("ul").addClass("compact-side--selec"); 
			
			$submenu.find("ul").show();
		}

		$("#bt-menu-responsive").on("click",function(){
			if( ! $("aside").hasClass("open") ){
				$("aside").addClass("open");
				$("#mobile-curtain").addClass("active");
			} else {
				$("aside").removeClass("open");
				$("#mobile-curtain").removeClass("active");
			}
		});
		$("#mobile-curtain").click(function(){
			$("aside").removeClass("open");
			$("#mobile-curtain").removeClass("active");
		});

	}


	function stickMainBar(){
		$(".main-bar").stick_in_parent({
			offset_top : 64
		});		
	}


	function tooltips(){
		/** iniciando tooltips **/
		$("section .lt-acoes .btn, .tooltipster").tooltipster({
			theme: 'tooltipster-ignite'
		}).addClass("has-tooltipster");

		$("main .help-bubble").not(".has-tooltipster").each(function(){
			var originalTitle = $(this).attr("title");
			$(this).attr("data-title",originalTitle);
			$(this).tooltipster({
				theme: "tooltipster-ignite",
				side: "right"
			}).addClass("has-tooltipster");
		});
	}


	function ckeditor(){

		$(".ckeditor-full").each( function () {
			CKEDITOR.replace( this , {
				extraPlugins: "autogrow",

				filebrowserBrowseUrl: IGNITE.globals.urlAdmin+"js/ckeditor/browse.php?type=Files",
				filebrowserUploadUrl: IGNITE.globals.urlAdmin+"js/ckeditor/upload.php?type=Files",

				contentsCss: [
					IGNITE.globals.domain+'css/vendor.css',
					IGNITE.globals.domain+'css/colors.css',
					IGNITE.globals.domain+'css/style.css',
					IGNITE.globals.domain+'css/cms.css'
				],
				
				removePlugins: "resize"
			});
		});		
	}


	function adma(){


	}


	function confirm(){

		$(document).on("click","a[data-ignite-confirm-key]",function(ev){
			ev.preventDefault();

			var $this = $(this);
			var link = $this.attr("href");
			var keyword = $this.attr("data-ignite-confirm-key");
			
			var msg = $this.parent().attr("data-ignite-confirm-label");
			if(msg==undefined) msg = "Você confirma a exclusão de %key%?";
			msg = msg.replace("%key%", keyword);

			var configJson;
			try {
				configJson = $this.parent().attr("data-ignite-confirm-config");
				configJson = jQuery.parseJSON(configJson);
			}
			catch(err) {
				configJson = false;
			}
			
			var config = { 
				desc : "Esta ação não poderá ser desfeita." , 
				actionLabel :  "Sim" , 
				actionClass : "--red" , 
				cancelLabel: "Não" , 
				cancelClass: "--black" 
			};
			$.extend( config , configJson );

			$.confirm({
				theme: 'ignite',
				title: msg,
				content: "<p>"+config.desc+"</p>",
				//useBootstrap: false,
				columnClass: "medium",
				buttons: {
					action: {
						text: config.actionLabel,
						btnClass: ' '+config.actionClass,
						keys: ['enter', 'shift'],
						action: function(){
							window.location.href = link;
						}
					},
					cancel: {
						text: config.cancelLabel,
						btnClass: ' '+config.cancelClass,
						action: function(){
						}
					}
				}
			});
		});
	}


	function checaSessao(tempo){
		if(tempo===undefined) tempo = IGNITE.globals.sessaoTimer;
		tempo = (tempo * 1000)+10;
		setTimeout(function(){
			$.ajax({
				url: IGNITE.globals.urlAdmin+"?rt=index/status",
				dataType: "json",
				success: function(data){
					if(data.efetuarLogout) window.location = IGNITE.globals.urlAdmin;
					else checaSessao(data.novoTimer);
				}
			});
		},tempo);	
	}


	function dispatchIgniteFrame(){

		$(document).on("click","a[data-ignite-frame]",function(ev){
			ev.preventDefault();

			var $this = $(this);
			var url = $this.attr("href");
			var configs = $this.attr("data-ignite-frame");
			var inIframe = $this.closest("html").hasClass("in-iframe");

			if(!inIframe){
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
			} else {
				window.location.href = url;
			}

			$this.addClass("has-ignite-frame");
		
		});

	}


	function searchListAux(){
		var jqxhrSearch = null;

		/** disparadores de busca **/
		$("#content").on("change","#form-list-aux input[type='radio']",function(){
			ole();
		});
		$("#content").on("keyup","#form-list-aux input[type='text']",function(){
			ole();
		});

		/** função de busca da página **/
		function ole(){
			var valBuscado = $("#form-list-aux input[type='text']").val();
			var pag = "index.php?"+$("#form-list-aux").serialize()+"&type=ajax&highlight=word";			

			if( jqxhrSearch != null ) {
				jqxhrSearch.abort();
				jqxhrSearch = null;
			}

			jqxhrSearch = 
				$.ajax({
					url: pag,
					beforeSend: function(){
						
					}				
				})
				.done(function(data) {
					var result = $(data).find("#content .col-md-9").contents();
					$("#content .col-md-9").html(result);
					$("#form-list-aux .btn-reset-filter").fadeIn();

					highlightWord(valBuscado);
					stickMainBar();

					history.pushState(null, null, pag);
				})
				.fail(function( jqXHR, requestStatus, errorThrown ) {
					if(requestStatus!="abort"){
						alert("Ocorreu um erro ao consultar o servidor.");
					}
				})
				.always(function() {
			});

		}
	}

	function highlightWord(txt){
		$("#content .main-list").mark(txt, {
			"wildcards": "enabled",
			"class": "highlight"
		});
	}

	function fireSelectors(){
		/*** disparador fire de select / form ***/
		$(document).on("change",".fire-selector",function(){
			var $formParent = $(this).closest("form");
			$(this).hasClass("fire-selector");
			$formParent.submit();
		});

		/*** disparador fire de select / link***/
		$(document).on("change",".fire-selector-link",function(){
			$(this).hasClass("fire-selector");
			window.location.href = $(this).val();
		});
	}

	function tabrox(){
		/*** disparador do tabrox ***/
		$(document).on("click",".tabrox ul li [data-ignite-tabrox-rel]",function(){
			var $this = $(this);

			var $tabroxClosest = $this.closest(".tabrox");
			var tabroxTarget = $tabroxClosest.attr("data-ignite-tabrox-target");
			var $tabroxContainerTarget = $("#"+tabroxTarget);

			var tabroxElementTarget = $this.attr("data-ignite-tabrox-rel");
			var $tabroxElementTarget = $tabroxContainerTarget.find("[data-ignite-tabrox-rel='"+tabroxElementTarget+"']");

			$tabroxClosest.find("a[data-ignite-tabrox-rel]").removeClass("selec");
			$tabroxClosest.find("a[data-ignite-tabrox-rel='"+tabroxElementTarget+"']").addClass("selec");


			$tabroxContainerTarget.find("[data-ignite-tabrox-rel]").hide();
			$tabroxElementTarget.show();
		});
	}

	return {
		version: version ,
		init: init,
		tooltips: tooltips
	};

}());


/*** instanciando objeto e iniciando Ignite ***/
	var ignite = Ignite;

	$(document).ready(function(){
		ignite.init();
	});

	/** verificando se página está em iframe **/
	if (window.self != window.top) {
		$("html").addClass("in-iframe");
		if($(window.frameElement).hasClass("mfp-iframe")){
			$("html").addClass("compact");
			$(document).ready(function(){
				$("body").addClass("compact");
			});
		}
	}