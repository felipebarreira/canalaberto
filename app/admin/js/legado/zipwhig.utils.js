/**
 * ----------------------------------------
 * Cookie Jar (antiga Cookie Arkantas)
 * Permite uma f�cil manipula��o de cookies, utilizando um shortcode com sintaxe semelhante do Prototype Core
 * 
 * Shortcut: .set(content:string,dias:int) / .set() / .erase()
 * @date 24.Fev.2010
 * @version 0.2.1
 * @license Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)
 * @copyright
 */

$cookie = function (nome) {
    var cookie = new CookieArkantas(nome);
    return cookie;
};
CookieArkantas = function (name) {
    this.name = name;

    this.set = function createCookie(value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=" + window.location.pathname;
    }

    this.get = function () {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    this.erase = function () {
        this.set("", -1);
    }
};


/**
 * ----------------------------------------
 * GET Url - Similar a sintaxe do PHP
 * Shortcut: $get(text)
 * @version 0.2.1
 * @license Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)
 * @copyright
 */
function getURLParam(strParamName) {
    var strReturn = "";
    var strHref = window.location.href;
    if (strHref.indexOf("?") > -1) {
        var strQueryString = strHref.substr(strHref.indexOf("?")).toLowerCase();
        var aQueryString = strQueryString.split("&");
        for (var iParam = 0; iParam < aQueryString.length; iParam++) {
            if (
                aQueryString[iParam].indexOf(strParamName.toLowerCase() + "=") > -1) {
                var aParam = aQueryString[iParam].split("=");
                strReturn = aParam[1];
                break;
            }
        }
    }
    //Linha abaixo foi inserida, para não gerar bugs no FormReveal do Ginga
    strReturn = strReturn.replace("#", "");
    return unescape(strReturn);
}
$get = function (param) {
    return getURLParam(param);
}
/**
 * ----------------------------------------
 * toArray()
 * Shortcut: .toArray();
 * @date 24.Fev.2010
 * @version 0.2.1
 * @license Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)
 * @copyright
 */

/**
 * ----------------------------------------
 * RGB to HEXA
 * Shortcut: .toHex();
 * @date 24.Fev.2010
 * @version 0.2.1
 * @license Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)
 * @copyright
 */
function toHex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return parseInt(x).toString(16);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}
/**
 * ----------------------------------------
 * Plugin PutCursorAtEnd
 * Usage: $("#inputElement").putCursorAtEnd();
 * @date 23.Ago.2011
 * @version 0.5.0
 * @license Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)
 * @copyright
 */
(function ($) {
    jQuery.fn.putCursorAtEnd = function () {
        return this.each(function () {
            $(this).focus();

            // Caso exista suporte. Chrome, Safari, Firefox
            if (this.setSelectionRange) {
                var len = $(this).val().length * 2;
                this.setSelectionRange(len, len);
            }
            else {
                if (this.createTextRange) {
                    var len = $(this).val().length;
                    var range = this.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', len);
                    range.moveStart('character', len);
                    range.select();
                }
                else {
                    $(this).val($(this).val());
                    console.log("else else");
                }
            }

            // Necessário para alguns browsers.
            this.scrollTop = 999999;
        });
    };
})(jQuery);

JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        // simple data type
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    }
    else {
        // recurse array or object
        var n, v, json = [], arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n]; t = typeof (v);
            if (t == "string") v = '"' + v + '"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

