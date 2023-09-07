$(document).ready(function(){
	AddVenda.init();

	$("#encapForm").delegate(".ark-checkbox input[type='checkbox']","click",function(){
		var par = $(this).closest(".ark-checkbox");
		var val = $(this).is(":checked");

		if(val){
			$(par).addClass("pago").removeClass("aberto");
			$(par).find("span").text("pago");
		}
		else{
			$(par).addClass("aberto").removeClass("pago");
			$(par).find("span").text("aberto");
		}
	});
	$("#encapForm").delegate(".fpb-excluir","click",function(){
		var par = $(this).closest("fieldset");
		$(par).remove();
	});


});



var AddVenda = {
	init: function(){
		AddVenda.masks();
		AddVenda.eventos();
		AddVenda.pagamentos.init();
	},
	masks: function(){
		/*$(".mmoeda").priceFormat();*/
		/*
		$("#select-links").selectize({
			create: true,
			sortField: "text"
		});
		$("#select-venda-cadastrada").selectize({
			sortField: "text"
		});
		*/
	},
	eventos: function(){
		$("#bt-pagamentos-mais").on("click",function(){
			$("#drop-add-recorrente").toggleClass("hide");
		});
		$("#check-notif-antes").change(function(){
			if($(this).is(":checked")){
				$("#area-notif-lembrete").slideDown();
			}
			else{
				$("#area-notif-lembrete").slideUp();
			}
		});
		$("#link-venda-cadastrada").click(function(ev){
			ev.preventDefault();
			var state = $("#area-venda-nova").css("display");

			$("#area-venda-nova").slideToggle();
			$("#area-venda-cadastrada").slideToggle();

			if(state=="block"){
				$(this).text("[ cadastrar uma nova venda ]");
			}
			else{
				$(this).text("[ adicionar a uma venda já cadastrada ]");
			}
		});
	},
	pagamentos: {
		init: function(){
			AddVenda.pagamentos.eventos();
		},
		eventos: function(){

			$("#bt-adicionar-pagamento").on("click",function(){
				AddVenda.pagamentos.criaPagamento(false);
			});
			$("#link-adicionar-recorrente").click(function(ev){
				ev.preventDefault();
				AddVenda.pagamentos.criaPagamento(true);
				$("#drop-add-recorrente").toggleClass("hide");
			});

			$(".bt-eximais-pagamento").on("click",function(ev){
				ev.preventDefault();
				var parent = $(this).closest("fieldset");
				$(parent).find(".form-pagamentos-mais").slideToggle();
				$(this).toggleClass("ativo");
			});

			$(".bt-gerar-pagamentos").on("click",function(){
				var parent = $(this).closest("fieldset");
				var num = $(parent).find(".input-num-vezes").val();

				for(i=1 ; i<num ; i++){
					AddVenda.pagamentos.criaPagamento(false,parent);
				}
				$(parent).find(".form-pagamentos-recorr").remove();
				$(parent).find(".bt-eximais-pagamento").show();
				$(parent).find(".fpb-checkbox").show();
			});

		},
		criaPagamento: function(moldeRecorr,completaGerador){
			completaGerador = completaGerador || false;

			//pega o molde 
			var molde = $("#lp-molde fieldset").clone();
			var container = $("#lp-area");

			//reatacha as masks
			/*
			$(molde).find("input.hasDatepicker").removeClass("hasDatepicker").removeAttr('id');
			$(molde).find(".ico").remove();
			$(molde).find(".data")
				.not(".hasDatepicker")
				.datepicker({
					changeMonth: true,
					changeYear: true,
					maxDate: '+24M'
				})
				.css({'margin-right': -23,'width': 110})
				.mask("99/99/9999",{placeholder:"dd/mm/aaaa"})
				.after('<img src="img/mini/data.png" alt="Selecionar uma data" class="ico" />');
				*/
			/*
			$(".data-horario").not(".hasNumeric")
				.numeric()
				.addClass("hasNumeric");
			*/
			/*$(molde).find(".mmoeda").priceFormat();*/

			//verifica se é molde de recorrente
			if(moldeRecorr){
				//é reccorente
				$(molde).find(".bt-eximais-pagamento").hide();
				$(molde).find(".fpb-checkbox").hide();

			}
			else{
				//nõo é recorrente
				$(molde).find(".form-pagamentos-recorr").remove();

				if(completaGerador){

					var $parent = $(completaGerador);

					var desc = $parent.find(".input-desc-pgto").val();
					var data = $parent.find(".input-data-pgto").val();
					var valor = $parent.find(".mmoeda").val();
					var forma = $parent.find(".select-forma-pgto").val();
					var periodo = $parent.find(".select-recorr-pgto").val();

					$(molde).find(".mmoeda").val(valor);		
					$(molde).find(".input-desc-pgto").val(desc);
					$(molde).find(".select-forma-pgto option[value='"+forma+"']").attr("selected","selected");

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

					var ultimaData = $("#lp-area fieldset .input-data-pgto").last().val();
					var novaData = moment(ultimaData, "DD-MM-YYYY").add(numFormato, stringFormato).format("DD/MM/YYYY");
					$(molde).find(".input-data-pgto").val(novaData);

				}
			}
			
			//numera os check para php
			var ultimoIDcheck = $("#lp-area fieldset .form-pagamentos-bts .id-check-pgto").last().attr("name");
			if(ultimoIDcheck==undefined){
				ultimoIDcheck=0;
			}
			else{
				ultimoIDcheck = ultimoIDcheck.slice(9);
				ultimoIDcheck = parseInt(ultimoIDcheck);
			}
			ultimoIDcheck = ultimoIDcheck+1;
			$(molde).find(".form-pagamentos-bts .id-check-pgto").attr("name","paystatus"+ultimoIDcheck);

			//insere a div do pagamento
			$(molde).appendTo(container);

		},
		contarItensPagamento: function(){

		}
	}
};


/*
function contarItensPagamento(){
	var count = $("#lp-area fieldset").length;

	$("#lp-area fieldset .pag-item-count").each(function(i){
		$(this).text(i+1);
	});
};
*/