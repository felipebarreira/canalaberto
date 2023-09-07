$(document).ready(function(){
	$("#cmsMod .cmbTit").live("keyup",function(){
		var valor = $(this).val();
		parent.atualizaTituloModulo(MODULOglobals.moduloId,valor);
		//alert("v");
	});	
	$(".inputTags").tagsInput({width:"80%",height:"auto",defaultText:"separe com vírgula ou pressione 'enter'"});
});

function salvaJa(){
	document.forms["formModulo"].submit();
};
function CMSmoduloActiver(json){
	if(json.msg){
		
		var tipro = "success";
		if(json.tipo=="vermelho") tipro="error";
		else tipro="success";
		
		$(document).ready(function(){
			$().toastmessage("showToast", {
				text : json.msg,
				sticky : false,
				stayTime: 5300,
				position: "top-center",
				type : tipro
			});	
			
			var formaId = "iframe"+MODULOglobals.moduloId+"";
			parent.document.getElementById(formaId).contentWindow.location.reload();
			parent.$("#cms-zona #modulo"+MODULOglobals.moduloId+"").find(".cmBts .botao2").removeClass("botao3");
		});
	}
	else return false;
};
