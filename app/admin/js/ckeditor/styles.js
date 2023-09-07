/**
 * Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// This file contains style definitions that can be used by CKEditor plugins.
//
// The most common use for it is the "stylescombo" plugin which shows the Styles drop-down
// list containing all styles in the editor toolbar. Other plugins, like
// the "div" plugin, use a subset of the styles for their features.
//
// If you do not have plugins that depend on this file in your editor build, you can simply
// ignore it. Otherwise it is strongly recommended to customize this file to match your
// website requirements and design properly.
//
// For more information refer to: https://ckeditor.com/docs/ckeditor4/latest/guide/dev_styles.html#style-rules

CKEDITOR.stylesSet.add( 'default', [


	/* Block styles */

	{
		name: 'Box cinza',
		element: 'div',
		styles: {
			padding: '.5rem 1.0rem',
			background: '#eee',
			border: '1px solid #ccc'
		}
	},
	{
		name: 'Box de informação',
		element: 'div',
		attributes: { 'class': 'box-one' }
	},


	/* Inline styles */

	{ name: 'Cor primária', element: 'span', attributes: { 'class': 'color-one' } },
	{ name: 'Cor destacada', element: 'span', attributes: { 'class': 'color-accent' } },
	{ name: 'Fonte cursiva', element: 'span', attributes: { 'class': 'font-cursiva' } },
	{ name: 'Marca-texto', element: 'mark', attributes: { 'class': 'marker' } },
	{ name: 'Texto monoespaçado',	element: 'code' },
	{ name: 'Texto deletado',		element: 'del' },
	{ name: 'Texto sublinhado',	element: 'ins' },


	/* Object styles */

	{
		name: 'Imagem à direita',
		element: 'img',
		styles: {
			'float': 'right'
		}
	},
	{
		name: 'Imagem à esquerda',
		element: 'img',
		styles: {
			'float': 'left'
		}
	},
	{
		name: 'Imagem com largura 100%',
		element: 'img',
		styles: {
			'width': '100%',
			'height': 'auto'
		}
	},
	{
		name: 'Tabela com borda',
		element: 'table',
		attributes: {
			cellpadding: '5',
			cellspacing: '5',
			class: 'ark-table --border'
		},
		styles: {
			'width': '100%'
		}
	},
	{
		name: 'Tabela zebrada',
		element: 'table',
		attributes: {
			cellpadding: '5',
			cellspacing: '5',
			class: 'ark-table --zebra'
		},
		styles: {
			'width': '100%'
		}
	},
	{
		name: 'Tabela cabeçalho claro',
		element: 'table',
		attributes: {
			cellpadding: '5',
			cellspacing: '5',
			class: 'ark-table --lighthead'
		},
		styles: {
			'width': '100%'
		}
	},
	{
		name: 'Tabela cabeçalho escuro',
		element: 'table',
		attributes: {
			cellpadding: '5',
			cellspacing: '5',
			class: 'ark-table --darkhead'
		},
		styles: {
			'width': '100%'
		}
	},
	{
		name: 'Tabela compacta',
		element: 'table',
		attributes: {
			cellpadding: '0',
			cellspacing: '0',
			class: 'ark-table --border --small'
		},
		styles: {
			'width': '100%'
		}
	},
	{
		name: 'Lista quadrada',
		element: 'ul',
		attributes: {
			class: '--lista-quadrada'
		}
	}

] );

