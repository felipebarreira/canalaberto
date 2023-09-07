Ignite.educacional =  (function(){

	addLesson = (function(){

		function init(){
			$("#lista-cria-aulas").on("adma:added",function(ev, clone, original){
				var dataInicial = original.find(".data-aulas").val();
				dataInicial = moment(dataInicial, "DD/MM/YYYY");
				if(dataInicial.isValid()){
					var dataCampo = checaProxDiaGerarAulas(dataInicial);
					clone.find(".data-aulas").val(dataCampo);
				} 

				var timestart = original.find('input[name="lessontimestart[]"]').val();
				clone.find('input[name="lessontimestart[]"]').val(timestart);

				var duration = original.find('input[name="lessonduration[]"]').val();
				clone.find('input[name="lessonduration[]"]').val(duration);

				$("html, body").animate({
					scrollTop: clone.offset().top
				}, 500);

			});			
		}


		function checaProxDiaGerarAulas(dataInicial){
				var recurrence, nextDates , dataFinal;
				var isHolyday = false;
				var diasRecurr = checaDiasGerarAulas();
				recurrence = moment(dataInicial,"DD/MM/YYYY").recur().every(diasRecurr).daysOfWeek();
				allDates = recurrence.next(1);
				//console.log("checaProxDiaGerarAulas =>" + moment(allDates[0]).format("DD/MM/YYYY"));

				$.each(HOLYDAYS.dates, function (idx, obj) {
				    if (obj == moment(allDates[0]).format("DD/MM")) {	
						toastr.info("Ignorando aula no feriado em: "+obj, "Ignorando aula", {
							timeOut: 5000,
							progressBar: true,
  							positionClass: "toast-top-center"
						});
				        isHolyday = true;
				    }
				});

				if(isHolyday){
					dataFinal = checaProxDiaGerarAulas(moment(allDates[0]).format("DD/MM/YYYY"));
				} else {
					dataFinal = moment(allDates[0]).format("DD/MM/YYYY");
				}
				
				return dataFinal;
		}

		function checaDiasGerarAulas(){
			var diasRecurr = new Array();
			if($("#addgroup-info input[name='seg']").is(":checked")) diasRecurr.push("Segunda-feira");
			if($("#addgroup-info input[name='ter']").is(":checked")) diasRecurr.push("Terça-feira");
			if($("#addgroup-info input[name='qua']").is(":checked")) diasRecurr.push("Quarta-feira");
			if($("#addgroup-info input[name='qui']").is(":checked")) diasRecurr.push("Quinta-feira");
			if($("#addgroup-info input[name='sex']").is(":checked")) diasRecurr.push("Sexta-feira");
			if($("#addgroup-info input[name='sab']").is(":checked")) diasRecurr.push("Sábado");

			if(diasRecurr.length==0){
				return false;
			} else {
				return diasRecurr;
			}
			
		}

		return {
			init: init
		}

	}());

	return {
		addLesson: addLesson
	};

}());	