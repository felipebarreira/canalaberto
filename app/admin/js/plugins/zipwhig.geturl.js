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