$(document).ready(function(){

		var hashPrint = window.location.hash;
		if(hashPrint=="#print"){
			window.print();
		}

		$("#seletor-rel-aluno").on("change",function(){
			//var tgt = $(this).val();
			//window.location = tgt;		
			$("#form-rel-aluno").submit();
		});
		$("#seletor-rel-aula").on("change",function(){
			var tgt = $(this).val();
			window.location = tgt;		
		});

		/*
		$(".data-filtro")
		.datepicker({
			changeMonth: true,
			changeYear: true
		})
		.css({'margin-right': -23,'width': 110})
		//.attr('readonly', 'readonly')
		.mask("99/99/9999",{placeholder:"dd/mm/aaaa"})
		.after('<img src="img/mini/data.png" alt="Selecionar uma data" />');
		*/
		
		$("#frb-link").click(function(){
			$("#frb-filtros").slideDown();
			$("#frb-filtros-links").slideUp();
		});
		$("#frb-link-cancelar").click(function(){
			$("#frb-filtros").slideUp();
			$("#frb-filtros-links").slideDown();
		});

		$("#despejo-ajax").delegate(".link-visualizar-relatorio","click",function(ev){
			ev.preventDefault();

			var _el = $(this);
			var url = _el.attr("href");
			url = url+"&addClass=visualizar-editar";
			url = GINGAglobals.urlAdmin+"index.php"+url+"";
			var data= _el.parents("tr").find(".tb-list-desc-tit").text();

			$.gingaFrame({
				"url": url,
				"txt": "Relatório — <strong>"+data+"</strong>",
				"modal": false,
				"width": "94%",
				"height": "94%"
			});
		});

});
