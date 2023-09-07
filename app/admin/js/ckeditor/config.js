/** CONFIG.JS
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {

	config.fontSize_sizes = '10/1.0rem;11/1.1rem;12/1.2rem;13/1.3rem;14/1.4rem;15/1.5rem;16/1.6rem;18/1.8rem;20/2.0rem;24/2.4rem;28/2.8rem;30/3.0rem;36/3.6rem;42/4.2rem;';

	config.toolbarGroups = [
		{ name: 'basicstyles', groups: [ 'basicstyles'] },
		{ name: 'colors', groups: [ 'colors'  ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'cleanup', groups: [ 'cleanup'  ] },
		"/",
		
		{ name: 'clipboard', groups: [ 'clipboard' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] },
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] }
	]; 
	config.removeButtons = 'Subscript,Superscript,Font,Save,NewPage,Preview,Print,PasteText,PasteFromWord,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,About,Flash,Smiley,SpecialChar,Iframe,CopyFormatting,CreateDiv,Blockquote,Language,BidiRtl,BidiLtr,PageBreak';

	config.bodyClass = "cms-zona";
	config.toolbarCanCollapse = true;
	config.allowedContent = true;
	config.autoGrow_onStartup = true;

};