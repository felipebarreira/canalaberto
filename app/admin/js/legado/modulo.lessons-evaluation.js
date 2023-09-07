$(document).ready(function(){		
	//return false;

	if($("#ta-ativa-home").is(":checked")) window.homeworkChecked = true;
	else window.homeworkChecked = false;

	$(".tal-campo-presenca").change(function(){
		var val = $(this).is(":checked");
		var linha = $(this).parents(".ta-linha");
		if(val){
			linha.removeClass("ta-linha-nr").addClass("ta-linha-rr")
			linha.find(".tal-numl").removeAttr("disabled");
			if(homeworkChecked) linha.find(".tal-numh").removeAttr("disabled");
		}
		else{
			linha.addClass("ta-linha-nr").removeClass("ta-linha-rr");
			linha.find(".tal-numl").attr("disabled","disabled");
			linha.find(".tal-numh").attr("disabled","disabled");
			linha.find(".tal-num").val("");
		}
	});

	$("#ta-ativa-home").change(function(){
		var val = $(this).is(":checked");

		if(val)	window.homeworkChecked = true;
		else window.homeworkChecked = false;

		atualizaChecksHw();
	});

});
function atualizaChecksHw(){
	if(homeworkChecked){
		$(".ta-linha-rr .tal-numh").removeAttr("disabled");
	} else {
		$(".tal-numh").attr("disabled","disabled");
		$(".tal-numh").val("");
	}
};