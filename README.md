# jsPDF-CustomFonts-support

JsPDF is an open source that loads JavaScript in an HTML5 environment and creates a pdf document.

The current version does not support Custom Fonts. I will try to implement this feature.


## Current Version

Version 0.2

[jsPDF libary](http://parall.ax/products/jspdf)

I do not claim to be the author of the jsPDF library, this code simply adds preliminary custom fonts support.

## Version History

0.1 Initial proof of concept

0.2 support multiline text

## Getting Started

This document will walk you through the basics of jsPDF and will show you how to create PDF files in the browser.

To begin with the default configuration, you should include six files:

* **jspdf.js**,
* **FileSaver.js**,
* **split_text_to_size.js**,
* **standard_fonts_metrics.js**,
* **customfonts.js**,
* **vfs_fonts.js** - default font definition (it contains 4 Fonts, you can however [use custom fonts instead](https://www.giftofspeed.com/base64-encoder/))

```html
<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <title>jsPDF customfonts example</title>
    <script language="javascript" type="text/javascript" src="./plugins/FileSaver.js"></script>
    <script language="javascript" type="text/javascript" src="./plugins/split_text_to_size.js"></script>
    <script language="javascript" type="text/javascript" src="./plugins/standard_fonts_metrics.js"></script>
    <script language="javascript" type="text/javascript" src="jspdf.js"></script>
    <script language="javascript" type="text/javascript" src="customfonts.js"></script>
    <script language="javascript" type="text/javascript" src="vfs_fonts.js"></script>
</head>
<body>
...
```

## addCustomFonts Method

```javascript
doc.addFont(fileName, fontName, fontStyle);


```

## Example Code

```javascript
var doc = new jsPDF();


doc.addFont('HMKMMAG.TTF', 'MagicR', 'normal');
doc.addFont('roundedMgenplus.ttf', 'roundedMgenplus', 'normal');
doc.addFont('gothic.ttf', 'LiLing', 'normal');
doc.addFont('GuardianSans.ttf', 'GuardianSans', 'normal');

doc.setFont('MagicR');
doc.text(15, 15, '안녕하세요 만나서 반갑습니다.');

doc.setFont('roundedMgenplus');
doc.text(15, 30, 'こんにちは。はじめまして。');

doc.setFont('LiLing');
doc.text(15, 45, '早上好。 很高兴见到你');

doc.setFont('GuardianSans');
doc.text(15, 60, 'Good morning. Nice to meet you.');

//multi-lines Test
doc.setMaxWidth(150);
doc.text(15, 75,
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit,' +
    ' sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' +
    ' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris' +
    ' nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor ' +
    'in reprehenderit in voluptate velit esse cillum dolore eu fugiat ' +
    'nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
    'sunt in culpa qui officia deserunt mollit anim id est laborum.'
);
doc.save('jspdf.pdf');

```

## License
MIT
