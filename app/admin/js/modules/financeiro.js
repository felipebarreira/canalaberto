Ignite.financeiro =  (function(){

	addClient = (function(){

		function init(){
			
			/*** disparador do cep  ***/
			$("#input-cep").mask("00000-000",{onComplete:function(valor){
				buscaCEP(valor);
			}});
			/*** disparador de criador de login  ***/
			$("#form-cadastro input[name='name']").keyup(function(){
				var ret = criarNomeUsuario($(this).val());
				$("#form-cadastro input[name='login']").val(ret);
			});

			/*** alternador do tipo do contato  ***/
			$("#form-cadastro").on("change","#checkbox-tipocontato",function(){
				var _val = $(this).val();

				if(_val=="person"){
					$(".campos-pj").hide();
					$(".campos-pj input").attr("disabled", "disabled");
					$(".campos-pf input").removeAttr("disabled");
					$(".campos-pf").show();
				} else if(_val=="company") {
					$(".campos-pf").hide();
					$(".campos-pf input").attr("disabled", "disabled");
					$(".campos-pj input").removeAttr("disabled");
					$(".campos-pj").show();
				}
			});

			/*** disparador do auto-preenchimento da cor ***/
			$("#form-cadastro").on("keyup",".input-code",function(){
				var _val = $(this).val();
				var valCor = $("#form-cadastro .input-cor").val();

				$("#form-cadastro .input-cor").val("#"+intToRGB(hashCode(_val)));
			});

		}

		/*** função de busca do cep  ***/
		function buscaCEP(cep){
			$.getJSON("//viacep.com.br/ws/"+ cep +"/json/", function(dados) {
				if (!("erro" in dados)) {
					$("#form-cadastro input[name='address']").val(dados.logradouro);
					$("#form-cadastro input[name='district']").val(dados.bairro);
					$("#form-cadastro input[name='city']").val(dados.localidade);
					//$("#form-cadastro select[name='state']").val(dados.uf);
					$("#form-cadastro select[name='state'] option[value='"+dados.uf+"']").attr("selected","selected");
				} 
				else {
					//CEP pesquisado não foi encontrado.
					alert("CEP não encontrado!");
				}
			});
		}

		/*** funções utilitárias ***/
		function hashCode(str) { // java String#hashCode
			var hash = 0;
			for (var i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
			}
			return hash;
		} 
		function intToRGB(i){
			var c = (i & 0x00FFFFFF)
				.toString(16)
				.toUpperCase();

			return "00000".substring(0, 6 - c.length) + c;
		}

		return {
			init: init
		}

	}());


	updateClient = (function(){

	}());


	listClients = (function(){

	}());

	addService = (function(){
		function init(){

			$("input.radio-categoria").change(function() {
				if (this.value == "receipt") {
					$("#area-receita").slideDown();
					$("#area-despesa").slideUp();

					$("#area-receita input").removeAttr("disabled");
					$("#area-despesa input").attr("disabled", "disabled");
				}
				else if (this.value == "expense") {
					$("#area-receita").slideUp();
					$("#area-despesa").slideDown();

					$("#area-despesa input").removeAttr("disabled");
					$("#area-receita input").attr("disabled", "disabled");
				}
			});

		}

		return {
			init: init
		}
	}());

	addPayment = (function(){
		function init(){
			var scrollUnlocked = true;

			/** disparadores do selectize **/
			selectizar();

			/** botão de notificação **/
			$("main").on("click",".bt-config-notif", function(){
				$("#area-config-notif").slideToggle();
			});

			/** botão de vincular contrato **/
			$("main").on("click",".bt-vincularcontrato", function(){
				var isContract = $("#form-add-payment").attr("data-iscontract");
				console.log(isContract);

				if(isContract == 'true'){
					//abrir novo contrato
					$("#fieldset-novocontrato input").removeAttr("disabled");
					//$('#select-client')[0].selectize.enable(); 
					//$('#select-categoria')[0].selectize.enable(); 

					$('#select-venda-cadastrada')[0].selectize.disable(); 

					$("#fieldset-novocontrato").slideDown();
					$("#fieldset-vincularcontrato").slideUp();

					$("#form-add-payment").attr("data-iscontract", 'false');

				} else if(isContract == 'false') {
					//abrir vincular contrato
					$('#select-venda-cadastrada')[0].selectize.enable(); 

					$("#fieldset-novocontrato input").attr("disabled","disabled");
					//$('#select-client')[0].selectize.disable(); 
					//$('#select-categoria')[0].selectize.disable(); 

					$("#fieldset-vincularcontrato").slideDown();
					$("#fieldset-novocontrato").slideUp();

					$("#form-add-payment").attr("data-iscontract", 'true');
				}
			});

			/** botão do gerador de recorrência **/
			$("main").on("click",".bt-abrirrecorrencia", function(){
				$("#fieldset-gerarrecorrencia").slideToggle();
			});

			/** replicador do adma para o input de máscara **/

			$("#lista-cria-pgto").on("adma:beforeclone",function(ev, original){
				
				/** gestão do selectize **/
				$('.select-selectize').each(function(){ // fazer isso para cada 'select-selectize' 
					if ($(this)[0].selectize) { // requer [0] para selecionar o objeto correto
						var value = $(this)[0].selectize.getValue(); // guardar o valor atual do selectize
						$(this)[0].selectize.destroy(); // destrói selectize()

						//verifica se o select tem o value para casos que a option foi criada
						if($(this).find("option[value='"+value+"']").length > 0){ 
							$(this).val(value);  // setar valor correto do select
						} else {
							$(this).append('<option value="'+value+'" >'+value+'</option>'); //criar o option criado
							$(this).val(value); 
						}
					}
					 $(this).attr("required", "required");
				});

			});	

			$("#lista-cria-pgto").on("adma:added",function(ev, clone, original){
				
				
				/** gestão da máscara **/
				clone.find(".has-mask-money").removeClass("has-mask-money"); // feita a remoção da classe, pois o molde é copiado direto do DOM 
				Arkantas.mask.init(); //depois é chamado a função do Arkantas de máscara
				
				 /** gestão do tooltip **/
				var $tooltipClone = clone.find(".has-tooltipster");
				var originalTitle = $tooltipClone.attr("data-title");
				$tooltipClone.attr("title",originalTitle);
				$tooltipClone.removeClass("has-tooltipster");
				Ignite.tooltips();

				// renumera checkboxes de pago
				var ultimoSwitch = parseInt($("#lca-area fieldset .switch").last().attr("data-count-switch"));
				clone.find(".switch").prop('id', 'switch-pago-'+(ultimoSwitch+1));
				clone.find(".switch").attr("data-count-switch",(ultimoSwitch+1));
				clone.find(".switch").attr("name","paystatus-"+(ultimoSwitch+1));
				clone.find(".ignite-switch label").prop("for",'switch-pago-'+(ultimoSwitch+1));

				selectizar();
				contarTransacoes();

				if(scrollUnlocked){
					$("html, body").animate({
						scrollTop: clone.offset().top
					}, 500);
				}

			});		

			$("#lista-cria-pgto").on("adma:remove",function(){
				contarTransacoes();
				toastr.success(null , "Transação removida", {
					timeOut: 10000,
					progressBar: true,
					positionClass: "toast-top-center"
				});   
			});		


			/** gerador de recorrÊncia **/
			$("main").on("click","#bt-gerarrecorrencia",function(){
				scrollUnlocked = false;

				var $parent = $("#lca-area fieldset").eq(0);

				var desc = $parent.find(".input-desc-pgto").val();
				var status = $parent.find(".switch").is(":checked");
				//console.log(status);
				var cliente = $parent.find(".select-client").val(); 
				var categoria = $parent.find(".select-categoria").val(); 
				var data = $parent.find(".input-data-pgto").val();
				var dataComp = $parent.find(".input-data-comp").val();
				var valor = $parent.find(".input-valor").val();
				var forma = $parent.find(".select-forma-pgto").val(); 

				var qtd = $("#input-num-vezes").val()  - 1;
				var periodo = $("#select-recorr-pgto").val();  
				var numFormato , stringFormato; 

				switch(periodo){
					case "7d":
						numFormato = 7;
						stringFormato = "d";
					break;
					case "15d":
						numFormato = 15;
						stringFormato = "d";
					break;
					case "1M":
						numFormato = 1;
						stringFormato = "M";
					break;
					case "2M":
						numFormato = 2;
						stringFormato = "M";
					break;
					case "3M":
						numFormato = 3;
						stringFormato = "M";
					break;
					case "6M":
						numFormato = 6;
						stringFormato = "M";
					break;
					case "1y":
						numFormato = 1;
						stringFormato = "y";
					break;
				}

				for(var i = 0; i < qtd ; i++ ){
					//pegando a última data válida e fazendo as conversões
					var ultimaData = $("#lca-area fieldset").last().find(".input-data-pgto").val();
					var ultimaDataConvertida = moment(ultimaData, "YYYY-MM-DD");
					var novaData = moment(ultimaDataConvertida).add(numFormato, stringFormato).format("YYYY-MM-DD");

					//disparando trigger de criaçao de novo 
					$(document).find(".ark-adma__trigger button").trigger("click");
					
					//selecionando ultimo criado
					var $pagRecemCriado = $("#lca-area fieldset").last();

					//preenchendo os campos
					$pagRecemCriado.find(".input-desc-pgto").val(desc);
					if(status)  $pagRecemCriado.find(".switch").prop('checked', true);
					$pagRecemCriado.find(".input-data-pgto").val(novaData);
					$pagRecemCriado.find(".input-data-comp").val(dataComp);
					$pagRecemCriado.find(".input-valor").val(valor);
					$pagRecemCriado.find(".select-forma-pgto").val(forma);
					$pagRecemCriado.find(".select-client").val(cliente);
					$pagRecemCriado.find(".select-categoria").val(categoria);
					$pagRecemCriado.find(".select-client")[0].selectize.setValue(cliente);
					$pagRecemCriado.find(".select-categoria")[0].selectize.setValue(categoria);
					
				}

				toastr.success(null , "Transações recorrente geradas", {
					timeOut: 10000,
					progressBar: true,
					positionClass: "toast-top-center"
				});      

				scrollUnlocked = true;
	

			});
		}

		function contarTransacoes(){
			var num = $("#lca-area fieldset").length;
			$("#lca-area fieldset").each(function(i){
				$(this).find(".lca-count").text(i+1);
			});

			if(num==1) $("#lca-area .ark-adma__scheme--original").addClass("fieldset-collap");
			else $("#lca-area .ark-adma__scheme--original").removeClass("fieldset-collap");
			
		}

		function selectizar(){
			$('.select-create').selectize({
				maxItems: 1,
				create: true
			});

			$('.select-simple').selectize({
				maxItems: 1,
				create: false
			});
		}

		return {
			init: init
		}
	}());


	listPayments = (function(){
		function init(){

			jqxhrSearch = null;

			renderizarPeity();

			/** disparadores do selectize **/
			$('.select-simple').selectize({
				maxItems: 1,
				create: false
			});

			/** abrir ignite frame no botao de novo pagament **/
			$("main").on("click","#bt-new-payment",function(ev){
				ev.preventDefault();

				var $el = $(this);
				var url = $el.attr("href");

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
							recarregaPagamentos(true); 
						}
					}
				});
			});

			/** abrir ignite frame no editar pagamento **/
			$("main").on("click",".link-edit-payment",function(ev){
				ev.preventDefault();

				var $el = $(this);
				var url = $el.attr("href");

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
							recarregaPagamentos(true);                            
						}
					}
				});

			});

			/** abrir ignite frame de notificações **/
			$("main").on("click",".link-notificacao",function(ev){
				ev.preventDefault();

				var $el = $(this);
				var url = $el.attr("href");

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

			});

			/** disparador de alterar status do pagamento **/
			$("main").on("change",".switch-status-payment",function(ev){
				ev.preventDefault();

				var $el = $(this);
				var $linha = $(this).closest("tr");
				var val = $el.is(":checked");
				var id = $linha.find(".tb-id-pagto").text();

				if(val){
					alteraStatusPgto(id,true);
					$($linha).addClass("linha-pago");
				}
				else{
					alteraStatusPgto(id,false);
					$($linha).removeClass("linha-pago");

					var dataPagamento = moment($($linha).find(".tb-list-data").text() , "DD/MM/YYYY" );
					if( ! moment([]).isBefore(dataPagamento) ){
						$($linha).addClass("linha-vencida");
					}
				}


			});

			/** disparar de abas dos meses **/
			$("#tab-calendar").on("click",".tab-calendar__meses li",function(){
				var mesClick = $(this).attr("data-aba-mes");
				var mesDias = moment(mesClick, "MM YYYY").daysInMonth();  

				$("#abames-menu-seldata").trigger("deselec");
				$(".tab-calendar__meses li").removeClass("selec");  
				$(this).addClass("selec");   

				//var diaInicial = moment("01 "+mesClick,"DD MM YYYY").format("DD/MM/YYYY");
				//var diaFinal = moment(mesDias+" "+mesClick,"DD MM YYYY").format("DD/MM/YYYY");

				var diaInicial = moment("01 "+mesClick,"DD MM YYYY").format("YYYY-MM-DD");
				var diaFinal = moment(mesDias+" "+mesClick,"DD MM YYYY").format("YYYY-MM-DD");

				$("#input-dateinit").val(diaInicial);
				$("#input-enddate").val(diaFinal);

				/* bugfix: chamando duas vezes */
				recarregaPagamentos(true,function(){
					/* ocultando notificação desnecessária
					toastr.success(null , "Transações atualizadas", {
						timeOut: 1000,
						progressBar: true,
						positionClass: "toast-top-center"
					}); 
					*/
				});
				
			});

			/** diisparador das setas dos meses **/
			$("#tab-calendar").on("click",".tab-calendar__menor.--setas",function(){
				var tgt = $(this).attr("data-seta");
				var mesAtual , mesTgt = "";


				if(tgt=="prev"){
					mesAtual = $("#tab-calendar__meses li:first-child").attr("data-aba-mes");
					mesTgt = moment(mesAtual,"MM YYYY").subtract(1, 'month');
					var mes = moment(mesTgt).format("MMMM");
					var mesNum = moment(mesTgt).format("MM");
					var ano = moment(mesTgt).format("YYYY");
					$('<li data-aba-mes="'+mesNum+' '+ano+'"><p> '+mes+' <br> <span>'+ano+'</span></p></li>').prependTo('#tab-calendar__meses');
					$("#tab-calendar__meses li:last-child").remove();
				}else{
					mesAtual = $("#tab-calendar__meses li:last-child").attr("data-aba-mes");
					mesTgt = moment(mesAtual,"MM YYYY").add(1, 'month');
					var mes = moment(mesTgt).format("MMMM");
					var mesNum = moment(mesTgt).format("MM");
					var ano = moment(mesTgt).format("YYYY");
					$('<li data-aba-mes="'+mesNum+' '+ano+'"><p> '+mes+' <br> <span>'+ano+'</span></p></li>').appendTo('#tab-calendar__meses');
					$("#tab-calendar__meses li:first-child").remove();
				}

				//checaMesSelec();	
			});

			/** disparador do selecionador manual de datas **/
			$("#abames-menu-seldata").on("selec",function(){
				var $this = $(this);
				$this.addClass("selec");
				$("#form-finan-busca__datas").slideDown();

				$("#tab-calendar__meses li").removeClass("selec");
			});
			$("#abames-menu-seldata").on("deselec",function(){
				var $this = $(this);
				$this.removeClass("selec");
				$("#form-finan-busca__datas").slideUp();

				$(".checkbox-buscarqualquerdata").prop("checked", false).trigger("change");
			});

			$("main").on("click","#abames-menu-seldata",function(){
				var $this = $(this);
				if($this.hasClass("selec")){
					$this.trigger("deselec");
				} else {
					$this.trigger("selec");
				}
			});

			/** disabled inputs de data ao buscar em qualquer data **/
			$("main").on("change",".checkbox-buscarqualquerdata",function(){
				let isChecked =  $(this).is(":checked");
				if(isChecked){
					$(".data-filtro").prop("disabled", true);
				} else {
					$(".data-filtro").prop("disabled", false);
				}
			});


			/** disparador fire das buscas **/
			$("main").on("change","#form-finan-busca select , #form-finan-busca .data-filtro , #form-finan-busca .checkbox-buscarqualquerdata",function(){
				recarregaPagamentos(true);
			});
			$("main").on("keyup","#form-finan-busca input",function(){
				var $element = $(this);
				var _val = $(this).val();

				recarregaPagamentos(true, function(){
					$("#table-payments .tb-list-desc-tit").mark(_val, {
						"wildcards": "enabled",
						"class": "highlight"
					});
				});


			});

			/** selecionador múltiplo **/
			let lastChecked;
			$("main").on("click",'#table-payments .lt-body-checkbox input[type = "checkbox"]', function(e){
				let inBetween = false;
				let $check = $(this);

				//verifica se o shift está pressionado e o check foi selecionado
				if (e.shiftKey && $check.is(":checked")) {
					let $checkboxes = $('#table-payments .lt-body-checkbox input[type = "checkbox"]');
				
					//inicia o each em todos os checkboxes
					$checkboxes.each(function( index ) {
						let $this = $(this);

						//a variavel inBetween só é setada a partir do momento que o check iterado seja igual ao selecionado ou o último selecionado, após isso a variavel é setada como falsa
						if($($this)[0] == $($check)[0] || $($this)[0] == $(lastChecked)[0]){
							inBetween = !inBetween;
							//console.log('Starting/finishing to check them inbetween!');
						}
						//se a variavel inBetween estiver como true, significa que o elemento iterado está no range dos checkboxes
						if (inBetween) {
							$this.prop('checked', true); 
							$this.trigger("change");
						}

					})
					
				}
				lastChecked = $check;
			});

			/** tooltips **/
			tooltips();


			/** disparador do gerador de remessa **/
			$("main").on("click","#link-gerar-remessa",function(ev){
				ev.preventDefault();
				var $fieldsetGerarRemessa = $("#fieldset-gerar-remessa");
				var isVisible = $("#fieldset-gerar-remessa").is(":visible");

				if(!isVisible){
					$fieldsetGerarRemessa.slideDown(function(){
						$("html, body").animate({
							scrollTop: $fieldsetGerarRemessa.offset().top
						}, 750);
						$fieldsetGerarRemessa.addClass("shake animated");
						$("#table-payments").addClass("--remessa-mode");
					});
				} else {
					$fieldsetGerarRemessa.slideUp();
					$("#table-payments").removeClass("--remessa-mode");
				}
			});


			/** highlight linha selecionada **/
			$("main").on("change",".lt-body-checkbox input",function(){
				var isChecked = $(this).is(":checked");
				var $linha = $(this).closest("tr");

				if(isChecked){
					$linha.addClass("linha-selec");
				} else {
					$linha.removeClass("linha-selec");
				}
			});


			/** confirms de excluir transação **/
			$("main").on("click",".bt-excluir-transacao",function(ev){
				ev.preventDefault();

				let $this = $(this);
				let url  = $this.attr("href");

				let name = $this.closest("tr").find(".tb-list-desc-tit").text();

				let config = { 
					msg: "Você deseja excluir a transação <strong>"+name+"</strong>?",
					msgExcluida: "A transação <strong>"+name+"</strong> foi excluída com sucesso.",
					desc : "Esta ação não poderá ser desfeita." , 
					actionLabel :  "Sim" , 
					actionClass : "--red" , 
					cancelLabel: "Não" , 
					cancelClass: "--black" 
				};


				$.confirm({
					theme: 'ignite',
					title: config.msg,
					content: "<p>"+config.desc+"</p>",
					//useBootstrap: false,
					columnClass: "medium",
					buttons: {
						action: {
							text: config.actionLabel,
							btnClass: ' '+config.actionClass,
							keys: ['enter', 'shift'],
							action: function(){

								$.ajax({
									type: "GET",
									url: url,
									beforeSend: function( xhr ) {
										
									}
								})
								.done(function( data ) {
									if(data.action){
										toastr.success(config.msgExcluida , "Transação excluída", {
											timeOut: 5000,
											progressBar: true,
											positionClass: "toast-top-center"
										});    
									}
									else{
										toastr.error("Não foi possível excluir esta transação. "+ name , "Erro", {
											timeOut: 0,
											closeButton: false,
											positionClass: "toast-top-center"
										});                      
									}
									recarregaPagamentos(true);
								})
								.fail(function(){
									toastr.error("O servidor não respondeu. Tente novamente mais tarde.", "Erro", {
										timeOut: 0,
										closeButton: false,
										positionClass: "toast-top-center"
									});                      
								});

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

		/*** função de ajax para alterar status do pagamento ***/
		function alteraStatusPgto(id,pago){
			let url = IGNITE.globals.urlAdmin+"index.php?rt=payments/updatestatus";

			$.ajax({
				type: "GET",
				url: url,
				data: "id-payment="+id,
				beforeSend: function( xhr ) {
					Pace.start
				}
			})
			.done(function( data ) {

				recarregaPagamentos(false,function(){

					if(data.ok){
						toastr.success("O status da transação foi alterado com sucesso." , "Status alterado", {
							timeOut: 5000,
							progressBar: true,
							positionClass: "toast-top-center"
						});    
					}
					else{
						toastr.error("O status da transação não pode ser alterado. ", "Erro", {
							timeOut: 0,
							closeButton: false,
							positionClass: "toast-top-center"
						});                      
					}
					
				});

			})
			.fail(function(){
				toastr.error("O servidor não respondeu. Tente novamente mais tarde.", "Erro", {
					timeOut: 0,
					closeButton: false,
					positionClass: "toast-top-center"
				});                      
			});
		}


		/*** função que recarrega os pagamentos ***/
		function recarregaPagamentos(reloadAll, callback){

			var serializedFormFinan = $("#form-finan-busca").serialize();
			if(reloadAll) $("#table-payments").addClass("--loading");

			/*if($get("searchperiod")=="true"){
				//console.log();
			} else {
				serializedFormFinan = serializedFormFinan.replace("searchperiod=true&", "");
			}*/

			var urlPag = "index.php?"+serializedFormFinan+"";
			var paramsUrl = new URLSearchParams(serializedFormFinan);


			if( jqxhrSearch != null ) {
				jqxhrSearch.abort();
				jqxhrSearch = null;
			}

			jqxhrSearch = 
				$.ajax({
					url: urlPag+"&type=ajax",
					beforeSend: function(){
						
					}				
				})
				.done(function(data) {
					history.pushState(null, null, urlPag);
					atualizaLinks();
					$(".finan-bt-exportar-excel").attr("href",urlPag.replace("rt=payments","rt=payments/export_xls"));

					if(reloadAll){
						$("#despejo-table-payments").html(data);
					} else {
						var result = $(data).find("tfoot").contents();
						$("#table-payments tfoot").html(result);
					}
					
					recarregaSaldo();

					tooltips();
					renderizarPeity();
					$("#table-payments").removeClass("--loading");

					if (typeof callback == "function") { 
						callback.call(this); 
					}
				})
				.fail(function( jqXHR, requestStatus, errorThrown ) {
					if(requestStatus!="abort"){
						toastr.error("Ocorreu um erro ao consultar o servidor. Não foi possível acessar a lista de pagamentos. Tente novamente mais tarde, ou entre em contato com os desenvolvedores.", "Erro", {
							timeOut: 0,
							closeButton: false,
							positionClass: "toast-top-center"
						});  
					}
				})
				.always(function() {
					//renderizarPeity();
				});

		}

		/*** função que recarrega o saldo da conta ***/
		function recarregaSaldo(callback){
			
			var account = $("#form-finan-busca input[name='account']").val();

			$.ajax({
				url: IGNITE.globals.urlAdmin+"index.php?rt=payments&account="+account,
				beforeSend: function(){
					//$("#content .finance-saldo-label").addClass("--loading");
					$("#content .finance-saldo-label").removeClass("--active");
				}				
			})
			.done(function(data) {
				var result = $(data).find("#content .finance-saldo-label").contents();
				
				var newBalance = result.text();
				var oldBalance = $("#content .finance-saldo-label span").text();

				if(newBalance != oldBalance){
					$("#content .finance-saldo-label").html(result);

					var dropdown = $(data).find("#content .dropdown-seletor-conta .dropdown .ark-dropdown__menu").contents();
					$("#content .dropdown-seletor-conta .dropdown .ark-dropdown__menu").html(dropdown);

					$("#content .finance-saldo-label span").tooltipster({
						theme: "tooltipster-ignite",
						side: "top"
					}).addClass("has-tooltipster");

					$("#content .finance-saldo-label").addClass("--active");
				}

				if (typeof callback == "function") { 
					callback.call(this); 
				}
				
			})
			.fail(function( jqXHR, requestStatus, errorThrown ) {
				if(requestStatus!="abort"){
					toastr.error("Ocorreu um erro ao consultar o servidor. Não foi possível atualizar o saldo da conta.", "Erro", {
						timeOut: 0,
						closeButton: false,
						positionClass: "toast-top-center"
					});  
				}
			})
			.always(function() {
			});
		}

		function atualizaLinks(){
			$(".content-header__tabs a , .dropdown-seletor-conta a").each(function(){
				var itemUrl = $(this).attr("href");
				itemUrl = itemUrl.replace("index.php", "");

				var paramsUrl = new URLSearchParams(itemUrl);
				paramsUrl.set("dateinit", $("#input-dateinit").val() );
				paramsUrl.set("enddate", $("#input-enddate").val() );

				$(this).attr("href", "index.php?"+paramsUrl);
			});
		}

		/*** funções auxiliares ***/
		function tooltips(){
			$("main .lt-acoes .btn, main .lt-icons .btn").not(".has-tooltipster").each(function(){
				$(this).tooltipster({
					theme: "tooltipster-ignite",
					side: "top"
				}).addClass("has-tooltipster");
			});
		}

		function renderizarPeity(){
			let $sparkline =  $("span.total-sparkline");
			$sparkline.peity("donut", {
				fill: ["#118a7a", "#C50A0A"]
			});
			

			let $wrapSparkline =  $("span.wrap-sparkline");
			let sparkLabel = $wrapSparkline.attr("data-label")
			let valorPago = parseInt($wrapSparkline.attr("data-pay")); 
			let valorAberto = parseInt($wrapSparkline.attr("data-open"));

			let percentPago = ( 100 * valorPago ) / (valorPago+valorAberto);
			let percentAberto = ( 100 * valorAberto ) / (valorPago+valorAberto); 
			percentPago = parseFloat(percentPago).toFixed(1);
			percentAberto = parseFloat(percentAberto).toFixed(1);

			$wrapSparkline.tooltipster({
				content: "pago: <strong>"+percentPago+"%</strong> <br> "+sparkLabel+": <strong>"+percentAberto+"%</strong>",
				contentAsHTML: true,
				theme: "tooltipster-ignite",
				side: "top"
			});

		}


		return {
			init: init,
			alteraStatusPgto: alteraStatusPgto,
			recarregaPagamentos: recarregaPagamentos,
			recarregaSaldo: recarregaSaldo
		}
	}());


	updatePayment = (function(){
		function init(){

			/*** disparador do copiador de link de boleto ***/
			$("main").on("click", ".bt-copiar-linkbol", function(){
				var copyText = document.getElementById("input-linkbol");
				copyText.select();
				document.execCommand("copy");            

				toastr.success("Utilize Ctrl+V para colar.", "Link do boleto copiado", {
					timeOut: 10000,
					progressBar: true,
					positionClass: "toast-top-center"
				});  
			});


			/*** observador de mudanças em formulário ***/
			$("main").on("change","#form-update-payment *",function(){
				let $buttonBadge = $("#button-bar__alert");

				$buttonBadge.show().removeClass("bounce animated");

				setTimeout(function(){
					$buttonBadge.addClass("bounce animated");
				},100);
				
			});

			/*** emissor de aviso ao alterar forma de pagamento ***/
			$("main").on("change","#select-forma-pgto",function(){
				toastr.info("Ao alterar uma forma de pagamento, para ver os detalhes na coluna direita, você deve salvar a transação.", "Aviso", {
					timeOut: 10000,
					progressBar: true,
					positionClass: "toast-top-center"
				});  
			});

			/*** disparador dos selectize ***/
			selectizar();
		}

		function selectizar(){
			$('.select-create').selectize({
				maxItems: 1,
				create: true
			});

			$('.select-simple').selectize({
				maxItems: 1,
				create: false
			});
		}

		return {
			init: init
		}
	}());


	paymentNotifications = (function(){

		function init(){

			$("#check-notif-antes").on("change", function(){
				if($(this).is(":checked")){
					$("#area-notif-lembrete").slideDown();
					$("#form-envia-notificacao .notif-prev-antes").fadeIn("fast");
					marcarDia($(".notif-prev-antes b").text(),"antes",true);
				}else{
					$("#area-notif-lembrete").slideUp();
					$("#form-envia-notificacao .notif-prev-antes").fadeOut("fast");
					desmarcaDia("antes");
				}
			});
			$("#check-notif-nodia").on("change", function(){
				if($(this).is(":checked")){
					$("#form-envia-notificacao .notif-prev-nodia").fadeIn("fast");
					$("#calendar-dia").slideDown();
					marcarDia($(".notif-prev-nodia b").text(),"dia",true);
				} else {
					$("#form-envia-notificacao .notif-prev-nodia").fadeOut("fast");
					desmarcaDia("dia");
				}
			});
			$("#check-notif-depois").on("change", function(){
				if($(this).is(":checked")){
					$("#form-envia-notificacao .notif-prev-depois").fadeIn("fast");
					$("#calendar-depois").slideDown();
					marcarDia($(".notif-prev-depois b").text(),"depois",true);
				} else {
					$("#form-envia-notificacao .notif-prev-depois").fadeOut("fast");
					desmarcaDia("depois");
				}

			});


			$("#input-notif-antes").on("change", function(){
				var dia = $("#form-envia-notificacao").attr("data-dia-vencimento");
				var valo = $(this).val();
				var dia_notif = moment(dia, "DD-MM-YYYY").subtract(valo, "days").format("DD/MM/YYYY");
				$("#form-envia-notificacao .notif-prev-antes b").text(dia_notif);
				$("#form-envia-notificacao .notif-prev-antes").addClass('animated fadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					$(this).removeClass("animated fadeIn");
				});

				if($("#check-notif-antes").is(":checked")){
					marcarDia( $(".notif-prev-antes b").text() , "antes", true);
				}
			});
			$("#input-notif-depois").on("change", function(){
				var dia = $("#form-envia-notificacao").attr("data-dia-vencimento");
				var valo = $(this).val();
				var dia_notif = moment(dia, "DD-MM-YYYY").add(valo, "days").format("DD/MM/YYYY");
				$("#form-envia-notificacao .notif-prev-depois b").text(dia_notif);
				$("#form-envia-notificacao .notif-prev-depois").addClass('animated fadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					$(this).removeClass("animated fadeIn");
				});

				if($("#check-notif-depois").is(":checked")){
					marcarDia( $(".notif-prev-depois b").text() , "depois", true);
				}
			});

			$("main").on("click","#bt-visualizarregistro",function(){
				$("#fieldset-registro").slideToggle();
			})


			/*** verificando se checkboxes já estão marcados e gerando calendários ***/
			if($("#check-notif-nodia").is(":checked")){
				//geraCalendarDia();
				marcarDia( $(".notif-prev-nodia b").text() , "dia");
			}
			if($("#check-notif-antes").is(":checked")){
				//geraCalendarAntes();
				marcarDia( $(".notif-prev-antes b").text() , "antes");
			}
			if($("#check-notif-depois").is(":checked")){
				//geraCalendarDepois();
				marcarDia( $(".notif-prev-depois b").text() , "depois");
			}


		}


		function marcarDia(dia,tipo,verify = false){
			var diaEscolhido = moment(dia,"DD/MM/YYYY").format("YYYY-MM-DD");  
			var hoje = moment().format("YYYY-MM-DD");  

			var mesAno =  moment(dia, "DD/MM/YYYY").format("MM/YYYY");
			var dia = moment(dia, "DD/MM/YYYY").format("DD");

			
			//procura mes
			var jaTemMes = $("#calendars-notifs .calendar-container[data-mes='"+mesAno+"']").length;

			if(!jaTemMes){
				//gerar calendario
				geraCalendar(mesAno);
			}

			//avisa sobre dias incompatíveis
			if(verify){
				if(moment(diaEscolhido).isBefore(hoje)){
					toastr.error(null , "A data escolhida é anterior a hoje.", {
						timeOut: 5000,
						progressBar: true,
						positionClass: "toast-top-center"
					});      
				}
			}


			//marca e desmarca os dias
			$(".calendar-container").find("td").removeClass(tipo);
			$(".calendar-container[data-mes='"+mesAno+"']").find("td[data-dia='"+parseInt(dia)+"']").addClass(tipo);

			reordenaCalendar();
		}

		function desmarcaDia(tipo){
			$("#calendars-notifs .calendar-container").find("td").removeClass(tipo);
			reordenaCalendar();
		}

		function geraCalendar(mesAno){
			let mes = moment(mesAno, "MM/YYYY").format("MM");
			let ano = moment(mesAno, "MM/YYYY").format("YYYY");
			let mesAnoID = moment(mesAno, "MM/YYYY").format("X");

			var div = $('<div/>', {
				"id": mesAnoID,
				"data-mes": mesAno,
				"data-index": mesAnoID,
				"class": "calendar-container"
			}).appendTo('#calendars-notifs');

			var calendar = new CalendarConstructor();
			calendar.renderCalendar(mesAnoID, 1, mes-1, ano);
		}

		function reordenaCalendar(){
			$('#calendars-notifs .calendar-container').each(function(){
				var $this = $(this);
				var diaSelec = $this.find("td.dia").length;
				var antesSelec = $this.find("td.antes").length;
				var depoisSelec = $this.find("td.depois").length;

				if(diaSelec == 0 && antesSelec == 0 && depoisSelec == 0){
					$this.remove();
				}
			});

			$('#calendars-notifs').each(function(){
				var $this = $(this);
				$this.append($this.find('.calendar-container').get().sort(function(a, b) {
					return $(a).data('index') - $(b).data('index');
				}));
			});

			//marca hoje
			var hojeMesAno =  moment().format("MM/YYYY");
			var hojeDia = moment().format("DD");
			$("#calendars-notifs .calendar-container").find("td").removeClass("selec");
			$(".calendar-container[data-mes='"+hojeMesAno+"']").find("td[data-dia='"+parseInt(hojeDia)+"']").addClass("selec");
		}

		return {
			init: init
		}

	}());

	sendNotifications = (function(){
		function init(){

			/*** fire selector deo tempalte ***/
			$("main").on("change",".fire-selector",function(){
				window.location.href = $(this).val();
			});


			/*** criador de selectize especial para contatos e e-mails ***/
			var REGEX_EMAIL = '([a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@' +
							'(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)';

			var formatName = function(item) {
				return $.trim((item.first_name || '') + ' ' + (item.last_name || ''));
			};

			/* select to */
			$('#select-to').selectize({
				placeholder: "Escolha os contatos ou digite um e-mail",
				persist: false,
				maxItems: null,
				valueField: 'email',
				labelField: 'name',
				searchField: ['first_name', 'last_name', 'email'],
				sortField: [
					{field: 'first_name', direction: 'asc'},
					{field: 'last_name', direction: 'asc'}
				],
				options: selectTo,
				render: {
					item: function(item, escape) {
						var name = formatName(item);
						return '<div>' +
							(name ? '<span class="name">' + escape(name) + '</span>' : '') +
							(item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
						'</div>';
					},
					option: function(item, escape) {
						var name = formatName(item);
						var label = name || item.email;
						var caption = name ? item.email : null;
						return '<div>' +
							'<span class="label">' + escape(label) + '</span>' +
							(caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
						'</div>';
					}
				},
				createFilter: function(input) {
					var regexpA = new RegExp('^' + REGEX_EMAIL + '$', 'i');
					var regexpB = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
					return regexpA.test(input) || regexpB.test(input);
				},
				create: function(input) {
					if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
						return {email: input};
					}
					var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
					if (match) {
						var name       = $.trim(match[1]);
						var pos_space  = name.indexOf(' ');
						var first_name = name.substring(0, pos_space);
						var last_name  = name.substring(pos_space + 1);

						return {
							email: match[2],
							first_name: first_name,
							last_name: last_name
						};
					}
					alert('E-mail inválido.');
					return false;
				}
			});

			/* select cco */
			$('#select-cco').selectize({
				placeholder: 'Escreva os endereços de e-mail',
				persist: false,
				maxItems: null,
				valueField: 'email',
				labelField: 'name',
				searchField: ['first_name', 'last_name', 'email'],
				sortField: [
					{field: 'first_name', direction: 'asc'},
					{field: 'last_name', direction: 'asc'}
				],
				render: {
					item: function(item, escape) {
						var name = formatName(item);
						return '<div>' +
									(name ? '<span class="name">' + escape(name) + '</span>' : '') +
									(item.email ? '<span class="email">' + escape(item.email) + '</span>' : '') +
								'</div>';
					},
					option: function(item, escape) {
						var name = formatName(item);
						var label = name || item.email;
						var caption = name ? item.email : null;
						return '<div>' +
									'<span class="label">' + escape(label) + '</span>' +
									(caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
								'</div>';
					}
				},
				createFilter: function(input) {
					var regexpA = new RegExp('^' + REGEX_EMAIL + '$', 'i');
					var regexpB = new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i');
					return regexpA.test(input) || regexpB.test(input);
				},
				create: function(input) {
					if ((new RegExp('^' + REGEX_EMAIL + '$', 'i')).test(input)) {
						return {email: input};
					}
					var match = input.match(new RegExp('^([^<]*)\<' + REGEX_EMAIL + '\>$', 'i'));
					if (match) {
						var name       = $.trim(match[1]);
						var pos_space  = name.indexOf(' ');
						var first_name = name.substring(0, pos_space);
						var last_name  = name.substring(pos_space + 1);

						return {
							email: match[2],
							first_name: first_name,
							last_name: last_name
						};
					}
					alert("E-mail inválido.");
					return false;
				}
			});

		}

		return {
			init: init
		}
	}());


	extract = (function(){
		function init(){
			jqxhrSearch = null;

			/*** disparador do seletor de período ***/
			$("main").on("click","#finance-graph__link-periodo",function(ev){
				ev.preventDefault();
				$("#finance-graph__search").slideToggle();
			});

			/** abrir ignite frame no editar pagamento **/
			$("main").on("click",".link-edit-payment",function(ev){
				ev.preventDefault();

				var $el = $(this);
				var url = $el.attr("href");

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
							recarregaExtrato();
						}
					}
				});

			});
		}

		/*** função que recarrega o extrato ***/
		function recarregaExtrato(callback){

			var urlPag = window.location.href;

			if( jqxhrSearch != null ) {
				jqxhrSearch.abort();
				jqxhrSearch = null;
			}

			jqxhrSearch = 
				$.ajax({
					url: urlPag+"&type=ajax",
					beforeSend: function(){
						$("#table-payments").addClass("--loading");
					}				
				})
				.done(function(data) {

					$("#despejo-table-payments").html($(data).find("#despejo-table-payments").contents());
					$("#table-payments").removeClass("--loading");

					if (typeof callback == "function") { 
						callback.call(this); 
					}
				})
				.fail(function( jqXHR, requestStatus, errorThrown ) {
					if(requestStatus!="abort"){
						toastr.error("Ocorreu um erro ao consultar o servidor. Não foi possível acessar o extrato. Tente novamente mais tarde, ou entre em contato com os desenvolvedores.", "Erro", {
							timeOut: 0,
							closeButton: false,
							positionClass: "toast-top-center"
						});  
					}
				})
				.always(function() {
				});

		}

		return {
			init: init
		}
	}());


	dashboard = (function(){
		function init(){

			
            /*** gráfico :: fluxo de caixa ***/
			var graficoFluxo = document.getElementById('graph-panel__canvas').getContext('2d');
			window.myMixedChart = new Chart(graficoFluxo, {
				type: 'bar',
				data: dadosFluxo,
				options: {
					responsive: true,
                    scales: {
                        xAxes: [{
							ticks: {}
                        }],
						yAxes: [
							{
								type:'linear',
								id:'left-axis',
								display: true,
								position: 'left',
								scaleLabel: {display: true, labelString: 'Receitas / Despesas'},
								ticks: {
									beginAtZero: true,
									userCallback: function(value, index, values) {
										return value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL', minimumFractionDigits: 0});
									}
								}
							},{
								type:'linear',
								id:'right-axis',
								display: true,
								position: 'right',
								scaleLabel: {display: true, labelString: 'Saldo'},
								stacked:false,
								gridLines: {drawOnChartArea:false},
								ticks: {
									beginAtZero: false,
									userCallback: function(value, index, values) {
										return value.toLocaleString('pt-br',{style: 'currency', currency: 'BRL', minimumFractionDigits: 0});
									}
								}
							}
						]
                    },
					tooltips: {
						mode: 'index',
						intersect: true,
                        callbacks: {
                            label: function(tooltipItem, data) {
                                return tooltipItem.yLabel.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
                            }
                        }
				    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
				}
			});

            /*** gráfico :: previsto/realizado - receitas  ***/
			var graficoFluxo = document.getElementById('graph-panel__previsto-receitas').getContext('2d');
			window.myMixedChart = new Chart(graficoFluxo, {
				type: 'doughnut',
				data: dadosReceitas,
				options: {
					responsive: true,
					legend: {
						position: "bottom"
					},
					tooltips: {
						mode: 'index',
						intersect: true,
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var dataLabel = data.labels[tooltipItem.index];
                                var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

                                var dataset = data.datasets[tooltipItem.datasetIndex];
                                var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                                    return previousValue + currentValue;
                                });
                                var currentValue = dataset.data[tooltipItem.index];
                                var percentage = Math.floor(((currentValue/total) * 100)+0.5);
             
                                return dataLabel+": "+value+" ("+percentage+"%)";
                            }
                        }
				    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
				}
			});

            /*** gráfico :: previsto/realizado - despesas  ***/
			var graficoFluxo = document.getElementById('graph-panel__previsto-despesas').getContext('2d');
			window.myMixedChart = new Chart(graficoFluxo, {
				type: 'doughnut',
				data: dadosDespesas,
				options: {
					responsive: true,
					legend: {
						position: "bottom"
					},
					tooltips: {
						mode: "index",
						intersect: true,
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var dataLabel = data.labels[tooltipItem.index];
                                var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

                                var dataset = data.datasets[tooltipItem.datasetIndex];
                                var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                                    return previousValue + currentValue;
                                });
                                var currentValue = dataset.data[tooltipItem.index];
                                var percentage = Math.floor(((currentValue/total) * 100)+0.5);
             
                                return dataLabel+": "+value+" ("+percentage+"%)";
                            }
                        }
				    },
                    plugins: {
                        datalabels: {
                            display: false
                        }
                    }
				}
			});


			/*** disparador do seletor de período ***/
			$("main").on("click","#finance-graph__link-periodo",function(ev){
				ev.preventDefault();
				$("#finance-graph__search").slideToggle();
			});


		}

		return {
			init: init
		}
	}());

	return {
		addClient: addClient,
		updateClient: updateClient,
		listClients: listClients,
		addService: addService,
		addPayment: addPayment,
		listPayments: listPayments,
		updatePayment: updatePayment,
		paymentNotifications: paymentNotifications,
		sendNotifications: sendNotifications,
		extract: extract,
		dashboard: dashboard
	};

}());	