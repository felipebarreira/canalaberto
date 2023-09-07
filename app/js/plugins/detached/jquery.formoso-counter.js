// formosoCounter

(function($) {
    $.formosoCounter = function(element, options) {

        // opções default do plugin
        var defaults = {
            debug: false,
            showLabel: true,
            "insufficientMessage" : "Nos conte mais um pouco.",
            "sufficientMessage" : "Muito bom! Fique a vontade para continuar escrevendo.",
            "adequateMessage" : "Ótimo!",
            onFoo: function() {}
        }

        // istancia atual do plugin - evita confusões ao usar a váriavel plugin
        var plugin = this;


        // isso manterá o padrão mesclado e as opções fornecidas pelo usuário
        // as propriedades do plugin estarão disponíveis neste objeto, como:
        // plugin.settings.propertyName de dentro do plug-in ou
        // element.data ('formosoCounter'). settings.propertyName de fora do plug-in,
        // onde "elemento" é o elemento ao qual o plug-in está anexado;
        plugin.settings = {}

        var $formoso = $(element),          // referencia ao objeto jQuery do elemento
             formoso = element,             // referencia ao elemento no DOM
             $textarea = $formoso.find("textarea");    // referencia ao textarea
        plugin.$formoso = $formoso;

        var min,
            max,
            adequate,
            hasMin,
            hasMax,
            maxValue;

        // método construtor
        plugin.init = function() {
            if(plugin.settings.debug)  console.log("formosoCounter > init");

            // extende as configurações default com as do uusário 
            plugin.settings = $.extend({}, defaults, options);

            $formoso.addClass("has-formoso");

            plugin.prepare($formoso);
            plugin.attachEvents($formoso);
        }

        // métodos públicos

        plugin.prepare = function($formoso) {
            min = parseInt( $textarea.attr("minlength") );
            max = parseInt( $textarea.attr("maxlength") );
            hasMin = (min > 0)? true : false;
            hasMax = (max > 0)? true : false;

            console.log(hasMin,hasMax);

            if(hasMax && !hasMin ) min = max / 2;


            if( (hasMax && !hasMin) || (hasMax && hasMin) ){
                adequate = min + ((max-min) / 2);
                maxValue = max;

                $formoso.find(".formoso-counter__count").html('<p><span class="current">0</span><span class="total">'+max+'</span></p>');
            } else if(hasMin && !hasMax){
                adequate = min * 2;
                maxValue = min;

                $formoso.addClass("--no-max");
                $formoso.find(".formoso-counter__count").html('<p><span class="current">0</span><span class="total">'+min+'</span></p>');
            } else {
                $formoso.find(".formoso-counter__count").html('<p><span class="current">0</span></p>');
            }

        }


        plugin.attachEvents = function($formoso) {
            
            $textarea.on("keyup", function(){
                var textareaLength = $textarea.val().length;
                var message;
                var percent = ( textareaLength * 100 ) / maxValue ;
                var $label = $formoso.find(".formoso-counter__label");
                var oldMessage = $label.find("p").text();

                if(plugin.settings.debug)  console.log(textareaLength);

                $formoso.removeClass("--sufficient --insufficient --adequate");

                if(textareaLength < min){
                   message = plugin.settings.insufficientMessage;
                   $formoso.addClass("--insufficient");
                } else if(textareaLength >= min && textareaLength <= adequate){
                    message = plugin.settings.sufficientMessage;
                    $formoso.addClass("--sufficient");
                } else{
                    message = plugin.settings.adequateMessage;
                    $formoso.addClass("--adequate");
                }

                if( plugin.settings.showLabel && (oldMessage != message || (textareaLength < min)) ){
                     $label.html('<p class="fadeOut animated">'+ message +'</p>');
                }

                $formoso.find('.formoso-counter__count .current').text(textareaLength);
                setProgress($formoso,percent);
                 
            });
        }


        plugin.addMethod = function(grita){
            console.log("grita");
        }

        // métodos privados
        var setProgress = function($el , percent){
            if(percent > 100 ) percent = 100;
            $el.find(".formoso-counter__progress span").css("width", percent+"%")
        }


        // chama o método construtor
        plugin.init();

    }

    // adiciona o plugin ao objeto jQuery.fn 
    $.fn.formosoCounter = function(options) {

        this.addMethod = function(grita) {
            //console.log(grita);
        };

        return this.each(function() {
            // se o plug-in ainda não foi anexado ao elemento
            if (undefined == $(this).data('formosoCounter')) {
                var plugin = new $.formosoCounter(this, options);
                $(this).data('formosoCounter', plugin);
            }
        });
    }

})(jQuery);


$(document).ready(function(){

    $(".formoso-counter").each(function(){
        var $this = $(this);

        var showLabel = $this[0].hasAttribute("formoso-show-label")? $this.attr("formoso-show-label") : "true" ;

        //converte para bool
        showLabel = (showLabel === 'true');

        $this.formosoCounter({
            "debug": false,
            "showLabel": showLabel
        });
    });
});


