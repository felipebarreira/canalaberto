/**
 * ----------------------------------------
 * Browser Kit JS (for Jquery)
 * Parte integrante do ZipWhig*

 * ----------------------------------------
 *
 * @date 01.Mai.2010
 * @version 1.0.5
 * @license Creative Commons Attribution License 3.0 (http://creativecommons.org/licenses/by/3.0/)
 * @copyright
 */
String.prototype.contains = function () {
	var resu = false;
	for (var i = 0; i < arguments.length; i++) {
		if (this.toLowerCase().indexOf(arguments[i].toLowerCase()) > -1) {
			resu = i + 1;
			break;
		}
	}
	return resu;
};

var _ua = navigator.userAgent;
var _vd = navigator.vendor;
var _pd = navigator.product;

var _browser_rv = (_ua.indexOf('rv:') > -1);
var _browser_op = (_ua.indexOf('Opera') > -1);
var _browser_ap = (_ua.indexOf('Apple') > -1);
var _browser_sf = (_ua.indexOf('Safari') > -1 && _vd.match(/Apple/));
var _browser_ie = (_ua.indexOf('MSIE') > -1);
var _browser_ic = (_ua.indexOf('Ice') > -1);
var _browser_cr = (_ua.indexOf('Chrome') > -1 && _vd.match(/Google/));
var _browser_pd = (_pd == 'Gecko');
var _browser_ff = (_vd == 'Firefox' || (_browser_pd && _ua.contains('Firefox', 'BonEcho', 'Paradiso') && !_ua.contains('Flock')));
var _browser_fk = (_browser_pd && _ua.contains('Flock') && !_browser_ff);
var _browser_ns = (_vd == 'Netscape');

function isMozilla() { // Mozilla Suite Browser
	return (_browser_pd && _browser_rv && !(_browser_ff || _browser_ns || _browser_fk || _browser_ic || _browser_ap));
};

function isNetscape() { // Netscape 6 or higher
	return (_browser_pd && _browser_ns);
};

function isFirefox() { // Mozilla Firefox
	return (_browser_pd && (_browser_ff || !_browser_rv) && !(_browser_fk || _browser_ap || _browser_cr));
};

function isFlock() {
	return (_browser_pd && _browser_fk);
};

function isIce() {
	return (_browser_pd && _browser_ic);
};

function isGecko() {
	return _browser_pd;
};

function isSafari() {
	return _browser_sf;
};

function isChrome() {
	return _browser_cr;
};

function isApple() {
	return _browser_ap;
};

function isOpera() { // Opera browser
	return (!_browser_pd && _browser_op);
};

function isIE() { // Internet Explorer
	return (_browser_ie && !_browser_pd && !_browser_op);
};

function otherBrowsers() {
	return (!(isMozilla() || isNetscape() || isFirefox() || isFlock() || isIce() || isOpera() || isIE() || isChrome() || isSafari()));
};

getBrowserName = function () {
	var b = "None";
	if (isFirefox() && navigator.userAgent.indexOf("Firefox") > -1) b = "Firefox"; //Firefox
	else if (isMozilla()) b = "Mozilla"; //Mozilla
	else if (isNetscape()) b = "Netscape"; //Netscape
	else if (isOpera()) b = "Opera"; //Opera
	else if (isIE()) b = "Internet Explorer"; //Internet Explorer
	else if (isFlock()) b = "Flock"; //Flock
	else if (isFirefox() && navigator.userAgent.indexOf("Firefox") == -1) b = "Mozilla Family"; //Outro browser (fam�lia Mozilla)
	else if (isSafari()) b = "Safari"; //Safari
	else if (isChrome()) b = "Chrome"; //Google Chrome
	else b = "Other"; //N�o identificado

	return b;
};

getBrowserNumber = function () {
	var b = 0;
	if (isFirefox() && navigator.userAgent.indexOf("Firefox") > -1) b = 1; //Firefox
	else if (isMozilla()) b = 2; //Mozilla
	else if (isNetscape()) b = 3; //Netscape
	else if (isOpera()) b = 4; //Opera
	else if (isIE()) b = 5; //Internet Explorer
	else if (isFlock()) b = 6; //Flock
	else if (isFirefox() && navigator.userAgent.indexOf("Firefox") == -1) b = 7; //Outro browser (fam�lia Mozilla)
	else if (isSafari()) b = 8; //Safari
	else if (isChrome()) b = 9; //Google Chrome
	else b = 10; //N�o identificado

	return b;
};

getBrowserVersion = function () {
	var browser;
	var v;

	browser = getBrowserNumber();

	if (browser == 5) { //Identifica vers�o IEs
		var temp = navigator.userAgent;
		var sea = /;/g;
		temp = temp.replace(sea, "|");
		temp2 = temp.split("MSIE");
		temp3 = temp2[1].split("|", 1);
		return temp3;
	}
	else if (browser == 1) { //Identifica vers�o Firefox
		var temp = navigator.userAgent;
		var sea = / |\//g;
		temp = temp.replace(sea, ";");
		temp2 = temp.split(";");
		templ = temp2.length;
		return temp2[templ - 1];
	}
	else if (browser == 4) { //Identifica vers�o Opera
		var temp = navigator.userAgent;
		var sea = / |\//g;
		temp = temp.replace(sea, ";");
		temp2 = temp.split(";");
		templ = temp2.length;
		return temp2[templ - 1];
	}
	else return false;
};

$browser = function (acao) {
	if (acao == "name") return getBrowserName();
	else if (acao == "code") return getBrowserNumber();
	else if (acao == "version") return getBrowserVersion();
	else if (acao == "isArcaic") {
		if (getBrowserNumber() == 5 && getBrowserVersion() <= 6.0) return true;
		else return false;
	}
}
isCapable = function () {
	var sta = $browser('isArcaic');
	if (sta) return false
	else return true
};
isArcaic = function () {
	var sta = $browser('isArcaic');
	if (sta) return true
	else return false
};
