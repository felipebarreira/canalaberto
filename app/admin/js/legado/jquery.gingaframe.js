(function($){
    $.extend({
		GingaFrame: {
			cortina: {
				show: function(){
					$("#gfCortina").fadeIn(300).show();
				},
				hide: function(){
					$("#gfCortina").fadeOut(170);
				}
			},
			janela:{
				show: function(){
					$("#gfJanela").show();
					this.move();
				},
				hide: function(){
					$("#gfJanela").hide();
					$("#gfJanela").css("top",-800);
				},
				trocaTamanho: function(w,h){
					$("#gfJanela").css("width",w).css("height",h);
				},
				move: function(){
					var size = {
						x: $(window).width(),
						y: $(window).height()
					};
					var scroll = {
						x: $(window).scrollLeft(),
						y: $(window).scrollTop()
					};
					var height = $("#gfJanela").height();
					var y = 0;
					var x = 0;
					y = scroll.x + ((size.x - $("#gfJanela").width()) / 2);
					if (x== "bottom") {
						x = (scroll.y + size.y + 80)
					}
					else {
						x = (scroll.y - height) - 80
					}
					if (!$("#gfJanela").visible) {
						if ($("#gfJanela").animation) {
							$("#gfJanela").animation.stop
						}
						$("#gfJanela").animation = $("#gfJanela").animate({
							left: y,
							top: scroll.y + ((size.y - height) / 2)
						}, {
							duration: 520,
							queue: false,
							easing: 'easeOutBack'
						})
						//console.log("A1");
					}
					else {
					   $("#gfJanela").css({
							top: x,
							left: y
						})
						//console.log("A2");
					}
					
					$("#gfJanela iframe").attr("width",$("#gfJanela").width()-24);
					$("#gfJanela iframe").attr("height",$("#gfJanela").height()-94);
				}
			},
			create: function(){
				//console.log("create");
				this.cortina.hide();
				this.janela.hide();
				//this.janela.show();
				this.addEvents();
			},
			show: function(opcoes){
			
				var conf = $.extend( {
				  'url'         : '#',
				  'txt'			: 'Visualizar',
				  'modal'		: true,
				  "width"		: "60%",
				  "height"		: "60%",
				  "auxButton"	: false
				}, opcoes);
			
				if(conf.width || conf.height){
					this.janela.trocaTamanho(conf.width,conf.height);
				}
			
				var jan = $("#gfJanela");
				jan.find("#gfjT").html(conf.txt);
				$('#gfjTopo').html("");
				$('#gfjTopo').hide();
				
				var iframe = $('<iframe></iframe>').attr('id', 'gingaFrameIframe').attr('name', 'gingaFrameIframe').attr('src', conf.url).attr("frameborder","0");
				iframe.ready(function() {
						$('#gfjTopo').show();
				});
				$('#gfjTopo').append(iframe);
				
				
				
				if(conf.auxButton){
					$("#gfBotoesAux").attr("value",conf.auxButton.label);
					funcao2 = conf.auxButton.funcao;
					//funcao2();
					$("#gfBotoesAux").click(function(){
						funcao2();
					});

					$("#gfBotoesAux").show();
				}
				else{
					$("#gfBotoesAux").hide();
				}
				
				
				this.cortina.show();
				this.janela.show();
				
				if(!conf.modal){
					$("#gfCortina").click(function(){
						$.GingaFrame.close();
						$(this).unbind("click");
					});
				}
			},
			close: function(){
				$("#gfBotoesAux").unbind("click");
				this.cortina.hide();
				this.janela.hide();
			},
			addEvents: function(){
				$(window).bind('resize', $.proxy(function(){
                    this.janela.move()
                }, this));
                $(window).bind('scroll', $.proxy(function(){
                    this.janela.move()
                }, this));
				$("#gfBotoesFechar").click(function(){
					$.GingaFrame.close();
				});
			}
		},
		gingaFrame: function(opcoes){
			return $.GingaFrame.show(opcoes)
		}
    });
    $(function(){
       $.GingaFrame.create();
    })
})(jQuery);

