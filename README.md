# jsPDF-CustomFonts-support
[![Build Status](https://travis-ci.org/sphilee/jsPDF-CustomFonts-support.svg?branch=master)](https://travis-ci.org/sphilee/jsPDF-CustomFonts-support/branches)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JsPDF is an open source that loads JavaScript in an HTML5 environment and creates a pdf document.

The current version does not support Custom Fonts. I will try to implement this feature.

## Demo

It's on the [GitHub Pages](https://sphilee.github.io/jsPDF-CustomFonts-support/).

## Current Version

Version 0.0.4

[jsPDF libary](http://parall.ax/products/jspdf)

I do not claim to be the author of the jsPDF library, this code simply adds preliminary custom fonts support.

## Version History

0.0.1 Initial proof of concept

0.0.2 Support multiline text

0.0.3 Refactor multiline text

0.0.4 Make into a plugin

## Install

Download and include [jspdf.customfonts.min.js](https://rawgit.com/sphilee/jsPDF-CustomFonts-support/master/dist/jspdf.customfonts.min.js).

You can also get the plugin with a package manager:
- ```npm install jspdf-customfonts```


## Getting Started

This document will walk you through the basics of jsPDF and will show you how to create PDF files in the browser.

To begin with the default configuration, you should include 3 files:

* **https://unpkg.com/jspdf@latest/dist/jspdf.min.js**,
* **dist/jspdf.customfonts.min.js**,
* **dist/default_vfs.js** - default vfs font definition (it contains 1 Font)
	* however you can use custom fonts according to the following detailed instructions :
        1. Run ``npm install``
		1. Copy your fonts into the **fonts** subdirectory.
		2. Run ```node makeFonts.js``` to create a new dist/default_vfs.js.
		3. Include your new **dist/default_vfs.js** file in your code.

```html
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <title>jsPDF customfonts example</title>
    <script src="https://unpkg.com/jspdf@latest/dist/jspdf.min.js"></script>
    <script src="dist/jspdf.customfonts.min.js"></script>
    <script src="dist/default_vfs.js"></script>
</head>
<body>
...
```


## addFileToVFS Method

```javascript
doc.addFileToVFS(fileName, Base64content);
```

## addFont Method

```javascript
doc.addFont(fileName, fontName, fontStyle);
```

## Example Code

```javascript
var doc = new jsPDF();

doc.addFont('NotoSansCJKjp-Regular.ttf', 'NotoSansCJKjp', 'normal');

doc.setFont('NotoSansCJKjp');
doc.text(15, 30, 'こんにちは。はじめまして。');

//multi-lines Test
var paragraph = '相次いで廃止された寝台列車に代わり、いまや夜間の移動手段として主力になりつつある夜行バス。「安い」「寝ながら移動できる」などのメリットを生かすため、運行ダイヤはどのように組まれているのでしょうか。夜遅く出て、朝早く着くというメリット夜行バスを使うメリットといえば、各種アンケートでもいちばん多い回答の「安い」以外に、';
var lines = doc.splitTextToSize(paragraph, 150);
doc.text(15, 60, lines);

doc.save('custom_fonts.pdf');

```

## License
MIT