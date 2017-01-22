### jspdf-UTF8-support ##

JsPDF is an open source that reads JavaScript in an HTML5 environment and creates a pdf document.

The current version does not support Custom Fonts. I will try to implement this feature.


### Current Version ###

Version 0.1

[jsPDF libary](http://parall.ax/products/jspdf) 

I do not claim to be the author of the jsPDF library, this code simply adds preliminary custom support.

### Version History ###

0.1 Initial proof of concept

### add Custom Fonts Method ###

```javascript
doc.addFont(filename, fontname, font-weight, encoding);


```

### Example Code ###

```javascript
        var doc = new PDFDocument();

        doc.addFont('HMKMMAG.TTF', 'MagicR', 'normal', 'Identity-H'); 
        doc.addFont('HMKMRHD.TTF', 'HeadlineR', 'normal', 'Identity-H'); 
        doc.addFont('msgothic.ttf', 'MsGothic', 'normal', 'Identity-H');    
        doc.addFont('wts11.ttf', 'HanWang', 'normal', 'Identity-H');       


        doc.setFont('MagicR');        // set font


        //doc.setDefaultFonts(0, 'Times');    //English default
        //doc.setDefaultFonts(1, 'AAAAAA+MagicR-HM');    //Korean default
        doc.setDefaultFonts(3, 'HanWang');         //Chinese default
        doc.setDefaultFonts(2, 'MsGothic');        //Japanese default


        doc.setFontSize(20);
        doc.setTextColor(153,051,102);
        doc.setCharSpace(3);

        doc.drawText(10, 20, ['나는 jspdf의 ', {
            text: '홍A平길Bお동安C'
            , fontSize: 30
            , TextColor: [255, 0, 0]
            , charSpace: -1
            , font: 'HeadlineR'
        },' 입니다.']);

        doc.save('jspdf.pdf');

```

