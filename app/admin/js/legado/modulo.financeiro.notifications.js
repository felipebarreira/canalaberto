$(document).ready(function(){
	$("#check-notif-antes").change(function(){
		if($(this).is(":checked")){
			$("#area-notif-lembrete").slideDown();
			$("#form-envia-notificacao .notif-prev-antes").fadeIn("fast");
		}else{
			$("#area-notif-lembrete").slideUp();
			$("#form-envia-notificacao .notif-prev-antes").fadeOut("fast");
		}
	});
	$("#check-notif-nodia").change(function(){
		if($(this).is(":checked"))
			$("#form-envia-notificacao .notif-prev-nodia").fadeIn("fast");
		else
			$("#form-envia-notificacao .notif-prev-nodia").fadeOut("fast");
	});
	$("#check-notif-depois").change(function(){
		if($(this).is(":checked"))
			$("#form-envia-notificacao .notif-prev-depois").fadeIn("fast");
		else
			$("#form-envia-notificacao .notif-prev-depois").fadeOut("fast");
	});


	$("#input-notif-antes").change(function(){
		var dia = $("#form-envia-notificacao").attr("data-dia-vencimento");
		var valo = $(this).val();
		var dia_notif = moment(dia, "DD-MM-YYYY").subtract(valo, "days").format("DD/MM/YYYY");
		$("#form-envia-notificacao .notif-prev-antes b").text(dia_notif);
		$("#form-envia-notificacao .notif-prev-antes").addClass('animated fadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$(this).removeClass("animated fadeIn");
		});
	});
	$("#input-notif-depois").change(function(){
		var dia = $("#form-envia-notificacao").attr("data-dia-vencimento");
		var valo = $(this).val();
		var dia_notif = moment(dia, "DD-MM-YYYY").add(valo, "days").format("DD/MM/YYYY");
		$("#form-envia-notificacao .notif-prev-depois b").text(dia_notif);
		$("#form-envia-notificacao .notif-prev-depois").addClass('animated fadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			$(this).removeClass("animated fadeIn");
		});
	});


	var urlAtual = getURLParam("rt");
	//console.log(urlAtual);

	if(urlAtual=="paynotifications/send"){
		parent.alteraTextoBtNotificacoes("Enviar notificação");
	}else if(urlAtual=="paynotifications/update"){
		parent.alteraTextoBtNotificacoes("Salvar");
	}

	var hash = window.location.hash;
	if(hash=="#agendada"){
		$("#encapTabs ul li[rel='agendada']").trigger("click");
	}else if (hash=="#reg"){
		$("#encapTabs ul li[rel='reg']").trigger("click");
	}


});
