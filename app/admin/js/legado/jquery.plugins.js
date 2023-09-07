


/*
* ImageFollowMouse plugin for jQuery
* v1.0
* Image Follow Mouse move
*
* By Xing Wang, http://AskBargains.com
*
* Please use as you wish at your own risk.
*
*/

/*
* Usage:
*
* From JavaScript, use:
*     $(<select>).ImageFollowMouse({src: <S>, width: <W>, height: <H>, topY:<Y> ,leftX :<X> ,backgroundColor :<C>, Padding:<P>});
*     where:
*       <select> is the DOM node selector, e.g. "p"
*	<S> is the src of Image 
*       <W> is the Width of Image (optional)
*       <H> is the Height of Image (optional)
*       <Y> is the Image close to the mouse poing of y lever (optional)
*       <X> is the Image close to the mouse poing of x lever (optional)
*       <C> is the background color of Image (optional)
*       <P> is the Image Padding(optional)
* 
*Example :
*     
*     <img src="images/happy.jpg" id="selectedImage"  width="88px" style="border:2px solid #ccc; background-color:#fff; padding:2px" />
*    
*     ///////////////////////////////////////////////////////
*
*     <script type="text/javascript">
*     $(document).ready(function() {
*     $("#selectedImage").ImageFollowMouse({ 
*            src: 'images/happy.jpg',
*            Padding:'28px'
*         });  
*     }); 
*     </script>
*
*    
*/

(function ($) {

    $.fn.ImageFollowMouse = function (params) {

        params = $.extend({ src: null, width: null, height: null, topY: null, leftX: null, backgroundColor: null, Padding: null }, params);

        this.each(function () {

            var imgWidth;
            var imgHeight;
            var $t = $(this);
            var X = 15;
            var Y = 10;
            var bColor = 'fff';
            var iPadding = '8px';

            $("<img id='MouseImage' />").attr({ src: params.src }).prependTo('body');
            $("#MouseImage")
                .addClass("miClass")
                .css('position', 'absolute')
                ;
            if (params.width != null) {
                imgWidth = params.width;
                $("#MouseImage").css('width', imgWidth);
            }
            if (params.height != null) {
                imgHeight = params.height;
                $("#MouseImage").css('height', imgHeight);
            }


            if (params.topY != null) X = params.topY;
            if (params.leftX != null) Y = params.leftX;
            if (params.backgroundColor != null) bColor = params.backgroundColor;
            if (params.Padding != null) iPadding = params.Padding;

            $t.bind('mousemove.mouse_trail', function (e) {
                $(".miClass")
                    .css('top', e.pageY + X)
                    .css('left', e.pageX + Y)
                    .css('z-index', 9999)
                    ;
            });

            $t.bind('mouseout.mouse_trail', function (e) {

            });
        });


        return this;
    };
})(jQuery);
var MouseAjax = function () {
    this.init = function () {
        $(document).ImageFollowMouse({ src: 'img/ajax-loader2.gif' });
        $("#MouseImage").css("visibility", "hidden").hide();
    }
    this.show = function () {
        $("#MouseImage").css("visibility", "visible").show();
    }
    this.hide = function () {
        $("#MouseImage").css("visibility", "hidden").hide();
    }

}
/*
 * TableDnD plug-in for JQuery, allows you to drag and drop table rows
 * You can set up various options to control how the system will work
 * Copyright (c) Denis Howlett <denish@isocra.com>
 * Licensed like jQuery, see http://docs.jquery.com/License.
 *
 * Configuration options:
 * 
 * onDragStyle
 *     This is the style that is assigned to the row during drag. There are limitations to the styles that can be
 *     associated with a row (such as you can't assign a border--well you can, but it won't be
 *     displayed). (So instead consider using onDragClass.) The CSS style to apply is specified as
 *     a map (as used in the jQuery css(...) function).
 * onDropStyle
 *     This is the style that is assigned to the row when it is dropped. As for onDragStyle, there are limitations
 *     to what you can do. Also this replaces the original style, so again consider using onDragClass which
 *     is simply added and then removed on drop.
 * onDragClass
 *     This class is added for the duration of the drag and then removed when the row is dropped. It is more
 *     flexible than using onDragStyle since it can be inherited by the row cells and other content. The default
 *     is class is tDnD_whileDrag. So to use the default, simply customise this CSS class in your
 *     stylesheet.
 * onDrop
 *     Pass a function that will be called when the row is dropped. The function takes 2 parameters: the table
 *     and the row that was dropped. You can work out the new order of the rows by using
 *     table.rows.
 * onDragStart
 *     Pass a function that will be called when the user starts dragging. The function takes 2 parameters: the
 *     table and the row which the user has started to drag.
 * onAllowDrop
 *     Pass a function that will be called as a row is over another row. If the function returns true, allow 
 *     dropping on that row, otherwise not. The function takes 2 parameters: the dragged row and the row under
 *     the cursor. It returns a boolean: true allows the drop, false doesn't allow it.
 * scrollAmount
 *     This is the number of pixels to scroll if the user moves the mouse cursor to the top or bottom of the
 *     window. The page should automatically scroll up or down as appropriate (tested in IE6, IE7, Safari, FF2,
 *     FF3 beta
 * dragHandle
 *     This is the name of a class that you assign to one or more cells in each row that is draggable. If you
 *     specify this class, then you are responsible for setting cursor: move in the CSS and only these cells
 *     will have the drag behaviour. If you do not specify a dragHandle, then you get the old behaviour where
 *     the whole row is draggable.
 * 
 * Other ways to control behaviour:
 *
 * Add class="nodrop" to any rows for which you don't want to allow dropping, and class="nodrag" to any rows
 * that you don't want to be draggable.
 *
 * Inside the onDrop method you can also call $.tableDnD.serialize() this returns a string of the form
 * <tableID>[]=<rowID1>&<tableID>[]=<rowID2> so that you can send this back to the server. The table must have
 * an ID as must all the rows.
 *
 * Other methods:
 *
 * $("...").tableDnDUpdate() 
 * Will update all the matching tables, that is it will reapply the mousedown method to the rows (or handle cells).
 * This is useful if you have updated the table rows using Ajax and you want to make the table draggable again.
 * The table maintains the original configuration (so you don't have to specify it again).
 *
 * $("...").tableDnDSerialize()
 * Will serialize and return the serialized string as above, but for each of the matching tables--so it can be
 * called from anywhere and isn't dependent on the currentTable being set up correctly before calling
 *
 * Known problems:
 * - Auto-scoll has some problems with IE7  (it scrolls even when it shouldn't), work-around: set scrollAmount to 0
 * 
 * Version 0.2: 2008-02-20 First public version
 * Version 0.3: 2008-02-07 Added onDragStart option
 *                         Made the scroll amount configurable (default is 5 as before)
 * Version 0.4: 2008-03-15 Changed the noDrag/noDrop attributes to nodrag/nodrop classes
 *                         Added onAllowDrop to control dropping
 *                         Fixed a bug which meant that you couldn't set the scroll amount in both directions
 *                         Added serialize method
 * Version 0.5: 2008-05-16 Changed so that if you specify a dragHandle class it doesn't make the whole row
 *                         draggable
 *                         Improved the serialize method to use a default (and settable) regular expression.
 *                         Added tableDnDupate() and tableDnDSerialize() to be called when you are outside the table
 */
jQuery.tableDnD = {
    /** Keep hold of the current table being dragged */
    currentTable: null,
    /** Keep hold of the current drag object if any */
    dragObject: null,
    /** The current mouse offset */
    mouseOffset: null,
    /** Remember the old value of Y so that we don't do too much processing */
    oldY: 0,

    /** Actually build the structure */
    build: function (options) {
        // Set up the defaults if any

        this.each(function () {
            // This is bound to each matching table, set up the defaults and override with user options
            this.tableDnDConfig = jQuery.extend({
                onDragStyle: null,
                onDropStyle: null,
                // Add in the default class for whileDragging
                onDragClass: "tDnD_whileDrag",
                onDrop: null,
                onDragStart: null,
                scrollAmount: 5,
                serializeRegexp: /[^\-]*$/, // The regular expression to use to trim row IDs
                serializeParamName: null, // If you want to specify another parameter name instead of the table ID
                dragHandle: null // If you give the name of a class here, then only Cells with this class will be draggable
            }, options || {});
            // Now make the rows draggable
            jQuery.tableDnD.makeDraggable(this);
        });

        // Now we need to capture the mouse up and mouse move event
        // We can use bind so that we don't interfere with other event handlers
        jQuery(document)
            .bind('mousemove', jQuery.tableDnD.mousemove)
            .bind('mouseup', jQuery.tableDnD.mouseup);

        // Don't break the chain
        return this;
    },

    /** This function makes all the rows on the table draggable apart from those marked as "NoDrag" */
    makeDraggable: function (table) {
        var config = table.tableDnDConfig;
        if (table.tableDnDConfig.dragHandle) {
            // We only need to add the event to the specified cells
            var cells = jQuery("td." + table.tableDnDConfig.dragHandle, table);
            cells.each(function () {
                // The cell is bound to "this"
                jQuery(this).mousedown(function (ev) {
                    jQuery.tableDnD.dragObject = this.parentNode;
                    jQuery.tableDnD.currentTable = table;
                    jQuery.tableDnD.mouseOffset = jQuery.tableDnD.getMouseOffset(this, ev);
                    if (config.onDragStart) {
                        // Call the onDrop method if there is one
                        config.onDragStart(table, this);
                    }
                    return false;
                });
            })
        } else {
            // For backwards compatibility, we add the event to the whole row
            var rows = jQuery("tr", table); // get all the rows as a wrapped set
            rows.each(function () {
                // Iterate through each row, the row is bound to "this"
                var row = jQuery(this);
                if (!row.hasClass("nodrag")) {
                    row.mousedown(function (ev) {
                        if (ev.target.tagName == "TD") {
                            jQuery.tableDnD.dragObject = this;
                            jQuery.tableDnD.currentTable = table;
                            jQuery.tableDnD.mouseOffset = jQuery.tableDnD.getMouseOffset(this, ev);
                            if (config.onDragStart) {
                                // Call the onDrop method if there is one
                                config.onDragStart(table, this);
                            }
                            return false;
                        }
                    }).css("cursor", "-moz-grab"); // Store the tableDnD object
                }
            });
        }
    },

    updateTables: function () {
        this.each(function () {
            // this is now bound to each matching table
            if (this.tableDnDConfig) {
                jQuery.tableDnD.makeDraggable(this);
            }
        })
    },

    /** Get the mouse coordinates from the event (allowing for browser differences) */
    mouseCoords: function (ev) {
        if (ev.pageX || ev.pageY) {
            return { x: ev.pageX, y: ev.pageY };
        }
        return {
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.clientY + document.body.scrollTop - document.body.clientTop
        };
    },

    /** Given a target element and a mouse event, get the mouse offset from that element.
        To do this we need the element's position and the mouse position */
    getMouseOffset: function (target, ev) {
        ev = ev || window.event;

        var docPos = this.getPosition(target);
        var mousePos = this.mouseCoords(ev);
        return { x: mousePos.x - docPos.x, y: mousePos.y - docPos.y };
    },

    /** Get the position of an element by going up the DOM tree and adding up all the offsets */
    getPosition: function (e) {
        var left = 0;
        var top = 0;
        /** Safari fix -- thanks to Luis Chato for this! */
        if (e.offsetHeight == 0) {
            /** Safari 2 doesn't correctly grab the offsetTop of a table row
            this is detailed here:
            http://jacob.peargrove.com/blog/2006/technical/table-row-offsettop-bug-in-safari/
            the solution is likewise noted there, grab the offset of a table cell in the row - the firstChild.
            note that firefox will return a text node as a first child, so designing a more thorough
            solution may need to take that into account, for now this seems to work in firefox, safari, ie */
            e = e.firstChild; // a table cell
        }

        while (e.offsetParent) {
            left += e.offsetLeft;
            top += e.offsetTop;
            e = e.offsetParent;
        }

        left += e.offsetLeft;
        top += e.offsetTop;

        return { x: left, y: top };
    },

    mousemove: function (ev) {
        if (jQuery.tableDnD.dragObject == null) {
            return;
        }

        var dragObj = jQuery(jQuery.tableDnD.dragObject);
        var config = jQuery.tableDnD.currentTable.tableDnDConfig;
        var mousePos = jQuery.tableDnD.mouseCoords(ev);
        var y = mousePos.y - jQuery.tableDnD.mouseOffset.y;
        //auto scroll the window
        var yOffset = window.pageYOffset;
        if (document.all) {
            // Windows version
            //yOffset=document.body.scrollTop;
            if (typeof document.compatMode != 'undefined' &&
                document.compatMode != 'BackCompat') {
                yOffset = document.documentElement.scrollTop;
            }
            else if (typeof document.body != 'undefined') {
                yOffset = document.body.scrollTop;
            }

        }

        if (mousePos.y - yOffset < config.scrollAmount) {
            window.scrollBy(0, -config.scrollAmount);
        } else {
            var windowHeight = window.innerHeight ? window.innerHeight
                : document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
            if (windowHeight - (mousePos.y - yOffset) < config.scrollAmount) {
                window.scrollBy(0, config.scrollAmount);
            }
        }


        if (y != jQuery.tableDnD.oldY) {
            // work out if we're going up or down...
            var movingDown = y > jQuery.tableDnD.oldY;
            // update the old value
            jQuery.tableDnD.oldY = y;
            // update the style to show we're dragging
            if (config.onDragClass) {
                dragObj.addClass(config.onDragClass);
            } else {
                dragObj.css(config.onDragStyle);
            }
            // If we're over a row then move the dragged row to there so that the user sees the
            // effect dynamically
            var currentRow = jQuery.tableDnD.findDropTargetRow(dragObj, y);
            if (currentRow) {
                // to-do worry about what happens when there are multiple TBODIES
                if (movingDown && jQuery.tableDnD.dragObject != currentRow) {
                    jQuery.tableDnD.dragObject.parentNode.insertBefore(jQuery.tableDnD.dragObject, currentRow.nextSibling);
                } else if (!movingDown && jQuery.tableDnD.dragObject != currentRow) {
                    jQuery.tableDnD.dragObject.parentNode.insertBefore(jQuery.tableDnD.dragObject, currentRow);
                }
            }
        }

        return false;
    },

    /** We're only worried about the y position really, because we can only move rows up and down */
    findDropTargetRow: function (draggedRow, y) {
        var rows = jQuery.tableDnD.currentTable.rows;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var rowY = this.getPosition(row).y;
            var rowHeight = parseInt(row.offsetHeight) / 2;
            if (row.offsetHeight == 0) {
                rowY = this.getPosition(row.firstChild).y;
                rowHeight = parseInt(row.firstChild.offsetHeight) / 2;
            }
            // Because we always have to insert before, we need to offset the height a bit
            if ((y > rowY - rowHeight) && (y < (rowY + rowHeight))) {
                // that's the row we're over
                // If it's the same as the current row, ignore it
                if (row == draggedRow) { return null; }
                var config = jQuery.tableDnD.currentTable.tableDnDConfig;
                if (config.onAllowDrop) {
                    if (config.onAllowDrop(draggedRow, row)) {
                        return row;
                    } else {
                        return null;
                    }
                } else {
                    // If a row has nodrop class, then don't allow dropping (inspired by John Tarr and Famic)
                    var nodrop = jQuery(row).hasClass("nodrop");
                    if (!nodrop) {
                        return row;
                    } else {
                        return null;
                    }
                }
                return row;
            }
        }
        return null;
    },

    mouseup: function (e) {
        if (jQuery.tableDnD.currentTable && jQuery.tableDnD.dragObject) {
            var droppedRow = jQuery.tableDnD.dragObject;
            var config = jQuery.tableDnD.currentTable.tableDnDConfig;
            // If we have a dragObject, then we need to release it,
            // The row will already have been moved to the right place so we just reset stuff
            if (config.onDragClass) {
                jQuery(droppedRow).removeClass(config.onDragClass);
            } else {
                jQuery(droppedRow).css(config.onDropStyle);
            }
            jQuery.tableDnD.dragObject = null;
            if (config.onDrop) {
                // Call the onDrop method if there is one
                config.onDrop(jQuery.tableDnD.currentTable, droppedRow);
            }
            jQuery.tableDnD.currentTable = null; // let go of the table too
        }
    },

    serialize: function () {
        if (jQuery.tableDnD.currentTable) {
            return jQuery.tableDnD.serializeTable(jQuery.tableDnD.currentTable);
        } else {
            return "Error: No Table id set, you need to set an id on your table and every row";
        }
    },

    serializeTable: function (table) {
        var result = "";
        var tableId = table.id;
        var rows = table.rows;
        for (var i = 0; i < rows.length; i++) {
            if (result.length > 0) result += "&";
            var rowId = rows[i].id;
            if (rowId && rowId && table.tableDnDConfig && table.tableDnDConfig.serializeRegexp) {
                rowId = rowId.match(table.tableDnDConfig.serializeRegexp)[0];
            }

            result += tableId + '[]=' + rowId;
        }
        return result;
    },

    serializeTables: function () {
        var result = "";
        this.each(function () {
            // this is now bound to each matching table
            result += jQuery.tableDnD.serializeTable(this);
        });
        return result;
    }

}

jQuery.fn.extend(
    {
        tableDnD: jQuery.tableDnD.build,
        tableDnDUpdate: jQuery.tableDnD.updateTables,
        tableDnDSerialize: jQuery.tableDnD.serializeTables
    }
);

/*
 * jQuery Tooltip plugin 1.3
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-tooltip/
 * http://docs.jquery.com/Plugins/Tooltip
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id: jquery.tooltip.js 5741 2008-06-21 15:22:16Z joern.zaefferer $
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */; (function ($) {
    var helper = {}, current, title, tID, IE = $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent), track = false; $.tooltip = { blocked: false, defaults: { delay: 200, fade: false, showURL: true, extraClass: "", top: 15, left: 15, id: "tooltip" }, block: function () { $.tooltip.blocked = !$.tooltip.blocked; } }; $.fn.extend({ tooltip: function (settings) { settings = $.extend({}, $.tooltip.defaults, settings); createHelper(settings); return this.each(function () { $.data(this, "tooltip", settings); this.tOpacity = helper.parent.css("opacity"); this.tooltipText = this.title; $(this).removeAttr("title");/*this.alt="";*/ }).mouseover(save).mouseout(hide).click(hide); }, fixPNG: IE ? function () { return this.each(function () { var image = $(this).css('backgroundImage'); if (image.match(/^url\(["']?(.*\.png)["']?\)$/i)) { image = RegExp.$1; $(this).css({ 'backgroundImage': 'none', 'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')" }).each(function () { var position = $(this).css('position'); if (position != 'absolute' && position != 'relative') $(this).css('position', 'relative'); }); } }); } : function () { return this; }, unfixPNG: IE ? function () { return this.each(function () { $(this).css({ 'filter': '', backgroundImage: '' }); }); } : function () { return this; }, hideWhenEmpty: function () { return this.each(function () { $(this)[$(this).html() ? "show" : "hide"](); }); }, url: function () { return this.attr('href') || this.attr('src'); } }); function createHelper(settings) { if (helper.parent) return; helper.parent = $('<div id="' + settings.id + '"><h3></h3><div class="body"></div><div class="url"></div><span></span></div>').appendTo(document.body).hide(); if ($.fn.bgiframe) helper.parent.bgiframe(); helper.title = $('h3', helper.parent); helper.body = $('div.body', helper.parent); helper.url = $('div.url', helper.parent); } function settings(element) { return $.data(element, "tooltip"); } function handle(event) {
        if (settings(this).delay) tID = setTimeout(show, settings(this).delay); else
            show(); track = !!settings(this).track; $(document.body).bind('mousemove', update); update(event);
    } function save() {
        if ($.tooltip.blocked || this == current || (!this.tooltipText && !settings(this).bodyHandler)) return; current = this; title = this.tooltipText; if (settings(this).bodyHandler) { helper.title.hide(); var bodyContent = settings(this).bodyHandler.call(this); if (bodyContent.nodeType || bodyContent.jquery) { helper.body.empty().append(bodyContent) } else { helper.body.html(bodyContent); } helper.body.show(); } else if (settings(this).showBody) { var parts = title.split(settings(this).showBody); helper.title.html(parts.shift()).show(); helper.body.empty(); for (var i = 0, part; (part = parts[i]); i++) { if (i > 0) helper.body.append("<br/>"); helper.body.append(part); } helper.body.hideWhenEmpty(); } else { helper.title.html(title).show(); helper.body.hide(); } if (settings(this).showURL && $(this).url()) helper.url.html($(this).url().replace('http://', '')).show(); else
            helper.url.hide(); helper.parent.addClass(settings(this).extraClass); if (settings(this).fixPNG) helper.parent.fixPNG(); handle.apply(this, arguments);
    } function show() {
        tID = null; if ((!IE || !$.fn.bgiframe) && settings(current).fade) {
            if (helper.parent.is(":animated")) helper.parent.stop().show().fadeTo(settings(current).fade, current.tOpacity); else
                helper.parent.is(':visible') ? helper.parent.fadeTo(settings(current).fade, current.tOpacity) : helper.parent.fadeIn(settings(current).fade);
        } else { helper.parent.show(); } update();
    } function update(event) { if ($.tooltip.blocked) return; if (event && event.target.tagName == "OPTION") { return; } if (!track && helper.parent.is(":visible")) { $(document.body).unbind('mousemove', update) } if (current == null) { $(document.body).unbind('mousemove', update); return; } helper.parent.removeClass("viewport-right").removeClass("viewport-bottom"); var left = helper.parent[0].offsetLeft; var top = helper.parent[0].offsetTop; if (event) { left = event.pageX + settings(current).left; top = event.pageY + settings(current).top; var right = 'auto'; if (settings(current).positionLeft) { right = $(window).width() - left; left = 'auto'; } helper.parent.css({ left: left, right: right, top: top }); } var v = viewport(), h = helper.parent[0]; if (v.x + v.cx < h.offsetLeft + h.offsetWidth) { left -= h.offsetWidth + 20 + settings(current).left; helper.parent.css({ left: left + 'px' }).addClass("viewport-right"); } if (v.y + v.cy < h.offsetTop + h.offsetHeight) { top -= h.offsetHeight + 20 + settings(current).top; helper.parent.css({ top: top + 'px' }).addClass("viewport-bottom"); } } function viewport() { return { x: $(window).scrollLeft(), y: $(window).scrollTop(), cx: $(window).width(), cy: $(window).height() }; } function hide(event) {
        if ($.tooltip.blocked) return; if (tID) clearTimeout(tID); current = null; var tsettings = settings(this); function complete() { helper.parent.removeClass(tsettings.extraClass).hide().css("opacity", ""); } if ((!IE || !$.fn.bgiframe) && tsettings.fade) {
            if (helper.parent.is(':animated')) helper.parent.stop().fadeTo(tsettings.fade, 0, complete); else
                helper.parent.stop().fadeOut(tsettings.fade, complete);
        } else
            complete(); if (settings(this).fixPNG) helper.parent.unfixPNG();
    }
})(jQuery);


/* TIMEENTRY
    http://keith-wood.name/timeEntry.html
   Time entry for jQuery v1.4.9.
   Written by Keith Wood (kbwood{at}iinet.com.au) June 2007.
   Dual licensed under the GPL (http://dev.jquery.com/browser/trunk/jquery/GPL-LICENSE.txt) and 
   MIT (http://dev.jquery.com/browser/trunk/jquery/MIT-LICENSE.txt) licenses. 
   Please attribute the author if you use it. */
(function ($) { function TimeEntry() { this._disabledInputs = []; this.regional = []; this.regional[''] = { show24Hours: false, separator: ':', ampmPrefix: '', ampmNames: ['AM', 'PM'], spinnerTexts: ['Now', 'Previous field', 'Next field', 'Increment', 'Decrement'] }; this._defaults = { appendText: '', showSeconds: false, timeSteps: [1, 1, 1], initialField: 0, useMouseWheel: true, defaultTime: null, minTime: null, maxTime: null, spinnerImage: 'spinnerDefault.png', spinnerSize: [20, 20, 8], spinnerBigImage: '', spinnerBigSize: [40, 40, 16], spinnerIncDecOnly: false, spinnerRepeat: [500, 250], beforeShow: null, beforeSetTime: null }; $.extend(this._defaults, this.regional['']) } var m = 'timeEntry'; $.extend(TimeEntry.prototype, { markerClassName: 'hasTimeEntry', setDefaults: function (a) { extendRemove(this._defaults, a || {}); return this }, _connectTimeEntry: function (b, c) { var d = $(b); if (d.hasClass(this.markerClassName)) { return } var e = {}; e.options = $.extend({}, c); e._selectedHour = 0; e._selectedMinute = 0; e._selectedSecond = 0; e._field = 0; e.input = $(b); $.data(b, m, e); var f = this._get(e, 'spinnerImage'); var g = this._get(e, 'spinnerText'); var h = this._get(e, 'spinnerSize'); var i = this._get(e, 'appendText'); var j = (!f ? null : $('<span class="timeEntry_control" style="display: inline-block; ' + 'background: url(\'' + f + '\') 0 0 no-repeat; ' + 'width: ' + h[0] + 'px; height: ' + h[1] + 'px;' + ($.browser.mozilla && $.browser.version < '1.9' ? ' padding-left: ' + h[0] + 'px; padding-bottom: ' + (h[1] - 18) + 'px;' : '') + '"></span>')); d.wrap('<span class="timeEntry_wrap"></span>').after(i ? '<span class="timeEntry_append">' + i + '</span>' : '').after(j || ''); d.addClass(this.markerClassName).bind('focus.timeEntry', this._doFocus).bind('blur.timeEntry', this._doBlur).bind('click.timeEntry', this._doClick).bind('keydown.timeEntry', this._doKeyDown).bind('keypress.timeEntry', this._doKeyPress); if ($.browser.mozilla) { d.bind('input.timeEntry', function (a) { $.timeEntry._parseTime(e) }) } if ($.browser.msie) { d.bind('paste.timeEntry', function (a) { setTimeout(function () { $.timeEntry._parseTime(e) }, 1) }) } if (this._get(e, 'useMouseWheel') && $.fn.mousewheel) { d.mousewheel(this._doMouseWheel) } if (j) { j.mousedown(this._handleSpinner).mouseup(this._endSpinner).mouseover(this._expandSpinner).mouseout(this._endSpinner).mousemove(this._describeSpinner) } }, _enableTimeEntry: function (a) { this._enableDisable(a, false) }, _disableTimeEntry: function (a) { this._enableDisable(a, true) }, _enableDisable: function (b, c) { var d = $.data(b, m); if (!d) { return } b.disabled = c; if (b.nextSibling && b.nextSibling.nodeName.toLowerCase() == 'span') { $.timeEntry._changeSpinner(d, b.nextSibling, (c ? 5 : -1)) } $.timeEntry._disabledInputs = $.map($.timeEntry._disabledInputs, function (a) { return (a == b ? null : a) }); if (c) { $.timeEntry._disabledInputs.push(b) } }, _isDisabledTimeEntry: function (a) { return $.inArray(a, this._disabledInputs) > -1 }, _changeTimeEntry: function (a, b, c) { var d = $.data(a, m); if (d) { if (typeof b == 'string') { var e = b; b = {}; b[e] = c } var f = this._extractTime(d); extendRemove(d.options, b || {}); if (f) { this._setTime(d, new Date(0, 0, 0, f[0], f[1], f[2])) } } $.data(a, m, d) }, _destroyTimeEntry: function (b) { $input = $(b); if (!$input.hasClass(this.markerClassName)) { return } $input.removeClass(this.markerClassName).unbind('.timeEntry'); if ($.fn.mousewheel) { $input.unmousewheel() } this._disabledInputs = $.map(this._disabledInputs, function (a) { return (a == b ? null : a) }); $input.parent().replaceWith($input); $.removeData(b, m) }, _setTimeTimeEntry: function (a, b) { var c = $.data(a, m); if (c) { if (b === null || b === '') { c.input.val('') } else { this._setTime(c, b ? (typeof b == 'object' ? new Date(b.getTime()) : b) : null) } } }, _getTimeTimeEntry: function (a) { var b = $.data(a, m); var c = (b ? this._extractTime(b) : null); return (!c ? null : new Date(0, 0, 0, c[0], c[1], c[2])) }, _getOffsetTimeEntry: function (a) { var b = $.data(a, m); var c = (b ? this._extractTime(b) : null); return (!c ? 0 : (c[0] * 3600 + c[1] * 60 + c[2]) * 1000) }, _doFocus: function (a) { var b = (a.nodeName && a.nodeName.toLowerCase() == 'input' ? a : this); if ($.timeEntry._lastInput == b || $.timeEntry._isDisabledTimeEntry(b)) { $.timeEntry._focussed = false; return } var c = $.data(b, m); $.timeEntry._focussed = true; $.timeEntry._lastInput = b; $.timeEntry._blurredInput = null; var d = $.timeEntry._get(c, 'beforeShow'); extendRemove(c.options, (d ? d.apply(b, [b]) : {})); $.data(b, m, c); $.timeEntry._parseTime(c); setTimeout(function () { $.timeEntry._showField(c) }, 10) }, _doBlur: function (a) { $.timeEntry._blurredInput = $.timeEntry._lastInput; $.timeEntry._lastInput = null }, _doClick: function (b) { var c = b.target; var d = $.data(c, m); if (!$.timeEntry._focussed) { var e = $.timeEntry._get(d, 'separator').length + 2; d._field = 0; if (c.selectionStart != null) { for (var f = 0; f <= Math.max(1, d._secondField, d._ampmField); f++) { var g = (f != d._ampmField ? (f * e) + 2 : (d._ampmField * e) + $.timeEntry._get(d, 'ampmPrefix').length + $.timeEntry._get(d, 'ampmNames')[0].length); d._field = f; if (c.selectionStart < g) { break } } } else if (c.createTextRange) { var h = $(b.srcElement); var i = c.createTextRange(); var j = function (a) { return { thin: 2, medium: 4, thick: 6 }[a] || a }; var k = b.clientX + document.documentElement.scrollLeft - (h.offset().left + parseInt(j(h.css('border-left-width')), 10)) - i.offsetLeft; for (var f = 0; f <= Math.max(1, d._secondField, d._ampmField); f++) { var g = (f != d._ampmField ? (f * e) + 2 : (d._ampmField * e) + $.timeEntry._get(d, 'ampmPrefix').length + $.timeEntry._get(d, 'ampmNames')[0].length); i.collapse(); i.moveEnd('character', g); d._field = f; if (k < i.boundingWidth) { break } } } } $.data(c, m, d); $.timeEntry._showField(d); $.timeEntry._focussed = false }, _doKeyDown: function (a) { if (a.keyCode >= 48) { return true } var b = $.data(a.target, m); switch (a.keyCode) { case 9: return (a.shiftKey ? $.timeEntry._changeField(b, -1, true) : $.timeEntry._changeField(b, +1, true)); case 35: if (a.ctrlKey) { $.timeEntry._setValue(b, '') } else { b._field = Math.max(1, b._secondField, b._ampmField); $.timeEntry._adjustField(b, 0) } break; case 36: if (a.ctrlKey) { $.timeEntry._setTime(b) } else { b._field = 0; $.timeEntry._adjustField(b, 0) } break; case 37: $.timeEntry._changeField(b, -1, false); break; case 38: $.timeEntry._adjustField(b, +1); break; case 39: $.timeEntry._changeField(b, +1, false); break; case 40: $.timeEntry._adjustField(b, -1); break; case 46: $.timeEntry._setValue(b, ''); break }return false }, _doKeyPress: function (a) { var b = String.fromCharCode(a.charCode == undefined ? a.keyCode : a.charCode); if (b < ' ') { return true } var c = $.data(a.target, m); $.timeEntry._handleKeyPress(c, b); return false }, _doMouseWheel: function (a, b) { if ($.timeEntry._isDisabledTimeEntry(a.target)) { return } b = ($.browser.opera ? -b / Math.abs(b) : ($.browser.safari ? b / Math.abs(b) : b)); var c = $.data(a.target, m); c.input.focus(); if (!c.input.val()) { $.timeEntry._parseTime(c) } $.timeEntry._adjustField(c, b); a.preventDefault() }, _expandSpinner: function (b) { var c = $.timeEntry._getSpinnerTarget(b); var d = $.data($.timeEntry._getInput(c), m); if ($.timeEntry._isDisabledTimeEntry(d.input[0])) { return } var e = $.timeEntry._get(d, 'spinnerBigImage'); if (e) { d._expanded = true; var f = $(c).offset(); var g = null; $(c).parents().each(function () { var a = $(this); if (a.css('position') == 'relative' || a.css('position') == 'absolute') { g = a.offset() } return !g }); var h = $.timeEntry._get(d, 'spinnerSize'); var i = $.timeEntry._get(d, 'spinnerBigSize'); $('<div class="timeEntry_expand" style="position: absolute; left: ' + (f.left - (i[0] - h[0]) / 2 - (g ? g.left : 0)) + 'px; top: ' + (f.top - (i[1] - h[1]) / 2 - (g ? g.top : 0)) + 'px; width: ' + i[0] + 'px; height: ' + i[1] + 'px; background: transparent url(' + e + ') no-repeat 0px 0px; z-index: 10;"></div>').mousedown($.timeEntry._handleSpinner).mouseup($.timeEntry._endSpinner).mouseout($.timeEntry._endExpand).mousemove($.timeEntry._describeSpinner).insertAfter(c) } }, _getInput: function (a) { return $(a).siblings('.' + $.timeEntry.markerClassName)[0] }, _describeSpinner: function (a) { var b = $.timeEntry._getSpinnerTarget(a); var c = $.data($.timeEntry._getInput(b), m); b.title = $.timeEntry._get(c, 'spinnerTexts')[$.timeEntry._getSpinnerRegion(c, a)] }, _handleSpinner: function (a) { var b = $.timeEntry._getSpinnerTarget(a); var c = $.timeEntry._getInput(b); if ($.timeEntry._isDisabledTimeEntry(c)) { return } if (c == $.timeEntry._blurredInput) { $.timeEntry._lastInput = c; $.timeEntry._blurredInput = null } var d = $.data(c, m); $.timeEntry._doFocus(c); var e = $.timeEntry._getSpinnerRegion(d, a); $.timeEntry._changeSpinner(d, b, e); $.timeEntry._actionSpinner(d, e); $.timeEntry._timer = null; $.timeEntry._handlingSpinner = true; var f = $.timeEntry._get(d, 'spinnerRepeat'); if (e >= 3 && f[0]) { $.timeEntry._timer = setTimeout(function () { $.timeEntry._repeatSpinner(d, e) }, f[0]); $(b).one('mouseout', $.timeEntry._releaseSpinner).one('mouseup', $.timeEntry._releaseSpinner) } }, _actionSpinner: function (a, b) { if (!a.input.val()) { $.timeEntry._parseTime(a) } switch (b) { case 0: this._setTime(a); break; case 1: this._changeField(a, -1, false); break; case 2: this._changeField(a, +1, false); break; case 3: this._adjustField(a, +1); break; case 4: this._adjustField(a, -1); break } }, _repeatSpinner: function (a, b) { if (!$.timeEntry._timer) { return } $.timeEntry._lastInput = $.timeEntry._blurredInput; this._actionSpinner(a, b); this._timer = setTimeout(function () { $.timeEntry._repeatSpinner(a, b) }, this._get(a, 'spinnerRepeat')[1]) }, _releaseSpinner: function (a) { clearTimeout($.timeEntry._timer); $.timeEntry._timer = null }, _endExpand: function (a) { $.timeEntry._timer = null; var b = $.timeEntry._getSpinnerTarget(a); var c = $.timeEntry._getInput(b); var d = $.data(c, m); $(b).remove(); d._expanded = false }, _endSpinner: function (a) { $.timeEntry._timer = null; var b = $.timeEntry._getSpinnerTarget(a); var c = $.timeEntry._getInput(b); var d = $.data(c, m); if (!$.timeEntry._isDisabledTimeEntry(c)) { $.timeEntry._changeSpinner(d, b, -1) } if ($.timeEntry._handlingSpinner) { $.timeEntry._lastInput = $.timeEntry._blurredInput } if ($.timeEntry._lastInput && $.timeEntry._handlingSpinner) { $.timeEntry._showField(d) } $.timeEntry._handlingSpinner = false }, _getSpinnerTarget: function (a) { return a.target || a.srcElement }, _getSpinnerRegion: function (a, b) { var c = this._getSpinnerTarget(b); var d = ($.browser.opera || $.browser.safari ? $.timeEntry._findPos(c) : $(c).offset()); var e = ($.browser.safari ? $.timeEntry._findScroll(c) : [document.documentElement.scrollLeft || document.body.scrollLeft, document.documentElement.scrollTop || document.body.scrollTop]); var f = this._get(a, 'spinnerIncDecOnly'); var g = (f ? 99 : b.clientX + e[0] - d.left - ($.browser.msie ? 2 : 0)); var h = b.clientY + e[1] - d.top - ($.browser.msie ? 2 : 0); var i = this._get(a, (a._expanded ? 'spinnerBigSize' : 'spinnerSize')); var j = (f ? 99 : i[0] - 1 - g); var k = i[1] - 1 - h; if (i[2] > 0 && Math.abs(g - j) <= i[2] && Math.abs(h - k) <= i[2]) { return 0 } var l = Math.min(g, h, j, k); return (l == g ? 1 : (l == j ? 2 : (l == h ? 3 : 4))) }, _changeSpinner: function (a, b, c) { $(b).css('background-position', '-' + ((c + 1) * this._get(a, (a._expanded ? 'spinnerBigSize' : 'spinnerSize'))[0]) + 'px 0px') }, _findPos: function (a) { var b = curTop = 0; if (a.offsetParent) { b = a.offsetLeft; curTop = a.offsetTop; while (a = a.offsetParent) { var c = b; b += a.offsetLeft; if (b < 0) { b = c } curTop += a.offsetTop } } return { left: b, top: curTop } }, _findScroll: function (a) { var b = false; $(a).parents().each(function () { b |= $(this).css('position') == 'fixed' }); if (b) { return [0, 0] } var c = a.scrollLeft; var d = a.scrollTop; while (a = a.parentNode) { c += a.scrollLeft || 0; d += a.scrollTop || 0 } return [c, d] }, _get: function (a, b) { return (a.options[b] != null ? a.options[b] : $.timeEntry._defaults[b]) }, _parseTime: function (a) { var b = this._extractTime(a); var c = this._get(a, 'showSeconds'); if (b) { a._selectedHour = b[0]; a._selectedMinute = b[1]; a._selectedSecond = b[2] } else { var d = this._constrainTime(a); a._selectedHour = d[0]; a._selectedMinute = d[1]; a._selectedSecond = (c ? d[2] : 0) } a._secondField = (c ? 2 : -1); a._ampmField = (this._get(a, 'show24Hours') ? -1 : (c ? 3 : 2)); a._lastChr = ''; a._field = Math.max(0, Math.min(Math.max(1, a._secondField, a._ampmField), this._get(a, 'initialField'))); if (a.input.val() != '') { this._showTime(a) } }, _extractTime: function (a, b) { b = b || a.input.val(); var c = this._get(a, 'separator'); var d = b.split(c); if (c == '' && b != '') { d[0] = b.substring(0, 2); d[1] = b.substring(2, 4); d[2] = b.substring(4, 6) } var e = this._get(a, 'ampmNames'); var f = this._get(a, 'show24Hours'); if (d.length >= 2) { var g = !f && (b.indexOf(e[0]) > -1); var h = !f && (b.indexOf(e[1]) > -1); var i = parseInt(d[0], 10); i = (isNaN(i) ? 0 : i); i = ((g || h) && i == 12 ? 0 : i) + (h ? 12 : 0); var j = parseInt(d[1], 10); j = (isNaN(j) ? 0 : j); var k = (d.length >= 3 ? parseInt(d[2], 10) : 0); k = (isNaN(k) || !this._get(a, 'showSeconds') ? 0 : k); return this._constrainTime(a, [i, j, k]) } return null }, _constrainTime: function (a, b) { var c = (b != null); if (!c) { var d = this._determineTime(a, this._get(a, 'defaultTime')) || new Date(); b = [d.getHours(), d.getMinutes(), d.getSeconds()] } var e = false; var f = this._get(a, 'timeSteps'); for (var i = 0; i < f.length; i++) { if (e) { b[i] = 0 } else if (f[i] > 1) { b[i] = Math.round(b[i] / f[i]) * f[i]; e = true } } return b }, _showTime: function (a) { var b = this._get(a, 'show24Hours'); var c = this._get(a, 'separator'); var d = (this._formatNumber(b ? a._selectedHour : ((a._selectedHour + 11) % 12) + 1) + c + this._formatNumber(a._selectedMinute) + (this._get(a, 'showSeconds') ? c + this._formatNumber(a._selectedSecond) : '') + (b ? '' : this._get(a, 'ampmPrefix') + this._get(a, 'ampmNames')[(a._selectedHour < 12 ? 0 : 1)])); this._setValue(a, d); this._showField(a) }, _showField: function (a) { var b = a.input[0]; if (a.input.is(':hidden') || $.timeEntry._lastInput != b) { return } var c = this._get(a, 'separator'); var d = c.length + 2; var e = (a._field != a._ampmField ? (a._field * d) : (a._ampmField * d) - c.length + this._get(a, 'ampmPrefix').length); var f = e + (a._field != a._ampmField ? 2 : this._get(a, 'ampmNames')[0].length); if (b.setSelectionRange) { b.setSelectionRange(e, f) } else if (b.createTextRange) { var g = b.createTextRange(); g.moveStart('character', e); g.moveEnd('character', f - a.input.val().length); g.select() } if (!b.disabled) { b.focus() } }, _formatNumber: function (a) { return (a < 10 ? '0' : '') + a }, _setValue: function (a, b) { if (b != a.input.val()) { a.input.val(b).trigger('change') } }, _changeField: function (a, b, c) { var d = (a.input.val() == '' || a._field == (b == -1 ? 0 : Math.max(1, a._secondField, a._ampmField))); if (!d) { a._field += b } this._showField(a); a._lastChr = ''; $.data(a.input[0], m, a); return (d && c) }, _adjustField: function (a, b) { if (a.input.val() == '') { b = 0 } var c = this._get(a, 'timeSteps'); this._setTime(a, new Date(0, 0, 0, a._selectedHour + (a._field == 0 ? b * c[0] : 0) + (a._field == a._ampmField ? b * 12 : 0), a._selectedMinute + (a._field == 1 ? b * c[1] : 0), a._selectedSecond + (a._field == a._secondField ? b * c[2] : 0))) }, _setTime: function (a, b) { b = this._determineTime(a, b); var c = this._constrainTime(a, b ? [b.getHours(), b.getMinutes(), b.getSeconds()] : null); b = new Date(0, 0, 0, c[0], c[1], c[2]); var b = this._normaliseTime(b); var d = this._normaliseTime(this._determineTime(a, this._get(a, 'minTime'))); var e = this._normaliseTime(this._determineTime(a, this._get(a, 'maxTime'))); b = (d && b < d ? d : (e && b > e ? e : b)); var f = this._get(a, 'beforeSetTime'); if (f) { b = f.apply(a.input[0], [this._getTimeTimeEntry(a.input[0]), b, d, e]) } a._selectedHour = b.getHours(); a._selectedMinute = b.getMinutes(); a._selectedSecond = b.getSeconds(); this._showTime(a); $.data(a.input[0], m, a) }, _normaliseTime: function (a) { if (!a) { return null } a.setFullYear(1900); a.setMonth(0); a.setDate(0); return a }, _determineTime: function (i, j) { var k = function (a) { var b = new Date(); b.setTime(b.getTime() + a * 1000); return b }; var l = function (a) { var b = $.timeEntry._extractTime(i, a); var c = new Date(); var d = (b ? b[0] : c.getHours()); var e = (b ? b[1] : c.getMinutes()); var f = (b ? b[2] : c.getSeconds()); if (!b) { var g = /([+-]?[0-9]+)\s*(s|S|m|M|h|H)?/g; var h = g.exec(a); while (h) { switch (h[2] || 's') { case 's': case 'S': f += parseInt(h[1], 10); break; case 'm': case 'M': e += parseInt(h[1], 10); break; case 'h': case 'H': d += parseInt(h[1], 10); break }h = g.exec(a) } } c = new Date(0, 0, 10, d, e, f, 0); if (/^!/.test(a)) { if (c.getDate() > 10) { c = new Date(0, 0, 10, 23, 59, 59) } else if (c.getDate() < 10) { c = new Date(0, 0, 10, 0, 0, 0) } } return c }; return (j ? (typeof j == 'string' ? l(j) : (typeof j == 'number' ? k(j) : j)) : null) }, _handleKeyPress: function (a, b) { if (b == this._get(a, 'separator')) { this._changeField(a, +1, false) } else if (b >= '0' && b <= '9') { var c = parseInt(b, 10); var d = parseInt(a._lastChr + b, 10); var e = this._get(a, 'show24Hours'); var f = (a._field != 0 ? a._selectedHour : (e ? (d < 24 ? d : c) : (d >= 1 && d <= 12 ? d : (c > 0 ? c : a._selectedHour)) % 12 + (a._selectedHour >= 12 ? 12 : 0))); var g = (a._field != 1 ? a._selectedMinute : (d < 60 ? d : c)); var h = (a._field != a._secondField ? a._selectedSecond : (d < 60 ? d : c)); var i = this._constrainTime(a, [f, g, h]); this._setTime(a, new Date(0, 0, 0, i[0], i[1], i[2])); a._lastChr = b } else if (!this._get(a, 'show24Hours')) { b = b.toLowerCase(); var j = this._get(a, 'ampmNames'); if ((b == j[0].substring(0, 1).toLowerCase() && a._selectedHour >= 12) || (b == j[1].substring(0, 1).toLowerCase() && a._selectedHour < 12)) { var k = a._field; a._field = a._ampmField; this._adjustField(a, +1); a._field = k; this._showField(a) } } } }); function extendRemove(a, b) { $.extend(a, b); for (var c in b) { if (b[c] == null) { a[c] = null } } return a } var n = ['getOffset', 'getTime', 'isDisabled']; $.fn.timeEntry = function (c) { var d = Array.prototype.slice.call(arguments, 1); if (typeof c == 'string' && $.inArray(c, n) > -1) { return $.timeEntry['_' + c + 'TimeEntry'].apply($.timeEntry, [this[0]].concat(d)) } return this.each(function () { var a = this.nodeName.toLowerCase(); if (a == 'input') { if (typeof c == 'string') { $.timeEntry['_' + c + 'TimeEntry'].apply($.timeEntry, [this].concat(d)) } else { var b = ($.fn.metadata ? $(this).metadata() : {}); $.timeEntry._connectTimeEntry(this, $.extend(b, c)) } } }) }; $.timeEntry = new TimeEntry() })(jQuery);
/* http://keith-wood.name/timeEntry.html
   Portuguese initialisation for the jQuery time entry extension
   Written by Dino Sane (dino@asttra.com.br). */
(function ($) {
    $.timeEntry.regional['pt'] = {
        show24Hours: true, separator: ':',
        ampmPrefix: '', ampmNames: ['AM', 'PM'],
        spinnerTexts: ['Agora', 'Campo anterior', 'Campo Seguinte', 'Aumentar', 'Diminuir']
    };
    $.timeEntry.setDefaults($.timeEntry.regional['pt']);
})(jQuery);


/*---------------------------------------------------
jQuery MessageBox Personalizada
Uso para GinGa3
---------------------------------------------------*/
(function ($) {
    var ie6 = (jQuery.browser.msie && parseInt(jQuery.browser.version, 10) < 7 && parseInt(jQuery.browser.version, 10) > 4);
    if ($.proxy === undefined) {
        $.extend({
            proxy: function (fn, thisObject) {
                if (fn) {
                    proxy = function () {
                        return fn.apply(thisObject || this, arguments)
                    }
                };
                return proxy
            }
        })
    };
    $.extend(jQuery.easing, {
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined)
                s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
        }
    });
    $.extend($.expr[':'], {
        value: function (a) {
            return $(a).val()
        }
    });
    $.extend({
        MsgBoxConfig: function (options) {
            var defaults = {
                name: 'jquery-msgbox',
                formaction: '#',
                zIndex: 10000,
                width: 420,
                height: 'auto',
                background: '#FFFFFF',
                modal: true,
                overlay: {
                    'background-color': '#000000',
                    'opacity': 0.5
                },
                showDuration: 200,
                closeDuration: 100,
                moveDuration: 500,
                emergefrom: 'top',
                shake: {
                    distance: 10,
                    duration: 100,
                    transition: 'easeOutBack',
                    loops: 2
                }
            };
            if ($.aerOptions === undefined) {
                return $.aerOptions = $.extend(true, defaults, options)
            }
            else {
                return $.aerOptions = $.extend(true, $.aerOptions, options)
            }
        },
        MsgBoxObject: {
            options: {},
            esqueleto: {
                msgbox: [],
                wrapper: [],
                form: [],
                buttons: [],
                inputs: []
            },
            visible: false,
            i: 0,
            animation: false,
            overlay: {
                create: function (options) {
                    this.options = options;
                    this.element = $('<div id="' + new Date().getTime() + '"></div>');
                    this.element.css($.extend({}, {
                        'position': 'fixed',
                        'top': 0,
                        'left': 0,
                        'opacity': 0,
                        'display': 'none',
                        'z-index': this.options.zIndex
                    }, this.options.style));
                    this.element.click($.proxy(function (event) {
                        if (this.options.hideOnClick) {
                            if (!this.options.callback === undefined) {
                                this.options.callback()
                            }
                            else {
                                this.hide()
                            }
                        }
                        event.preventDefault()
                    }, this));
                    this.hidden = true;
                    this.inject();
                    return this
                },
                inject: function () {
                    this.target = $(document.body);
                    this.target.append(this.element);
                    if (ie6) {
                        this.element.css({
                            'position': 'absolute'
                        });
                        var zIndex = parseInt(this.element.css('zIndex'));
                        if (!zIndex) {
                            zIndex = 1;
                            var pos = this.element.css('position');
                            if (pos == 'static' || !pos) {
                                this.element.css({
                                    'position': 'relative'
                                })
                            }
                            this.element.css({
                                'zIndex': zIndex
                            })
                        }
                        zIndex = (!!(this.options.zIndex || this.options.zIndex === 0) && zIndex > this.options.zIndex) ? this.options.zIndex : zIndex - 1;
                        if (zIndex < 0) {
                            zIndex = 1
                        }
                        this.shim = $('<iframe id="IF_' + new Date().getTime() + '" scrolling="no" frameborder=0 src=""></div>');
                        this.shim.css({
                            zIndex: zIndex,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            border: 'none',
                            width: 0,
                            height: 0,
                            opacity: 0
                        });
                        this.shim.insertAfter(this.element);
                        $('html, body').css({
                            'height': '100%',
                            'width': '100%',
                            'margin-left': 0,
                            'margin-right': 0
                        })
                    }
                },
                resize: function (x, y) {
                    this.element.css({
                        'height': 0,
                        'width': 0
                    });
                    if (this.shim)
                        this.shim.css({
                            'height': 0,
                            'width': 0
                        });
                    var win = {
                        x: $(document).width(),
                        y: $(document).height()
                    };
                    this.element.css({
                        'width': '100%',
                        'height': y ? y : win.y
                    });
                    if (this.shim) {
                        this.shim.css({
                            'height': 0,
                            'width': 0
                        });
                        this.shim.css({
                            'position': 'absolute',
                            'left': 0,
                            'top': 0,
                            'width': this.element.width(),
                            'height': y ? y : win.y
                        })
                    }
                    return this
                },
                show: function () {
                    if (!this.hidden)
                        return this;
                    if (this.transition)
                        this.transition.stop();
                    this.target.bind('resize', $.proxy(this.resize, this));
                    this.resize();
                    if (this.shim)
                        this.shim.css({
                            'display': 'block'
                        });
                    this.hidden = false;
                    this.transition = this.element.fadeIn(this.options.showDuration, $.proxy(function () {
                        this.element.trigger('show')
                    }, this));
                    return this
                },
                hide: function () {
                    if (this.hidden)
                        return this;
                    if (this.transition)
                        this.transition.stop();
                    this.target.unbind('resize');
                    if (this.shim)
                        this.shim.css({
                            'display': 'none'
                        });
                    this.hidden = true;
                    this.transition = this.element.fadeOut(this.options.closeDuration, $.proxy(function () {
                        this.element.trigger('hide');
                        this.element.css({
                            'height': 0,
                            'width': 0
                        })
                    }, this));
                    return this
                }
            },
            create: function () {
                this.options = $.MsgBoxConfig();
                this.overlay.create({
                    style: this.options.overlay,
                    hideOnClick: !this.options.modal,
                    zIndex: this.options.zIndex - 1,
                    showDuration: this.options.showDuration,
                    closeDuration: this.options.closeDuration
                });
                this.esqueleto.msgbox = $('<div class="' + this.options.name + '"></div>');
                this.esqueleto.msgbox.css({
                    display: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: this.options.width,
                    height: this.options.height,
                    'z-index': this.options.zIndex,
                    'word-wrap': 'break-word',
                    '-moz-box-shadow': '0 0 15px rgba(0, 0, 0, 0.5)',
                    '-webkit-box-shadow': '0 0 15px rgba(0, 0, 0, 0.5)',
                    'box-shadow': '0 0 15px rgba(0, 0, 0, 0.5)',
                    '-moz-border-radius': '6px',
                    '-webkit-border-radius': '6px',
                    'border-radius': '6px',
                    'background-color': this.options.background
                });
                this.esqueleto.wrapper = $('<div class="' + this.options.name + '-wrapper"></div>');
                this.esqueleto.msgbox.append(this.esqueleto.wrapper);
                this.esqueleto.form = $('<form action="' + this.options.formaction + '" method="post"></form>');
                this.esqueleto.wrapper.append(this.esqueleto.form);
                this.esqueleto.wrapper.css({
                    height: (ie6 ? 80 : 'auto'),
                    'min-height': 80,
                    'zoom': 1
                });
                $('body').append(this.esqueleto.msgbox);
                this.addevents();
                return this.esqueleto.msgbox
            },
            addevents: function () {
                $(window).bind('resize', $.proxy(function () {
                    if (this.visible) {
                        this.overlay.resize();
                        this.moveBox()
                    }
                }, this));
                $(window).bind('scroll', $.proxy(function () {
                    this.moveBox()
                }, this));
                this.esqueleto.msgbox.bind('keydown', $.proxy(function (event) {
                    if (event.keyCode == 27) {
                        this.close(false)
                    }
                }, this));
                this.esqueleto.form.bind('submit', $.proxy(function (event) {
                    event.preventDefault()
                }, this));
                this.overlay.element.bind('show', $.proxy(function () {
                    $(this).triggerHandler('show')
                }, this));
                this.overlay.element.bind('hide', $.proxy(function () {
                    $(this).triggerHandler('close')
                }, this))
            },
            show: function (txt, options, callback) {
                var types = ['alert', 'info', 'error', 'prompt', 'confirm'];
                this.esqueleto.msgbox.queue(this.options.name, $.proxy(function (next) {
                    options = $.extend(true, {
                        type: 'alert'
                    }, options || {});
                    if (options.buttons === undefined) {
                        if (options.type == 'confirm' || options.type == 'prompt') {
                            var buttons = [{
                                type: 'submit',
                                value: 'Aceitar'
                            }, {
                                type: 'cancel',
                                value: 'Cancelar'
                            }]
                        }
                        else {
                            var buttons = [{
                                type: 'submit',
                                value: 'Aceitar'
                            }]
                        }
                    }
                    else {
                        var buttons = options.buttons
                    };
                    if (options.inputs === undefined && options.type == 'prompt') {
                        var inputs = [{
                            type: 'text',
                            name: 'prompt',
                            value: ''
                        }]
                    }
                    else {
                        var inputs = options.inputs
                    };
                    this.callback = $.isFunction(callback) ? callback : function (e) {
                    };
                    if (inputs !== undefined) {
                        this.esqueleto.inputs = $('<div class="' + this.options.name + '-inputs"></div>');
                        this.esqueleto.form.append(this.esqueleto.inputs);
                        $.each(inputs, $.proxy(function (i, input) {
                            if (input.type == 'text' || input.type == 'password') {
                                iLabel = input.label ? '<label class="' + this.options.name + '-label">' + input.label : '';
                                fLabel = input.label ? '</label>' : '';
                                input.value = input.value === undefined ? '' : input.value;
                                iRequired = input.required === undefined || input.required == false ? '' : 'required="true"';
                                this.esqueleto.inputs.append($(iLabel + '<input type="' + input.type + '" name="' + this.options.name + '-label-' + i + '" value="' + input.value + '" autocomplete="off" ' + iRequired + '/>' + fLabel))
                            }
                            else
                                if (input.type == 'checkbox') {
                                    iLabel = input.label ? '<label class="' + this.options.name + '-label">' : '';
                                    fLabel = input.label ? input.label + '</label>' : '';
                                    input.value = input.value === undefined ? '1' : input.value;
                                    this.esqueleto.inputs.append($(iLabel + '<input type="' + input.type + '" style="display:inline; width:auto;" name="' + this.options.name + '-label-' + i + '" value="' + input.value + '" autocomplete="off"/> ' + fLabel))
                                }
                        }, this))
                    }
                    this.esqueleto.buttons = $('<div class="' + this.options.name + '-buttons"></div>');
                    this.esqueleto.form.append(this.esqueleto.buttons);
                    if (options.type == 'alert' || options.type == 'info' || options.type == 'error' || options.type == 'confirm') {
                        $.each(buttons, $.proxy(function (i, button) {
                            if (document.domain.indexOf("envato.com") != -1 || document.domain.indexOf("inspira.me") != -1 || document.domain.indexOf("localhost") != -1) {
                            }

                            if (button.type == 'submit') {
                                this.esqueleto.buttons.append($('<button type="submit">' + button.value + '</button>').bind('click', $.proxy(function (e) {
                                    this.close(button.value);
                                    e.preventDefault()
                                }, this)))
                            }
                            else
                                if (button.type == 'cancel') {
                                    this.esqueleto.buttons.append($('<button type="button">' + button.value + '</button>').bind('click', $.proxy(function (e) {
                                        this.close(false);
                                        e.preventDefault()
                                    }, this)))
                                }
                        }, this))
                    }
                    else
                        if (options.type == 'prompt') {
                            $.each(buttons, $.proxy(function (i, button) {
                                if (document.domain.indexOf("envato.com") != -1 || document.domain.indexOf("inspira.me") != -1 || document.domain.indexOf("localhost") != -1) {
                                }

                                if (button.type == 'submit') {
                                    this.esqueleto.buttons.append($('<button type="submit">' + button.value + '</button>').bind('click', $.proxy(function (e) {
                                        if ($('input[required="true"]:not(:value)').length > 0) {
                                            $('input[required="true"]:not(:value):first').focus();
                                            this.shake()
                                        }
                                        else {
                                            this.close(this.toArguments($('input', this.esqueleto.inputs)))
                                        }
                                        e.preventDefault()
                                    }, this)))
                                }
                                else
                                    if (button.type == 'cancel') {
                                        this.esqueleto.buttons.append($('<button type="button">' + button.value + '</button>').bind('click', $.proxy(function (e) {
                                            this.close(false);
                                            e.preventDefault()
                                        }, this)))
                                    }
                            }, this))
                        };
                    this.esqueleto.form.prepend(txt);
                    $.each(types, $.proxy(function (i, e) {
                        this.esqueleto.wrapper.removeClass(this.options.name + '-' + e)
                    }, this));
                    this.esqueleto.wrapper.addClass(this.options.name + '-' + options.type);
                    this.moveBox();
                    this.visible = true;
                    this.overlay.show();
                    this.esqueleto.msgbox.css({
                        display: 'block',
                        left: (($(document).width() - this.options.width) / 2)
                    });
                    this.moveBox();
                    setTimeout($.proxy(function () {
                        var b = $('input, button', this.esqueleto.msgbox);
                        if (b.length) {
                            b.get(0).focus()
                        }
                    }, this), this.options.moveDuration)
                }, this));
                this.i++;
                if (this.i == 1) {
                    this.esqueleto.msgbox.dequeue(this.options.name)
                }
            },
            toArguments: function (array) {
                return $.map(array, function (a) {
                    return $(a).val()
                })
            },
            moveBox: function () {
                var size = {
                    x: $(window).width(),
                    y: $(window).height()
                };
                var scroll = {
                    x: $(window).scrollLeft(),
                    y: $(window).scrollTop()
                };
                var height = this.esqueleto.msgbox.outerHeight();
                var y = 0;
                var x = 0;
                y = scroll.x + ((size.x - this.options.width) / 2);
                if (this.options.emergefrom == "bottom") {
                    x = (scroll.y + size.y + 80)
                }
                else {
                    x = (scroll.y - height) - 80
                }
                if (this.visible) {
                    if (this.animation) {
                        this.animation.stop
                    }
                    this.animation = this.esqueleto.msgbox.animate({
                        left: y,
                        top: scroll.y + ((size.y - height) / 2)
                    }, {
                        duration: this.options.moveDuration,
                        queue: false,
                        easing: 'easeOutBack'
                    })
                }
                else {
                    this.esqueleto.msgbox.css({
                        top: x,
                        left: y
                    })
                }
            },
            close: function (param) {
                this.esqueleto.msgbox.css({
                    display: 'none',
                    top: 0
                });
                this.visible = false;
                if ($.isFunction(this.callback)) {
                    this.callback.apply(this, $.makeArray(param))
                }
                setTimeout($.proxy(function () {
                    this.i--;
                    this.esqueleto.msgbox.dequeue(this.options.name)
                }, this), this.options.closeDuration);
                if (this.i == 1) {
                    this.overlay.hide()
                }
                this.moveBox();
                this.esqueleto.form.empty()
            },
            shake: function () {
                var x = this.options.shake.distance;
                var d = this.options.shake.duration;
                var t = this.options.shake.transition;
                var o = this.options.shake.loops;
                var l = this.esqueleto.msgbox.position().left;
                var e = this.esqueleto.msgbox;
                for (i = 0; i < o; i++) {
                    e.animate({
                        left: l + x
                    }, d, t);
                    e.animate({
                        left: l - x
                    }, d, t)
                };
                e.animate({
                    left: l + x
                }, d, t);
                e.animate({
                    left: l
                }, d, t)
            }
        },
        msgbox: function (txt, options, callback) {
            return $.MsgBoxObject.show(txt, options, callback)
        }
    });
    $(function () {
        $.MsgBoxObject.create();
        if (document.domain.indexOf("envato.com") != -1 || document.domain.indexOf("inspira.me") != -1 || document.domain.indexOf("localhost") != -1) {
        }
    })
})(jQuery);

(function (a) { var b = new Array; var c = new Array; a.fn.doAutosize = function (b) { var c = a(this).data("minwidth"), d = a(this).data("maxwidth"), e = "", f = a(this), g = a("#" + a(this).data("tester_id")); if (e === (e = f.val())) { return } var h = e.replace(/&/g, "&").replace(/\s/g, " ").replace(/</g, "<").replace(/>/g, ">"); g.html(h); var i = g.width(), j = i + b.comfortZone >= c ? i + b.comfortZone : c, k = f.width(), l = j < k && j >= c || j > c && j < d; if (l) { f.width(j) } }; a.fn.resetAutosize = function (b) { var c = a(this).data("minwidth") || b.minInputWidth || a(this).width(), d = a(this).data("maxwidth") || b.maxInputWidth || a(this).closest(".tagsinput").width() - b.inputPadding, e = "", f = a(this), g = a("<tester/>").css({ position: "absolute", top: -9999, left: -9999, width: "auto", fontSize: f.css("fontSize"), fontFamily: f.css("fontFamily"), fontWeight: f.css("fontWeight"), letterSpacing: f.css("letterSpacing"), whiteSpace: "nowrap" }), h = a(this).attr("id") + "_autosize_tester"; if (!a("#" + h).length > 0) { g.attr("id", h); g.appendTo("body") } f.data("minwidth", c); f.data("maxwidth", d); f.data("tester_id", h); f.css("width", c) }; a.fn.addTag = function (d, e) { e = jQuery.extend({ focus: false, callback: true }, e); this.each(function () { var f = a(this).attr("id"); var g = a(this).val().split(b[f]); if (g[0] == "") { g = new Array } d = jQuery.trim(d); if (e.unique) { var h = a(g).tagExist(d); if (h == true) { a("#" + f + "_tag").addClass("not_valid") } } else { var h = false } if (d != "" && h != true) { a("<span>").addClass("tag").append(a("<span>").text(d).append("  "), a("<a>", { href: "#", title: "Removing tag", text: "x" }).click(function () { return a("#" + f).removeTag(escape(d)) })).insertBefore("#" + f + "_addTag"); g.push(d); a("#" + f + "_tag").val(""); if (e.focus) { a("#" + f + "_tag").focus() } else { a("#" + f + "_tag").blur() } a.fn.tagsInput.updateTagsField(this, g); if (e.callback && c[f] && c[f]["onAddTag"]) { var i = c[f]["onAddTag"]; i.call(this, d) } if (c[f] && c[f]["onChange"]) { var j = g.length; var i = c[f]["onChange"]; i.call(this, a(this), g[j - 1]) } } }); return false }; a.fn.removeTag = function (d) { d = unescape(d); this.each(function () { var e = a(this).attr("id"); var f = a(this).val().split(b[e]); a("#" + e + "_tagsinput .tag").remove(); str = ""; for (i = 0; i < f.length; i++) { if (f[i] != d) { str = str + b[e] + f[i] } } a.fn.tagsInput.importTags(this, str); if (c[e] && c[e]["onRemoveTag"]) { var g = c[e]["onRemoveTag"]; g.call(this, d) } }); return false }; a.fn.tagExist = function (b) { return jQuery.inArray(b, a(this)) >= 0 }; a.fn.importTags = function (b) { id = a(this).attr("id"); a("#" + id + "_tagsinput .tag").remove(); a.fn.tagsInput.importTags(this, b) }; a.fn.tagsInput = function (d) { var e = jQuery.extend({ interactive: true, defaultText: "add a tag", minChars: 0, width: "300px", height: "100px", autocomplete: { selectFirst: false }, hide: true, delimiter: ",", unique: true, removeWithBackspace: true, placeholderColor: "#666666", autosize: true, comfortZone: 20, inputPadding: 6 * 2 }, d); this.each(function () { if (e.hide) { a(this).hide() } var d = a(this).attr("id"); if (!d || b[a(this).attr("id")]) { d = a(this).attr("id", "tags" + (new Date).getTime()).attr("id") } var f = jQuery.extend({ pid: d, real_input: "#" + d, holder: "#" + d + "_tagsinput", input_wrapper: "#" + d + "_addTag", fake_input: "#" + d + "_tag" }, e); b[d] = f.delimiter; if (e.onAddTag || e.onRemoveTag || e.onChange) { c[d] = new Array; c[d]["onAddTag"] = e.onAddTag; c[d]["onRemoveTag"] = e.onRemoveTag; c[d]["onChange"] = e.onChange } var g = '<div id="' + d + '_tagsinput" class="tagsinput"><div id="' + d + '_addTag">'; if (e.interactive) { g = g + '<input id="' + d + '_tag" value="" data-default="' + e.defaultText + '" />' } g = g + '</div><div class="tags_clear"></div></div>'; a(g).insertAfter(this); a(f.holder).css("width", e.width); a(f.holder).css("height", e.height); if (a(f.real_input).val() != "") { a.fn.tagsInput.importTags(a(f.real_input), a(f.real_input).val()) } if (e.interactive) { a(f.fake_input).val(a(f.fake_input).attr("data-default")); a(f.fake_input).css("color", e.placeholderColor); a(f.fake_input).resetAutosize(e); a(f.holder).bind("click", f, function (b) { a(b.data.fake_input).focus() }); a(f.fake_input).bind("focus", f, function (b) { if (a(b.data.fake_input).val() == a(b.data.fake_input).attr("data-default")) { a(b.data.fake_input).val("") } a(b.data.fake_input).css("color", "#000000") }); if (e.autocomplete_url != undefined) { autocomplete_options = { source: e.autocomplete_url }; for (attrname in e.autocomplete) { autocomplete_options[attrname] = e.autocomplete[attrname] } if (jQuery.Autocompleter !== undefined) { a(f.fake_input).autocomplete(e.autocomplete_url, e.autocomplete); a(f.fake_input).bind("result", f, function (b, c, f) { if (c) { a("#" + d).addTag(c[0] + "", { focus: true, unique: e.unique }) } }) } else if (jQuery.ui.autocomplete !== undefined) { a(f.fake_input).autocomplete(autocomplete_options); a(f.fake_input).bind("autocompleteselect", f, function (b, c) { a(b.data.real_input).addTag(c.item.value, { focus: true, unique: e.unique }); return false }) } } else { a(f.fake_input).bind("blur", f, function (b) { var c = a(this).attr("data-default"); if (a(b.data.fake_input).val() != "" && a(b.data.fake_input).val() != c) { if (b.data.minChars <= a(b.data.fake_input).val().length && (!b.data.maxChars || b.data.maxChars >= a(b.data.fake_input).val().length)) a(b.data.real_input).addTag(a(b.data.fake_input).val(), { focus: true, unique: e.unique }) } else { a(b.data.fake_input).val(a(b.data.fake_input).attr("data-default")); a(b.data.fake_input).css("color", e.placeholderColor) } return false }) } a(f.fake_input).bind("keypress", f, function (b) { if (b.which == b.data.delimiter.charCodeAt(0) || b.which == 13) { b.preventDefault(); if (b.data.minChars <= a(b.data.fake_input).val().length && (!b.data.maxChars || b.data.maxChars >= a(b.data.fake_input).val().length)) a(b.data.real_input).addTag(a(b.data.fake_input).val(), { focus: true, unique: e.unique }); a(b.data.fake_input).resetAutosize(e); return false } else if (b.data.autosize) { a(b.data.fake_input).doAutosize(e) } }); f.removeWithBackspace && a(f.fake_input).bind("keydown", function (b) { if (b.keyCode == 8 && a(this).val() == "") { b.preventDefault(); var c = a(this).closest(".tagsinput").find(".tag:last").text(); var d = a(this).attr("id").replace(/_tag$/, ""); c = c.replace(/[\s]+x$/, ""); a("#" + d).removeTag(escape(c)); a(this).trigger("focus") } }); a(f.fake_input).blur(); if (f.unique) { a(f.fake_input).keydown(function (b) { if (b.keyCode == 8 || String.fromCharCode(b.which).match(/\w+|[áéíóúÁÉÍÓÚñÑ,/]+/)) { a(this).removeClass("not_valid") } }) } } }); return this }; a.fn.tagsInput.updateTagsField = function (c, d) { var e = a(c).attr("id"); a(c).val(d.join(b[e])) }; a.fn.tagsInput.importTags = function (d, e) { a(d).val(""); var f = a(d).attr("id"); var g = e.split(b[f]); for (i = 0; i < g.length; i++) { a(d).addTag(g[i], { focus: false, callback: false }) } if (c[f] && c[f]["onChange"]) { var h = c[f]["onChange"]; h.call(d, d, g[i]) } } })(jQuery);

/*
 * Copyright 2010 akquinet
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function (a) { var b = { inEffect: { opacity: "show" }, inEffectDuration: 600, stayTime: 3e3, text: "", sticky: false, type: "notice", position: "top-right", closeText: "", close: null }; var c = { init: function (c) { if (c) { a.extend(b, c) } }, showToast: function (c) { var d = {}; a.extend(d, b, c); var e, f, g, h, i; e = !a(".toast-container").length ? a("<div></div>").addClass("toast-container").addClass("toast-position-" + d.position).appendTo("body") : a(".toast-container"); f = a("<div></div>").addClass("toast-item-wrapper"); g = a("<div></div>").hide().addClass("toast-item toast-type-" + d.type).appendTo(e).html(a("<p>").append(d.text)).animate(d.inEffect, d.inEffectDuration).wrap(f); h = a("<div></div>").addClass("toast-item-close").prependTo(g).html(d.closeText).click(function () { a().toastmessage("removeToast", g, d) }); i = a("<div></div>").addClass("toast-item-image").addClass("toast-item-image-" + d.type).prependTo(g); if (navigator.userAgent.match(/MSIE 6/i)) { e.css({ top: document.documentElement.scrollTop }) } if (!d.sticky) { setTimeout(function () { a().toastmessage("removeToast", g, d) }, d.stayTime) } return g }, showNoticeToast: function (b) { var c = { text: b, type: "notice" }; return a().toastmessage("showToast", c) }, showSuccessToast: function (b) { var c = { text: b, type: "success" }; return a().toastmessage("showToast", c) }, showErrorToast: function (b) { var c = { text: b, type: "error" }; return a().toastmessage("showToast", c) }, showWarningToast: function (b) { var c = { text: b, type: "warning" }; return a().toastmessage("showToast", c) }, removeToast: function (a, b) { a.animate({ opacity: "0" }, 600, function () { a.parent().animate({ height: "0px" }, 300, function () { a.parent().remove() }) }); if (b && b.close !== null) { b.close() } } }; a.fn.toastmessage = function (b) { if (c[b]) { return c[b].apply(this, Array.prototype.slice.call(arguments, 1)) } else if (typeof b === "object" || !b) { return c.init.apply(this, arguments) } else { a.error("Method " + b + " does not exist on jQuery.toastmessage") } } })(jQuery);


/*
    jQuery Masked Input Plugin
    Copyright (c) 2007 - 2014 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.4.0
*/
!function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery) }(function (a) { var b, c = navigator.userAgent, d = /iphone/i.test(c), e = /chrome/i.test(c), f = /android/i.test(c); a.mask = { definitions: { 9: "[0-9]", a: "[A-Za-z]", "*": "[A-Za-z0-9]" }, autoclear: !0, dataName: "rawMaskFn", placeholder: "_" }, a.fn.extend({ caret: function (a, b) { var c; if (0 !== this.length && !this.is(":hidden")) return "number" == typeof a ? (b = "number" == typeof b ? b : a, this.each(function () { this.setSelectionRange ? this.setSelectionRange(a, b) : this.createTextRange && (c = this.createTextRange(), c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", a), c.select()) })) : (this[0].setSelectionRange ? (a = this[0].selectionStart, b = this[0].selectionEnd) : document.selection && document.selection.createRange && (c = document.selection.createRange(), a = 0 - c.duplicate().moveStart("character", -1e5), b = a + c.text.length), { begin: a, end: b }) }, unmask: function () { return this.trigger("unmask") }, mask: function (c, g) { var h, i, j, k, l, m, n, o; if (!c && this.length > 0) { h = a(this[0]); var p = h.data(a.mask.dataName); return p ? p() : void 0 } return g = a.extend({ autoclear: a.mask.autoclear, placeholder: a.mask.placeholder, completed: null }, g), i = a.mask.definitions, j = [], k = n = c.length, l = null, a.each(c.split(""), function (a, b) { "?" == b ? (n--, k = a) : i[b] ? (j.push(new RegExp(i[b])), null === l && (l = j.length - 1), k > a && (m = j.length - 1)) : j.push(null) }), this.trigger("unmask").each(function () { function h() { if (g.completed) { for (var a = l; m >= a; a++)if (j[a] && C[a] === p(a)) return; g.completed.call(B) } } function p(a) { return g.placeholder.charAt(a < g.placeholder.length ? a : 0) } function q(a) { for (; ++a < n && !j[a];); return a } function r(a) { for (; --a >= 0 && !j[a];); return a } function s(a, b) { var c, d; if (!(0 > a)) { for (c = a, d = q(b); n > c; c++)if (j[c]) { if (!(n > d && j[c].test(C[d]))) break; C[c] = C[d], C[d] = p(d), d = q(d) } z(), B.caret(Math.max(l, a)) } } function t(a) { var b, c, d, e; for (b = a, c = p(a); n > b; b++)if (j[b]) { if (d = q(b), e = C[b], C[b] = c, !(n > d && j[d].test(e))) break; c = e } } function u() { var a = B.val(), b = B.caret(); if (a.length < o.length) { for (A(!0); b.begin > 0 && !j[b.begin - 1];)b.begin--; if (0 === b.begin) for (; b.begin < l && !j[b.begin];)b.begin++; B.caret(b.begin, b.begin) } else { for (A(!0); b.begin < n && !j[b.begin];)b.begin++; B.caret(b.begin, b.begin) } h() } function v() { A(), B.val() != E && B.change() } function w(a) { if (!B.prop("readonly")) { var b, c, e, f = a.which || a.keyCode; o = B.val(), 8 === f || 46 === f || d && 127 === f ? (b = B.caret(), c = b.begin, e = b.end, e - c === 0 && (c = 46 !== f ? r(c) : e = q(c - 1), e = 46 === f ? q(e) : e), y(c, e), s(c, e - 1), a.preventDefault()) : 13 === f ? v.call(this, a) : 27 === f && (B.val(E), B.caret(0, A()), a.preventDefault()) } } function x(b) { if (!B.prop("readonly")) { var c, d, e, g = b.which || b.keyCode, i = B.caret(); if (!(b.ctrlKey || b.altKey || b.metaKey || 32 > g) && g && 13 !== g) { if (i.end - i.begin !== 0 && (y(i.begin, i.end), s(i.begin, i.end - 1)), c = q(i.begin - 1), n > c && (d = String.fromCharCode(g), j[c].test(d))) { if (t(c), C[c] = d, z(), e = q(c), f) { var k = function () { a.proxy(a.fn.caret, B, e)() }; setTimeout(k, 0) } else B.caret(e); i.begin <= m && h() } b.preventDefault() } } } function y(a, b) { var c; for (c = a; b > c && n > c; c++)j[c] && (C[c] = p(c)) } function z() { B.val(C.join("")) } function A(a) { var b, c, d, e = B.val(), f = -1; for (b = 0, d = 0; n > b; b++)if (j[b]) { for (C[b] = p(b); d++ < e.length;)if (c = e.charAt(d - 1), j[b].test(c)) { C[b] = c, f = b; break } if (d > e.length) { y(b + 1, n); break } } else C[b] === e.charAt(d) && d++, k > b && (f = b); return a ? z() : k > f + 1 ? g.autoclear || C.join("") === D ? (B.val() && B.val(""), y(0, n)) : z() : (z(), B.val(B.val().substring(0, f + 1))), k ? b : l } var B = a(this), C = a.map(c.split(""), function (a, b) { return "?" != a ? i[a] ? p(b) : a : void 0 }), D = C.join(""), E = B.val(); B.data(a.mask.dataName, function () { return a.map(C, function (a, b) { return j[b] && a != p(b) ? a : null }).join("") }), B.one("unmask", function () { B.off(".mask").removeData(a.mask.dataName) }).on("focus.mask", function () { if (!B.prop("readonly")) { clearTimeout(b); var a; E = B.val(), a = A(), b = setTimeout(function () { z(), a == c.replace("?", "").length ? B.caret(0, a) : B.caret(a) }, 10) } }).on("blur.mask", v).on("keydown.mask", w).on("keypress.mask", x).on("input.mask paste.mask", function () { B.prop("readonly") || setTimeout(function () { var a = A(!0); B.caret(a), h() }, 0) }), e && f && B.off("input.mask").on("input.mask", u), A() }) } }) });

/*** PLUGIN PARA MASKED INPUT QUE ADICIONA NONO DIGITO ***/
jQuery.fn.brTelMask = function () {

    return this.each(function () {
        var el = this;

        $(el).ready(function () {
            if ($(el).val() != "") formataCerto(el);
            else $(el).mask("(99) 9999-9999?9");
        });
        $(el).focusout(function () {
            formataCerto(el);
        });

    });
    function formataCerto(el) {
        var phone, element;
        element = $(el);
        element.unmask();
        phone = element.val().replace(/\D/g, '');
        if (phone.length > 10) {
            element.mask("(99) 99999-999?9");
        } else {
            element.mask("(99) 9999-9999?9");
        }
    };
};



/*

* Price Format jQuery Plugin
* By Eduardo Cuducos
* cuducos [at] gmail [dot] com
* Version: 1.1
* Release: 2009-02-10

* original char limit by Flávio Silveira <http://flaviosilveira.com>
* original keydown event attachment by Kaihua Qi
* keydown fixes by Thasmo <http://thasmo.com>

*/
(function (e) { e.fn.priceFormat = function (t) { var n = { prefix: "R$ ", suffix: "", centsSeparator: ",", thousandsSeparator: ".", limit: false, centsLimit: 2, clearPrefix: false, clearSufix: false, allowNegative: false, insertPlusSign: false, clearOnEmpty: false }; var t = e.extend(n, t); return this.each(function () { function m(e) { if (n.is("input")) n.val(e); else n.html(e) } function g() { if (n.is("input")) r = n.val(); else r = n.html(); return r } function y(e) { var t = ""; for (var n = 0; n < e.length; n++) { char_ = e.charAt(n); if (t.length == 0 && char_ == 0) char_ = false; if (char_ && char_.match(i)) { if (f) { if (t.length < f) t = t + char_ } else { t = t + char_ } } } return t } function b(e) { while (e.length < l + 1) e = "0" + e; return e } function w(t, n) { if (!n && (t === "" || t == w("0", true)) && v) return ""; var r = b(y(t)); var i = ""; var f = 0; if (l == 0) { u = ""; c = "" } var c = r.substr(r.length - l, l); var h = r.substr(0, r.length - l); r = l == 0 ? h : h + u + c; if (a || e.trim(a) != "") { for (var m = h.length; m > 0; m--) { char_ = h.substr(m - 1, 1); f++; if (f % 3 == 0) char_ = a + char_; i = char_ + i } if (i.substr(0, 1) == a) i = i.substring(1, i.length); r = l == 0 ? i : i + u + c } if (p && (h != 0 || c != 0)) { if (t.indexOf("-") != -1 && t.indexOf("+") < t.indexOf("-")) { r = "-" + r } else { if (!d) r = "" + r; else r = "+" + r } } if (s) r = s + r; if (o) r = r + o; return r } function E(e) { var t = e.keyCode ? e.keyCode : e.which; var n = String.fromCharCode(t); var i = false; var s = r; var o = w(s + n); if (t >= 48 && t <= 57 || t >= 96 && t <= 105) i = true; if (t == 8) i = true; if (t == 9) i = true; if (t == 13) i = true; if (t == 46) i = true; if (t == 37) i = true; if (t == 39) i = true; if (p && (t == 189 || t == 109 || t == 173)) i = true; if (d && (t == 187 || t == 107 || t == 61)) i = true; if (!i) { e.preventDefault(); e.stopPropagation(); if (s != o) m(o) } } function S() { var e = g(); var t = w(e); if (e != t) m(t); if (parseFloat(e) == 0 && v) m("") } function x() { n.val(s + g()) } function T() { n.val(g() + o) } function N() { if (e.trim(s) != "" && c) { var t = g().split(s); m(t[1]) } } function C() { if (e.trim(o) != "" && h) { var t = g().split(o); m(t[0]) } } var n = e(this); var r = ""; var i = /[0-9]/; if (n.is("input")) r = n.val(); else r = n.html(); var s = t.prefix; var o = t.suffix; var u = t.centsSeparator; var a = t.thousandsSeparator; var f = t.limit; var l = t.centsLimit; var c = t.clearPrefix; var h = t.clearSuffix; var p = t.allowNegative; var d = t.insertPlusSign; var v = t.clearOnEmpty; if (d) p = true; n.bind("keydown.price_format", E); n.bind("keyup.price_format", S); n.bind("focusout.price_format", S); if (c) { n.bind("focusout.price_format", function () { N() }); n.bind("focusin.price_format", function () { x() }) } if (h) { n.bind("focusout.price_format", function () { C() }); n.bind("focusin.price_format", function () { T() }) } if (g().length > 0) { S(); N(); C() } }) }; e.fn.unpriceFormat = function () { return e(this).unbind(".price_format") }; e.fn.unmask = function () { var t; var n = ""; if (e(this).is("input")) t = e(this).val(); else t = e(this).html(); for (var r in t) { if (!isNaN(t[r]) || t[r] == "-") n += t[r] } return n } })(jQuery);

/*
 *
 * Copyright (c) 2006-2014 Sam Collett (http://www.texotela.co.uk)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version 1.4.1
 * Demo: http://www.texotela.co.uk/code/jquery/numeric/
 *
 */
(function ($) { $.fn.numeric = function (config, callback) { if (typeof config === "boolean") { config = { decimal: config, negative: true, decimalPlaces: -1 } } config = config || {}; if (typeof config.negative == "undefined") { config.negative = true } var decimal = config.decimal === false ? "" : config.decimal || "."; var negative = config.negative === true ? true : false; var decimalPlaces = typeof config.decimalPlaces == "undefined" ? -1 : config.decimalPlaces; callback = typeof callback == "function" ? callback : function () { }; return this.data("numeric.decimal", decimal).data("numeric.negative", negative).data("numeric.callback", callback).data("numeric.decimalPlaces", decimalPlaces).keypress($.fn.numeric.keypress).keyup($.fn.numeric.keyup).blur($.fn.numeric.blur) }; $.fn.numeric.keypress = function (e) { var decimal = $.data(this, "numeric.decimal"); var negative = $.data(this, "numeric.negative"); var decimalPlaces = $.data(this, "numeric.decimalPlaces"); var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0; if (key == 13 && this.nodeName.toLowerCase() == "input") { return true } else if (key == 13) { return false } var allow = false; if (e.ctrlKey && key == 97 || e.ctrlKey && key == 65) { return true } if (e.ctrlKey && key == 120 || e.ctrlKey && key == 88) { return true } if (e.ctrlKey && key == 99 || e.ctrlKey && key == 67) { return true } if (e.ctrlKey && key == 122 || e.ctrlKey && key == 90) { return true } if (e.ctrlKey && key == 118 || e.ctrlKey && key == 86 || e.shiftKey && key == 45) { return true } if (key < 48 || key > 57) { var value = $(this).val(); if ($.inArray("-", value.split("")) !== 0 && negative && key == 45 && (value.length === 0 || parseInt($.fn.getSelectionStart(this), 10) === 0)) { return true } if (decimal && key == decimal.charCodeAt(0) && $.inArray(decimal, value.split("")) != -1) { allow = false } if (key != 8 && key != 9 && key != 13 && key != 35 && key != 36 && key != 37 && key != 39 && key != 46) { allow = false } else { if (typeof e.charCode != "undefined") { if (e.keyCode == e.which && e.which !== 0) { allow = true; if (e.which == 46) { allow = false } } else if (e.keyCode !== 0 && e.charCode === 0 && e.which === 0) { allow = true } } } if (decimal && key == decimal.charCodeAt(0)) { if ($.inArray(decimal, value.split("")) == -1) { allow = true } else { allow = false } } } else { allow = true; if (decimal && decimalPlaces > 0) { var dot = $.inArray(decimal, $(this).val().split("")); if (dot >= 0 && $(this).val().length > dot + decimalPlaces) { allow = false } } } return allow }; $.fn.numeric.keyup = function (e) { var val = $(this).val(); if (val && val.length > 0) { var carat = $.fn.getSelectionStart(this); var selectionEnd = $.fn.getSelectionEnd(this); var decimal = $.data(this, "numeric.decimal"); var negative = $.data(this, "numeric.negative"); var decimalPlaces = $.data(this, "numeric.decimalPlaces"); if (decimal !== "" && decimal !== null) { var dot = $.inArray(decimal, val.split("")); if (dot === 0) { this.value = "0" + val; carat++; selectionEnd++ } if (dot == 1 && val.charAt(0) == "-") { this.value = "-0" + val.substring(1); carat++; selectionEnd++ } val = this.value } var validChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "-", decimal]; var length = val.length; for (var i = length - 1; i >= 0; i--) { var ch = val.charAt(i); if (i !== 0 && ch == "-") { val = val.substring(0, i) + val.substring(i + 1) } else if (i === 0 && !negative && ch == "-") { val = val.substring(1) } var validChar = false; for (var j = 0; j < validChars.length; j++) { if (ch == validChars[j]) { validChar = true; break } } if (!validChar || ch == " ") { val = val.substring(0, i) + val.substring(i + 1) } } var firstDecimal = $.inArray(decimal, val.split("")); if (firstDecimal > 0) { for (var k = length - 1; k > firstDecimal; k--) { var chch = val.charAt(k); if (chch == decimal) { val = val.substring(0, k) + val.substring(k + 1) } } } if (decimal && decimalPlaces > 0) { var dot = $.inArray(decimal, val.split("")); if (dot >= 0) { val = val.substring(0, dot + decimalPlaces + 1); selectionEnd = Math.min(val.length, selectionEnd) } } this.value = val; $.fn.setSelection(this, [carat, selectionEnd]) } }; $.fn.numeric.blur = function () { var decimal = $.data(this, "numeric.decimal"); var callback = $.data(this, "numeric.callback"); var negative = $.data(this, "numeric.negative"); var val = this.value; if (val !== "") { var re = new RegExp(negative ? "-?" : "" + "^\\d+$|^\\d*" + decimal + "\\d+$"); if (!re.exec(val)) { callback.apply(this) } } }; $.fn.removeNumeric = function () { return this.data("numeric.decimal", null).data("numeric.negative", null).data("numeric.callback", null).data("numeric.decimalPlaces", null).unbind("keypress", $.fn.numeric.keypress).unbind("keyup", $.fn.numeric.keyup).unbind("blur", $.fn.numeric.blur) }; $.fn.getSelectionStart = function (o) { if (o.type === "number") { return undefined } else if (o.createTextRange && document.selection) { var r = document.selection.createRange().duplicate(); r.moveEnd("character", o.value.length); if (r.text == "") return o.value.length; return Math.max(0, o.value.lastIndexOf(r.text)) } else { try { return o.selectionStart } catch (e) { return 0 } } }; $.fn.getSelectionEnd = function (o) { if (o.type === "number") { return undefined } else if (o.createTextRange && document.selection) { var r = document.selection.createRange().duplicate(); r.moveStart("character", -o.value.length); return r.text.length } else return o.selectionEnd }; $.fn.setSelection = function (o, p) { if (typeof p == "number") { p = [p, p] } if (p && p.constructor == Array && p.length == 2) { if (o.type === "number") { o.focus() } else if (o.createTextRange) { var r = o.createTextRange(); r.collapse(true); r.moveStart("character", p[0]); r.moveEnd("character", p[1] - p[0]); r.select() } else { o.focus(); try { if (o.setSelectionRange) { o.setSelectionRange(p[0], p[1]) } } catch (e) { } } } } })(jQuery);

/*****************************************
JS BARCODE
******************************************/
function CODE128(c, p) {
    function m() { return -1 == c.search(r) ? !1 : !0 } function a(q, g, e, a) { var k; k = "" + b(e); k += g(q); k += b(a(q, e)); return k + "1100011101011" } function l(q) { for (var g = "", e = 0; e < q.length; e++) { var a; a: { for (a = 0; a < h.length; a++)if (h[a][0] == q[e]) { a = h[a][1]; break a } a = "" } g += a } return g } function d(a) { for (var g = "", e = 0; e < a.length; e += 2)g += b(parseInt(a.substr(e, 2))); return g } function f(a, g) {
        for (var e = 0, k = 0; k < a.length; k++) { var b; a: { for (b = 0; b < h.length; b++)if (h[b][0] == a[k]) { b = h[b][2]; break a } b = 0 } e += b * (k + 1) } return (e +
            g) % 103
    } function n(a, g) { for (var e = 0, k = 1, b = 0; b < a.length; b += 2)e += parseInt(a.substr(b, 2)) * k, k++; return (e + g) % 103 } function b(a) { for (var b = 0; b < h.length; b++)if (h[b][2] == a) return h[b][1]; return "" } p = p || "B"; this.string128 = c + ""; this.valid = m; this.encoded = function () { return m(c) ? k["code128" + p](c) : "" }; var h = [[" ", "11011001100", 0], ["!", "11001101100", 1], ['"', "11001100110", 2], ["#", "10010011000", 3], ["$", "10010001100", 4], ["%", "10001001100", 5], ["&", "10011001000", 6], ["'", "10011000100", 7], ["(", "10001100100", 8], [")", "11001001000",
        9], ["*", "11001000100", 10], ["+", "11000100100", 11], [",", "10110011100", 12], ["-", "10011011100", 13], [".", "10011001110", 14], ["/", "10111001100", 15], ["0", "10011101100", 16], ["1", "10011100110", 17], ["2", "11001110010", 18], ["3", "11001011100", 19], ["4", "11001001110", 20], ["5", "11011100100", 21], ["6", "11001110100", 22], ["7", "11101101110", 23], ["8", "11101001100", 24], ["9", "11100101100", 25], [":", "11100100110", 26], [";", "11101100100", 27], ["<", "11100110100", 28], ["=", "11100110010", 29], [">", "11011011000", 30], ["?", "11011000110",
        31], ["@", "11000110110", 32], ["A", "10100011000", 33], ["B", "10001011000", 34], ["C", "10001000110", 35], ["D", "10110001000", 36], ["E", "10001101000", 37], ["F", "10001100010", 38], ["G", "11010001000", 39], ["H", "11000101000", 40], ["I", "11000100010", 41], ["J", "10110111000", 42], ["K", "10110001110", 43], ["L", "10001101110", 44], ["M", "10111011000", 45], ["N", "10111000110", 46], ["O", "10001110110", 47], ["P", "11101110110", 48], ["Q", "11010001110", 49], ["R", "11000101110", 50], ["S", "11011101000", 51], ["T", "11011100010", 52], ["U", "11011101110",
        53], ["V", "11101011000", 54], ["W", "11101000110", 55], ["X", "11100010110", 56], ["Y", "11101101000", 57], ["Z", "11101100010", 58], ["[", "11100011010", 59], ["\\", "11101111010", 60], ["]", "11001000010", 61], ["^", "11110001010", 62], ["_", "10100110000", 63], ["`", "10100001100", 64], ["a", "10010110000", 65], ["b", "10010000110", 66], ["c", "10000101100", 67], ["d", "10000100110", 68], ["e", "10110010000", 69], ["f", "10110000100", 70], ["g", "10011010000", 71], ["h", "10011000010", 72], ["i", "10000110100", 73], ["j", "10000110010", 74], ["k", "11000010010",
        75], ["l", "11001010000", 76], ["m", "11110111010", 77], ["n", "11000010100", 78], ["o", "10001111010", 79], ["p", "10100111100", 80], ["q", "10010111100", 81], ["r", "10010011110", 82], ["s", "10111100100", 83], ["t", "10011110100", 84], ["u", "10011110010", 85], ["v", "11110100100", 86], ["w", "11110010100", 87], ["x", "11110010010", 88], ["y", "11011011110", 89], ["z", "11011110110", 90], ["{", "11110110110", 91], ["|", "10101111000", 92], ["}", "10100011110", 93], ["~", "10001011110", 94], [String.fromCharCode(127), "10111101000", 95], [String.fromCharCode(128),
        "10111100010", 96], [String.fromCharCode(129), "11110101000", 97], [String.fromCharCode(130), "11110100010", 98], [String.fromCharCode(131), "10111011110", 99], [String.fromCharCode(132), "10111101110", 100], [String.fromCharCode(133), "11101011110", 101], [String.fromCharCode(134), "11110101110", 102], [String.fromCharCode(135), "11010000100", 103], [String.fromCharCode(136), "11010010000", 104], [String.fromCharCode(137), "11010011100", 105]], r = /^[!-~ ]+$/, k = {
            code128B: function (b) { return a(b, l, 104, f) }, code128C: function (b) {
                b =
                    b.replace(/ /g, ""); return a(b, d, 105, n)
            }
        }
} function CODE128B(c) { return new CODE128(c, "B") } function CODE128C(c) { return new CODE128(c, "C") }; function CODE39(c) {
    function p() { return -1 == c.search(a) ? !1 : !0 } var m = [[0, "0", "101000111011101"], [1, "1", "111010001010111"], [2, "2", "101110001010111"], [3, "3", "111011100010101"], [4, "4", "101000111010111"], [5, "5", "111010001110101"], [6, "6", "101110001110101"], [7, "7", "101000101110111"], [8, "8", "111010001011101"], [9, "9", "101110001011101"], [10, "A", "111010100010111"], [11, "B", "101110100010111"], [12, "C", "111011101000101"], [13, "D", "101011100010111"], [14, "E", "111010111000101"], [15, "F", "101110111000101"], [16, "G", "101010001110111"],
    [17, "H", "111010100011101"], [18, "I", "101110100011101"], [19, "J", "101011100011101"], [20, "K", "111010101000111"], [21, "L", "101110101000111"], [22, "M", "111011101010001"], [23, "N", "101011101000111"], [24, "O", "111010111010001"], [25, "P", "101110111010001"], [26, "Q", "101010111000111"], [27, "R", "111010101110001"], [28, "S", "101110101110001"], [29, "T", "101011101110001"], [30, "U", "111000101010111"], [31, "V", "100011101010111"], [32, "W", "111000111010101"], [33, "X", "100010111010111"], [34, "Y", "111000101110101"], [35, "Z", "100011101110101"],
    [36, "-", "100010101110111"], [37, ".", "111000101011101"], [38, " ", "100011101011101"], [39, "$", "100010001000101"], [40, "/", "100010001010001"], [41, "+", "100010100010001"], [42, "%", "101000100010001"]]; this.valid = p; this.encoded = function () { if (p(c)) { var a = c, a = a.toUpperCase(), d; d = "1000101110111010"; for (var f = 0; f < a.length; f++) { var n; a: { for (n = 0; n < m.length; n++)if (m[n][1] == a[f]) { n = m[n][2]; break a } n = "" } d += n + "0" } return d + "1000101110111010" } return "" }; var a = /^[0-9a-zA-Z\-\.\ \$\/\+\%]+$/
}; function EAN(c) {
    function p(b, h) { for (var g = "", e = 0; e < b.length; e++)"L" == h[e] ? g += a[b[e]] : "G" == h[e] ? g += l[b[e]] : "R" == h[e] && (g += d[b[e]]); return g } function m(a) { if (-1 == a.search(r)) return !1; for (var b = a[12], g = 0, e = 0; 12 > e; e += 2)g += parseInt(a[e]); for (e = 1; 12 > e; e += 2)g += 3 * parseInt(a[e]); return b == (10 - g % 10) % 10 } this.EANnumber = c + ""; this.valid = function () { return m(this.EANnumber) }; this.encoded = function () {
        if (m(this.EANnumber)) {
            var a = this.EANnumber, d = "", g = a[0], e = a.substr(1, 7), a = a.substr(7, 6), d = d + n, d = d + p(e, f[g]), d = d + h, d =
                d + p(a, "RRRRRR"); return d += b
        } return ""
    }; var a = { 0: "0001101", 1: "0011001", 2: "0010011", 3: "0111101", 4: "0100011", 5: "0110001", 6: "0101111", 7: "0111011", 8: "0110111", 9: "0001011" }, l = { 0: "0100111", 1: "0110011", 2: "0011011", 3: "0100001", 4: "0011101", 5: "0111001", 6: "0000101", 7: "0010001", 8: "0001001", 9: "0010111" }, d = { 0: "1110010", 1: "1100110", 2: "1101100", 3: "1000010", 4: "1011100", 5: "1001110", 6: "1010000", 7: "1000100", 8: "1001000", 9: "1110100" }, f = {
        0: "LLLLLL", 1: "LLGLGG", 2: "LLGGLG", 3: "LLGGGL", 4: "LGLLGG", 5: "LGGLLG", 6: "LGGGLL", 7: "LGLGLG",
        8: "LGLGGL", 9: "LGGLGL"
    }, n = "101", b = "101", h = "01010", r = /^[0-9]{13}$/
} function UPC(c) { this.ean = new EAN("0" + c); this.valid = function () { return this.ean.valid() }; this.encoded = function () { return this.ean.encoded() } }; function ITF(c) { this.ITFNumber = c + ""; this.valid = function () { return -1 !== this.ITFNumber.search(l) }; this.encoded = function () { if (-1 !== this.ITFNumber.search(l)) { var d = this.ITFNumber, f; f = "" + m; for (var n = 0; n < d.length; n += 2) { for (var b = d.substr(n, 2), h = "", c = p[b[0]], b = p[b[1]], k = 0; 5 > k; k++)h += "1" == c[k] ? "111" : "1", h += "1" == b[k] ? "000" : "0"; f += h } return f += a } return "" }; var p = { 0: "00110", 1: "10001", 2: "01001", 3: "11000", 4: "00101", 5: "10100", 6: "01100", 7: "00011", 8: "10010", 9: "01010" }, m = "1010", a = "11101", l = /^([0-9][0-9])+$/ }; function ITF14(c) {
    function p(a) { for (var b = 0, d = 0; 13 > d; d++)b += parseInt(a[d]) * (3 - d % 2 * 2); return 10 - b % 10 } function m(a) { return -1 == a.search(f) ? !1 : 14 == a.length ? a[13] == p(a) : !0 } this.ITF14number = c + ""; this.valid = function () { return m(this.ITF14number) }; this.encoded = function () { if (m(this.ITF14number)) { var f = this.ITF14number, b = ""; 13 == f.length && (f += p(f)); for (var b = b + l, h = 0; 14 > h; h += 2) { for (var c = f.substr(h, 2), k = "", q = a[c[0]], c = a[c[1]], g = 0; 5 > g; g++)k += "1" == q[g] ? "111" : "1", k += "1" == c[g] ? "000" : "0"; b += k } return b += d } return "" };
    var a = { 0: "00110", 1: "10001", 2: "01001", 3: "11000", 4: "00101", 5: "10100", 6: "01100", 7: "00011", 8: "10010", 9: "01010" }, l = "1010", d = "11101", f = /^[0-9]{13,14}$/
}; function pharmacode(c) { function p(c, a) { if (0 == c.length) return ""; var l, d = !1, f; l = c.length - 1; for (f = 0; "0" == c[l] || 0 > l;)f++, l--; 0 == f ? (l = a ? "001" : "00111", d = a) : (l = "001".repeat(f - (a ? 1 : 0)), l += "00111"); return p(c.substr(0, c.length - f - 1), d) + l } this.number = parseInt(c); this.encoded = function () { return this.valid(this.number) ? p(this.number.toString(2), !0).substr(2) : "" }; this.valid = function () { return 3 <= this.number && 131070 >= this.number }; String.prototype.repeat = function (c) { return Array(c + 1).join(this) } }; (function (c) {
    JsBarcode = function (c, m, a, l) {
        a = function (a, b) { var c = {}, d; for (d in a) c[d] = a[d]; for (d in b) c[d] = b[d]; return c }(JsBarcode.defaults, a); var d = c; window.jQuery && d instanceof jQuery && (d = c.get(0)); d instanceof HTMLCanvasElement || (d = document.createElement("canvas")); if (!d.getContext) return c; var f = new window[a.format](m); if (!f.valid()) return l && l(!1), this; var f = f.encoded(), n = function (c) {
            var f, g; g = a.height; b.font = a.fontSize + "px " + a.font; b.textBaseline = "bottom"; b.textBaseline = "top"; "left" == a.textAlign ?
                (f = a.quite, b.textAlign = "left") : "right" == a.textAlign ? (f = d.width - a.quite, b.textAlign = "right") : (f = d.width / 2, b.textAlign = "center"); b.fillText(c, f, g)
        }, b = d.getContext("2d"); d.width = f.length * a.width + 2 * a.quite; d.height = a.height + (a.displayValue ? 1.3 * a.fontSize : 0); b.clearRect(0, 0, d.width, d.height); a.backgroundColor && (b.fillStyle = a.backgroundColor, b.fillRect(0, 0, d.width, d.height)); b.fillStyle = a.lineColor; for (var h = 0; h < f.length; h++) { var r = h * a.width + a.quite; "1" == f[h] && b.fillRect(r, 0, a.width, a.height) } a.displayValue &&
            n(m); uri = d.toDataURL("image/png"); window.jQuery && c instanceof jQuery ? c.get(0) instanceof HTMLCanvasElement || c.attr("src", uri) : c instanceof HTMLCanvasElement || c.setAttribute("src", uri); l && l(!0)
    }; JsBarcode.defaults = { width: 2, height: 100, quite: 10, format: "CODE128", displayValue: !1, font: "monospace", textAlign: "center", fontSize: 12, backgroundColor: "", lineColor: "#000" }; window.jQuery && (c.fn.JsBarcode = function (c, m, a) { JsBarcode(this, c, m, a); return this })
})(window.jQuery);


//! moment.js
//! version : 2.10.3
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
!function (a, b) { "object" == typeof exports && "undefined" != typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : a.moment = b() }(this, function () {
    "use strict"; function a() { return Dc.apply(null, arguments) } function b(a) { Dc = a } function c(a) { return "[object Array]" === Object.prototype.toString.call(a) } function d(a) { return a instanceof Date || "[object Date]" === Object.prototype.toString.call(a) } function e(a, b) { var c, d = []; for (c = 0; c < a.length; ++c)d.push(b(a[c], c)); return d } function f(a, b) { return Object.prototype.hasOwnProperty.call(a, b) } function g(a, b) { for (var c in b) f(b, c) && (a[c] = b[c]); return f(b, "toString") && (a.toString = b.toString), f(b, "valueOf") && (a.valueOf = b.valueOf), a } function h(a, b, c, d) { return za(a, b, c, d, !0).utc() } function i() { return { empty: !1, unusedTokens: [], unusedInput: [], overflow: -2, charsLeftOver: 0, nullInput: !1, invalidMonth: null, invalidFormat: !1, userInvalidated: !1, iso: !1 } } function j(a) { return null == a._pf && (a._pf = i()), a._pf } function k(a) { if (null == a._isValid) { var b = j(a); a._isValid = !isNaN(a._d.getTime()) && b.overflow < 0 && !b.empty && !b.invalidMonth && !b.nullInput && !b.invalidFormat && !b.userInvalidated, a._strict && (a._isValid = a._isValid && 0 === b.charsLeftOver && 0 === b.unusedTokens.length && void 0 === b.bigHour) } return a._isValid } function l(a) { var b = h(0 / 0); return null != a ? g(j(b), a) : j(b).userInvalidated = !0, b } function m(a, b) { var c, d, e; if ("undefined" != typeof b._isAMomentObject && (a._isAMomentObject = b._isAMomentObject), "undefined" != typeof b._i && (a._i = b._i), "undefined" != typeof b._f && (a._f = b._f), "undefined" != typeof b._l && (a._l = b._l), "undefined" != typeof b._strict && (a._strict = b._strict), "undefined" != typeof b._tzm && (a._tzm = b._tzm), "undefined" != typeof b._isUTC && (a._isUTC = b._isUTC), "undefined" != typeof b._offset && (a._offset = b._offset), "undefined" != typeof b._pf && (a._pf = j(b)), "undefined" != typeof b._locale && (a._locale = b._locale), Fc.length > 0) for (c in Fc) d = Fc[c], e = b[d], "undefined" != typeof e && (a[d] = e); return a } function n(b) { m(this, b), this._d = new Date(+b._d), Gc === !1 && (Gc = !0, a.updateOffset(this), Gc = !1) } function o(a) { return a instanceof n || null != a && null != a._isAMomentObject } function p(a) { var b = +a, c = 0; return 0 !== b && isFinite(b) && (c = b >= 0 ? Math.floor(b) : Math.ceil(b)), c } function q(a, b, c) { var d, e = Math.min(a.length, b.length), f = Math.abs(a.length - b.length), g = 0; for (d = 0; e > d; d++)(c && a[d] !== b[d] || !c && p(a[d]) !== p(b[d])) && g++; return g + f } function r() { } function s(a) { return a ? a.toLowerCase().replace("_", "-") : a } function t(a) { for (var b, c, d, e, f = 0; f < a.length;) { for (e = s(a[f]).split("-"), b = e.length, c = s(a[f + 1]), c = c ? c.split("-") : null; b > 0;) { if (d = u(e.slice(0, b).join("-"))) return d; if (c && c.length >= b && q(e, c, !0) >= b - 1) break; b-- } f++ } return null } function u(a) { var b = null; if (!Hc[a] && "undefined" != typeof module && module && module.exports) try { b = Ec._abbr, require("./locale/" + a), v(b) } catch (c) { } return Hc[a] } function v(a, b) { var c; return a && (c = "undefined" == typeof b ? x(a) : w(a, b), c && (Ec = c)), Ec._abbr } function w(a, b) { return null !== b ? (b.abbr = a, Hc[a] || (Hc[a] = new r), Hc[a].set(b), v(a), Hc[a]) : (delete Hc[a], null) } function x(a) { var b; if (a && a._locale && a._locale._abbr && (a = a._locale._abbr), !a) return Ec; if (!c(a)) { if (b = u(a)) return b; a = [a] } return t(a) } function y(a, b) { var c = a.toLowerCase(); Ic[c] = Ic[c + "s"] = Ic[b] = a } function z(a) { return "string" == typeof a ? Ic[a] || Ic[a.toLowerCase()] : void 0 } function A(a) { var b, c, d = {}; for (c in a) f(a, c) && (b = z(c), b && (d[b] = a[c])); return d } function B(b, c) { return function (d) { return null != d ? (D(this, b, d), a.updateOffset(this, c), this) : C(this, b) } } function C(a, b) { return a._d["get" + (a._isUTC ? "UTC" : "") + b]() } function D(a, b, c) { return a._d["set" + (a._isUTC ? "UTC" : "") + b](c) } function E(a, b) { var c; if ("object" == typeof a) for (c in a) this.set(c, a[c]); else if (a = z(a), "function" == typeof this[a]) return this[a](b); return this } function F(a, b, c) { for (var d = "" + Math.abs(a), e = a >= 0; d.length < b;)d = "0" + d; return (e ? c ? "+" : "" : "-") + d } function G(a, b, c, d) { var e = d; "string" == typeof d && (e = function () { return this[d]() }), a && (Mc[a] = e), b && (Mc[b[0]] = function () { return F(e.apply(this, arguments), b[1], b[2]) }), c && (Mc[c] = function () { return this.localeData().ordinal(e.apply(this, arguments), a) }) } function H(a) { return a.match(/\[[\s\S]/) ? a.replace(/^\[|\]$/g, "") : a.replace(/\\/g, "") } function I(a) { var b, c, d = a.match(Jc); for (b = 0, c = d.length; c > b; b++)Mc[d[b]] ? d[b] = Mc[d[b]] : d[b] = H(d[b]); return function (e) { var f = ""; for (b = 0; c > b; b++)f += d[b] instanceof Function ? d[b].call(e, a) : d[b]; return f } } function J(a, b) { return a.isValid() ? (b = K(b, a.localeData()), Lc[b] || (Lc[b] = I(b)), Lc[b](a)) : a.localeData().invalidDate() } function K(a, b) { function c(a) { return b.longDateFormat(a) || a } var d = 5; for (Kc.lastIndex = 0; d >= 0 && Kc.test(a);)a = a.replace(Kc, c), Kc.lastIndex = 0, d -= 1; return a } function L(a, b, c) { _c[a] = "function" == typeof b ? b : function (a) { return a && c ? c : b } } function M(a, b) { return f(_c, a) ? _c[a](b._strict, b._locale) : new RegExp(N(a)) } function N(a) { return a.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (a, b, c, d, e) { return b || c || d || e }).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") } function O(a, b) { var c, d = b; for ("string" == typeof a && (a = [a]), "number" == typeof b && (d = function (a, c) { c[b] = p(a) }), c = 0; c < a.length; c++)ad[a[c]] = d } function P(a, b) { O(a, function (a, c, d, e) { d._w = d._w || {}, b(a, d._w, d, e) }) } function Q(a, b, c) { null != b && f(ad, a) && ad[a](b, c._a, c, a) } function R(a, b) { return new Date(Date.UTC(a, b + 1, 0)).getUTCDate() } function S(a) { return this._months[a.month()] } function T(a) { return this._monthsShort[a.month()] } function U(a, b, c) { var d, e, f; for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), d = 0; 12 > d; d++) { if (e = h([2e3, d]), c && !this._longMonthsParse[d] && (this._longMonthsParse[d] = new RegExp("^" + this.months(e, "").replace(".", "") + "$", "i"), this._shortMonthsParse[d] = new RegExp("^" + this.monthsShort(e, "").replace(".", "") + "$", "i")), c || this._monthsParse[d] || (f = "^" + this.months(e, "") + "|^" + this.monthsShort(e, ""), this._monthsParse[d] = new RegExp(f.replace(".", ""), "i")), c && "MMMM" === b && this._longMonthsParse[d].test(a)) return d; if (c && "MMM" === b && this._shortMonthsParse[d].test(a)) return d; if (!c && this._monthsParse[d].test(a)) return d } } function V(a, b) { var c; return "string" == typeof b && (b = a.localeData().monthsParse(b), "number" != typeof b) ? a : (c = Math.min(a.date(), R(a.year(), b)), a._d["set" + (a._isUTC ? "UTC" : "") + "Month"](b, c), a) } function W(b) { return null != b ? (V(this, b), a.updateOffset(this, !0), this) : C(this, "Month") } function X() { return R(this.year(), this.month()) } function Y(a) { var b, c = a._a; return c && -2 === j(a).overflow && (b = c[cd] < 0 || c[cd] > 11 ? cd : c[dd] < 1 || c[dd] > R(c[bd], c[cd]) ? dd : c[ed] < 0 || c[ed] > 24 || 24 === c[ed] && (0 !== c[fd] || 0 !== c[gd] || 0 !== c[hd]) ? ed : c[fd] < 0 || c[fd] > 59 ? fd : c[gd] < 0 || c[gd] > 59 ? gd : c[hd] < 0 || c[hd] > 999 ? hd : -1, j(a)._overflowDayOfYear && (bd > b || b > dd) && (b = dd), j(a).overflow = b), a } function Z(b) { a.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + b) } function $(a, b) { var c = !0, d = a + "\n" + (new Error).stack; return g(function () { return c && (Z(d), c = !1), b.apply(this, arguments) }, b) } function _(a, b) { kd[a] || (Z(b), kd[a] = !0) } function aa(a) { var b, c, d = a._i, e = ld.exec(d); if (e) { for (j(a).iso = !0, b = 0, c = md.length; c > b; b++)if (md[b][1].exec(d)) { a._f = md[b][0] + (e[6] || " "); break } for (b = 0, c = nd.length; c > b; b++)if (nd[b][1].exec(d)) { a._f += nd[b][0]; break } d.match(Yc) && (a._f += "Z"), ta(a) } else a._isValid = !1 } function ba(b) { var c = od.exec(b._i); return null !== c ? void (b._d = new Date(+c[1])) : (aa(b), void (b._isValid === !1 && (delete b._isValid, a.createFromInputFallback(b)))) } function ca(a, b, c, d, e, f, g) { var h = new Date(a, b, c, d, e, f, g); return 1970 > a && h.setFullYear(a), h } function da(a) { var b = new Date(Date.UTC.apply(null, arguments)); return 1970 > a && b.setUTCFullYear(a), b } function ea(a) { return fa(a) ? 366 : 365 } function fa(a) { return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0 } function ga() { return fa(this.year()) } function ha(a, b, c) { var d, e = c - b, f = c - a.day(); return f > e && (f -= 7), e - 7 > f && (f += 7), d = Aa(a).add(f, "d"), { week: Math.ceil(d.dayOfYear() / 7), year: d.year() } } function ia(a) { return ha(a, this._week.dow, this._week.doy).week } function ja() { return this._week.dow } function ka() { return this._week.doy } function la(a) { var b = this.localeData().week(this); return null == a ? b : this.add(7 * (a - b), "d") } function ma(a) { var b = ha(this, 1, 4).week; return null == a ? b : this.add(7 * (a - b), "d") } function na(a, b, c, d, e) { var f, g, h = da(a, 0, 1).getUTCDay(); return h = 0 === h ? 7 : h, c = null != c ? c : e, f = e - h + (h > d ? 7 : 0) - (e > h ? 7 : 0), g = 7 * (b - 1) + (c - e) + f + 1, { year: g > 0 ? a : a - 1, dayOfYear: g > 0 ? g : ea(a - 1) + g } } function oa(a) { var b = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1; return null == a ? b : this.add(a - b, "d") } function pa(a, b, c) { return null != a ? a : null != b ? b : c } function qa(a) { var b = new Date; return a._useUTC ? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()] : [b.getFullYear(), b.getMonth(), b.getDate()] } function ra(a) { var b, c, d, e, f = []; if (!a._d) { for (d = qa(a), a._w && null == a._a[dd] && null == a._a[cd] && sa(a), a._dayOfYear && (e = pa(a._a[bd], d[bd]), a._dayOfYear > ea(e) && (j(a)._overflowDayOfYear = !0), c = da(e, 0, a._dayOfYear), a._a[cd] = c.getUTCMonth(), a._a[dd] = c.getUTCDate()), b = 0; 3 > b && null == a._a[b]; ++b)a._a[b] = f[b] = d[b]; for (; 7 > b; b++)a._a[b] = f[b] = null == a._a[b] ? 2 === b ? 1 : 0 : a._a[b]; 24 === a._a[ed] && 0 === a._a[fd] && 0 === a._a[gd] && 0 === a._a[hd] && (a._nextDay = !0, a._a[ed] = 0), a._d = (a._useUTC ? da : ca).apply(null, f), null != a._tzm && a._d.setUTCMinutes(a._d.getUTCMinutes() - a._tzm), a._nextDay && (a._a[ed] = 24) } } function sa(a) { var b, c, d, e, f, g, h; b = a._w, null != b.GG || null != b.W || null != b.E ? (f = 1, g = 4, c = pa(b.GG, a._a[bd], ha(Aa(), 1, 4).year), d = pa(b.W, 1), e = pa(b.E, 1)) : (f = a._locale._week.dow, g = a._locale._week.doy, c = pa(b.gg, a._a[bd], ha(Aa(), f, g).year), d = pa(b.w, 1), null != b.d ? (e = b.d, f > e && ++d) : e = null != b.e ? b.e + f : f), h = na(c, d, e, g, f), a._a[bd] = h.year, a._dayOfYear = h.dayOfYear } function ta(b) { if (b._f === a.ISO_8601) return void aa(b); b._a = [], j(b).empty = !0; var c, d, e, f, g, h = "" + b._i, i = h.length, k = 0; for (e = K(b._f, b._locale).match(Jc) || [], c = 0; c < e.length; c++)f = e[c], d = (h.match(M(f, b)) || [])[0], d && (g = h.substr(0, h.indexOf(d)), g.length > 0 && j(b).unusedInput.push(g), h = h.slice(h.indexOf(d) + d.length), k += d.length), Mc[f] ? (d ? j(b).empty = !1 : j(b).unusedTokens.push(f), Q(f, d, b)) : b._strict && !d && j(b).unusedTokens.push(f); j(b).charsLeftOver = i - k, h.length > 0 && j(b).unusedInput.push(h), j(b).bigHour === !0 && b._a[ed] <= 12 && b._a[ed] > 0 && (j(b).bigHour = void 0), b._a[ed] = ua(b._locale, b._a[ed], b._meridiem), ra(b), Y(b) } function ua(a, b, c) { var d; return null == c ? b : null != a.meridiemHour ? a.meridiemHour(b, c) : null != a.isPM ? (d = a.isPM(c), d && 12 > b && (b += 12), d || 12 !== b || (b = 0), b) : b } function va(a) { var b, c, d, e, f; if (0 === a._f.length) return j(a).invalidFormat = !0, void (a._d = new Date(0 / 0)); for (e = 0; e < a._f.length; e++)f = 0, b = m({}, a), null != a._useUTC && (b._useUTC = a._useUTC), b._f = a._f[e], ta(b), k(b) && (f += j(b).charsLeftOver, f += 10 * j(b).unusedTokens.length, j(b).score = f, (null == d || d > f) && (d = f, c = b)); g(a, c || b) } function wa(a) { if (!a._d) { var b = A(a._i); a._a = [b.year, b.month, b.day || b.date, b.hour, b.minute, b.second, b.millisecond], ra(a) } } function xa(a) { var b, e = a._i, f = a._f; return a._locale = a._locale || x(a._l), null === e || void 0 === f && "" === e ? l({ nullInput: !0 }) : ("string" == typeof e && (a._i = e = a._locale.preparse(e)), o(e) ? new n(Y(e)) : (c(f) ? va(a) : f ? ta(a) : d(e) ? a._d = e : ya(a), b = new n(Y(a)), b._nextDay && (b.add(1, "d"), b._nextDay = void 0), b)) } function ya(b) { var f = b._i; void 0 === f ? b._d = new Date : d(f) ? b._d = new Date(+f) : "string" == typeof f ? ba(b) : c(f) ? (b._a = e(f.slice(0), function (a) { return parseInt(a, 10) }), ra(b)) : "object" == typeof f ? wa(b) : "number" == typeof f ? b._d = new Date(f) : a.createFromInputFallback(b) } function za(a, b, c, d, e) { var f = {}; return "boolean" == typeof c && (d = c, c = void 0), f._isAMomentObject = !0, f._useUTC = f._isUTC = e, f._l = c, f._i = a, f._f = b, f._strict = d, xa(f) } function Aa(a, b, c, d) { return za(a, b, c, d, !1) } function Ba(a, b) { var d, e; if (1 === b.length && c(b[0]) && (b = b[0]), !b.length) return Aa(); for (d = b[0], e = 1; e < b.length; ++e)b[e][a](d) && (d = b[e]); return d } function Ca() { var a = [].slice.call(arguments, 0); return Ba("isBefore", a) } function Da() { var a = [].slice.call(arguments, 0); return Ba("isAfter", a) } function Ea(a) { var b = A(a), c = b.year || 0, d = b.quarter || 0, e = b.month || 0, f = b.week || 0, g = b.day || 0, h = b.hour || 0, i = b.minute || 0, j = b.second || 0, k = b.millisecond || 0; this._milliseconds = +k + 1e3 * j + 6e4 * i + 36e5 * h, this._days = +g + 7 * f, this._months = +e + 3 * d + 12 * c, this._data = {}, this._locale = x(), this._bubble() } function Fa(a) { return a instanceof Ea } function Ga(a, b) { G(a, 0, 0, function () { var a = this.utcOffset(), c = "+"; return 0 > a && (a = -a, c = "-"), c + F(~~(a / 60), 2) + b + F(~~a % 60, 2) }) } function Ha(a) { var b = (a || "").match(Yc) || [], c = b[b.length - 1] || [], d = (c + "").match(td) || ["-", 0, 0], e = +(60 * d[1]) + p(d[2]); return "+" === d[0] ? e : -e } function Ia(b, c) { var e, f; return c._isUTC ? (e = c.clone(), f = (o(b) || d(b) ? +b : +Aa(b)) - +e, e._d.setTime(+e._d + f), a.updateOffset(e, !1), e) : Aa(b).local(); return c._isUTC ? Aa(b).zone(c._offset || 0) : Aa(b).local() } function Ja(a) { return 15 * -Math.round(a._d.getTimezoneOffset() / 15) } function Ka(b, c) { var d, e = this._offset || 0; return null != b ? ("string" == typeof b && (b = Ha(b)), Math.abs(b) < 16 && (b = 60 * b), !this._isUTC && c && (d = Ja(this)), this._offset = b, this._isUTC = !0, null != d && this.add(d, "m"), e !== b && (!c || this._changeInProgress ? $a(this, Va(b - e, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, a.updateOffset(this, !0), this._changeInProgress = null)), this) : this._isUTC ? e : Ja(this) } function La(a, b) { return null != a ? ("string" != typeof a && (a = -a), this.utcOffset(a, b), this) : -this.utcOffset() } function Ma(a) { return this.utcOffset(0, a) } function Na(a) { return this._isUTC && (this.utcOffset(0, a), this._isUTC = !1, a && this.subtract(Ja(this), "m")), this } function Oa() { return this._tzm ? this.utcOffset(this._tzm) : "string" == typeof this._i && this.utcOffset(Ha(this._i)), this } function Pa(a) { return a = a ? Aa(a).utcOffset() : 0, (this.utcOffset() - a) % 60 === 0 } function Qa() { return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset() } function Ra() { if (this._a) { var a = this._isUTC ? h(this._a) : Aa(this._a); return this.isValid() && q(this._a, a.toArray()) > 0 } return !1 } function Sa() { return !this._isUTC } function Ta() { return this._isUTC } function Ua() { return this._isUTC && 0 === this._offset } function Va(a, b) { var c, d, e, g = a, h = null; return Fa(a) ? g = { ms: a._milliseconds, d: a._days, M: a._months } : "number" == typeof a ? (g = {}, b ? g[b] = a : g.milliseconds = a) : (h = ud.exec(a)) ? (c = "-" === h[1] ? -1 : 1, g = { y: 0, d: p(h[dd]) * c, h: p(h[ed]) * c, m: p(h[fd]) * c, s: p(h[gd]) * c, ms: p(h[hd]) * c }) : (h = vd.exec(a)) ? (c = "-" === h[1] ? -1 : 1, g = { y: Wa(h[2], c), M: Wa(h[3], c), d: Wa(h[4], c), h: Wa(h[5], c), m: Wa(h[6], c), s: Wa(h[7], c), w: Wa(h[8], c) }) : null == g ? g = {} : "object" == typeof g && ("from" in g || "to" in g) && (e = Ya(Aa(g.from), Aa(g.to)), g = {}, g.ms = e.milliseconds, g.M = e.months), d = new Ea(g), Fa(a) && f(a, "_locale") && (d._locale = a._locale), d } function Wa(a, b) { var c = a && parseFloat(a.replace(",", ".")); return (isNaN(c) ? 0 : c) * b } function Xa(a, b) { var c = { milliseconds: 0, months: 0 }; return c.months = b.month() - a.month() + 12 * (b.year() - a.year()), a.clone().add(c.months, "M").isAfter(b) && --c.months, c.milliseconds = +b - +a.clone().add(c.months, "M"), c } function Ya(a, b) { var c; return b = Ia(b, a), a.isBefore(b) ? c = Xa(a, b) : (c = Xa(b, a), c.milliseconds = -c.milliseconds, c.months = -c.months), c } function Za(a, b) { return function (c, d) { var e, f; return null === d || isNaN(+d) || (_(b, "moment()." + b + "(period, number) is deprecated. Please use moment()." + b + "(number, period)."), f = c, c = d, d = f), c = "string" == typeof c ? +c : c, e = Va(c, d), $a(this, e, a), this } } function $a(b, c, d, e) { var f = c._milliseconds, g = c._days, h = c._months; e = null == e ? !0 : e, f && b._d.setTime(+b._d + f * d), g && D(b, "Date", C(b, "Date") + g * d), h && V(b, C(b, "Month") + h * d), e && a.updateOffset(b, g || h) } function _a(a) { var b = a || Aa(), c = Ia(b, this).startOf("day"), d = this.diff(c, "days", !0), e = -6 > d ? "sameElse" : -1 > d ? "lastWeek" : 0 > d ? "lastDay" : 1 > d ? "sameDay" : 2 > d ? "nextDay" : 7 > d ? "nextWeek" : "sameElse"; return this.format(this.localeData().calendar(e, this, Aa(b))) } function ab() { return new n(this) } function bb(a, b) { var c; return b = z("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = o(a) ? a : Aa(a), +this > +a) : (c = o(a) ? +a : +Aa(a), c < +this.clone().startOf(b)) } function cb(a, b) { var c; return b = z("undefined" != typeof b ? b : "millisecond"), "millisecond" === b ? (a = o(a) ? a : Aa(a), +a > +this) : (c = o(a) ? +a : +Aa(a), +this.clone().endOf(b) < c) } function db(a, b, c) { return this.isAfter(a, c) && this.isBefore(b, c) } function eb(a, b) { var c; return b = z(b || "millisecond"), "millisecond" === b ? (a = o(a) ? a : Aa(a), +this === +a) : (c = +Aa(a), +this.clone().startOf(b) <= c && c <= +this.clone().endOf(b)) } function fb(a) { return 0 > a ? Math.ceil(a) : Math.floor(a) } function gb(a, b, c) { var d, e, f = Ia(a, this), g = 6e4 * (f.utcOffset() - this.utcOffset()); return b = z(b), "year" === b || "month" === b || "quarter" === b ? (e = hb(this, f), "quarter" === b ? e /= 3 : "year" === b && (e /= 12)) : (d = this - f, e = "second" === b ? d / 1e3 : "minute" === b ? d / 6e4 : "hour" === b ? d / 36e5 : "day" === b ? (d - g) / 864e5 : "week" === b ? (d - g) / 6048e5 : d), c ? e : fb(e) } function hb(a, b) { var c, d, e = 12 * (b.year() - a.year()) + (b.month() - a.month()), f = a.clone().add(e, "months"); return 0 > b - f ? (c = a.clone().add(e - 1, "months"), d = (b - f) / (f - c)) : (c = a.clone().add(e + 1, "months"), d = (b - f) / (c - f)), -(e + d) } function ib() { return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ") } function jb() { var a = this.clone().utc(); return 0 < a.year() && a.year() <= 9999 ? "function" == typeof Date.prototype.toISOString ? this.toDate().toISOString() : J(a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : J(a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]") } function kb(b) { var c = J(this, b || a.defaultFormat); return this.localeData().postformat(c) } function lb(a, b) { return this.isValid() ? Va({ to: this, from: a }).locale(this.locale()).humanize(!b) : this.localeData().invalidDate() } function mb(a) { return this.from(Aa(), a) } function nb(a, b) { return this.isValid() ? Va({ from: this, to: a }).locale(this.locale()).humanize(!b) : this.localeData().invalidDate() } function ob(a) { return this.to(Aa(), a) } function pb(a) { var b; return void 0 === a ? this._locale._abbr : (b = x(a), null != b && (this._locale = b), this) } function qb() { return this._locale } function rb(a) { switch (a = z(a)) { case "year": this.month(0); case "quarter": case "month": this.date(1); case "week": case "isoWeek": case "day": this.hours(0); case "hour": this.minutes(0); case "minute": this.seconds(0); case "second": this.milliseconds(0) }return "week" === a && this.weekday(0), "isoWeek" === a && this.isoWeekday(1), "quarter" === a && this.month(3 * Math.floor(this.month() / 3)), this } function sb(a) { return a = z(a), void 0 === a || "millisecond" === a ? this : this.startOf(a).add(1, "isoWeek" === a ? "week" : a).subtract(1, "ms") } function tb() { return +this._d - 6e4 * (this._offset || 0) } function ub() { return Math.floor(+this / 1e3) } function vb() { return this._offset ? new Date(+this) : this._d } function wb() { var a = this; return [a.year(), a.month(), a.date(), a.hour(), a.minute(), a.second(), a.millisecond()] } function xb() { return k(this) } function yb() { return g({}, j(this)) } function zb() { return j(this).overflow } function Ab(a, b) { G(0, [a, a.length], 0, b) } function Bb(a, b, c) { return ha(Aa([a, 11, 31 + b - c]), b, c).week } function Cb(a) { var b = ha(this, this.localeData()._week.dow, this.localeData()._week.doy).year; return null == a ? b : this.add(a - b, "y") } function Db(a) { var b = ha(this, 1, 4).year; return null == a ? b : this.add(a - b, "y") } function Eb() { return Bb(this.year(), 1, 4) } function Fb() { var a = this.localeData()._week; return Bb(this.year(), a.dow, a.doy) } function Gb(a) { return null == a ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (a - 1) + this.month() % 3) } function Hb(a, b) { if ("string" == typeof a) if (isNaN(a)) { if (a = b.weekdaysParse(a), "number" != typeof a) return null } else a = parseInt(a, 10); return a } function Ib(a) { return this._weekdays[a.day()] } function Jb(a) { return this._weekdaysShort[a.day()] } function Kb(a) { return this._weekdaysMin[a.day()] } function Lb(a) { var b, c, d; for (this._weekdaysParse || (this._weekdaysParse = []), b = 0; 7 > b; b++)if (this._weekdaysParse[b] || (c = Aa([2e3, 1]).day(b), d = "^" + this.weekdays(c, "") + "|^" + this.weekdaysShort(c, "") + "|^" + this.weekdaysMin(c, ""), this._weekdaysParse[b] = new RegExp(d.replace(".", ""), "i")), this._weekdaysParse[b].test(a)) return b } function Mb(a) { var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay(); return null != a ? (a = Hb(a, this.localeData()), this.add(a - b, "d")) : b } function Nb(a) { var b = (this.day() + 7 - this.localeData()._week.dow) % 7; return null == a ? b : this.add(a - b, "d") } function Ob(a) { return null == a ? this.day() || 7 : this.day(this.day() % 7 ? a : a - 7) } function Pb(a, b) { G(a, 0, 0, function () { return this.localeData().meridiem(this.hours(), this.minutes(), b) }) } function Qb(a, b) { return b._meridiemParse } function Rb(a) { return "p" === (a + "").toLowerCase().charAt(0) } function Sb(a, b, c) { return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM" } function Tb(a) { G(0, [a, 3], 0, "millisecond") } function Ub() { return this._isUTC ? "UTC" : "" } function Vb() { return this._isUTC ? "Coordinated Universal Time" : "" } function Wb(a) { return Aa(1e3 * a) } function Xb() { return Aa.apply(null, arguments).parseZone() } function Yb(a, b, c) { var d = this._calendar[a]; return "function" == typeof d ? d.call(b, c) : d } function Zb(a) { var b = this._longDateFormat[a]; return !b && this._longDateFormat[a.toUpperCase()] && (b = this._longDateFormat[a.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (a) { return a.slice(1) }), this._longDateFormat[a] = b), b } function $b() { return this._invalidDate } function _b(a) { return this._ordinal.replace("%d", a) } function ac(a) { return a } function bc(a, b, c, d) { var e = this._relativeTime[c]; return "function" == typeof e ? e(a, b, c, d) : e.replace(/%d/i, a) } function cc(a, b) { var c = this._relativeTime[a > 0 ? "future" : "past"]; return "function" == typeof c ? c(b) : c.replace(/%s/i, b) } function dc(a) { var b, c; for (c in a) b = a[c], "function" == typeof b ? this[c] = b : this["_" + c] = b; this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source) } function ec(a, b, c, d) { var e = x(), f = h().set(d, b); return e[c](f, a) } function fc(a, b, c, d, e) { if ("number" == typeof a && (b = a, a = void 0), a = a || "", null != b) return ec(a, b, c, e); var f, g = []; for (f = 0; d > f; f++)g[f] = ec(a, f, c, e); return g } function gc(a, b) { return fc(a, b, "months", 12, "month") } function hc(a, b) { return fc(a, b, "monthsShort", 12, "month") } function ic(a, b) { return fc(a, b, "weekdays", 7, "day") } function jc(a, b) { return fc(a, b, "weekdaysShort", 7, "day") } function kc(a, b) { return fc(a, b, "weekdaysMin", 7, "day") } function lc() { var a = this._data; return this._milliseconds = Rd(this._milliseconds), this._days = Rd(this._days), this._months = Rd(this._months), a.milliseconds = Rd(a.milliseconds), a.seconds = Rd(a.seconds), a.minutes = Rd(a.minutes), a.hours = Rd(a.hours), a.months = Rd(a.months), a.years = Rd(a.years), this } function mc(a, b, c, d) { var e = Va(b, c); return a._milliseconds += d * e._milliseconds, a._days += d * e._days, a._months += d * e._months, a._bubble() } function nc(a, b) { return mc(this, a, b, 1) } function oc(a, b) { return mc(this, a, b, -1) } function pc() { var a, b, c, d = this._milliseconds, e = this._days, f = this._months, g = this._data, h = 0; return g.milliseconds = d % 1e3, a = fb(d / 1e3), g.seconds = a % 60, b = fb(a / 60), g.minutes = b % 60, c = fb(b / 60), g.hours = c % 24, e += fb(c / 24), h = fb(qc(e)), e -= fb(rc(h)), f += fb(e / 30), e %= 30, h += fb(f / 12), f %= 12, g.days = e, g.months = f, g.years = h, this } function qc(a) { return 400 * a / 146097 } function rc(a) { return 146097 * a / 400 } function sc(a) { var b, c, d = this._milliseconds; if (a = z(a), "month" === a || "year" === a) return b = this._days + d / 864e5, c = this._months + 12 * qc(b), "month" === a ? c : c / 12; switch (b = this._days + Math.round(rc(this._months / 12)), a) { case "week": return b / 7 + d / 6048e5; case "day": return b + d / 864e5; case "hour": return 24 * b + d / 36e5; case "minute": return 1440 * b + d / 6e4; case "second": return 86400 * b + d / 1e3; case "millisecond": return Math.floor(864e5 * b) + d; default: throw new Error("Unknown unit " + a) } } function tc() { return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * p(this._months / 12) } function uc(a) { return function () { return this.as(a) } } function vc(a) { return a = z(a), this[a + "s"]() } function wc(a) { return function () { return this._data[a] } } function xc() { return fb(this.days() / 7) } function yc(a, b, c, d, e) { return e.relativeTime(b || 1, !!c, a, d) } function zc(a, b, c) { var d = Va(a).abs(), e = fe(d.as("s")), f = fe(d.as("m")), g = fe(d.as("h")), h = fe(d.as("d")), i = fe(d.as("M")), j = fe(d.as("y")), k = e < ge.s && ["s", e] || 1 === f && ["m"] || f < ge.m && ["mm", f] || 1 === g && ["h"] || g < ge.h && ["hh", g] || 1 === h && ["d"] || h < ge.d && ["dd", h] || 1 === i && ["M"] || i < ge.M && ["MM", i] || 1 === j && ["y"] || ["yy", j]; return k[2] = b, k[3] = +a > 0, k[4] = c, yc.apply(null, k) } function Ac(a, b) { return void 0 === ge[a] ? !1 : void 0 === b ? ge[a] : (ge[a] = b, !0) } function Bc(a) { var b = this.localeData(), c = zc(this, !a, b); return a && (c = b.pastFuture(+this, c)), b.postformat(c) } function Cc() { var a = he(this.years()), b = he(this.months()), c = he(this.days()), d = he(this.hours()), e = he(this.minutes()), f = he(this.seconds() + this.milliseconds() / 1e3), g = this.asSeconds(); return g ? (0 > g ? "-" : "") + "P" + (a ? a + "Y" : "") + (b ? b + "M" : "") + (c ? c + "D" : "") + (d || e || f ? "T" : "") + (d ? d + "H" : "") + (e ? e + "M" : "") + (f ? f + "S" : "") : "P0D" } var Dc, Ec, Fc = a.momentProperties = [], Gc = !1, Hc = {}, Ic = {}, Jc = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g, Kc = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, Lc = {}, Mc = {}, Nc = /\d/, Oc = /\d\d/, Pc = /\d{3}/, Qc = /\d{4}/, Rc = /[+-]?\d{6}/, Sc = /\d\d?/, Tc = /\d{1,3}/, Uc = /\d{1,4}/, Vc = /[+-]?\d{1,6}/, Wc = /\d+/, Xc = /[+-]?\d+/, Yc = /Z|[+-]\d\d:?\d\d/gi, Zc = /[+-]?\d+(\.\d{1,3})?/, $c = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, _c = {}, ad = {}, bd = 0, cd = 1, dd = 2, ed = 3, fd = 4, gd = 5, hd = 6; G("M", ["MM", 2], "Mo", function () { return this.month() + 1 }), G("MMM", 0, 0, function (a) { return this.localeData().monthsShort(this, a) }), G("MMMM", 0, 0, function (a) { return this.localeData().months(this, a) }), y("month", "M"), L("M", Sc), L("MM", Sc, Oc), L("MMM", $c), L("MMMM", $c), O(["M", "MM"], function (a, b) { b[cd] = p(a) - 1 }), O(["MMM", "MMMM"], function (a, b, c, d) { var e = c._locale.monthsParse(a, d, c._strict); null != e ? b[cd] = e : j(c).invalidMonth = a }); var id = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), jd = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), kd = {}; a.suppressDeprecationWarnings = !1; var ld = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, md = [["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/], ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/], ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/], ["GGGG-[W]WW", /\d{4}-W\d{2}/], ["YYYY-DDD", /\d{4}-\d{3}/]], nd = [["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/], ["HH:mm", /(T| )\d\d:\d\d/], ["HH", /(T| )\d\d/]], od = /^\/?Date\((\-?\d+)/i; a.createFromInputFallback = $("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function (a) { a._d = new Date(a._i + (a._useUTC ? " UTC" : "")) }), G(0, ["YY", 2], 0, function () { return this.year() % 100 }), G(0, ["YYYY", 4], 0, "year"), G(0, ["YYYYY", 5], 0, "year"), G(0, ["YYYYYY", 6, !0], 0, "year"), y("year", "y"), L("Y", Xc), L("YY", Sc, Oc), L("YYYY", Uc, Qc), L("YYYYY", Vc, Rc), L("YYYYYY", Vc, Rc), O(["YYYY", "YYYYY", "YYYYYY"], bd), O("YY", function (b, c) { c[bd] = a.parseTwoDigitYear(b) }), a.parseTwoDigitYear = function (a) { return p(a) + (p(a) > 68 ? 1900 : 2e3) }; var pd = B("FullYear", !1); G("w", ["ww", 2], "wo", "week"), G("W", ["WW", 2], "Wo", "isoWeek"), y("week", "w"), y("isoWeek", "W"), L("w", Sc), L("ww", Sc, Oc), L("W", Sc), L("WW", Sc, Oc), P(["w", "ww", "W", "WW"], function (a, b, c, d) { b[d.substr(0, 1)] = p(a) }); var qd = { dow: 0, doy: 6 }; G("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), y("dayOfYear", "DDD"), L("DDD", Tc), L("DDDD", Pc), O(["DDD", "DDDD"], function (a, b, c) { c._dayOfYear = p(a) }), a.ISO_8601 = function () { }; var rd = $("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function () { var a = Aa.apply(null, arguments); return this > a ? this : a }), sd = $("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function () { var a = Aa.apply(null, arguments); return a > this ? this : a }); Ga("Z", ":"), Ga("ZZ", ""), L("Z", Yc), L("ZZ", Yc), O(["Z", "ZZ"], function (a, b, c) { c._useUTC = !0, c._tzm = Ha(a) }); var td = /([\+\-]|\d\d)/gi; a.updateOffset = function () { }; var ud = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, vd = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/; Va.fn = Ea.prototype; var wd = Za(1, "add"), xd = Za(-1, "subtract"); a.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ"; var yd = $("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function (a) { return void 0 === a ? this.localeData() : this.locale(a) }); G(0, ["gg", 2], 0, function () { return this.weekYear() % 100 }), G(0, ["GG", 2], 0, function () { return this.isoWeekYear() % 100 }), Ab("gggg", "weekYear"), Ab("ggggg", "weekYear"), Ab("GGGG", "isoWeekYear"), Ab("GGGGG", "isoWeekYear"), y("weekYear", "gg"), y("isoWeekYear", "GG"), L("G", Xc), L("g", Xc), L("GG", Sc, Oc), L("gg", Sc, Oc), L("GGGG", Uc, Qc), L("gggg", Uc, Qc), L("GGGGG", Vc, Rc), L("ggggg", Vc, Rc), P(["gggg", "ggggg", "GGGG", "GGGGG"], function (a, b, c, d) { b[d.substr(0, 2)] = p(a) }), P(["gg", "GG"], function (b, c, d, e) { c[e] = a.parseTwoDigitYear(b) }), G("Q", 0, 0, "quarter"), y("quarter", "Q"), L("Q", Nc), O("Q", function (a, b) { b[cd] = 3 * (p(a) - 1) }), G("D", ["DD", 2], "Do", "date"), y("date", "D"), L("D", Sc), L("DD", Sc, Oc), L("Do", function (a, b) { return a ? b._ordinalParse : b._ordinalParseLenient }), O(["D", "DD"], dd), O("Do", function (a, b) { b[dd] = p(a.match(Sc)[0], 10) }); var zd = B("Date", !0); G("d", 0, "do", "day"), G("dd", 0, 0, function (a) { return this.localeData().weekdaysMin(this, a) }), G("ddd", 0, 0, function (a) { return this.localeData().weekdaysShort(this, a) }), G("dddd", 0, 0, function (a) { return this.localeData().weekdays(this, a) }), G("e", 0, 0, "weekday"), G("E", 0, 0, "isoWeekday"), y("day", "d"), y("weekday", "e"), y("isoWeekday", "E"), L("d", Sc), L("e", Sc), L("E", Sc), L("dd", $c), L("ddd", $c), L("dddd", $c), P(["dd", "ddd", "dddd"], function (a, b, c) { var d = c._locale.weekdaysParse(a); null != d ? b.d = d : j(c).invalidWeekday = a }), P(["d", "e", "E"], function (a, b, c, d) { b[d] = p(a) }); var Ad = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), Bd = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), Cd = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"); G("H", ["HH", 2], 0, "hour"), G("h", ["hh", 2], 0, function () { return this.hours() % 12 || 12 }), Pb("a", !0), Pb("A", !1), y("hour", "h"), L("a", Qb), L("A", Qb), L("H", Sc), L("h", Sc), L("HH", Sc, Oc), L("hh", Sc, Oc), O(["H", "HH"], ed), O(["a", "A"], function (a, b, c) { c._isPm = c._locale.isPM(a), c._meridiem = a }), O(["h", "hh"], function (a, b, c) { b[ed] = p(a), j(c).bigHour = !0 }); var Dd = /[ap]\.?m?\.?/i, Ed = B("Hours", !0); G("m", ["mm", 2], 0, "minute"), y("minute", "m"), L("m", Sc), L("mm", Sc, Oc), O(["m", "mm"], fd); var Fd = B("Minutes", !1); G("s", ["ss", 2], 0, "second"), y("second", "s"), L("s", Sc), L("ss", Sc, Oc), O(["s", "ss"], gd); var Gd = B("Seconds", !1); G("S", 0, 0, function () { return ~~(this.millisecond() / 100) }), G(0, ["SS", 2], 0, function () { return ~~(this.millisecond() / 10) }), Tb("SSS"), Tb("SSSS"), y("millisecond", "ms"), L("S", Tc, Nc), L("SS", Tc, Oc), L("SSS", Tc, Pc), L("SSSS", Wc), O(["S", "SS", "SSS", "SSSS"], function (a, b) { b[hd] = p(1e3 * ("0." + a)) }); var Hd = B("Milliseconds", !1); G("z", 0, 0, "zoneAbbr"), G("zz", 0, 0, "zoneName"); var Id = n.prototype; Id.add = wd, Id.calendar = _a, Id.clone = ab, Id.diff = gb, Id.endOf = sb, Id.format = kb, Id.from = lb, Id.fromNow = mb, Id.to = nb, Id.toNow = ob, Id.get = E, Id.invalidAt = zb, Id.isAfter = bb, Id.isBefore = cb, Id.isBetween = db, Id.isSame = eb, Id.isValid = xb, Id.lang = yd, Id.locale = pb, Id.localeData = qb, Id.max = sd, Id.min = rd, Id.parsingFlags = yb, Id.set = E, Id.startOf = rb, Id.subtract = xd, Id.toArray = wb, Id.toDate = vb, Id.toISOString = jb, Id.toJSON = jb, Id.toString = ib, Id.unix = ub, Id.valueOf = tb, Id.year = pd, Id.isLeapYear = ga, Id.weekYear = Cb, Id.isoWeekYear = Db, Id.quarter = Id.quarters = Gb, Id.month = W, Id.daysInMonth = X, Id.week = Id.weeks = la, Id.isoWeek = Id.isoWeeks = ma, Id.weeksInYear = Fb, Id.isoWeeksInYear = Eb, Id.date = zd, Id.day = Id.days = Mb, Id.weekday = Nb, Id.isoWeekday = Ob, Id.dayOfYear = oa, Id.hour = Id.hours = Ed, Id.minute = Id.minutes = Fd, Id.second = Id.seconds = Gd, Id.millisecond = Id.milliseconds = Hd, Id.utcOffset = Ka, Id.utc = Ma, Id.local = Na, Id.parseZone = Oa, Id.hasAlignedHourOffset = Pa, Id.isDST = Qa, Id.isDSTShifted = Ra, Id.isLocal = Sa, Id.isUtcOffset = Ta, Id.isUtc = Ua, Id.isUTC = Ua, Id.zoneAbbr = Ub, Id.zoneName = Vb, Id.dates = $("dates accessor is deprecated. Use date instead.", zd), Id.months = $("months accessor is deprecated. Use month instead", W), Id.years = $("years accessor is deprecated. Use year instead", pd), Id.zone = $("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", La); var Jd = Id, Kd = { sameDay: "[Today at] LT", nextDay: "[Tomorrow at] LT", nextWeek: "dddd [at] LT", lastDay: "[Yesterday at] LT", lastWeek: "[Last] dddd [at] LT", sameElse: "L" }, Ld = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY LT", LLLL: "dddd, MMMM D, YYYY LT" }, Md = "Invalid date", Nd = "%d", Od = /\d{1,2}/, Pd = {
        future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour",
        hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years"
    }, Qd = r.prototype; Qd._calendar = Kd, Qd.calendar = Yb, Qd._longDateFormat = Ld, Qd.longDateFormat = Zb, Qd._invalidDate = Md, Qd.invalidDate = $b, Qd._ordinal = Nd, Qd.ordinal = _b, Qd._ordinalParse = Od, Qd.preparse = ac, Qd.postformat = ac, Qd._relativeTime = Pd, Qd.relativeTime = bc, Qd.pastFuture = cc, Qd.set = dc, Qd.months = S, Qd._months = id, Qd.monthsShort = T, Qd._monthsShort = jd, Qd.monthsParse = U, Qd.week = ia, Qd._week = qd, Qd.firstDayOfYear = ka, Qd.firstDayOfWeek = ja, Qd.weekdays = Ib, Qd._weekdays = Ad, Qd.weekdaysMin = Kb, Qd._weekdaysMin = Cd, Qd.weekdaysShort = Jb, Qd._weekdaysShort = Bd, Qd.weekdaysParse = Lb, Qd.isPM = Rb, Qd._meridiemParse = Dd, Qd.meridiem = Sb, v("en", { ordinalParse: /\d{1,2}(th|st|nd|rd)/, ordinal: function (a) { var b = a % 10, c = 1 === p(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th"; return a + c } }), a.lang = $("moment.lang is deprecated. Use moment.locale instead.", v), a.langData = $("moment.langData is deprecated. Use moment.localeData instead.", x); var Rd = Math.abs, Sd = uc("ms"), Td = uc("s"), Ud = uc("m"), Vd = uc("h"), Wd = uc("d"), Xd = uc("w"), Yd = uc("M"), Zd = uc("y"), $d = wc("milliseconds"), _d = wc("seconds"), ae = wc("minutes"), be = wc("hours"), ce = wc("days"), de = wc("months"), ee = wc("years"), fe = Math.round, ge = { s: 45, m: 45, h: 22, d: 26, M: 11 }, he = Math.abs, ie = Ea.prototype; ie.abs = lc, ie.add = nc, ie.subtract = oc, ie.as = sc, ie.asMilliseconds = Sd, ie.asSeconds = Td, ie.asMinutes = Ud, ie.asHours = Vd, ie.asDays = Wd, ie.asWeeks = Xd, ie.asMonths = Yd, ie.asYears = Zd, ie.valueOf = tc, ie._bubble = pc, ie.get = vc, ie.milliseconds = $d, ie.seconds = _d, ie.minutes = ae, ie.hours = be, ie.days = ce, ie.weeks = xc, ie.months = de, ie.years = ee, ie.humanize = Bc, ie.toISOString = Cc, ie.toString = Cc, ie.toJSON = Cc, ie.locale = pb, ie.localeData = qb, ie.toIsoString = $("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", Cc), ie.lang = yd, G("X", 0, 0, "unix"), G("x", 0, 0, "valueOf"), L("x", Xc), L("X", Zc), O("X", function (a, b, c) { c._d = new Date(1e3 * parseFloat(a, 10)) }), O("x", function (a, b, c) { c._d = new Date(p(a)) }), a.version = "2.10.3", b(Aa), a.fn = Jd, a.min = Ca, a.max = Da, a.utc = h, a.unix = Wb, a.months = gc, a.isDate = d, a.locale = v, a.invalid = l, a.duration = Va, a.isMoment = o, a.weekdays = ic, a.parseZone = Xb, a.localeData = x, a.isDuration = Fa, a.monthsShort = hc, a.weekdaysMin = kc, a.defineLocale = w, a.weekdaysShort = jc, a.normalizeUnits = z, a.relativeTimeThreshold = Ac; var je = a; return je
});

/********************
moment js recur 
********************/
!function (a, b) { "object" == typeof exports ? module.exports = b(require("moment")) : "function" == typeof define && define.amd ? define("moment-recur", ["moment"], b) : a.moment = b(a.moment) }(this, function (a) { var b; if (b = "undefined" != typeof module && null !== module && null != module.exports, "undefined" == typeof a) throw Error("Can't find moment"); var c = function () { function a(a, b) { for (var c in a) if (a.hasOwnProperty(c) && parseInt(c, 10) <= 0) throw Error("Intervals must be greater than zero"); return { measure: b.toLowerCase(), units: a } } function b(a, b, c, d) { var e = null; e = d.isBefore(c) ? c.diff(d, a, !0) : d.diff(c, a, !0), "days" == a && (e = parseInt(e)); for (var f in b) if (b.hasOwnProperty(f) && (f = parseInt(f, 10), e % f === 0)) return !0; return !1 } return { create: a, match: b } }(), d = function () { function b(a, b, c) { c.forEach(function (c) { if (a > c || c > b) throw Error("Value should be in range " + a + " to " + b) }) } function c(b, c) { var d, e, f, g = {}; for (d in b) b.hasOwnProperty(d) && (e = parseInt(d, 10), isNaN(e) && (e = d), f = a().set(c, e).get(c), g[f] = b[d]); return g } function d(a, d) { var e = []; "daysOfWeek" === d && (a = c(a, "days")), "monthsOfYear" === d && (a = c(a, "months")); for (var f in a) hasOwnProperty.call(a, f) && e.push(f); return b(g[d].low, g[d].high, e), { measure: d, units: a } } function e(a, b, c) { var d = f[a], e = c[d](); if (b[e]) return !0; if ("date" === d && e == c.add(1, "months").date(0).format("D") && 31 > e) for (; 31 >= e;) { if (b[e]) return !0; e++ } return !1 } var f = { daysOfMonth: "date", daysOfWeek: "day", weeksOfMonth: "monthWeek", weeksOfMonthByDay: "monthWeekByDay", weeksOfYear: "weeks", monthsOfYear: "months" }, g = { daysOfMonth: { low: 1, high: 31 }, daysOfWeek: { low: 0, high: 6 }, weeksOfMonth: { low: 0, high: 4 }, weeksOfMonthByDay: { low: 0, high: 4 }, weeksOfYear: { low: 0, high: 52 }, monthsOfYear: { low: 0, high: 11 } }; return { create: d, match: e } }(), e = function () { function b() { var a, b = l[this.measure]; if (!(this instanceof n)) throw Error("Private method trigger() was called directly or not called as instance of Recur!"); if ("undefined" == typeof this.units || null === this.units || !this.measure) return this; if ("calendar" !== b && "interval" !== b) throw Error("Invlid measure provided: " + this.measure); if ("interval" === b) { if (!this.start) throw Error("Must have a start date set to set an interval!"); a = c.create(this.units, this.measure) } if ("calendar" === b && (a = d.create(this.units, this.measure)), this.units = null, this.measure = null, "weeksOfMonthByDay" === a.measure && !this.hasRule("daysOfWeek")) throw Error("weeksOfMonthByDay must be combined with daysOfWeek"); for (var e = 0; e < this.rules.length; e++)this.rules[e].measure === a.measure && this.rules.splice(e, 1); return this.rules.push(a), this } function e(a, b, c) { var d, e, f = []; if (!(this instanceof n)) throw Error("Private method trigger() was called directly or not called as instance of Recur!"); if (!this.start && !this.from) throw Error("Cannot get occurances without start or from date."); if ("all" === c && !this.end) throw Error("Cannot get all occurances without an end date."); if (this.end && this.start > this.end) throw Error("Start date cannot be later than end date."); if ("all" !== c && !(a > 0)) return f; for (d = (this.from || this.start).clone(), "all" === c && this.matches(d, !1) && (e = b ? d.format(b) : d.clone(), f.push(e)); f.length < (null === a ? f.length + 1 : a) && ("next" === c || "all" === c ? d.add(1, "day") : d.subtract(1, "day"), this.matches(d, "all" === c ? !1 : !0) && (e = b ? d.format(b) : d.clone(), f.push(e)), !("all" === c && d >= this.end));); return f } function f(a, b, c) { return a && c.isBefore(a) ? !1 : b && c.isAfter(b) ? !1 : !0 } function g(a) { var b = {}; if ("[object Array]" == Object.prototype.toString.call(a)) a.forEach(function (a) { b[a] = !0 }); else if (a === Object(a)) b = a; else { if ("[object Number]" != Object.prototype.toString.call(a) && "[object String]" != Object.prototype.toString.call(a)) throw Error("Provide an array, object, string or number when passing units!"); b[a] = !0 } return b } function h(b, c) { for (var d = 0, e = b.length; e > d; d++)if (a(b[d]).isSame(c)) return !0; return !1 } function i(a) { switch (a) { case "day": return "days"; case "week": return "weeks"; case "month": return "months"; case "year": return "years"; case "dayOfWeek": return "daysOfWeek"; case "dayOfMonth": return "daysOfMonth"; case "weekOfMonth": return "weeksOfMonth"; case "weekOfMonthByDay": return "weeksOfMonthByDay"; case "weekOfYear": return "weeksOfYear"; case "monthOfYear": return "monthsOfYear"; default: return a } } function j(a, b, e) { var f, g, h, i; for (f = 0, g = a.length; g > f; f++)if (h = a[f], i = l[h.measure], "interval" === i) { if (!c.match(h.measure, h.units, e, b)) return !1 } else { if ("calendar" !== i) return !1; if (!d.match(h.measure, h.units, b)) return !1 } return !0 } function k(a) { return function (b) { return this.every.call(this, b, a), this } } var l = { days: "interval", weeks: "interval", months: "interval", years: "interval", daysOfWeek: "calendar", daysOfMonth: "calendar", weeksOfMonth: "calendar", weeksOfMonthByDay: "calendar", weeksOfYear: "calendar", monthsOfYear: "calendar" }, m = { days: "day", weeks: "week", months: "month", years: "year", daysOfWeek: "dayOfWeek", daysOfMonth: "dayOfMonth", weeksOfMonth: "weekOfMonth", weeksOfMonthByDay: "weekOfMonthByDay", weeksOfYear: "weekOfYear", monthsOfYear: "monthOfYear" }, n = function (b) { b.start && (this.start = a(b.start).dateOnly()), b.end && (this.end = a(b.end).dateOnly()), this.rules = b.rules || []; var c = b.exceptions || []; this.exceptions = []; for (var d = 0; d < c.length; d++)this.except(c[d]); return this.units = null, this.measure = null, this.from = null, this }; n.prototype.startDate = function (b) { return null === b ? (this.start = null, this) : b ? (this.start = a(b).dateOnly(), this) : this.start }, n.prototype.endDate = function (b) { return null === b ? (this.end = null, this) : b ? (this.end = a(b).dateOnly(), this) : this.end }, n.prototype.fromDate = function (b) { return null === b ? (this.from = null, this) : b ? (this.from = a(b).dateOnly(), this) : this.from }, n.prototype.save = function () { var b = {}; this.start && a(this.start).isValid() && (b.start = this.start.format("L")), this.end && a(this.end).isValid() && (b.end = this.end.format("L")), b.exceptions = []; for (var c = 0, d = this.exceptions.length; d > c; c++)b.exceptions.push(this.exceptions[c].format("L")); return b.rules = this.rules, b }, n.prototype.repeats = function () { return this.rules.length > 0 ? !0 : !1 }, n.prototype.every = function (a, c) { return "undefined" != typeof a && null !== a && (this.units = g(a)), "undefined" != typeof c && null !== c && (this.measure = i(c)), b.call(this) }, n.prototype.except = function (b) { return b = a(b).dateOnly(), this.exceptions.push(b), this }, n.prototype.forget = function (b) { var c, d, e = a(b); if (e.isValid()) { for (e = e.dateOnly(), c = 0, d = this.exceptions.length; d > c; c++)if (e.isSame(this.exceptions[c])) return this.exceptions.splice(c, 1), this; return this } for (c = 0, d = this.rules.length; d > c; c++)this.rules[c].measure === i(b) && this.rules.splice(c, 1) }, n.prototype.hasRule = function (a) { var b, c; for (b = 0, c = this.rules.length; c > b; b++)if (this.rules[b].measure === i(a)) return !0; return !1 }, n.prototype.matches = function (b, c) { var d = a(b).dateOnly(); if (!d.isValid()) throw Error("Invalid date supplied to match method: " + b); return c || f(this.start, this.end, d) ? h(this.exceptions, d) ? !1 : j(this.rules, d, this.start) ? !0 : !1 : !1 }, n.prototype.next = function (a, b) { return e.call(this, a, b, "next") }, n.prototype.previous = function (a, b) { return e.call(this, a, b, "previous") }, n.prototype.all = function (a) { return e.call(this, null, a, "all") }; for (var o in m) l.hasOwnProperty(o) && (n.prototype[o] = n.prototype[m[o]] = k(o)); return n }(); return a.recur = function (b, c) { return new e(b !== Object(b) || a.isMoment(b) ? { start: b, end: c } : b) }, a.fn.recur = function (b, c) { return b !== Object(b) || a.isMoment(b) ? (c || (c = b, b = void 0), b || (b = this), new e({ start: b, end: c, moment: this })) : ("undefined" == typeof b.start && (b.start = this), new e(b)) }, a.fn.monthWeek = function () { var a = this.clone().startOf("month").startOf("week"), b = this.clone().startOf("week"); return b.diff(a, "weeks") }, a.fn.monthWeekByDay = function () { var a, b, c, d; return a = this.clone(), b = this.clone().startOf("month").startOf("week"), c = this.clone().startOf("week"), d = c.diff(b, "weeks"), a.subtract(d, "weeks").month() === this.clone().month() ? d : d - 1 }, a.fn.dateOnly = function () { return this.tz && "function" == typeof a.tz ? a.tz(this.format("YYYY/MM/DD"), "UTC") : this.hours(0).minutes(0).seconds(0).milliseconds(0).add(this.utcOffset(), "minute").utcOffset(0) }, a });

//! moment.js locale configuration
//! locale : Portuguese (Brazil) [pt-br]
//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

; (function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        && typeof require === 'function' ? factory(require('../moment')) :
        typeof define === 'function' && define.amd ? define(['../moment'], factory) :
            factory(global.moment)
}(this, function (moment) {
    'use strict';


    var pt_br = moment.defineLocale('pt-br', {
        months: 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
        monthsShort: 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
        weekdays: 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
        weekdaysShort: 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
        weekdaysMin: 'Dom_2ª_3ª_4ª_5ª_6ª_Sáb'.split('_'),
        weekdaysParseExact: true,
        longDateFormat: {
            LT: 'HH:mm',
            LTS: 'HH:mm:ss',
            L: 'DD/MM/YYYY',
            LL: 'D [de] MMMM [de] YYYY',
            LLL: 'D [de] MMMM [de] YYYY [às] HH:mm',
            LLLL: 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
        },
        calendar: {
            sameDay: '[Hoje às] LT',
            nextDay: '[Amanhã às] LT',
            nextWeek: 'dddd [às] LT',
            lastDay: '[Ontem às] LT',
            lastWeek: function () {
                return (this.day() === 0 || this.day() === 6) ?
                    '[Último] dddd [às] LT' : // Saturday + Sunday
                    '[Última] dddd [às] LT'; // Monday - Friday
            },
            sameElse: 'L'
        },
        relativeTime: {
            future: 'em %s',
            past: '%s atrás',
            s: 'poucos segundos',
            m: 'um minuto',
            mm: '%d minutos',
            h: 'uma hora',
            hh: '%d horas',
            d: 'um dia',
            dd: '%d dias',
            M: 'um mês',
            MM: '%d meses',
            y: 'um ano',
            yy: '%d anos'
        },
        ordinalParse: /\d{1,2}º/,
        ordinal: '%dº'
    });

    return pt_br;

}));