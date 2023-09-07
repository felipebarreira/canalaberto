Ignite.cms = (function(){


	addContext = (function(){

		function init(){
			
			$("#input-context-name").on("keyup",function(){
				let _val = $(this).val();
				let _newVal = Ignite.cms.utils.createURL(_val);
				$("#input-context-url").val(_newVal);
			});
		}

		return {
			init: init
		}

	}());

	addCategory = (function(){

		function init(){
			
			$("#input-category-name").on("keyup",function(){
				let _val = $(this).val();
				let _newVal = Ignite.cms.utils.createURL(_val);
				$("#input-category-url").val(_newVal);
			});

			/** disparadores do selectize **/
			$('.select-simple').selectize({
				maxItems: 1,
				create: false
			});
		}

		return {
			init: init
		}

	}());

	addItem = (function(){

		function init(){

			/** verificando se é mobile **/
			if($("html").hasClass("mobile")){
				$("#content").html("");
				alert("Não é possível usar o editor de página do AppxCMS em dispositivos mobile. Por favor, utilize um desktop.");
				window.location.href = IGNITE.globals.urlAdmin;
			}

			/** disparadores do selectize **/
			$('.select-tags').selectize({
				create: true
			});  
			$('.select-simple').selectize({
				maxItems: 1,
				create: false
			});	

			/** disparador do slug de url **/
			$("#input-cms-titulo, #input-cms-url").on("keyup",function(){
				let _val = $(this).val();
				let _newVal = Ignite.cms.utils.createURL(_val);

				$("#input-cms-url").val(_newVal);
				$("#span-gi-url").text(_newVal);
			});
			$("#button-editar-url").on("click",function(){
				$("#box-cms-url").slideToggle();
			});

			/** disparador de atualização do live preview **/
			$("main").on("click",".cms-link-live",function(ev){
				ev.preventDefault();
			});

			/** observador de mudanças em formulário **/
			$("main").on("change","#form-cms input,#form-cms select,#form-cms textarea",function(ev){
				var $element = ev.target;
				if($($element).attr("id") == "switch-publicado"){
					return false;
				}
				
				let $buttonAtualizar = $("#bt-cms-atualizardados");
				let $buttonBadge = $("#button-bar__alert");

				$buttonAtualizar.show(function(){
					//console.log(ev.target.attr('id'));
					$buttonBadge.show().removeClass("bounce animated");

					setTimeout(function(){
						$buttonBadge.addClass("bounce animated");
					},100);
				});

			});
			$("main").on("change",".cms-textarea-description", function(){
			});

			/** disparador do evento do botão de publicar/despublicar **/
			$("#switch-publicado").on("change",function(ev){
				var _value = $(this).is(":checked");
				ajaxPublicaDespublica(IGNITE.globals.cms.itemId,_value);
			});

			/** disparador do selec de colunas **/
			$("#cms-zona").on("click",".cms-zona__seletor-coluna a",function(ev){
				ev.preventDefault();

				let tipoLinha = $(this).attr("rel");
				criaLinha(tipoLinha);
				abrirBarraCMS();
			});

			/** draggable dos ícones da cms barra **/
			$( "#cms-barra ul li.cms-barra__modulo").draggable({	
				containment: "main",
				scroll: true,
				cursor: "grabbing",
				start: function(){
					$("#cms-zona .cms-droppable").show();
					$("#cms-zona").addClass("busy")
				},
				stop: function(){
					$("#cms-zona .cms-droppable").not(".cms-droppable__intact").hide();
					$("#cms-zona").removeClass("busy");
				},
				//helper: "clone",	
				//método default do helper sobrescrito
				//método original substituido por:
				helper: function (e,ui) {
					return $(this).clone().appendTo('body').show();
				},
				distance: 20
			});

			/** clickable no ícone  para quebrar bloco **/
			$("main").on("click",".cms-breakable",function(){
				$("#cms-zona .cms-selec").slideDown();
				$("#cms-zona .cms-breakable").hide();
			});


			/** droppable no quebrar bloco **/
			$(".cms-breakable").droppable({
				//accept: ".cms-barra__modulo ",
				tolerance: "pointer",
				drop: function(event, ui){
					
					//console.log(ui.draggable.attr("data-template"));

					if(ui.draggable.attr("data-template")){
						//criar linha e módulo
						let tipoModulo = ui.draggable.attr("data-template");
						let moduloID = ui.draggable.attr("data-moduloid");
					   

						 criaLinha("cL1").then(resposta => {
							let linhaID = resposta;
							let colunaID = $("#cms-zona .cms-linha[data-linhaid='"+linhaID+"']").find(".cms-coluna").attr("data-colunaid");
							
							criaModulo(tipoModulo,moduloID,linhaID,colunaID);
						});
					} else {
						//criar linha e transferir módulo
						criaLinha("cL1").then(resposta => {
							let moduloID = ui.draggable.attr("data-moduloid");
							let linhaID = resposta;

							let colunaID = $("#cms-zona .cms-linha[data-linhaid='"+linhaID+"']").find(".cms-coluna").attr("data-colunaid");

							$("#cms-zona .cms-modulo[data-moduloid='"+moduloID+"']").appendTo("#cms-zona .cms-coluna[data-colunaid='"+colunaID+"']");

							organizaDroppables();

							checaColunasVazias().then(resposta => {
								enviaOrdenacao();
							});
						   
						});
					}                   
				}
			});

			/** droppable no trash **/
			$("#cms-barra-trash").droppable({
				//accept: ".cms-barra__modulo ",
				drop: function(event, ui){
					let moduloID = ui.draggable.attr("data-moduloid");
					let moduloNome = ui.draggable.find(".cms-modulo__header p span").text();
					//console.log(ui.draggable.attr("data-moduloid"));


					$.confirm({
						theme: 'ignite',
						title: "Você deseja excluir o módulo <strong>"+moduloNome+"</strong>?",
						content: "<p>Todo o conteúdo desse módulo será permanentemente eliminado. <br> Esta ação é irreversível.</p>",
						//useBootstrap: false,
						columnClass: "medium",
						buttons: {
							action: {
								text: "Sim, excluir",
								btnClass: ' --red',
								keys: ['enter', 'shift'],
								action: function(){

									$.ajax({
										url: "?rt=removeModuleItem",
										type: "get",
										data: "id-moduleitem="+moduloID,
										dataType: "json",
										beforeSend: function( xhr ) {
										}
									})
									.done(function( data ) {
										if(!data.error){

											$("#cms-zona .cms-modulo[data-moduloid='"+moduloID+"']").remove();
											
											 checaColunasVazias().then(resposta => {
												enviaOrdenacao();
											});

											toastr.success(null , "Módulo excluído com sucesso.", {
												timeOut: 5000,
												progressBar: true,
												positionClass: "toast-top-full-width"
											});    

											Ignite.cms.utils.refreshLiveIframe();
										}
										else{
											toastr.error("Não foi possível excluir esta transação. " , "Erro", {
												timeOut: 0,
												closeButton: false,
												positionClass: "toast-top-full-width"
											});                      
										}

									})
									.fail(function(){
										toastr.error("O servidor não respondeu. Tente novamente mais tarde.", "Erro CMS-BARRATRASH-AJAX-FAIL", {
											timeOut: 0,
											closeButton: true,
											extendedTimeOut: 0,
											positionClass: "toast-top-full-width"
										});                      
									});

								}
							},
							cancel: {
								text: "Cancelar",
								btnClass: '--black',
								action: function(){
								}
							}
						}
					});

			   
				}
			});

			/** disparador do ignite frame **/
			$("#cms-zona").on("click"," .cms-modulo .cms-modulo__header a",function(ev){
				ev.preventDefault();
				let url = $(this).attr("href");

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
							Ignite.cms.utils.refreshLiveIframe();
						}
					}
				});
			});


			/** disparador dos viewport do live preview **/
			$("#cms-bar").on("click",".cms-iframe__bar .btn-cms-viewport",function(ev){
				console.log("aqui entrou");
				var viewport = $(this).attr("data-cms-viewport");

				if(viewport == "desktop"){
					$("#cms-iframe__viewport").addClass("--desktop").removeClass("--tablet --mobile");
				} else if(viewport == "tablet"){
					$("#cms-iframe__viewport").addClass("--tablet").removeClass("--desktop --mobile");
				} else if(viewport == "mobile"){
					$("#cms-iframe__viewport").addClass("--mobile").removeClass("--tablet --desktop");
				}
			});

			/*** outras funções auxiliadoras ***/
			/** verifica se página é edição **/
			if(IGNITE.globals.cms.abrirBarra){
				listenersModulos(); 
				abrirBarraCMS();
				$("#cms-zona .cms-breakable").show();
			}
		}


		/*** função dinamica para droppable principal e sortable dos módulos ***/
		function listenersModulos(){

			/** droppable principal **/
			$(".cms-droppable").droppable({
				drop: function(event, ui){
					let tipoModulo = ui.draggable.attr("data-template");
					let moduloID = ui.draggable.attr("data-moduloid");
					let linhaID = $(this).parents(".cms-linha").attr("data-linhaid");
					let colunaID = $(this).parent(".cms-coluna").attr("data-colunaid");

					criaModulo(tipoModulo,moduloID,linhaID,colunaID);
				}
			});

			/** sortable dos módulos **/
			$( "#cms-zona ul").sortable({
					items: "li:not(.cms-droppable)",
					connectWith: "ul",
					placeholder: "cms-place",
					handle: ".cms-modulo__header",
					opacity: 0.5 ,
					containment: "main",
					cursor: "grabbing",
					//tolerance: "pointer",
					start : function(event,ui){
						$("#cms-zona").addClass("busy cms-coluna-falsa");
						$("#cms-zona .cms-droppable").hide();
		  				
						var heightCmsZonaGrid =  $("#cms-zona__grid").outerHeight();
						$("#cms-zona__grid").addClass("--freeze").css("height",heightCmsZonaGrid+51);
						
						exibeBarraTrash(true);
					},
					stop: function(event,ui){
						$("#cms-zona").removeClass("busy cms-coluna-falsa");
						$(ui.item).addClass("--carregando");

						$("#cms-zona__grid").removeClass("--freeze").css("height","auto");
						
						exibeBarraTrash(false);
						
						organizaDroppables();
						checaColunasVazias().then(resposta => {
							enviaOrdenacao();
						});

						
					}
			});	


			setInterval(function(){
				$( "#cms-zona ul" ).sortable( "refreshPositions" );
			},1000);
		}

		/*** função criadora de linha ***/
		function criaLinha(tipoLinha){
			return  new Promise((resolve, reject) => {
				let formaDados = "item="+IGNITE.globals.cms.itemId+"&pos=1"+"&cssClass="+tipoLinha;
				
				$.ajax({
					url: "?rt=addRow",
					type: "post",
					data: formaDados,
					dataType: "json",
					beforeSend: function(){
					},
					success: function(r){
						if(!r.error){

							let formaIdLinha = "#"+tipoLinha;
							let template = $(formaIdLinha).html();

							$(template).attr("data-linhaId",r.row).appendTo("#cms-zona__grid");
							
							$("#cms-zona .cms-linha[data-linhaId='"+r.row+"'] .cms-coluna").each(function(index){
								$(this).attr("data-colunaId",r.columns[index]);
							});
							
							$("#cms-zona .cms-selec").hide();
							$("#cms-zona .cms-breakable").show();

							listenersModulos();
					
							resolve(r.row);
						} 
						else ginga_alert("Erro <b>CMSJS62</b><br/> Ocorreu um erro. Por favor, tente novamente!"); 
					},
					error:function(){
						ginga_alert("Erro <b>CMSJS65</b> <br/> Ocorreu um erro. Por favor, tente novamente!"); 
					}
				});
				
			});
			

		}

		/*** função criadora de módulos ***/
		function criaModulo(tipoModulo,moduloID,linhaID,colunaID){  
			//console.log(tipoModulo,moduloID,linhaID,colunaID);  
			
			let formaDados;
			formaDados = {
				"item": IGNITE.globals.cms.itemId+"", 
				"line": linhaID,
				"column": colunaID,
				"module": moduloID, 
			};
			
			formaDados = JSON.stringify(formaDados);
			//console.log(formaDados); 
			
			$.ajax({
				url: "?rt=addModuleItem",
				type: "post",
				data: "json="+formaDados,
				dataType: "json",
				beforeSend: function(){
				},
				success: function(r){
					if(!r.error){

						let template = $('#moduloCMS'+tipoModulo).html();

						let compiledTemplate = Template7.compile(template);
						let context = {
							url: r.url,
							moduloID: r.module
						};

						let finalHtml = compiledTemplate(context);
						$(finalHtml).appendTo($("#cms-zona .cms-coluna[data-colunaid='"+colunaID+"']"));

						$("#cms-zona .cms-coluna[data-colunaid='"+colunaID+"']").find(".cms-droppable").appendTo($("#cms-zona .cms-coluna[data-colunaid='"+colunaID+"']")).hide();

						//console.log(finalHtml);

						checaColunasVazias().then(resposta => {
							enviaOrdenacao();
						});
					} 
					else ginga_alert("Erro <b>listenersModulos().$('.cms-droppable').droppable.ajax.success.else</b><br/> Ocorreu um erro. Por favor, tente novamente!"); //ajaxCursor.hide();
				},
				error:function(){
					ginga_alert("Erro <b>listenersModulos().$('.cms-droppable').droppable.ajax.error</b> <br/> Ocorreu um erro. Por favor, tente novamente!"); 
				}
			});
		}

		/*** verifica se há linhas e colunas vazias ***/
		function checaColunasVazias(){
			return new Promise((resolve, reject) => {

				/** sinaliza colunas vazias **/
				$("#cms-zona__grid .cms-coluna").each(function(){
					let num = $(this).find(".cms-modulo").length;
					
					if(num == 0)	$(this).find(".cms-droppable").addClass("cms-droppable__intact").show();
					else 			$(this).find(".cms-droppable").removeClass("cms-droppable__intact").hide(); 
				});

				/** ajax de excluir linha **/
				$("#cms-zona__grid .cms-linha").each(function(){
					let $linha = $(this);
					let numModulos = $(this).find(".cms-modulo").length;
					let linhaID = $(this).attr("data-linhaid");


					if(numModulos==0){
						ajaxExcluirLinha($linha,IGNITE.globals.cms.itemId,linhaID).then(resposta => {

							if(resposta.sucess){
								$linha.css("background-color","red");
								$linha.remove();
							} 
							else{
								toastr.error("O servidor retornou a mensagem: "+resposta.msg, "Ocorreu um erro ao excluir a linha "+linhaID, {
									timeOut: 0,
									closeButton: true,
									extendedTimeOut: 0,
									positionClass: "toast-top-full-width"
								}); 
							}

							resolve();
						});

					} else {
						resolve();
					}
					
				});
			});
		}
		function ajaxExcluirLinha($linha,itemID,linhaID){
			return new Promise((resolve,reject) => {
				$.ajax({
					url: "?rt=addRow/delete",  
					type: "get",
					data: "id-item="+itemID+"&id-row="+linhaID,
					dataType: "json",
					beforeSend: function(){
					},
					success: function(resposta){
						resolve(resposta);
					},
					error:function(){
						toastr.error("O servidor não respondeu. Tente novamente mais tarde.", "Erro CMS-CHECACOLUNASVAZIAS-AJAX-FAIL", {
							timeOut: 0,
							closeButton: true,
							extendedTimeOut: 0,
							positionClass: "toast-top-full-width"
						});   
						reject();
					}
				});
			});
		}

		/*** coloca os droppables no fim de cada coluna ***/
		function organizaDroppables(){         
			$("#cms-zona .cms-coluna").each(function(){
				let aModulo = $(this).find(".cms-droppable");
				aModulo.appendTo($(this));
			});
		}

		/*** envia ajax para o servidor ***/
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
						Ignite.cms.utils.refreshLiveIframe();
					} 
					else{
						Ignite.cms.utils.errorProxy("Um ou mais módulos desta página, não existe(m) mais", "Ele(s) foram retirados da visualização. Resposta do servidor:"+r.msgError, false);
						
						var stringError = r.msgError;
						var regex = /(<span>)(\d{0,9})(<\/span>)/i;
						var idm = stringError.match(regex);

						//console.log(idm);
						$("#cms-zona .cms-modulo[data-moduloid='"+idm[2]+"']").remove();
					}
				},
				error:function(){
					Ignite.cms.utils.errorProxy("Não foi possível enviar a ordenação para o servidor.", "O servidor não respondeu.", true);
				}
			});
		}

		/*** função para exibir/ocultar a barra trash ***/
		function exibeBarraTrash(show){
			if(show){
				$("#cms-barra-trash__wrap").slideDown();
			} else {
				$("#cms-barra-trash__wrap").slideUp("fast");
			}
		}

		/*** função serializadora dos módulos ***/
		function serializaModulos(){
			let atc3;
			let formaJson = "{";
			formaJson += '"item":'+IGNITE.globals.cms.itemId+',';
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

			return formaJson;
		}

		/*** ajax para publicar e despublicar ***/
		function ajaxPublicaDespublica(paginaID, publicar){
			$.ajax({
				url: "?rt=addItem/publish",
				type: "get",
				data: "id-item="+paginaID+"&publish="+publicar,
				dataType: "json",
				beforeSend: function(){
				},
				success: function(r){
					if(publicar){
						toastr.success(null , "A página foi publicada!", {
							timeOut: 5000,
							progressBar: true,
							positionClass: "toast-top-full-width"
						});   
					}
				},
				error:function(){
				}
			});
		}

		/*** função para abrir barra do CMS ***/
		function abrirBarraCMS(){
			$("#cms-barra").slideDown();
		}

		/*** função legada ***/
		function ginga_alert(msg){
			alert(msg);
		}

		return {
			init: init
		}

	}());


	modulex = (function(){

		function init(){
			
			/** disparadores do selectize **/
			$('.select-tags').selectize({
				create: true
			});  

			/** ckeditor do cms **/
			
			CKEDITOR.on( 'dialogDefinition', function( ev ) {
				var dialogName = ev.data.name;
				var dialogDefinition = ev.data.definition;

				if ( dialogName == 'table' ) {
					var info = dialogDefinition.getContents( 'info' );
					var adv = dialogDefinition.getContents( 'advanced' );

					info.get( 'txtWidth' )[ 'default' ] = '100%';    
					info.get( 'txtBorder' )[ 'default' ] = '1';  
					info.get( 'selHeaders' )[ 'default' ] = 'row';  
					adv.get( 'advCSSClasses' )[ 'default' ] = 'ark-table --darkhead --border';  
				}
			});

			$(".ckeditor-cms").each( function () {
				CKEDITOR.replace( this , {
					extraPlugins: "autogrow",

					filebrowserBrowseUrl: IGNITE.globals.urlAdmin+"js/ckeditor/browse.php?type=Files",
					filebrowserUploadUrl: IGNITE.globals.urlAdmin+"js/ckeditor/upload.php?type=Files",

					contentsCss: [
						IGNITE.globals.domain+'css/vendor.css?v=21112019',
						IGNITE.globals.domain+'css/colors.css?v=21112019',
						IGNITE.globals.domain+'css/style.css?v=21112019',
						IGNITE.globals.domain+'css/cms.css?v=21112019'
					],
					
					removePlugins: "resize"
				});
			});	  
			
		}

		mimg = (function(){

			function init(){
				
				/** disparador do checkbox de miniaturas reagem **/
				$("main").on("change","#checkbox-exibir-miniatura",function(){
					let isChecked = $(this).is(":checked");

					if(isChecked){
						$("#box-miniaturas-reagem").slideDown();
					} else {
						$("#box-miniaturas-reagem").slideUp();
					}
				});

				/** disparador do ícone alternador do ratio de miniaturas **/
				$("main").on("click", ".mimg-chain", function(){
					if($(this).hasClass("link")){
						$(this).removeClass("link").addClass("unlink");
					} else {
						$(this).removeClass("unlink").addClass("link");
					}
					recalcRatio();
				});

				$("main").on("change keyup", ".input-thumb", function(){
					if($(".mimg-chain").hasClass("unlink")) return false;
					if($(this).val() <= 0 ){
						$(this).val(0);
						return false;
					}

					let _target= this.id;

					if(_target=="input-thumbwidth"){
						let _ratio = ratio($("#input-thumbheight").attr("data-calc"),$("#input-thumbwidth").attr("data-calc"));
						let _val = $(this).val()*_ratio;
						
						if(_val >= 0) $("#input-thumbheight").val(Math.round(_val));
						else $("#input-thumbheight").val(0);
					}
					else{
						let _ratio = ratio($("#input-thumbwidth").attr("data-calc"),$("#input-thumbheight").attr("data-calc"));
						let _val = $(this).val()*_ratio;
						
						if(_val >= 0) $("#input-thumbwidth").val(Math.round(_val));
						else $("#input-thumbwidth").val(0);
					}
				});


				/** disparador do Sortable da ordenação de imagens **/
				$( "#mimg-listaarquivos").sortable({
					containment: "main",
					handle: ".btn-mimg-moveimage",
					stop: function(event,ui){
						let forma =  { items: [] };
						$("#mimg-listaarquivos li").each(function(i){
							forma.items.push(
								$(this).attr("data-imgid")
							);
						});
						forma = JSON.stringify(forma);
						$("#mimg-ordenacaoimgs").val(forma);
					}
				});             

			}

			/** função simples de calcula de ratio **/
			function ratio(v1,v2){
				return v1/v2;
			}
			function recalcRatio(){
				$("#input-thumbheight").attr("data-calc",$("#input-thumbheight").val());
				$("#input-thumbwidth").attr("data-calc",$("#input-thumbwidth").val());
			}

			return {
				init: init
			}

		}());


		mlisting = (function(){

			function init(){
				
				/** disparador do alternador de páginas/categorias **/
				$("#checkbox-list-categories, #checkbox-list-pages").change(function(){
					var stat = $(this).val();
					
					if(stat=="C") $("#mlisting-lista").addClass("--nopages");
					else $("#mlisting-lista").removeClass("--nopages");
				});     

				/** mecanismo de escolhar de páginas dentro de categorias **/
				$("#mlisting-lista .input-cat").change(function(){
					var el = $(this).parents(".cat").attr("rel");
					var stat = $(this).is(":checked") ? true : false;
					
					if(stat) $("#mlisting-lista .--secondary[data-catid='"+el+"']").children(".pag").find("input").attr("checked","checked").attr("disabled","disabled");
					else  $("#mlisting-lista .--secondary[data-catid='"+el+"']").children(".pag").find("input").removeAttr("checked").removeAttr("disabled");
				});
			}

			return {
				init: init
			}

		}());

		return {
			init: init,
			mimg: mimg,
			mlisting: mlisting
		}

	}());

	menu = (function(){

		function init(){

			/** interceptador de fechamento do ignite frame  **/
			$(document).on('mfpBeforeClose', function(e /*, params */) {
				//console.log('Popup closed',  $.magnificPopup.instance);
				atualizaMainList();
			});

			/** disparadores do selectize **/
			$('.select-simple').selectize({
				maxItems: 1,
				create: false
			});

			/** disparador do ajax-select de ordenação **/
			$(document).on("change", "#select-ordem-menu", function(e) {
				var $form = $("#form-menu-ordenacao");
				var _val = $(this).val();

				if(_val=="M") $("#bt-order-itens-menu").fadeIn();
				else $("#bt-order-itens-menu").fadeOut();
				

				$.ajax({
					url: $form.attr("action") ,
					data: $form.serialize(),
					type: "post",
					dataType: "json",
					beforeSend: function(){
						
					}				
				})
				.done(function(data) {
					if(data.ok){
						atualizaMainList();
						toastr.success(null , "Ordenação do menu alterado com sucesso.", {
							timeOut: 5000,
							progressBar: true,
							positionClass: "toast-top-full-width"
						});   
					} else {
						Ignite.cms.utils.errorProxy("Não foi possível mudar a ordenação do menu", "O servidor retornou a mensagem: "+data.msg, true);
					}
				})
				.fail(function( jqXHR, requestStatus, errorThrown ) {
					if(requestStatus!="abort"){
						Ignite.cms.utils.errorProxy("Não foi possível ordernar o menu", "O servidor não respondeu.", true);
					}
				})
				.always(function() {
				});
			});


		}

		/*** ordenação do menu */
		function orderMenu(){
			
			Sortable.create(dragslides,{
				animation: 150,
				onEnd: function (/**Event*/evt) {
					var serializedIds = {};
					$("#dragslides li").each(function(index){
						//console.log(index);
						serializedIds[index] = $(this).attr("data-ignite-dragid");
					});
					//console.log(serializedIds);
					ordenaItensMenu(JSON.stringify(serializedIds));
				}
			});
		}
		function ordenaItensMenu(dados){
			var urlOrdena= IGNITE.globals.urlAdmin+"includes/helpers/app-order.php?ordernar="+$get("ordenar")+"&oid="+$get("oid");

			$.ajax({
				url: urlOrdena ,
				type: "post",
				data: "listaid="+dados,
				dataType: "json",
				beforeSend: function(){
				},
				success: function(r){
					if(r.verificado == true){
			
					toastr.success("Salvo", "Ordenação salva com sucesso" , {
						timeOut: 5000,
						progressBar: true,
						positionClass: "toast-top-full-width"
					});
						
					} 
					else Ignite.cms.utils.errorProxy("Não foi possível ordernar o menu", "O servidor negou a solicitação.", true);
				},
				error:function(){
					Ignite.cms.utils.errorProxy("Não foi possível ordernar o menu", "O servidor não respondeu", true);
				}
			});
		}

		function atualizaMainList(){
			$.ajax({
				url: window.location.href ,
				beforeSend: function(){
					
				}				
			})
			.done(function(data) {
				var result = $(data).find("#content .col-md-9").contents();
				$("#content .col-md-9").html(result);
			})
			.fail(function( jqXHR, requestStatus, errorThrown ) {
				if(requestStatus!="abort"){
					alert("Ocorreu um erro ao consultar o servidor.");
				}
			})
			.always(function() {
			});
		}

		return {
			init: init,
			orderMenu: orderMenu
		}

	}());

	utils = (function(){

		function createURL(str){
			str = str.replace(/^\s+|\s+$/g, ''); // trim
			str = str.toLowerCase();

			// remover acentos e pontuação
			let from = "ãàáäâèéëêìíïîòóöôùúüûñç·/_,:;";
			let to   = "aaaaaeeeeiiiioooouuuunc------";
			for (let i=0, l=from.length ; i<l ; i++) {
			str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
			}

			str = str.replace(/[^a-z0-9 -]/g, '') // remover carácteres inválidos
			.replace(/\s+/g, '-') // substituindo espaços por traços

			return str;
		};

		function errorProxy(title, desc, persistent = false){
			toastr.error(desc, title, {
				timeOut: (persistent)? 0 : 10000,
				closeButton: true,
				extendedTimeOut: 0,
				positionClass: "toast-top-full-width"
			});   
		}

		function refreshLiveIframe(){
			//console.log("entrou no refresh");
			var $iframe = $("#cms-live-iframe")[0];
			$iframe.src = $iframe.src+"?rand="+Math.floor(Math.random() * 9999);

			$("#cms-link-live span.circle-wing").addClass("--active");

			setTimeout(function(){
				$("#cms-link-live span.circle-wing").removeClass("--active");
			}, 900);
		}

		return {
			createURL: createURL,
			errorProxy: errorProxy,
			refreshLiveIframe: refreshLiveIframe
		}

	}());


	return {
		addContext: addContext,
		addCategory: addCategory,
		addItem: addItem,
		//modules: modules,
		modulex: modulex,
		menu: menu,
		utils: utils
	}

}());