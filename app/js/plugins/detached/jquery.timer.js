/**
 * jquery.timer.js
 *
 * Copyright (c) 2011 Jason Chavannes <jason.chavannes@gmail.com>
 *
 * http://jchavannes.com/jquery-timer
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 */

!function(t){function i(t,e,s){return this.constructor!=i||this.init?new i(t,e,s):(this.set(t,e,s),this)}t.timer=i,i.prototype.set=function(t,i,e){return this.init=!0,"object"==typeof t&&(t.time&&(i=t.time),t.autostart&&(e=t.autostart),t=t.action),"function"==typeof t&&(this.action=t),isNaN(i)||(this.intervalTime=i),e&&this.isReadyToStart()&&(this.isActive=!0,this.setTimer()),this},i.prototype.isReadyToStart=function(){var t=!this.active,i="function"==typeof this.action,e=!isNaN(this.intervalTime);return t&&i&&e},i.prototype.once=function(t){var i=this;return isNaN(t)?(i.action(),this):(setTimeout(function(){i.action()},t),this)},i.prototype.play=function(t){return this.isReadyToStart()&&(t?this.setTimer():this.setTimer(this.remaining),this.isActive=!0),this},i.prototype.pause=function(){return this.isActive&&(this.isActive=!1,this.remaining-=new Date-this.last,this.clearTimer()),this},i.prototype.stop=function(){return this.isActive=!1,this.remaining=this.intervalTime,this.clearTimer(),this},i.prototype.toggle=function(t){return this.isActive?this.pause():t?this.play(!0):this.play(),this},i.prototype.reset=function(){return this.isActive=!1,this.play(!0),this},i.prototype.clearTimer=function(){return clearTimeout(this.timeoutObject),this},i.prototype.setTimer=function(t){var i=this;return isNaN(t)&&(t=this.intervalTime),this.remaining=t,this.last=new Date,this.clearTimer(),this.timeoutObject=setTimeout(function(){i.execute()},t),this},i.prototype.execute=function(){if(this.isActive)try{this.action()}finally{this.setTimer()}return this}}(jQuery);
