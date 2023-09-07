/**
 */
$(document).ready(function(){
	$("#login-logar").click(function(){
		var sta = $("#login-lembrar").attr("checked");
		if(sta)	$cookie("pLogin").set($("#login-usuario").val(),30);
		else $cookie("pLogin").set("false");
	});
	
	var v_lembrar = $cookie("pLogin").get();
	if(v_lembrar==null){
		$cookie("pLogin").set("false");
		v_lembrar = $cookie("pLogin").get();
	}
	
	if(v_lembrar !="false"){
		$("#login-usuario").val(v_lembrar);
		$("#login-lembrar").attr("checked","checked");
	}
});