	$(document).ready(function(){

		/** excluir aulas - ajax event **/
		$(".mmFileListaArquivos .icoExcluir").click(function(ev){
			ev.preventDefault();
			var url = $(this).attr("href");
			var $item = $(this).parents(".mmilItem");
			exclui_arquivos(url,$item);
		});

		calendarioAulas();

	});

	function exclui_arquivos(url,$item){
		$.ajax({
			type: "GET",
			url: url
		})
		.done(function( data ) {
			console.log(data);
			if(data.action){
				$item.fadeOut(450,function(){
					$item.remove();

					$().toastmessage("showToast", {
						text : data.msg,
						sticky : false,
						stayTime: 3000,
						position: "top-center",
						type : "success"
					});
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

	function calendarioAulas(){
		$('.data-aulas').not(".hasDatepicker")
			.datepicker({
				changeMonth: true,
				changeYear: true,
				maxDate: '+24M'
			})
			.css({'margin-right': -23,'width': 110})
			//.attr('readonly', 'readonly')
			.mask("99/99/9999",{placeholder:"dd/mm/aaaa"})
			.after('<img src="img/mini/data.png" alt="Selecionar uma data" class="ico" />');

		$(".horario-aulas").not(".hasTimeEntry")
			.css({'margin-right': -23,'width': 110})
			.timeEntry({spinnerImage: ''})
			.after('<img src="img/mini/clock.png" alt="Selecionar um horário" class="ico" />');

		$(".data-horario").not(".hasNumeric")
			.numeric()
			.addClass("hasNumeric");

	};