$(document).ready(function(){

	/** armazenando lembrar login **/
	$("#form-login").on("submit",function(){
		if($("#login-lembrar").is(":checked")){
			localStorage.loginRemember = $("#login-usuario").val();
		} else {
			localStorage.loginRemember = "";
		}
	});

	/** verificando lembrar login ao carregar página **/
	if(localStorage.loginRemember != ""){
		$("#login-usuario").val(localStorage.loginRemember);
		$("#login-lembrar").prop('checked', true); 
	}

	/** apagando sessionStorage do menu **/
	sessionStorage.removeItem('sideMenuOpen');

});