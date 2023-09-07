$(function() {
	$('.mmoeda').priceFormat();

	$("#select-links").selectize({
		create: true,
		sortField: "text"
	});

	$("#encapForm").delegate(".ark-checkbox input[type='checkbox']","click",function(){
		var par = $(this).closest(".ark-checkbox");
		var fieldset = $(this).closest("fieldset");
		var val = $(this).is(":checked");

		if(val){
			$(par).addClass("pago").removeClass("aberto");
			$(fieldset).addClass("fieldset-pago");
			$(par).find("span").text("pago");
			$("#detalhes-cobranca").addClass("fieldset-pago");
			//$("#area-detalhes-cobranca").remove();
			//$("#detalhes-cobranca .expande-cobranca p").text("recolher detalhes da cobrança");
		}
		else{
			$(par).addClass("aberto").removeClass("pago");
			$(fieldset).removeClass("fieldset-pago");
			$("#detalhes-cobranca").removeClass("fieldset-pago");
			$(par).find("span").text("aberto");
		}
	});

	$("#detalhes-cobranca").delegate(".expande-cobranca", "click",function(){
			var act = $(this).hasClass("expande");
			if(act){
				$("#detalhes-cobranca .area-detalhes-cobranca").slideDown();
				$("#detalhes-cobranca .expande-cobranca p span").text("recolher detalhes da cobrança");
				$(this).removeClass("expande").addClass("contrai");
			}
			else{
				$("#detalhes-cobranca .area-detalhes-cobranca").slideUp();
				$("#detalhes-cobranca .expande-cobranca p span").text("visualizar detalhes da cobrança");
				$(this).removeClass("contrai").addClass("expande");
			}
	});

	$("#lista-anexos-pagamento .icoExcluir").click(function(ev){
		ev.preventDefault();
		var url = $(this).attr("href");
		var parent = $(this).closest("li");
		exclui_anexo(url,parent);

	});

});
function enviaForm(){
	$("#form-update-payment").submit();
}
function atualizaTotaisParent(){
	parent.atualizaTotais();
	setTimeout(function(){
		$("#msg").slideUp();
	}, 2200);
};

function exclui_anexo(url,$item){
	$.ajax({
		type: "GET",
		url: GINGAglobals.urlAdmin+url
	})
	.done(function( data ) {
		if(data.action){
			$().toastmessage("showToast", {
				text : data.msg,
				sticky : false,
				stayTime: 3000,
				position: "top-center",
				type : "success"
			});
			$item.fadeOut("slow",function(){
				$item.remove();
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