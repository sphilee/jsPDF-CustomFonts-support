# jsPDF-CustomFonts-support
[![Build Status](https://travis-ci.org/sphilee/jsPDF-CustomFonts-support.svg?branch=master)](https://travis-ci.org/sphilee/jsPDF-CustomFonts-support/branches)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

JsPDF is an open source that loads JavaScript in an HTML5 environment and creates a pdf document.

The current version does not support Custom Fonts. I will try to implement this feature.


## Current Version

Version 0.0.3

[jsPDF libary](http://parall.ax/products/jspdf)

I do not claim to be the author of the jsPDF library, this code simply adds preliminary custom fonts support.

## Version History

0.0.1 Initial proof of concept

0.0.2 Support multiline text

0.0.3 Refactor multiline text

## Install

Download and include [jspdf.customfonts.min.js](https://raw.githubusercontent.com/sphilee/jsPDF-CustomFonts-support/master/dist/jspdf.customfonts.min.js).

You can also get the plugin with a package manager:
- ```npm install jspdf-customfonts```


## Getting Started

This document will walk you through the basics of jsPDF and will show you how to create PDF files in the browser.

To begin with the default configuration, you should include two files:

* **dist/jspdf.customfonts.min.js**,
* **dist/default_vfs.js** - default vfs font definition (it contains 4 Fonts)
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
    <script language="javascript" type="text/javascript" src="dist/jspdf.customfonts.min.js"></script>
    <script language="javascript" type="text/javascript" src="dist/default_vfs.js"></script>
</head>
<body>
...
```


## addFileToVFS Method

```javascript
doc.addFileToVFS(fileName, Base64content);
```

## addCustomFonts Method

```javascript
doc.addFont(fileName, fontName, fontStyle);
```

## Example Code

```javascript
var doc = new jsPDF();

doc.addFont('Batang.ttf', 'Batang', 'normal');
doc.addFont('NotoSansCJKjp-Regular.ttf', 'NotoSansCJKjp', 'normal');
doc.addFont('NotoSansCJKtc-Regular.ttf', 'NotoSansCJKtc', 'normal');

doc.setFont('Batang');
doc.text(15, 15, '안녕하세요 만나서 반갑습니다.');

doc.setFont('NotoSansCJKjp');
doc.text(15, 30, 'こんにちは。はじめまして。');

doc.setFont('NotoSansCJKtc');
doc.text(15, 45, '早上好。 很高兴见到你');

//multi-lines Test
var paragraph = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit,' +
    ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
    ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris' +
    ' nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor ' +
    'in reprehenderit in voluptate velit esse cillum dolore eu fugiat ' +
    'nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.';
var lines = doc.splitTextToSize(paragraph, 150);
doc.text(15, 60, lines);

doc.save('custom_fonts.pdf');

```

## License
MIT