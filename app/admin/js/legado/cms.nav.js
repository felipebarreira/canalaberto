$(document).ready(function(){
	
	if($get("rt")=="menu"){
		$("#encapConteudo .gSwit").live("click",function(){
			var el = $(this);
			var span = el.parent().find("span");	
			var stat = $(this).attr("data-status");
			var isCategoria = el.hasClass("gsCat") ? true : false;   
			
			switch (stat){
				case "verde":
					//console.log("entrou");	
					el.addClass("gsVermelho").removeClass("gsVerde").removeClass("gsLaranja").attr("data-status","vermelho");
					span.text("invisível").css("color","#de3113");
					enviaVisibilidade(el.attr("data-invisivel"));
				break;
				case "laranja":
					el.addClass("gsVerde").removeClass("gsVermelho").removeClass("gsLaranja").attr("data-status","verde");
					span.text("visível").css("color","#568b26");
					enviaVisibilidade(el.attr("data-visivel"));
				break;
				case "vermelho":
					el.removeClass("gsVermelho");
					if(isCategoria){												
						el.addClass("gsLaranja").removeClass("gsVerde").attr("data-status","laranja");
						span.text("semi-visível").css("color","#bd8128");
						enviaVisibilidade(el.attr("data-semivisivel"));
					}
					else{
						el.addClass("gsVerde").removeClass("gsLaranja").attr("data-status","verde");
						span.text("visível").css("color","#568b26");
						enviaVisibilidade(el.attr("data-visivel"));
					}				
				break;
			}
		});
		
		
		$("#cmoSelec").change(function(){
			var valu = $(this).val();
			

			
			var form = $("#cmoForm");
			$.ajax({
				url: form.attr("action"),
				type: "post",
				data: form.serialize(),
				dataType: "json",
				beforeSend: function(){
				   ajaxCursor.show();
				},
				success: function(r){
					if(r.ok){
						$.ajax({
							url: window.location,
							success: function(data){
								data = $(data).find("#encapConteudo").children();
								$("#encapConteudo").html(data);
								tooltip();	

								$().toastmessage("showToast", {
									text : r.msg,
									sticky : false,
									stayTime: 5300,
									position: "top-center",
									type : "success"
								});
								
								if(valu=="M") $("#CMSmenuOpts .linkOrd").removeClass("hide");
								else $("#CMSmenuOpts .linkOrd").addClass("hide");
								
								ajaxCursor.hide();								
							}
						});
					} 
					else{ 
						ginga_alert("Erro <b></b><br/>"+r.msg);
						ajaxCursor.hide();
					}
				},
				error:function(){
					ginga_alert("Erro <b>CMSJS47</b> <br/> Ocorreu um erro. Por favor, tente novamente!"); ajaxCursor.hide();
				}
			});	
			
		});
		
		$("#cmoSubMenu ul li:eq(2)").click(function(ev){
			ev.preventDefault();
			var el = $(this).find("a");
			var act = el.hasClass("selec");
			
			if(!act){
				el.addClass("selec");
				$("#CMSmenuOpts").slideDown();
			}
			else{
				el.removeClass("selec");
				$("#CMSmenuOpts").slideUp();
			}
		
		});
		
	}
	
	
	if($get("rt")=="addcategory" || $get("rt")=="updatecategory"  || $get("rt")=="addcontext"){
		$("#giName, #giUrl").keyup(function(){
			var valor = $(this).val();
			valor = valor.toLowerCase()
			valor = valor.replace(/[.!?,:;~<>{}()\[\]$_*"'%&#@+|\\/]/gi,"");
			valor = valor.replace(/[á]/gi,"a");
			valor = valor.replace(/[é]/gi,"e");
			valor = valor.replace(/[í]/gi,"i");
			valor = valor.replace(/[ó]/gi,"o");
			valor = valor.replace(/[ú]/gi,"u");
			valor = valor.replace(/[ý]/gi,"y");
			valor = valor.replace(/[ã]/gi,"a");
			valor = valor.replace(/[õ]/gi,"o");
			valor = valor.replace(/[â]/gi,"a");
			valor = valor.replace(/[ê]/gi,"e");
			valor = valor.replace(/[î]/gi,"i");
			valor = valor.replace(/[ô]/gi,"o");
			valor = valor.replace(/[û]/gi,"u");
			valor = valor.replace(/[ç]/gi,"c");
			valor = valor.replace(/[ ]/gi,"-");
			$("#giUrl").val(valor);
		});
	}
	
});
function enviaVisibilidade(url){
		$.ajax({
            url: url,
			type: "get",
			dataType: "json",
			beforeSend: function(){
               ajaxCursor.show();
            },
            success: function(r){
            	if(r.ok){
					ajaxCursor.hide();
					
					$().toastmessage("showToast", {
						text : r.msg,
						sticky : false,
						stayTime: 2850,
						position: "top-center",
						type : "success"
					});
					
				} 
				else ginga_alert("Erro <b>enviaVisibilidade.$.ajax.success.else</b><br/>"+r.msg); ajaxCursor.hide();
			},
			error:function(){
				ginga_alert("Erro <b>enviaVisibilidade.$.ajax.error</b> <br/> Ocorreu um erro. Por favor, tente novamente!"); ajaxCursor.hide();
			}
        });	
};