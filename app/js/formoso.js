
var FORMOSO = (function() {

	var version = 1.5;

	function init() {
		commonFx();

		FORMOSO.menu.init();

		/** aplicando classes de validator nos forms **/
		$("form").each(function(){
			var form = $(this);

			form.get(0).addEventListener(
				"invalid",
				function(event) {
					form.addClass("validator");
				},
				true
			);
		});

		/** protetor de vídeos **/
		$(document).on("contextmenu",function(ev){
			if(ev.target.nodeName=='VIDEO') {
				return false;
			}
		});


		$(".formoso-listgrid").on("click",".formoso-listgrid__item",function(){
			var $this = $(this);
			$this.find("input[type=radio]").prop('checked', true); 
			$this.find("input[type=radio]").trigger("change");
		});
		$(".formoso-listgrid input[type='radio']").on("change",function(){
			$(this).closest(".formoso-item").find(".formoso-listgrid__item").removeClass("--selec");
			$(this).closest(".formoso-listgrid__item").addClass("--selec");
		});
	}




	function commonFx(){
		$('.formoso-banner__slider').slick({
			infinite: true,
			dots: true,
			slidesToShow: 1
		});

	}


	return {
		version: version ,
		init: init
	};

}());

FORMOSO.menu = {
	init: function(){
		FORMOSO.menu.gaveta.init();
		$("#btn-mobile").click(function () {
		   FORMOSO.menu.gaveta.toggle();
		});
		
		
		var menu = $('.sf-menu').superfish({
			//configurações aqui
		});						
		//menu.children('li').superfish('show');
	

	},
	gaveta:{
		isOpen: false,
		init: function(){
			$("#btn-close-tray").click(function(){
				FORMOSO.menu.gaveta.fechar();
			});		

			$("#tray-menu__container").on("click","li.submenu > a",function(){
				var $rootLi = $(this).closest("li"); 
				var $parentUl = $rootLi.find("ul");
				var isOwnSelec = $rootLi.hasClass("--selec");

				$("#tray-menu__container li.--selec").removeClass("--selec");

				if(isOwnSelec) return false;
				
				$rootLi.addClass("--selec");
				$parentUl.addClass("--selec");

				var indexMenu = $("#tray-menu__container li.submenu > a").index( this );
				sessionStorage.trayMenuOpen = indexMenu;
			});


			if (sessionStorage.trayMenuOpen) {
				var $submenu = $("#tray-menu__container li.submenu:eq('"+sessionStorage.trayMenuOpen+"')");
				$submenu.addClass("--selec");
			}

		},
		toggle: function(){
			if(FORMOSO.menu.gaveta.isOpen){
				FORMOSO.menu.gaveta.fechar();
			} else{
				FORMOSO.menu.gaveta.abrir();
			}
		},
		abrir: function(){
			$("body").addClass("--active-tray");
			FORMOSO.menu.gaveta.isOpen = true;
		},
		fechar: function(){
			$("body").removeClass("--active-tray");
			FORMOSO.menu.gaveta.isOpen = false;
		}
	}
};


FORMOSO.track = {
	init: function(){
		//todo
	},
	uid:{
		//todo
	}
};


$(window).bind("load", function() {
	$("body").addClass("loaded");
});

window.onunload = window.onbeforeunload = (function(){
	$("body").addClass("unloading");
})



$(document).ready(function(){
	FORMOSO.init();
});





