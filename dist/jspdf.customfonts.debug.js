(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.jspdf = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

/** @preserve
 * jsPDF - PDF Document creation from JavaScript
 * Version 0.0.2 Built on 2017-10-27T04:32:08.983Z
 *                           CommitID 2e2c6ed8b5
 *
 * Copyright (c) 2010-2016 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, willow-systems.com
 *               2012 Pablo Hess, https://github.com/pablohess
 *               2012 Florian Jenett, https://github.com/fjenett
 *               2013 Warren Weckesser, https://github.com/warrenweckesser
 *               2013 Youssef Beddad, https://github.com/lifof
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2013 Stefan Slonevskiy, https://github.com/stefslon
 *               2013 Jeremy Morel, https://github.com/jmorel
 *               2013 Christoph Hartmann, https://github.com/chris-rock
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Makes, https://github.com/dollaruw
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 Steven Spungin, https://github.com/Flamenco
 *               2014 Kenneth Glassey, https://github.com/Gavvers
 *
 * Licensed under the MIT License
 *
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth, Flamenco
 */

/**
 * Creates new jsPDF document object instance.
 * @name jsPDF
 * @class
 * @param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l") <br />
 * Can also be an options object.
 * @param unit        Measurement unit to be used when coordinates are specified.
 *                    One of "pt" (points), "mm" (Default), "cm", "in"
 * @param format      One of 'pageFormats' as shown below, default: a4
 * @returns {jsPDF}
 * @description
 * If the first parameter (orientation) is an object, it will be interpreted as an object of named parameters
 * ```
 * {
 *  orientation: 'p',
 *  unit: 'mm',
 *  format: 'a4',
 *  hotfixes: [] // an array of hotfix strings to enable
 * }
 * ```
 */
var jsPDF = function (global) {
  'use strict';

  var pdfVersion = '1.3',
      pageFormats = { // Size in pt of various paper formats
    'a0': [2383.94, 3370.39],
    'a1': [1683.78, 2383.94],
    'a2': [1190.55, 1683.78],
    'a3': [841.89, 1190.55],
    'a4': [595.28, 841.89],
    'a5': [419.53, 595.28],
    'a6': [297.64, 419.53],
    'a7': [209.76, 297.64],
    'a8': [147.40, 209.76],
    'a9': [104.88, 147.40],
    'a10': [73.70, 104.88],
    'b0': [2834.65, 4008.19],
    'b1': [2004.09, 2834.65],
    'b2': [1417.32, 2004.09],
    'b3': [1000.63, 1417.32],
    'b4': [708.66, 1000.63],
    'b5': [498.90, 708.66],
    'b6': [354.33, 498.90],
    'b7': [249.45, 354.33],
    'b8': [175.75, 249.45],
    'b9': [124.72, 175.75],
    'b10': [87.87, 124.72],
    'c0': [2599.37, 3676.54],
    'c1': [1836.85, 2599.37],
    'c2': [1298.27, 1836.85],
    'c3': [918.43, 1298.27],
    'c4': [649.13, 918.43],
    'c5': [459.21, 649.13],
    'c6': [323.15, 459.21],
    'c7': [229.61, 323.15],
    'c8': [161.57, 229.61],
    'c9': [113.39, 161.57],
    'c10': [79.37, 113.39],
    'dl': [311.81, 623.62],
    'letter': [612, 792],
    'government-letter': [576, 756],
    'legal': [612, 1008],
    'junior-legal': [576, 360],
    'ledger': [1224, 792],
    'tabloid': [792, 1224],
    'credit-card': [153, 243]
  };

  /**
   * jsPDF's Internal PubSub Implementation.
   * See mrrio.github.io/jsPDF/doc/symbols/PubSub.html
   * Backward compatible rewritten on 2014 by
   * Diego Casorran, https://github.com/diegocr
   *
   * @class
   * @name PubSub
   * @ignore This should not be in the public docs.
   */
  function PubSub(context) {
    var topics = {};

    this.subscribe = function (topic, callback, once) {
      if (typeof callback !== 'function') {
        return false;
      }

      if (!topics.hasOwnProperty(topic)) {
        topics[topic] = {};
      }

      var id = Math.random().toString(35);
      topics[topic][id] = [callback, !!once];

      return id;
    };

    this.unsubscribe = function (token) {
      for (var topic in topics) {
        if (topics[topic][token]) {
          delete topics[topic][token];
          return true;
        }
      }
      return false;
    };

    this.publish = function (topic) {
      if (topics.hasOwnProperty(topic)) {
        var args = Array.prototype.slice.call(arguments, 1),
            idr = [];

        for (var id in topics[topic]) {
          var sub = topics[topic][id];
          try {
            sub[0].apply(context, args);
          } catch (ex) {
            if (global.console) {
              console.error('jsPDF PubSub Error', ex.message, ex);
            }
          }
          if (sub[1]) idr.push(id);
        }
        if (idr.length) idr.forEach(this.unsubscribe);
      }
    };
  }

  /**
   * @constructor
   * @private
   */
  function jsPDF(orientation, unit, format, compressPdf) {
    var options = {};

    if ((typeof orientation === 'undefined' ? 'undefined' : _typeof(orientation)) === 'object') {
      options = orientation;

      orientation = options.orientation;
      unit = options.unit || unit;
      format = options.format || format;
      compressPdf = options.compress || options.compressPdf || compressPdf;
    }

    // Default options
    unit = unit || 'mm';
    format = format || 'a4';
    orientation = ('' + (orientation || 'P')).toLowerCase();

    var format_as_string = ('' + format).toLowerCase(),
        compress = !!compressPdf && typeof Uint8Array === 'function',
        textColor = options.textColor || '0 g',
        drawColor = options.drawColor || '0 G',
        activeFontSize = options.fontSize || 16,
        activeCharSpace = options.charSpace || 0,
        activeMaxWidth = options.maxWidth || 0,
        lineHeightProportion = options.lineHeight || 1.15,
        lineWidth = options.lineWidth || 0.200025,
        // 2mm
    objectNumber = 2,
        // 'n' Current object number
    outToPages = !1,
        // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
    offsets = [],
        // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
    fonts = {},
        // collection of font objects, where key is fontKey - a dynamically created label for a given font.
    fontmap = {},
        // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
    activeFontKey,
        // will be string representing the KEY of the font as combination of fontName + fontStyle
    k,
        // Scale factor
    tmp,
        page = 0,
        currentPage,
        pages = [],
        pagesContext = [],
        // same index as pages and pagedim
    pagedim = [],
        content = [],
        additionalObjects = [],
        lineCapID = 0,
        lineJoinID = 0,
        content_length = 0,
        pageWidth,
        pageHeight,
        pageMode,
        zoomMode,
        layoutMode,
        documentProperties = {
      'title': '',
      'subject': '',
      'author': '',
      'keywords': '',
      'creator': ''
    },
        API = {},
        events = new PubSub(API),
        hotfixes = options.hotfixes || [],


    /////////////////////
    // Private functions
    /////////////////////
    f2 = function f2(number) {
      return number.toFixed(2); // Ie, %.2f
    },
        f3 = function f3(number) {
      return number.toFixed(3); // Ie, %.3f
    },
        padd2 = function padd2(number) {
      return ('0' + parseInt(number)).slice(-2);
    },
        out = function out(string) {
      if (outToPages) {
        /* set by beginPage */
        pages[currentPage].push(string);
      } else {
        // +1 for '\n' that will be used to join 'content'
        content_length += string.length + 1;
        content.push(string);
      }
    },
        newObject = function newObject() {
      // Begin a new object
      objectNumber++;
      offsets[objectNumber] = content_length;
      out(objectNumber + ' 0 obj');
      return objectNumber;
    },

    // Does not output the object until after the pages have been output.
    // Returns an object containing the objectId and content.
    // All pages have been added so the object ID can be estimated to start right after.
    // This does not modify the current objectNumber;  It must be updated after the newObjects are output.
    newAdditionalObject = function newAdditionalObject() {
      var objId = pages.length * 2 + 1;
      objId += additionalObjects.length;
      var obj = {
        objId: objId,
        content: ''
      };
      additionalObjects.push(obj);
      return obj;
    },

    // Does not output the object.  The caller must call newObjectDeferredBegin(oid) before outputing any data
    newObjectDeferred = function newObjectDeferred() {
      objectNumber++;
      offsets[objectNumber] = function () {
        return content_length;
      };
      return objectNumber;
    },
        newObjectDeferredBegin = function newObjectDeferredBegin(oid) {
      offsets[oid] = content_length;
    },
        putStream = function putStream(str) {
      out('stream');
      out(str);
      out('endstream');
    },
        putPages = function putPages() {
      var n,
          p,
          arr,
          i,
          deflater,
          adler32,
          adler32cs,
          wPt,
          hPt,
          pageObjectNumbers = [];

      adler32cs = global.adler32cs || jsPDF.adler32cs;
      if (compress && typeof adler32cs === 'undefined') {
        compress = false;
      }

      // outToPages = false as set in endDocument(). out() writes to content.

      for (n = 1; n <= page; n++) {
        pageObjectNumbers.push(newObject());
        wPt = (pageWidth = pagedim[n].width) * k;
        hPt = (pageHeight = pagedim[n].height) * k;
        out('<</Type /Page');
        out('/Parent 1 0 R');
        out('/Resources 2 0 R');
        out('/MediaBox [0 0 ' + f2(wPt) + ' ' + f2(hPt) + ']');
        // Added for annotation plugin
        events.publish('putPage', {
          pageNumber: n,
          page: pages[n]
        });
        out('/Contents ' + (objectNumber + 1) + ' 0 R');
        out('>>');
        out('endobj');

        // Page content
        p = pages[n].join('\n');
        newObject();
        if (compress) {
          arr = [];
          i = p.length;
          while (i--) {
            arr[i] = p.charCodeAt(i);
          }
          adler32 = adler32cs.from(p);
          deflater = new Deflater(6);
          deflater.append(new Uint8Array(arr));
          p = deflater.flush();
          arr = new Uint8Array(p.length + 6);
          arr.set(new Uint8Array([120, 156])), arr.set(p, 2);
          arr.set(new Uint8Array([adler32 & 0xFF, adler32 >> 8 & 0xFF, adler32 >> 16 & 0xFF, adler32 >> 24 & 0xFF]), p.length + 2);
          p = String.fromCharCode.apply(null, arr);
          out('<</Length ' + p.length + ' /Filter [/FlateDecode]>>');
        } else {
          out('<</Length ' + p.length + '>>');
        }
        putStream(p);
        out('endobj');
      }
      offsets[1] = content_length;
      out('1 0 obj');
      out('<</Type /Pages');
      var kids = '/Kids [';
      for (i = 0; i < page; i++) {
        kids += pageObjectNumbers[i] + ' 0 R ';
      }
      out(kids + ']');
      out('/Count ' + page);
      out('>>');
      out('endobj');
      events.publish('postPutPages');
    },
        putFont = function putFont(font) {
      if (font.id.slice(1) >= 14) {
        var dictionary = font.metadata.embedTTF(font.encoding, newObject, out);
        dictionary ? font.objectNumber = dictionary : delete fonts[font.id];
      } else {
        font.objectNumber = newObject();
        out('<</BaseFont/' + font.postScriptName + '/Type/Font');
        if (typeof font.encoding === 'string') {
          out('/Encoding/' + font.encoding);
        }
        out('/Subtype/Type1>>');
        out('endobj');
      }
    },
        putFonts = function putFonts() {
      for (var fontKey in fonts) {
        if (fonts.hasOwnProperty(fontKey)) {
          putFont(fonts[fontKey]);
        }
      }
    },
        putXobjectDict = function putXobjectDict() {
      // Loop through images, or other data objects
      events.publish('putXobjectDict');
    },
        putResourceDictionary = function putResourceDictionary() {
      out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
      out('/Font <<');

      // Do this for each font, the '1' bit is the index of the font
      for (var fontKey in fonts) {
        if (fonts.hasOwnProperty(fontKey)) {
          out('/' + fontKey + ' ' + fonts[fontKey].objectNumber + ' 0 R');
        }
      }
      out('>>');
      out('/XObject <<');
      putXobjectDict();
      out('>>');
    },
        putResources = function putResources() {
      putFonts();
      events.publish('putResources');
      // Resource dictionary
      offsets[2] = content_length;
      out('2 0 obj');
      out('<<');
      putResourceDictionary();
      out('>>');
      out('endobj');
      events.publish('postPutResources');
    },
        putAdditionalObjects = function putAdditionalObjects() {
      events.publish('putAdditionalObjects');
      for (var i = 0; i < additionalObjects.length; i++) {
        var obj = additionalObjects[i];
        offsets[obj.objId] = content_length;
        out(obj.objId + ' 0 obj');
        out(obj.content);
        out('endobj');
      }
      objectNumber += additionalObjects.length;
      events.publish('postPutAdditionalObjects');
    },
        addToFontDictionary = function addToFontDictionary(fontKey, fontName, fontStyle) {
      // this is mapping structure for quick font key lookup.
      // returns the KEY of the font (ex: "F1") for a given
      // pair of font name and type (ex: "Arial". "Italic")
      if (!fontmap.hasOwnProperty(fontName)) {
        fontmap[fontName] = {};
      }
      fontmap[fontName][fontStyle] = fontKey;
    },

    /**
     * FontObject describes a particular font as member of an instnace of jsPDF
     *
     * It's a collection of properties like 'id' (to be used in PDF stream),
     * 'fontName' (font's family name), 'fontStyle' (font's style variant label)
     *
     * @class
     * @public
     * @property id {String} PDF-document-instance-specific label assinged to the font.
     * @property postScriptName {String} PDF specification full name for the font
     * @property encoding {Object} Encoding_name-to-Font_metrics_object mapping.
     * @name FontObject
     * @ignore This should not be in the public docs.
     */
    addFont = function addFont(postScriptName, fontName, fontStyle, encoding) {
      var fontKey = 'F' + (Object.keys(fonts).length + 1).toString(10),

      // This is FontObject
      font = fonts[fontKey] = {
        'id': fontKey,
        'postScriptName': postScriptName,
        'fontName': fontName,
        'fontStyle': fontStyle,
        'encoding': encoding,
        'metadata': {}
      };
      addToFontDictionary(fontKey, fontName, fontStyle);
      events.publish('addFont', font);

      return fontKey;
    },
        addFonts = function addFonts() {

      var HELVETICA = "helvetica",
          TIMES = "times",
          COURIER = "courier",
          NORMAL = "normal",
          BOLD = "bold",
          ITALIC = "italic",
          BOLD_ITALIC = "bolditalic",
          encoding = 'StandardEncoding',
          ZAPF = "zapfdingbats",
          standardFonts = [['Helvetica', HELVETICA, NORMAL, 'WinAnsiEncoding'], ['Helvetica-Bold', HELVETICA, BOLD, 'WinAnsiEncoding'], ['Helvetica-Oblique', HELVETICA, ITALIC, 'WinAnsiEncoding'], ['Helvetica-BoldOblique', HELVETICA, BOLD_ITALIC, 'WinAnsiEncoding'], ['Courier', COURIER, NORMAL, 'WinAnsiEncoding'], ['Courier-Bold', COURIER, BOLD, 'WinAnsiEncoding'], ['Courier-Oblique', COURIER, ITALIC, 'WinAnsiEncoding'], ['Courier-BoldOblique', COURIER, BOLD_ITALIC, 'WinAnsiEncoding'], ['Times-Roman', TIMES, NORMAL, 'WinAnsiEncoding'], ['Times-Bold', TIMES, BOLD, 'WinAnsiEncoding'], ['Times-Italic', TIMES, ITALIC, 'WinAnsiEncoding'], ['Times-BoldItalic', TIMES, BOLD_ITALIC, 'WinAnsiEncoding'], ['ZapfDingbats', ZAPF, undefined, 'StandardEncoding']];

      for (var i = 0, l = standardFonts.length; i < l; i++) {
        var fontKey = addFont(standardFonts[i][0], standardFonts[i][1], standardFonts[i][2], standardFonts[i][3]);

        // adding aliases for standard fonts, this time matching the capitalization
        var parts = standardFonts[i][0].split('-');
        addToFontDictionary(fontKey, parts[0], parts[1] || '');
      }
      events.publish('addFonts', {
        fonts: fonts,
        dictionary: fontmap
      });
    },
        SAFE = function __safeCall(fn) {
      fn.foo = function __safeCallWrapper() {
        try {
          return fn.apply(this, arguments);
        } catch (e) {
          var stack = e.stack || '';
          if (~stack.indexOf(' at ')) stack = stack.split(" at ")[1];
          var m = "Error in function " + stack.split("\n")[0].split('<')[0] + ": " + e.message;
          if (global.console) {
            global.console.error(m, e);
            if (global.alert) alert(m);
          } else {
            throw new Error(m);
          }
        }
      };
      fn.foo.bar = fn;
      return fn.foo;
    },
        to8bitStream = function to8bitStream(text, flags) {
      /**
       * PDF 1.3 spec:
       * "For text strings encoded in Unicode, the first two bytes must be 254 followed by
       * 255, representing the Unicode byte order marker, U+FEFF. (This sequence conflicts
       * with the PDFDocEncoding character sequence thorn ydieresis, which is unlikely
       * to be a meaningful beginning of a word or phrase.) The remainder of the
       * string consists of Unicode character codes, according to the UTF-16 encoding
       * specified in the Unicode standard, version 2.0. Commonly used Unicode values
       * are represented as 2 bytes per character, with the high-order byte appearing first
       * in the string."
       *
       * In other words, if there are chars in a string with char code above 255, we
       * recode the string to UCS2 BE - string doubles in length and BOM is prepended.
       *
       * HOWEVER!
       * Actual *content* (body) text (as opposed to strings used in document properties etc)
       * does NOT expect BOM. There, it is treated as a literal GID (Glyph ID)
       *
       * Because of Adobe's focus on "you subset your fonts!" you are not supposed to have
       * a font that maps directly Unicode (UCS2 / UTF16BE) code to font GID, but you could
       * fudge it with "Identity-H" encoding and custom CIDtoGID map that mimics Unicode
       * code page. There, however, all characters in the stream are treated as GIDs,
       * including BOM, which is the reason we need to skip BOM in content text (i.e. that
       * that is tied to a font).
       *
       * To signal this "special" PDFEscape / to8bitStream handling mode,
       * API.text() function sets (unless you overwrite it with manual values
       * given to API.text(.., flags) )
       * flags.autoencode = true
       * flags.noBOM = true
       *
       * ===================================================================================
       * `flags` properties relied upon:
       *   .sourceEncoding = string with encoding label.
       *                     "Unicode" by default. = encoding of the incoming text.
       *                     pass some non-existing encoding name
       *                     (ex: 'Do not touch my strings! I know what I am doing.')
       *                     to make encoding code skip the encoding step.
       *   .outputEncoding = Either valid PDF encoding name
       *                     (must be supported by jsPDF font metrics, otherwise no encoding)
       *                     or a JS object, where key = sourceCharCode, value = outputCharCode
       *                     missing keys will be treated as: sourceCharCode === outputCharCode
       *   .noBOM
       *       See comment higher above for explanation for why this is important
       *   .autoencode
       *       See comment higher above for explanation for why this is important
       */

      var i, l, sourceEncoding, encodingBlock, outputEncoding, newtext, isUnicode, ch, bch;

      flags = flags || {};
      sourceEncoding = flags.sourceEncoding || 'Unicode';
      outputEncoding = flags.outputEncoding;

      // This 'encoding' section relies on font metrics format
      // attached to font objects by, among others,
      // "Willow Systems' standard_font_metrics plugin"
      // see jspdf.plugin.standard_font_metrics.js for format
      // of the font.metadata.encoding Object.
      // It should be something like
      //   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
      //   .widths = {0:width, code:width, ..., 'fof':divisor}
      //   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}
      if ((flags.autoencode || outputEncoding) && fonts[activeFontKey].metadata && fonts[activeFontKey].metadata[sourceEncoding] && fonts[activeFontKey].metadata[sourceEncoding].encoding) {
        encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding;

        // each font has default encoding. Some have it clearly defined.
        if (!outputEncoding && fonts[activeFontKey].encoding) {
          outputEncoding = fonts[activeFontKey].encoding;
        }

        // Hmmm, the above did not work? Let's try again, in different place.
        if (!outputEncoding && encodingBlock.codePages) {
          outputEncoding = encodingBlock.codePages[0]; // let's say, first one is the default
        }

        if (typeof outputEncoding === 'string') {
          outputEncoding = encodingBlock[outputEncoding];
        }
        // we want output encoding to be a JS Object, where
        // key = sourceEncoding's character code and
        // value = outputEncoding's character code.
        if (outputEncoding) {
          isUnicode = false;
          newtext = [];
          for (i = 0, l = text.length; i < l; i++) {
            ch = outputEncoding[text.charCodeAt(i)];
            if (ch) {
              newtext.push(String.fromCharCode(ch));
            } else {
              newtext.push(text[i]);
            }

            // since we are looping over chars anyway, might as well
            // check for residual unicodeness
            if (newtext[i].charCodeAt(0) >> 8) {
              /* more than 255 */
              isUnicode = true;
            }
          }
          text = newtext.join('');
        }
      }

      i = text.length;
      // isUnicode may be set to false above. Hence the triple-equal to undefined
      while (isUnicode === undefined && i !== 0) {
        if (text.charCodeAt(i - 1) >> 8) {
          /* more than 255 */
          isUnicode = true;
        }
        i--;
      }
      if (!isUnicode) {
        return text;
      }

      newtext = flags.noBOM ? [] : [254, 255];
      for (i = 0, l = text.length; i < l; i++) {
        ch = text.charCodeAt(i);
        bch = ch >> 8; // divide by 256
        if (bch >> 8) {
          /* something left after dividing by 256 second time */
          throw new Error("Character at position " + i + " of string '" + text + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
        }
        newtext.push(bch);
        newtext.push(ch - (bch << 8));
      }
      return String.fromCharCode.apply(undefined, newtext);
    },
        pdfEscape = function pdfEscape(text, flags) {
      /**
       * Replace '/', '(', and ')' with pdf-safe versions
       *
       * Doing to8bitStream does NOT make this PDF display unicode text. For that
       * we also need to reference a unicode font and embed it - royal pain in the rear.
       *
       * There is still a benefit to to8bitStream - PDF simply cannot handle 16bit chars,
       * which JavaScript Strings are happy to provide. So, while we still cannot display
       * 2-byte characters property, at least CONDITIONALLY converting (entire string containing)
       * 16bit chars to (USC-2-BE) 2-bytes per char + BOM streams we ensure that entire PDF
       * is still parseable.
       * This will allow immediate support for unicode in document properties strings.
       */
      return to8bitStream(text, flags).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    },
        putInfo = function putInfo() {
      out('/Producer (jsPDF ' + jsPDF.version + ')');
      for (var key in documentProperties) {
        if (documentProperties.hasOwnProperty(key) && documentProperties[key]) {
          out('/' + key.substr(0, 1).toUpperCase() + key.substr(1) + ' (' + pdfEscape(documentProperties[key]) + ')');
        }
      }
      var created = new Date(),
          tzoffset = created.getTimezoneOffset(),
          tzsign = tzoffset < 0 ? '+' : '-',
          tzhour = Math.floor(Math.abs(tzoffset / 60)),
          tzmin = Math.abs(tzoffset % 60),
          tzstr = [tzsign, padd2(tzhour), "'", padd2(tzmin), "'"].join('');
      out(['/CreationDate (D:', created.getFullYear(), padd2(created.getMonth() + 1), padd2(created.getDate()), padd2(created.getHours()), padd2(created.getMinutes()), padd2(created.getSeconds()), tzstr, ')'].join(''));
    },
        putCatalog = function putCatalog() {
      out('/Type /Catalog');
      out('/Pages 1 0 R');
      // PDF13ref Section 7.2.1
      if (!zoomMode) zoomMode = 'fullwidth';
      switch (zoomMode) {
        case 'fullwidth':
          out('/OpenAction [3 0 R /FitH null]');
          break;
        case 'fullheight':
          out('/OpenAction [3 0 R /FitV null]');
          break;
        case 'fullpage':
          out('/OpenAction [3 0 R /Fit]');
          break;
        case 'original':
          out('/OpenAction [3 0 R /XYZ null null 1]');
          break;
        default:
          var pcn = '' + zoomMode;
          if (pcn.substr(pcn.length - 1) === '%') zoomMode = parseInt(zoomMode) / 100;
          if (typeof zoomMode === 'number') {
            out('/OpenAction [3 0 R /XYZ null null ' + f2(zoomMode) + ']');
          }
      }
      if (!layoutMode) layoutMode = 'continuous';
      switch (layoutMode) {
        case 'continuous':
          out('/PageLayout /OneColumn');
          break;
        case 'single':
          out('/PageLayout /SinglePage');
          break;
        case 'two':
        case 'twoleft':
          out('/PageLayout /TwoColumnLeft');
          break;
        case 'tworight':
          out('/PageLayout /TwoColumnRight');
          break;
      }
      if (pageMode) {
        /**
         * A name object specifying how the document should be displayed when opened:
         * UseNone      : Neither document outline nor thumbnail images visible -- DEFAULT
         * UseOutlines  : Document outline visible
         * UseThumbs    : Thumbnail images visible
         * FullScreen   : Full-screen mode, with no menu bar, window controls, or any other window visible
         */
        out('/PageMode /' + pageMode);
      }
      events.publish('putCatalog');
    },
        putTrailer = function putTrailer() {
      out('/Size ' + (objectNumber + 1));
      out('/Root ' + objectNumber + ' 0 R');
      out('/Info ' + (objectNumber - 1) + ' 0 R');
    },
        beginPage = function beginPage(width, height) {
      // Dimensions are stored as user units and converted to points on output
      var orientation = typeof height === 'string' && height.toLowerCase();
      if (typeof width === 'string') {
        var format = width.toLowerCase();
        if (pageFormats.hasOwnProperty(format)) {
          width = pageFormats[format][0] / k;
          height = pageFormats[format][1] / k;
        }
      }
      if (Array.isArray(width)) {
        height = width[1];
        width = width[0];
      }
      if (orientation) {
        switch (orientation.substr(0, 1)) {
          case 'l':
            if (height > width) orientation = 's';
            break;
          case 'p':
            if (width > height) orientation = 's';
            break;
        }
        if (orientation === 's') {
          tmp = width;
          width = height;
          height = tmp;
        }
      }
      outToPages = true;
      pages[++page] = [];
      pagedim[page] = {
        width: Number(width) || pageWidth,
        height: Number(height) || pageHeight
      };
      pagesContext[page] = {};
      _setPage(page);
    },
        _addPage = function _addPage() {
      beginPage.apply(this, arguments);
      // Set line width
      out(f2(lineWidth * k) + ' w');
      // Set draw color
      out(drawColor);
      // resurrecting non-default line caps, joins
      if (lineCapID !== 0) {
        out(lineCapID + ' J');
      }
      if (lineJoinID !== 0) {
        out(lineJoinID + ' j');
      }
      events.publish('addPage', {
        pageNumber: page
      });
    },
        _deletePage = function _deletePage(n) {
      if (n > 0 && n <= page) {
        pages.splice(n, 1);
        pagedim.splice(n, 1);
        page--;
        if (currentPage > page) {
          currentPage = page;
        }
        this.setPage(currentPage);
      }
    },
        _setPage = function _setPage(n) {
      if (n > 0 && n <= page) {
        currentPage = n;
        pageWidth = pagedim[n].width;
        pageHeight = pagedim[n].height;
      }
    },

    /**
     * Returns a document-specific font key - a label assigned to a
     * font name + font type combination at the time the font was added
     * to the font inventory.
     *
     * Font key is used as label for the desired font for a block of text
     * to be added to the PDF document stream.
     * @private
     * @function
     * @param fontName {String} can be undefined on "falthy" to indicate "use current"
     * @param fontStyle {String} can be undefined on "falthy" to indicate "use current"
     * @returns {String} Font key.
     */
    _getFont = function _getFont(fontName, fontStyle) {
      var key, originalFontName;

      fontName = fontName !== undefined ? fontName : fonts[activeFontKey].fontName;
      fontStyle = fontStyle !== undefined ? fontStyle : fonts[activeFontKey].fontStyle;

      originalFontName = fontName;

      if (fontName !== undefined) {
        fontName = fontName.toLowerCase();
      }
      switch (fontName) {
        case 'sans-serif':
        case 'verdana':
        case 'arial':
        case 'helvetica':
          fontName = 'helvetica';
          break;
        case 'fixed':
        case 'monospace':
        case 'terminal':
        case 'courier':
          fontName = 'courier';
          break;
        case 'serif':
        case 'cursive':
        case 'fantasy':
          fontName = 'times';
          break;
        default:
          fontName = originalFontName;
          break;
      }

      try {
        // get a string like 'F3' - the KEY corresponding tot he font + type combination.
        key = fontmap[fontName][fontStyle];
      } catch (e) {}

      if (!key) {
        //throw new Error("Unable to look up font label for font '" + fontName + "', '"
        //+ fontStyle + "'. Refer to getFontList() for available fonts.");
        key = fontmap['times'][fontStyle];
        if (key == null) {
          key = fontmap['times']['normal'];
        }
      }
      return key;
    },
        buildDocument = function buildDocument() {
      outToPages = false; // switches out() to content

      objectNumber = 2;
      content_length = 0;
      content = [];
      offsets = [];
      additionalObjects = [];
      // Added for AcroForm
      events.publish('buildDocument');

      // putHeader()
      out('%PDF-' + pdfVersion);

      putPages();

      // Must happen after putPages
      // Modifies current object Id
      putAdditionalObjects();

      putResources();

      // Info
      newObject();
      out('<<');
      putInfo();
      out('>>');
      out('endobj');

      // Catalog
      newObject();
      out('<<');
      putCatalog();
      out('>>');
      out('endobj');

      // Cross-ref
      var o = content_length,
          i,
          p = "0000000000";
      out('xref');
      out('0 ' + (objectNumber + 1));
      out(p + ' 65535 f ');
      for (i = 1; i <= objectNumber; i++) {
        var offset = offsets[i];
        if (typeof offset === 'function') {
          out((p + offsets[i]()).slice(-10) + ' 00000 n ');
        } else {
          out((p + offsets[i]).slice(-10) + ' 00000 n ');
        }
      }
      // Trailer
      out('trailer');
      out('<<');
      putTrailer();
      out('>>');
      out('startxref');
      out('' + o);
      out('%%EOF');

      outToPages = true;

      return content.join('\n');
    },
        getStyle = function getStyle(style) {
      // see path-painting operators in PDF spec
      var op = 'S'; // stroke
      if (style === 'F') {
        op = 'f'; // fill
      } else if (style === 'FD' || style === 'DF') {
        op = 'B'; // both
      } else if (style === 'f' || style === 'f*' || style === 'B' || style === 'B*') {
        /*
         Allow direct use of these PDF path-painting operators:
         - f	fill using nonzero winding number rule
         - f*	fill using even-odd rule
         - B	fill then stroke with fill using non-zero winding number rule
         - B*	fill then stroke with fill using even-odd rule
         */
        op = style;
      }
      return op;
    },
        getArrayBuffer = function getArrayBuffer() {
      var data = buildDocument(),
          len = data.length,
          ab = new ArrayBuffer(len),
          u8 = new Uint8Array(ab);

      while (len--) {
        u8[len] = data.charCodeAt(len);
      }return ab;
    },
        getBlob = function getBlob() {
      return new Blob([getArrayBuffer()], {
        type: "application/pdf"
      });
    },

    /**
     * Generates the PDF document.
     *
     * If `type` argument is undefined, output is raw body of resulting PDF returned as a string.
     *
     * @param {String} type A string identifying one of the possible output types.
     * @param {Object} options An object providing some additional signalling to PDF generator.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name output
     */
    _output = SAFE(function (type, options) {
      var datauri = ('' + type).substr(0, 6) === 'dataur' ? 'data:application/pdf;base64,' + btoa(buildDocument()) : 0;

      switch (type) {
        case undefined:
          return buildDocument();
        case 'save':
          if (navigator.getUserMedia) {
            if (global.URL === undefined || global.URL.createObjectURL === undefined) {
              return API.output('dataurlnewwindow');
            }
          }
          saveAs(getBlob(), options);
          if (typeof saveAs.unload === 'function') {
            if (global.setTimeout) {
              setTimeout(saveAs.unload, 911);
            }
          }
          break;
        case 'arraybuffer':
          return getArrayBuffer();
        case 'blob':
          return getBlob();
        case 'bloburi':
        case 'bloburl':
          // User is responsible of calling revokeObjectURL
          return global.URL && global.URL.createObjectURL(getBlob()) || void 0;
        case 'datauristring':
        case 'dataurlstring':
          return datauri;
        case 'dataurlnewwindow':
          var nW = global.open(datauri);
          if (nW || typeof safari === "undefined") return nW;
        /* pass through */
        case 'datauri':
        case 'dataurl':
          return global.document.location.href = datauri;
        default:
          throw new Error('Output type "' + type + '" is not supported.');
      }
      // @TODO: Add different output options
    }),


    /**
     * Used to see if a supplied hotfix was requested when the pdf instance was created.
     * @param {String} hotfixName - The name of the hotfix to check.
     * @returns {boolean}
     */
    hasHotfix = function hasHotfix(hotfixName) {
      return Array.isArray(hotfixes) === true && hotfixes.indexOf(hotfixName) > -1;
    };

    switch (unit) {
      case 'pt':
        k = 1;
        break;
      case 'mm':
        k = 72 / 25.4000508;
        break;
      case 'cm':
        k = 72 / 2.54000508;
        break;
      case 'in':
        k = 72;
        break;
      case 'px':
        if (hasHotfix('px_scaling') == true) {
          k = 72 / 96;
        } else {
          k = 96 / 72;
        }
        break;
      case 'pc':
        k = 12;
        break;
      case 'em':
        k = 12;
        break;
      case 'ex':
        k = 6;
        break;
      default:
        throw 'Invalid unit: ' + unit;
    }

    //---------------------------------------
    // Public API

    /**
     * Object exposing internal API to plugins
     * @public
     */
    API.internal = {
      'pdfEscape': pdfEscape,
      'getStyle': getStyle,
      /**
       * Returns {FontObject} describing a particular font.
       * @public
       * @function
       * @param fontName {String} (Optional) Font's family name
       * @param fontStyle {String} (Optional) Font's style variation name (Example:"Italic")
       * @returns {FontObject}
       */
      'getFont': function getFont() {
        return fonts[_getFont.apply(API, arguments)];
      },
      'getFontSize': function getFontSize() {
        return activeFontSize;
      },
      'getLineHeight': function getLineHeight() {
        return activeFontSize * lineHeightProportion;
      },
      'write': function write(string1 /*, string2, string3, etc */) {
        out(arguments.length === 1 ? string1 : Array.prototype.join.call(arguments, ' '));
      },
      'getCoordinateString': function getCoordinateString(value) {
        return f2(value * k);
      },
      'getVerticalCoordinateString': function getVerticalCoordinateString(value) {
        return f2((pageHeight - value) * k);
      },
      'collections': {},
      'newObject': newObject,
      'newAdditionalObject': newAdditionalObject,
      'newObjectDeferred': newObjectDeferred,
      'newObjectDeferredBegin': newObjectDeferredBegin,
      'putStream': putStream,
      'events': events,
      // ratio that you use in multiplication of a given "size" number to arrive to 'point'
      // units of measurement.
      // scaleFactor is set at initialization of the document and calculated against the stated
      // default measurement units for the document.
      // If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
      // through multiplication.
      'scaleFactor': k,
      'pageSize': {
        get width() {
          return pageWidth;
        },
        get height() {
          return pageHeight;
        }
      },
      'output': function output(type, options) {
        return _output(type, options);
      },
      'getNumberOfPages': function getNumberOfPages() {
        return pages.length - 1;
      },
      'pages': pages,
      'out': out,
      'f2': f2,
      'getPageInfo': function getPageInfo(pageNumberOneBased) {
        var objId = (pageNumberOneBased - 1) * 2 + 3;
        return {
          objId: objId,
          pageNumber: pageNumberOneBased,
          pageContext: pagesContext[pageNumberOneBased]
        };
      },
      'getCurrentPageInfo': function getCurrentPageInfo() {
        var objId = (currentPage - 1) * 2 + 3;
        return {
          objId: objId,
          pageNumber: currentPage,
          pageContext: pagesContext[currentPage]
        };
      },
      'getPDFVersion': function getPDFVersion() {
        return pdfVersion;
      },
      'hasHotfix': hasHotfix //Expose the hasHotfix check so plugins can also check them.
    };

    /**
     * Adds (and transfers the focus to) new page to the PDF document.
     * @function
     * @returns {jsPDF}
     *
     * @methodOf jsPDF#
     * @name addPage
     */
    API.addPage = function () {
      _addPage.apply(this, arguments);
      return this;
    };
    /**
     * Adds (and transfers the focus to) new page to the PDF document.
     * @function
     * @returns {jsPDF}
     *
     * @methodOf jsPDF#
     * @name setPage
     * @param {Number} page Switch the active page to the page number specified
     * @example
     * doc = jsPDF()
     * doc.addPage()
     * doc.addPage()
     * doc.text('I am on page 3', 10, 10)
     * doc.setPage(1)
     * doc.text('I am on page 1', 10, 10)
     */
    API.setPage = function () {
      _setPage.apply(this, arguments);
      return this;
    };
    API.insertPage = function (beforePage) {
      this.addPage();
      this.movePage(currentPage, beforePage);
      return this;
    };
    API.movePage = function (targetPage, beforePage) {
      if (targetPage > beforePage) {
        var tmpPages = pages[targetPage];
        var tmpPagedim = pagedim[targetPage];
        var tmpPagesContext = pagesContext[targetPage];
        for (var i = targetPage; i > beforePage; i--) {
          pages[i] = pages[i - 1];
          pagedim[i] = pagedim[i - 1];
          pagesContext[i] = pagesContext[i - 1];
        }
        pages[beforePage] = tmpPages;
        pagedim[beforePage] = tmpPagedim;
        pagesContext[beforePage] = tmpPagesContext;
        this.setPage(beforePage);
      } else if (targetPage < beforePage) {
        var tmpPages = pages[targetPage];
        var tmpPagedim = pagedim[targetPage];
        var tmpPagesContext = pagesContext[targetPage];
        for (var i = targetPage; i < beforePage; i++) {
          pages[i] = pages[i + 1];
          pagedim[i] = pagedim[i + 1];
          pagesContext[i] = pagesContext[i + 1];
        }
        pages[beforePage] = tmpPages;
        pagedim[beforePage] = tmpPagedim;
        pagesContext[beforePage] = tmpPagesContext;
        this.setPage(beforePage);
      }
      return this;
    };

    API.deletePage = function () {
      _deletePage.apply(this, arguments);
      return this;
    };

    /**
     * Set the display mode options of the page like zoom and layout.
     *
     * @param {integer|String} zoom   You can pass an integer or percentage as
     * a string. 2 will scale the document up 2x, '200%' will scale up by the
     * same amount. You can also set it to 'fullwidth', 'fullheight',
     * 'fullpage', or 'original'.
     *
     * Only certain PDF readers support this, such as Adobe Acrobat
     *
     * @param {String} layout Layout mode can be: 'continuous' - this is the
     * default continuous scroll. 'single' - the single page mode only shows one
     * page at a time. 'twoleft' - two column left mode, first page starts on
     * the left, and 'tworight' - pages are laid out in two columns, with the
     * first page on the right. This would be used for books.
     * @param {String} pmode 'UseOutlines' - it shows the
     * outline of the document on the left. 'UseThumbs' - shows thumbnails along
     * the left. 'FullScreen' - prompts the user to enter fullscreen mode.
     *
     * @function
     * @returns {jsPDF}
     * @name setDisplayMode
     */
    API.setDisplayMode = function (zoom, layout, pmode) {
      zoomMode = zoom;
      layoutMode = layout;
      pageMode = pmode;

      var validPageModes = [undefined, null, 'UseNone', 'UseOutlines', 'UseThumbs', 'FullScreen'];
      if (validPageModes.indexOf(pmode) == -1) {
        throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "' + pmode + '" is not recognized.');
      }
      return this;
    },

    /**
     * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
     *
     * @function
     * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Object} flags Collection of settings signalling how the text must be encoded. Defaults are sane. If you think you want to pass some flags, you likely can read the source.
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name text
     */
    API.text = function (text, x, y, flags, angle, align) {
      /**
       * Inserts something like this into PDF
       *   BT
       *    /F1 16 Tf  % Font name + size
       *    16 TL % How many units down for next line in multiline text
       *    0 g % color
       *    28.35 813.54 Td % position
       *    (line one) Tj
       *    T* (line two) Tj
       *    T* (line three) Tj
       *   ET
       */
      function ESC(s) {
        s = s.split("\t").join(Array(options.TabLen || 9).join(" "));
        return pdfEscape(s, flags);
      }
      /**
      Returns a widths of string in a given font, if the font size is set as 1 point.
        In other words, this is "proportional" value. For 1 unit of font size, the length
      of the string will be that much.
        Multiply by font size to get actual width in *points*
      Then divide by 72 to get inches or divide by (72/25.6) to get 'mm' etc.
        @public
      @function
      @param
      @returns {Type}
      */
      function getStringUnitWidth(text, options) {
        var result = 0;
        if (options.font.id.slice(1) >= 14) {
          result = options.font.metadata.widthOfString(text, options.fontSize, options.charSpace);
        } else {
          result = getArraySum(getCharWidthsArray(text, options)) * options.fontSize;
        }
        return result;
      }

      /**
      Returns an array of length matching length of the 'word' string, with each
      cell ocupied by the width of the char in that position.
        @function
      @param word {String}
      @param widths {Object}
      @param kerning {Object}
      @returns {Array}
      */
      function getCharWidthsArray(text, options) {
        options = options || {};

        var widths = options.widths ? options.widths : options.font.metadata.Unicode.widths;
        var widthsFractionOf = widths.fof ? widths.fof : 1;
        var kerning = options.kerning ? options.kerning : options.font.metadata.Unicode.kerning;
        var kerningFractionOf = kerning.fof ? kerning.fof : 1;

        var i;
        var l;
        var char_code;
        var prior_char_code = 0; //for kerning
        var default_char_width = widths[0] || widthsFractionOf;
        var output = [];

        for (i = 0, l = text.length; i < l; i++) {
          char_code = text.charCodeAt(i);
          output.push((widths[char_code] || default_char_width) / widthsFractionOf + (kerning[char_code] && kerning[char_code][prior_char_code] || 0) / kerningFractionOf);
          prior_char_code = char_code;
        }

        return output;
      }

      function getArraySum(array) {
        var i = array.length;
        var output = 0;

        while (i) {
          i--;
          output += array[i];
        }

        return output;
      }

      function encode(font, text) {
        font.use(text);
        text = font.encode(text);
        text = function () {
          var _results = [];

          for (var i = 0, _ref2 = text.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
            _results.push(text.charCodeAt(i).toString(16));
          }
          return _results;
        }().join('');

        return text;
      }

      // Pre-August-2012 the order of arguments was function(x, y, text, flags)
      // in effort to make all calls have similar signature like
      //   function(data, coordinates... , miscellaneous)
      // this method had its args flipped.
      // code below allows backward compatibility with old arg order.
      if (typeof text === 'number') {
        tmp = y;
        y = x;
        x = text;
        text = tmp;
      }

      // If there are any newlines in text, we assume
      // the user wanted to print multiple lines, so break the
      // text up into an array.  If the text is already an array,
      // we assume the user knows what they are doing.
      // Convert text into an array anyway to simplify
      // later code.
      if (typeof text === 'string') {
        if (text.match(/[\n\r]/)) {
          text = text.split(/\r\n|\r|\n/g);
        } else {
          text = [text];
        }
      }

      //multiline
      var maxWidth = activeMaxWidth || 0;
      var activeFont = fonts[activeFontKey];
      var k = this.internal.scaleFactor;

      var widthOfSpace = getStringUnitWidth(" ", {
        font: activeFont,
        charSpace: activeCharSpace,
        fontSize: activeFontSize
      }) / k;

      function splitByMaxWidth(value, maxWidth) {
        var i = 0;
        var lastBreak = 0;
        var currentWidth = 0;
        var resultingChunks = [];
        var widthOfEachWord = [];
        var currentChunk = [];
        var listOfWords = [];
        var result = [];

        listOfWords = value.split(/ /g);

        for (i = 0; i < listOfWords.length; i += 1) {
          widthOfEachWord.push(getStringUnitWidth(listOfWords[i], {
            font: activeFont,
            charSpace: activeCharSpace,
            fontSize: activeFontSize
          }) / k);
        }
        for (i = 0; i < listOfWords.length; i += 1) {
          currentChunk = widthOfEachWord.slice(lastBreak, i);
          currentWidth = getArraySum(currentChunk) + widthOfSpace * (currentChunk.length - 1);
          if (currentWidth >= maxWidth) {
            resultingChunks.push(listOfWords.slice(lastBreak, i !== 0 ? i - 1 : 0).join(" "));
            lastBreak = i !== 0 ? i - 1 : 0;
            i -= 1;
          } else if (i === widthOfEachWord.length - 1) {
            resultingChunks.push(listOfWords.slice(lastBreak, widthOfEachWord.length).join(" "));
          }
        }
        for (i = 0; i < resultingChunks.length; i += 1) {
          result = result.concat(resultingChunks[i]);
        }
        return result;
      }

      function firstFitMethod(value, maxWidth) {
        var j = 0;
        var tmpText = [];
        for (j = 0; j < value.length; j += 1) {
          tmpText = tmpText.concat(splitByMaxWidth(value[j], maxWidth));
        }
        return tmpText;
      }

      if (maxWidth > 0) text = firstFitMethod(text, maxWidth);

      if (typeof angle === 'string') {
        align = angle;
        angle = null;
      }
      if (typeof flags === 'string') {
        align = flags;
        flags = null;
      }
      if (typeof flags === 'number') {
        angle = flags;
        flags = null;
      }
      var xtra = '',
          mode = 'Td',
          todo;
      if (angle) {
        angle *= Math.PI / 180;
        var c = Math.cos(angle),
            s = Math.sin(angle);
        xtra = [f2(c), f2(s), f2(s * -1), f2(c), ''].join(" ");
        mode = 'Tm';
      }
      flags = flags || {};
      if (!('noBOM' in flags)) flags.noBOM = true;
      if (!('autoencode' in flags)) flags.autoencode = true;

      var strokeOption = '';
      var pageContext = this.internal.getCurrentPageInfo().pageContext;
      if (true === flags.stroke) {
        if (pageContext.lastTextWasStroke !== true) {
          strokeOption = '1 Tr\n';
          pageContext.lastTextWasStroke = true;
        }
      } else {
        if (pageContext.lastTextWasStroke) {
          strokeOption = '0 Tr\n';
        }
        pageContext.lastTextWasStroke = false;
      }

      if (typeof this._runningPageHeight === 'undefined') {
        this._runningPageHeight = 0;
      }

      if (typeof text === 'string') {
        text = ESC(text);
      } else if (Object.prototype.toString.call(text) === '[object Array]') {
        // we don't want to destroy  original text array, so cloning it
        var sa = text.concat(),
            da = [],
            len = sa.length;
        // we do array.join('text that must not be PDFescaped")
        // thus, pdfEscape each component separately

        while (len--) {
          da.push(activeFont.encoding === "MacRomanEncoding" ? sa.shift() : ESC(sa.shift()));
        }
        if (align) {
          var left,
              prevX,
              maxLineLength,
              leading = activeFontSize * lineHeightProportion,
              lineWidths = text.map(function (v) {
            return getStringUnitWidth(v, {
              font: activeFont,
              charSpace: activeCharSpace,
              fontSize: activeFontSize
            }) / k;
          }, this);
          maxLineLength = Math.max.apply(Math, lineWidths);
          // The first line uses the "main" Td setting,
          // and the subsequent lines are offset by the
          // previous line's x coordinate.
          if (align === "center") {
            // The passed in x coordinate defines
            // the center point.
            left = x - maxLineLength / 2;
            x -= lineWidths[0] / 2;
          } else if (align === "right") {
            // The passed in x coordinate defines the
            // rightmost point of the text.
            left = x - maxLineLength;
            x -= lineWidths[0];
          } else {
            throw new Error('Unrecognized alignment option, use "center" or "right".');
          }
          prevX = x;
          text = activeFont.encoding === "MacRomanEncoding" ? encode(activeFont.metadata, da[0]) : da[0];
          for (var i = 1, len = da.length; i < len; i++) {
            var delta = maxLineLength - lineWidths[i];
            if (align === "center") delta /= 2;
            // T* = x-offset leading Td ( text )
            if (activeFont.encoding === "MacRomanEncoding") {
              text += "> Tj\n" + (left - prevX + delta) + " -" + leading + " Td <" + da[i];
            } else {
              text += ") Tj\n" + (left - prevX + delta) + " -" + leading + " Td (" + da[i];
            }
            prevX = left + delta;
          }
        } else {
          text = activeFont.encoding === "MacRomanEncoding" ? da.map(function (out) {
            return encode(activeFont.metadata, out);
          }).join("> Tj\nT* <") : da.join(") Tj\nT* (");
        }
        text = activeFont.encoding === "MacRomanEncoding" ? '<' + text + '>' : '(' + text + ')';
      } else {
        throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
      }
      // Using "'" ("go next line and render text" mark) would save space but would complicate our rendering code, templates

      // BT .. ET does NOT have default settings for Tf. You must state that explicitely every time for BT .. ET
      // if you want text transformation matrix (+ multiline) to work reliably (which reads sizes of things from font declarations)
      // Thus, there is NO useful, *reliable* concept of "default" font for a page.
      // The fact that "default" (reuse font used before) font worked before in basic cases is an accident
      // - readers dealing smartly with brokenness of jsPDF's markup.

      var curY;
      if (todo) {
        //this.addPage();
        //this._runningPageHeight += y -  (activeFontSize * 1.7 / k);
        //curY = f2(pageHeight - activeFontSize * 1.7 /k);
      } else {
        curY = f2((pageHeight - y) * k);
      }
      //curY = f2((pageHeight - (y - this._runningPageHeight)) * k);

      //			if (curY < 0){
      //				console.log('auto page break');
      //				this.addPage();
      //				this._runningPageHeight = y -  (activeFontSize * 1.7 / k);
      //				curY = f2(pageHeight - activeFontSize * 1.7 /k);
      //			}

      var result = 'BT\n/' + activeFontKey + ' ' + activeFontSize + ' Tf\n' + // font face, style, size
      activeFontSize * lineHeightProportion + ' TL\n' + // line spacing
      strokeOption + textColor + '\n';

      if (activeCharSpace) result += activeCharSpace + ' Tc\n';

      result += xtra + f2(x * k) + ' ' + curY + ' ' + mode + '\n' + text + ' Tj\nET';

      if (todo) {
        //this.text( todo, x, activeFontSize * 1.7 / k);
        //this.text( todo, x, this._runningPageHeight + (activeFontSize * 1.7 / k));
        this.text(todo, x, y); // + (activeFontSize * 1.7 / k));
      }

      out(result);

      return this;
    };

    /**
     * Letter spacing method to print text with gaps
     *
     * @function
     * @param {String|Array} text String to be added to the page.
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} spacing Spacing (in units declared at inception)
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name lstext
     * @deprecated We'll be removing this function. It doesn't take character width into account.
     */
    API.lstext = function (text, x, y, spacing) {
      console.warn('jsPDF.lstext is deprecated');
      for (var i = 0, len = text.length; i < len; i++, x += spacing) {
        this.text(text[i], x, y);
      }return this;
    };

    API.line = function (x1, y1, x2, y2) {
      return this.lines([[x2 - x1, y2 - y1]], x1, y1);
    };

    API.clip = function () {
      // By patrick-roberts, github.com/MrRio/jsPDF/issues/328
      // Call .clip() after calling .rect() with a style argument of null
      out('W'); // clip
      out('S'); // stroke path; necessary for clip to work
    };

    /**
     * This fixes the previous function clip(). Perhaps the 'stroke path' hack was due to the missing 'n' instruction?
     * We introduce the fixed version so as to not break API.
     * @param fillRule
     */
    API.clip_fixed = function (fillRule) {
      // Call .clip() after calling drawing ops with a style argument of null
      // W is the PDF clipping op
      if ('evenodd' === fillRule) {
        out('W*');
      } else {
        out('W');
      }
      // End the path object without filling or stroking it.
      // This operator is a path-painting no-op, used primarily for the side effect of changing the current clipping path
      // (see Section 4.4.3, “Clipping Path Operators”)
      out('n');
    };

    /**
     * Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
     * All data points in `lines` are relative to last line origin.
     * `x`, `y` become x1,y1 for first line / curve in the set.
     * For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
     * For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.
     *
     * @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, 10) // line, line, bezier curve, line
     * @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
     * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @param {Boolean} closed If true, the path is closed with a straight line from the end of the last curve to the starting point.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name lines
     */
    API.lines = function (lines, x, y, scale, style, closed) {
      var scalex, scaley, i, l, leg, x2, y2, x3, y3, x4, y4;

      // Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
      // in effort to make all calls have similar signature like
      //   function(content, coordinateX, coordinateY , miscellaneous)
      // this method had its args flipped.
      // code below allows backward compatibility with old arg order.
      if (typeof lines === 'number') {
        tmp = y;
        y = x;
        x = lines;
        lines = tmp;
      }

      scale = scale || [1, 1];

      // starting point
      out(f3(x * k) + ' ' + f3((pageHeight - y) * k) + ' m ');

      scalex = scale[0];
      scaley = scale[1];
      l = lines.length;
      //, x2, y2 // bezier only. In page default measurement "units", *after* scaling
      //, x3, y3 // bezier only. In page default measurement "units", *after* scaling
      // ending point for all, lines and bezier. . In page default measurement "units", *after* scaling
      x4 = x; // last / ending point = starting point for first item.
      y4 = y; // last / ending point = starting point for first item.

      for (i = 0; i < l; i++) {
        leg = lines[i];
        if (leg.length === 2) {
          // simple line
          x4 = leg[0] * scalex + x4; // here last x4 was prior ending point
          y4 = leg[1] * scaley + y4; // here last y4 was prior ending point
          out(f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' l');
        } else {
          // bezier curve
          x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
          y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
          x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
          y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
          x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
          y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
          out(f3(x2 * k) + ' ' + f3((pageHeight - y2) * k) + ' ' + f3(x3 * k) + ' ' + f3((pageHeight - y3) * k) + ' ' + f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' c');
        }
      }

      if (closed) {
        out(' h');
      }

      // stroking / filling / both the path
      if (style !== null) {
        out(getStyle(style));
      }
      return this;
    };

    /**
     * Adds a rectangle to PDF
     *
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} w Width (in units declared at inception of PDF document)
     * @param {Number} h Height (in units declared at inception of PDF document)
     * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name rect
     */
    API.rect = function (x, y, w, h, style) {
      var op = getStyle(style);
      out([f2(x * k), f2((pageHeight - y) * k), f2(w * k), f2(-h * k), 're'].join(' '));

      if (style !== null) {
        out(getStyle(style));
      }

      return this;
    };

    /**
     * Adds a triangle to PDF
     *
     * @param {Number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name triangle
     */
    API.triangle = function (x1, y1, x2, y2, x3, y3, style) {
      this.lines([[x2 - x1, y2 - y1], // vector to point 2
      [x3 - x2, y3 - y2], // vector to point 3
      [x1 - x3, y1 - y3] // closing vector back to point 1
      ], x1, y1, // start of path
      [1, 1], style, true);
      return this;
    };

    /**
     * Adds a rectangle with rounded corners to PDF
     *
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} w Width (in units declared at inception of PDF document)
     * @param {Number} h Height (in units declared at inception of PDF document)
     * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
     * @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
     * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name roundedRect
     */
    API.roundedRect = function (x, y, w, h, rx, ry, style) {
      var MyArc = 4 / 3 * (Math.SQRT2 - 1);
      this.lines([[w - 2 * rx, 0], [rx * MyArc, 0, rx, ry - ry * MyArc, rx, ry], [0, h - 2 * ry], [0, ry * MyArc, -(rx * MyArc), ry, -rx, ry], [-w + 2 * rx, 0], [-(rx * MyArc), 0, -rx, -(ry * MyArc), -rx, -ry], [0, -h + 2 * ry], [0, -(ry * MyArc), rx * MyArc, -ry, rx, -ry]], x + rx, y, // start of path
      [1, 1], style);
      return this;
    };

    /**
     * Adds an ellipse to PDF
     *
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
     * @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
     * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name ellipse
     */
    API.ellipse = function (x, y, rx, ry, style) {
      var lx = 4 / 3 * (Math.SQRT2 - 1) * rx,
          ly = 4 / 3 * (Math.SQRT2 - 1) * ry;

      out([f2((x + rx) * k), f2((pageHeight - y) * k), 'm', f2((x + rx) * k), f2((pageHeight - (y - ly)) * k), f2((x + lx) * k), f2((pageHeight - (y - ry)) * k), f2(x * k), f2((pageHeight - (y - ry)) * k), 'c'].join(' '));
      out([f2((x - lx) * k), f2((pageHeight - (y - ry)) * k), f2((x - rx) * k), f2((pageHeight - (y - ly)) * k), f2((x - rx) * k), f2((pageHeight - y) * k), 'c'].join(' '));
      out([f2((x - rx) * k), f2((pageHeight - (y + ly)) * k), f2((x - lx) * k), f2((pageHeight - (y + ry)) * k), f2(x * k), f2((pageHeight - (y + ry)) * k), 'c'].join(' '));
      out([f2((x + lx) * k), f2((pageHeight - (y + ry)) * k), f2((x + rx) * k), f2((pageHeight - (y + ly)) * k), f2((x + rx) * k), f2((pageHeight - y) * k), 'c'].join(' '));

      if (style !== null) {
        out(getStyle(style));
      }

      return this;
    };

    /**
     * Adds an circle to PDF
     *
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} r Radius (in units declared at inception of PDF document)
     * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name circle
     */
    API.circle = function (x, y, r, style) {
      return this.ellipse(x, y, r, r, style);
    };

    /**
     * Adds a properties to the PDF document
     *
     * @param {Object} A property_name-to-property_value object structure.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setProperties
     */
    API.setProperties = function (properties) {
      // copying only those properties we can render.
      for (var property in documentProperties) {
        if (documentProperties.hasOwnProperty(property) && properties[property]) {
          documentProperties[property] = properties[property];
        }
      }
      return this;
    };

    /**
     * Sets font size for upcoming text elements.
     *
     * @param {Number} size Font size in points.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setFontSize
     */
    API.setFontSize = function (size) {
      activeFontSize = size;
      return this;
    };

    /**
     * Sets text font face, variant for upcoming text elements.
     * See output of jsPDF.getFontList() for possible font names, styles.
     *
     * @param {String} fontName Font name or family. Example: "times"
     * @param {String} fontStyle Font style or variant. Example: "italic"
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setFont
     */
    API.setFont = function (fontName, fontStyle) {
      activeFontKey = _getFont(fontName, fontStyle);
      // if font is not found, the above line blows up and we never go further
      return this;
    };

    /**
     * Switches font style or variant for upcoming text elements,
     * while keeping the font face or family same.
     * See output of jsPDF.getFontList() for possible font names, styles.
     *
     * @param {String} style Font style or variant. Example: "italic"
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setFontStyle
     */
    API.setFontStyle = API.setFontType = function (style) {
      activeFontKey = _getFont(undefined, style);
      // if font is not found, the above line blows up and we never go further
      return this;
    };

    /**
     * Returns an object - a tree of fontName to fontStyle relationships available to
     * active PDF document.
     *
     * @public
     * @function
     * @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
     * @methodOf jsPDF#
     * @name getFontList
     */
    API.getFontList = function () {
      // TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
      var list = {},
          fontName,
          fontStyle,
          tmp;

      for (fontName in fontmap) {
        if (fontmap.hasOwnProperty(fontName)) {
          list[fontName] = tmp = [];
          for (fontStyle in fontmap[fontName]) {
            if (fontmap[fontName].hasOwnProperty(fontStyle)) {
              tmp.push(fontStyle);
            }
          }
        }
      }

      return list;
    };

    /**
     * Add a custom font.
     *
     * @param {String} Postscript name of the Font.  Example: "Menlo-Regular"
     * @param {String} Name of font-family from @font-face definition.  Example: "Menlo Regular"
     * @param {String} Font style.  Example: "normal"
     * @function
     * @returns the {fontKey} (same as the internal method)
     * @methodOf jsPDF#
     * @name addFont
     */
    API.addFont = function (postScriptName, fontName, fontStyle, encoding) {
      addFont(postScriptName, fontName, fontStyle, encoding);
    };

    /**
     * Sets line width for upcoming lines.
     *
     * @param {Number} width Line width (in units declared at inception of PDF document)
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setLineWidth
     */
    API.setLineWidth = function (width) {
      out((width * k).toFixed(2) + ' w');
      return this;
    };

    /**
     * Sets the stroke color for upcoming elements.
     *
     * Depending on the number of arguments given, Gray, RGB, or CMYK
     * color space is implied.
     *
     * When only ch1 is given, "Gray" color space is implied and it
     * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
     * if values are communicated as String types, or in range from 0 (black)
     * to 255 (white) if communicated as Number type.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
     * value must be in the range from 0.00 (minimum intensity) to to 1.00
     * (max intensity) if values are communicated as String types, or
     * from 0 (min intensity) to to 255 (max intensity) if values are communicated
     * as Number types.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
     * value must be a in the range from 0.00 (0% concentration) to to
     * 1.00 (100% concentration)
     *
     * Because JavaScript treats fixed point numbers badly (rounds to
     * floating point nearest to binary representation) it is highly advised to
     * communicate the fractional numbers as String types, not JavaScript Number type.
     *
     * @param {Number|String} ch1 Color channel value
     * @param {Number|String} ch2 Color channel value
     * @param {Number|String} ch3 Color channel value
     * @param {Number|String} ch4 Color channel value
     *
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setDrawColor
     */
    API.setDrawColor = function (ch1, ch2, ch3, ch4) {
      var color;
      if (ch2 === undefined || ch4 === undefined && ch1 === ch2 === ch3) {
        // Gray color space.
        if (typeof ch1 === 'string') {
          color = ch1 + ' G';
        } else {
          color = f2(ch1 / 255) + ' G';
        }
      } else if (ch4 === undefined) {
        // RGB
        if (typeof ch1 === 'string') {
          color = [ch1, ch2, ch3, 'RG'].join(' ');
        } else {
          color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'RG'].join(' ');
        }
      } else {
        // CMYK
        if (typeof ch1 === 'string') {
          color = [ch1, ch2, ch3, ch4, 'K'].join(' ');
        } else {
          color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'K'].join(' ');
        }
      }

      out(color);
      return this;
    };

    /**
     * Sets the fill color for upcoming elements.
     *
     * Depending on the number of arguments given, Gray, RGB, or CMYK
     * color space is implied.
     *
     * When only ch1 is given, "Gray" color space is implied and it
     * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
     * if values are communicated as String types, or in range from 0 (black)
     * to 255 (white) if communicated as Number type.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
     * value must be in the range from 0.00 (minimum intensity) to to 1.00
     * (max intensity) if values are communicated as String types, or
     * from 0 (min intensity) to to 255 (max intensity) if values are communicated
     * as Number types.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
     * value must be a in the range from 0.00 (0% concentration) to to
     * 1.00 (100% concentration)
     *
     * Because JavaScript treats fixed point numbers badly (rounds to
     * floating point nearest to binary representation) it is highly advised to
     * communicate the fractional numbers as String types, not JavaScript Number type.
     *
     * @param {Number|String} ch1 Color channel value
     * @param {Number|String} ch2 Color channel value
     * @param {Number|String} ch3 Color channel value
     * @param {Number|String} ch4 Color channel value
     *
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setFillColor
     */
    API.setFillColor = function (ch1, ch2, ch3, ch4) {
      var color;

      if (ch2 === undefined || ch4 === undefined && ch1 === ch2 === ch3) {
        // Gray color space.
        if (typeof ch1 === 'string') {
          color = ch1 + ' g';
        } else {
          color = f2(ch1 / 255) + ' g';
        }
      } else if (ch4 === undefined || (typeof ch4 === 'undefined' ? 'undefined' : _typeof(ch4)) === 'object') {
        // RGB
        if (typeof ch1 === 'string') {
          color = [ch1, ch2, ch3, 'rg'].join(' ');
        } else {
          color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'rg'].join(' ');
        }
        if (ch4 && ch4.a === 0) {
          //TODO Implement transparency.
          //WORKAROUND use white for now
          color = ['255', '255', '255', 'rg'].join(' ');
        }
      } else {
        // CMYK
        if (typeof ch1 === 'string') {
          color = [ch1, ch2, ch3, ch4, 'k'].join(' ');
        } else {
          color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'k'].join(' ');
        }
      }

      out(color);
      return this;
    };

    /**
     * Sets the text color for upcoming elements.
     * If only one, first argument is given,
     * treats the value as gray-scale color value.
     *
     * @param {Number} r Red channel color value in range 0-255 or {String} r color value in hexadecimal, example: '#FFFFFF'
     * @param {Number} g Green channel color value in range 0-255
     * @param {Number} b Blue channel color value in range 0-255
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setTextColor
     */
    API.setTextColor = function (r, g, b) {
      if (typeof r === 'string' && /^#[0-9A-Fa-f]{6}$/.test(r)) {
        var hex = parseInt(r.substr(1), 16);
        r = hex >> 16 & 255;
        g = hex >> 8 & 255;
        b = hex & 255;
      }

      if (r === 0 && g === 0 && b === 0 || typeof g === 'undefined') {
        textColor = f3(r / 255) + ' g';
      } else {
        textColor = [f3(r / 255), f3(g / 255), f3(b / 255), 'rg'].join(' ');
      }
      return this;
    };

    /**
     * Initializes the default character set that the user wants to be global..
     *
     * @param {Number} charSpace
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setCharSpace
     */

    API.setCharSpace = function (charSpace) {
      activeCharSpace = charSpace;
      return this;
    };

    /**
     * Initializes the maximum length of text for multi-lines that the user wants to be global..
     *
     * @param {Number} maxWidth
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setMaxWidth
     */

    API.setMaxWidth = function (maxWidth) {
      activeMaxWidth = maxWidth;
      return this;
    };

    /**
     * Is an Object providing a mapping from human-readable to
     * integer flag values designating the varieties of line cap
     * and join styles.
     *
     * @returns {Object}
     * @fieldOf jsPDF#
     * @name CapJoinStyles
     */
    API.CapJoinStyles = {
      0: 0,
      'butt': 0,
      'but': 0,
      'miter': 0,
      1: 1,
      'round': 1,
      'rounded': 1,
      'circle': 1,
      2: 2,
      'projecting': 2,
      'project': 2,
      'square': 2,
      'bevel': 2
    };

    /**
     * Sets the line cap styles
     * See {jsPDF.CapJoinStyles} for variants
     *
     * @param {String|Number} style A string or number identifying the type of line cap
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setLineCap
     */
    API.setLineCap = function (style) {
      var id = this.CapJoinStyles[style];
      if (id === undefined) {
        throw new Error("Line cap style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
      }
      lineCapID = id;
      out(id + ' J');

      return this;
    };

    /**
     * Sets the line join styles
     * See {jsPDF.CapJoinStyles} for variants
     *
     * @param {String|Number} style A string or number identifying the type of line join
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setLineJoin
     */
    API.setLineJoin = function (style) {
      var id = this.CapJoinStyles[style];
      if (id === undefined) {
        throw new Error("Line join style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
      }
      lineJoinID = id;
      out(id + ' j');

      return this;
    };

    // Output is both an internal (for plugins) and external function
    API.output = _output;

    /**
     * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf')
     * @param  {String} filename The filename including extension.
     *
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name save
     */
    API.save = function (filename) {
      API.output('save', filename);
    };

    // applying plugins (more methods) ON TOP of built-in API.
    // this is intentional as we allow plugins to override
    // built-ins
    for (var plugin in jsPDF.API) {
      if (jsPDF.API.hasOwnProperty(plugin)) {
        if (plugin === 'events' && jsPDF.API.events.length) {
          (function (events, newEvents) {

            // jsPDF.API.events is a JS Array of Arrays
            // where each Array is a pair of event name, handler
            // Events were added by plugins to the jsPDF instantiator.
            // These are always added to the new instance and some ran
            // during instantiation.
            var eventname, handler_and_args, i;

            for (i = newEvents.length - 1; i !== -1; i--) {
              // subscribe takes 3 args: 'topic', function, runonce_flag
              // if undefined, runonce is false.
              // users can attach callback directly,
              // or they can attach an array with [callback, runonce_flag]
              // that's what the "apply" magic is for below.
              eventname = newEvents[i][0];
              handler_and_args = newEvents[i][1];
              events.subscribe.apply(events, [eventname].concat(typeof handler_and_args === 'function' ? [handler_and_args] : handler_and_args));
            }
          })(events, jsPDF.API.events);
        } else {
          API[plugin] = jsPDF.API[plugin];
        }
      }
    }

    //////////////////////////////////////////////////////
    // continuing initialization of jsPDF Document object
    //////////////////////////////////////////////////////
    // Add the first page automatically
    addFonts();
    activeFontKey = 'F1';
    _addPage(format, orientation);

    events.publish('initialized');
    return API;
  }

  /**
   * jsPDF.API is a STATIC property of jsPDF class.
   * jsPDF.API is an object you can add methods and properties to.
   * The methods / properties you add will show up in new jsPDF objects.
   *
   * One property is prepopulated. It is the 'events' Object. Plugin authors can add topics,
   * callbacks to this object. These will be reassigned to all new instances of jsPDF.
   * Examples:
   * jsPDF.API.events['initialized'] = function(){ 'this' is API object }
   * jsPDF.API.events['addFont'] = function(added_font_object){ 'this' is API object }
   *
   * @static
   * @public
   * @memberOf jsPDF
   * @name API
   *
   * @example
   * jsPDF.API.mymethod = function(){
   *   // 'this' will be ref to internal API object. see jsPDF source
   *   // , so you can refer to built-in methods like so:
   *   //     this.line(....)
   *   //     this.text(....)
   * }
   * var pdfdoc = new jsPDF()
   * pdfdoc.mymethod() // <- !!!!!!
   */
  jsPDF.API = {
    events: []
  };
  jsPDF.version = "1.x-master";

  if (typeof define === 'function' && define.amd) {
    define('jsPDF', function () {
      return jsPDF;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = jsPDF;
  } else {
    global.jsPDF = jsPDF;
  }
  return jsPDF;
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || undefined);

(function (jsPDFAPI) {
    'use strict';

    var PLUS = '+'.charCodeAt(0);
    var SLASH = '/'.charCodeAt(0);
    var NUMBER = '0'.charCodeAt(0);
    var LOWER = 'a'.charCodeAt(0);
    var UPPER = 'A'.charCodeAt(0);
    var PLUS_URL_SAFE = '-'.charCodeAt(0);
    var SLASH_URL_SAFE = '_'.charCodeAt(0);

    var b64ToByteArray = function b64ToByteArray(b64) {
        var i, j, l, tmp, placeHolders, arr;
        if (b64.length % 4 > 0) {
            throw new Error('Invalid string. Length must be a multiple of 4');
        }
        // the number of equal signs (place holders)
        // if there are two placeholders, than the two characters before it
        // represent one byte
        // if there is only one, then the three characters before it represent 2 bytes
        // this is just a cheap hack to not do indexOf twice
        var len = b64.length;
        placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;
        // base64 is 4/3 + up to two characters of the original data
        arr = new Uint8Array(b64.length * 3 / 4 - placeHolders);
        // if there are placeholders, only get up to the last complete 4 chars
        l = placeHolders > 0 ? b64.length - 4 : b64.length;
        var L = 0;

        function push(v) {
            arr[L++] = v;
        }
        for (i = 0, j = 0; i < l; i += 4, j += 3) {
            tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
            push((tmp & 0xFF0000) >> 16);
            push((tmp & 0xFF00) >> 8);
            push(tmp & 0xFF);
        }
        if (placeHolders === 2) {
            tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
            push(tmp & 0xFF);
        } else if (placeHolders === 1) {
            tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
            push(tmp >> 8 & 0xFF);
            push(tmp & 0xFF);
        }
        return arr;
    };

    var decode = function decode(elt) {
        var code = elt.charCodeAt(0);
        if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
        if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
        if (code < NUMBER) return -1; //no match
        if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
        if (code < UPPER + 26) return code - UPPER;
        if (code < LOWER + 26) return code - LOWER + 26;
    };

    var TTFFont = function () {
        TTFFont.open = function (filename, name, vfs, encoding) {
            var contents;
            contents = b64ToByteArray(vfs);
            return new TTFFont(contents, name, encoding);
        };

        function TTFFont(rawData, name, encoding) {
            var data;
            this.rawData = rawData;
            data = this.contents = new Data(rawData);
            this.contents.pos = 4;
            if (data.readString(4) === 'ttcf') {
                if (!name) {
                    throw new Error("Must specify a font name for TTC files.");
                }
                throw new Error("Font " + name + " not found in TTC file.");
            } else {
                data.pos = 0;
                this.parse();
                this.subset = new Subset(this);
                this.registerTTF();
            }
        }
        TTFFont.prototype.parse = function () {
            this.directory = new Directory(this.contents);
            this.head = new HeadTable(this);
            this.name = new NameTable(this);
            this.cmap = new CmapTable(this);
            this.hhea = new HheaTable(this);
            this.maxp = new MaxpTable(this);
            this.hmtx = new HmtxTable(this);
            this.post = new PostTable(this);
            this.os2 = new OS2Table(this);
            this.loca = new LocaTable(this);
            this.glyf = new GlyfTable(this);
            this.ascender = this.os2.exists && this.os2.ascender || this.hhea.ascender;
            this.decender = this.os2.exists && this.os2.decender || this.hhea.decender;
            this.lineGap = this.os2.exists && this.os2.lineGap || this.hhea.lineGap;
            return this.bbox = [this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax];
        };
        TTFFont.prototype.registerTTF = function () {
            var e, hi, low, raw, _ref;
            this.scaleFactor = 1000.0 / this.head.unitsPerEm;
            this.bbox = function () {
                var _i, _len, _ref, _results;
                _ref = this.bbox;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    e = _ref[_i];
                    _results.push(Math.round(e * this.scaleFactor));
                }
                return _results;
            }.call(this);
            this.stemV = 0;
            if (this.post.exists) {
                raw = this.post.italic_angle;
                hi = raw >> 16;
                low = raw & 0xFF;
                if (hi & 0x8000 !== 0) {
                    hi = -((hi ^ 0xFFFF) + 1);
                }
                this.italicAngle = +("" + hi + "." + low);
            } else {
                this.italicAngle = 0;
            }
            this.ascender = Math.round(this.ascender * this.scaleFactor);
            this.decender = Math.round(this.decender * this.scaleFactor);
            this.lineGap = Math.round(this.lineGap * this.scaleFactor);
            this.capHeight = this.os2.exists && this.os2.capHeight || this.ascender;
            this.xHeight = this.os2.exists && this.os2.xHeight || 0;
            this.familyClass = (this.os2.exists && this.os2.familyClass || 0) >> 8;
            this.isSerif = (_ref = this.familyClass) === 1 || _ref === 2 || _ref === 3 || _ref === 4 || _ref === 5 || _ref === 7;
            this.isScript = this.familyClass === 10;
            this.flags = 0;
            if (this.post.isFixedPitch) {
                this.flags |= 1 << 0;
            }
            if (this.isSerif) {
                this.flags |= 1 << 1;
            }
            if (this.isScript) {
                this.flags |= 1 << 3;
            }
            if (this.italicAngle !== 0) {
                this.flags |= 1 << 6;
            }
            this.flags |= 1 << 5;
            if (!this.cmap.unicode) {
                throw new Error('No unicode cmap for font');
            }
        };
        TTFFont.prototype.characterToGlyph = function (character) {
            var _ref;
            return ((_ref = this.cmap.unicode) != null ? _ref.codeMap[character] : void 0) || 0;
        };
        TTFFont.prototype.widthOfGlyph = function (glyph) {
            var scale;
            scale = 1000.0 / this.head.unitsPerEm;
            return this.hmtx.forGlyph(glyph).advance * scale;
        };
        TTFFont.prototype.widthOfString = function (string, size, charSpace) {
            var charCode, i, scale, width, _i, _ref, charSpace;
            string = '' + string;
            width = 0;
            for (i = _i = 0, _ref = string.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                charCode = string.charCodeAt(i);
                width += this.widthOfGlyph(this.characterToGlyph(charCode)) + charSpace * (1000 / size) || 0;
            }
            scale = size / 1000;
            return width * scale;
        };
        TTFFont.prototype.lineHeight = function (size, includeGap) {
            var gap;
            if (includeGap == null) {
                includeGap = false;
            }
            gap = includeGap ? this.lineGap : 0;
            return (this.ascender + gap - this.decender) / 1000 * size;
        };
        TTFFont.prototype.use = function (characters) {
            var _ref;
            return (_ref = this.subset) != null ? _ref.use(characters) : void 0;
        };
        TTFFont.prototype.encode = function (text) {
            var _ref;
            if (this.isAFM) {
                return this.font.encodeText(text);
            } else {
                return ((_ref = this.subset) != null ? _ref.encodeText(text) : void 0) || text;
            }
        };
        TTFFont.prototype.embedTTF = function (encoding, newObject, out) {
            var charWidths, cmap, code, data, descriptor, firstChar, fontfile, glyph;
            data = this.subset.encode();
            fontfile = {};
            fontfile = encoding === 'MacRomanEncoding' ? data : this.rawData;
            descriptor = {
                Type: 'FontDescriptor',
                FontName: this.subset.postscriptName,
                FontFile2: fontfile,
                FontBBox: this.bbox,
                Flags: this.flags,
                StemV: this.stemV,
                ItalicAngle: this.italicAngle,
                Ascent: this.ascender,
                Descent: this.decender,
                CapHeight: this.capHeight,
                XHeight: this.xHeight
            };
            firstChar = +Object.keys(this.subset.cmap)[0];
            if (firstChar !== 33 && encoding === 'MacRomanEncoding') return false;
            charWidths = function () {
                var _ref, _results;
                _ref = this.subset.cmap;
                _results = [];
                for (code in _ref) {
                    glyph = _ref[code];
                    _results.push(Math.round(this.widthOfGlyph(glyph)));
                }
                return _results;
            }.call(this);
            cmap = toUnicodeCmap(this.subset.subset);
            var dictionary = encoding === 'MacRomanEncoding' ? {
                Type: 'Font',
                BaseFont: this.subset.postscriptName,
                Subtype: 'TrueType',
                FontDescriptor: descriptor,
                FirstChar: firstChar,
                LastChar: firstChar + charWidths.length - 1,
                Widths: charWidths,
                Encoding: encoding,
                ToUnicode: cmap
            } : {
                Type: 'Font',
                BaseFont: this.subset.postscriptName,
                Subtype: 'TrueType',
                FontDescriptor: descriptor,
                FirstChar: 0,
                LastChar: 255,
                Widths: makeWidths(this),
                Encoding: encoding
            };
            return makeFontTable(dictionary);

            function makeFontTable(data) {
                var objRef = '';
                var tableNumber;
                if (data.Type === "Font") {
                    if (data.ToUnicode) data.ToUnicode = makeFontTable(data.ToUnicode);
                    data.FontDescriptor = makeFontTable(data.FontDescriptor);
                    tableNumber = newObject();
                    out(PDFObject.convert(data));
                } else if (data.Type === "FontDescriptor") {
                    data.FontFile2 = makeFontTable(data.FontFile2);
                    tableNumber = newObject();
                    out(PDFObject.convert(data));
                    objRef = ' 0 R';
                } else {
                    tableNumber = newObject();
                    out('<</Length1 ' + data.length + '>>');
                    out('stream');
                    Array.isArray(data) || data.constructor === Uint8Array ? out(toString(data)) : out(data);
                    out('endstream');
                    objRef = ' 0 R';
                }
                out('endobj');
                return tableNumber + objRef;
            }
        };

        var toString = function toString(fontfile) {
            var strings = [];
            for (var i = 0, length = fontfile.length; i < length; i++) {
                strings.push(String.fromCharCode(fontfile[i]));
            }
            return strings.join('');
        };

        var makeWidths = function makeWidths(font) {
            var widths = [];
            for (var i = 0; i < 256; i++) {
                widths[i] = 0;
            }
            var scale = 1000.0 / font.head.unitsPerEm;
            var codeMap = font.cmap.unicode.codeMap;
            var WinAnsiEncoding = {
                402: 131,
                8211: 150,
                8212: 151,
                8216: 145,
                8217: 146,
                8218: 130,
                8220: 147,
                8221: 148,
                8222: 132,
                8224: 134,
                8225: 135,
                8226: 149,
                8230: 133,
                8364: 128,
                8240: 137,
                8249: 139,
                8250: 155,
                710: 136,
                8482: 153,
                338: 140,
                339: 156,
                732: 152,
                352: 138,
                353: 154,
                376: 159,
                381: 142,
                382: 158
            };

            Object.keys(codeMap).map(function (key) {
                var WinAnsiEncodingValue = WinAnsiEncoding[key];
                var AssignedValue = Math.round(font.hmtx.metrics[codeMap[key]].advance * scale);
                WinAnsiEncodingValue ? widths[WinAnsiEncodingValue] = AssignedValue : key < 256 ? widths[key] = AssignedValue : undefined;
            });
            return widths;
        };

        var toUnicodeCmap = function toUnicodeCmap(map) {
            var code, codes, range, unicode, unicodeMap, _i, _len;
            unicodeMap = '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<00><ff>\nendcodespacerange';
            codes = Object.keys(map).sort(function (a, b) {
                return a - b;
            });
            range = [];
            for (_i = 0, _len = codes.length; _i < _len; _i++) {
                code = codes[_i];
                if (range.length >= 100) {
                    unicodeMap += "\n" + range.length + " beginbfchar\n" + range.join('\n') + "\nendbfchar";
                    range = [];
                }
                unicode = ('0000' + map[code].toString(16)).slice(-4);
                code = (+code).toString(16);
                range.push("<" + code + "><" + unicode + ">");
            }
            if (range.length) {
                unicodeMap += "\n" + range.length + " beginbfchar\n" + range.join('\n') + "\nendbfchar\n";
            }
            return unicodeMap += 'endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';
        };

        return TTFFont;
    }();

    var Data = function () {
        function Data(data) {
            this.data = data != null ? data : [];
            this.pos = 0;
            this.length = this.data.length;
        }
        Data.prototype.readByte = function () {
            return this.data[this.pos++];
        };
        Data.prototype.writeByte = function (byte) {
            return this.data[this.pos++] = byte;
        };
        Data.prototype.readUInt32 = function () {
            var b1, b2, b3, b4;
            b1 = this.readByte() * 0x1000000;
            b2 = this.readByte() << 16;
            b3 = this.readByte() << 8;
            b4 = this.readByte();
            return b1 + b2 + b3 + b4;
        };
        Data.prototype.writeUInt32 = function (val) {
            this.writeByte(val >>> 24 & 0xff);
            this.writeByte(val >> 16 & 0xff);
            this.writeByte(val >> 8 & 0xff);
            return this.writeByte(val & 0xff);
        };
        Data.prototype.readInt32 = function () {
            var int;
            int = this.readUInt32();
            if (int >= 0x80000000) {
                return int - 0x100000000;
            } else {
                return int;
            }
        };
        Data.prototype.writeInt32 = function (val) {
            if (val < 0) {
                val += 0x100000000;
            }
            return this.writeUInt32(val);
        };
        Data.prototype.readUInt16 = function () {
            var b1, b2;
            b1 = this.readByte() << 8;
            b2 = this.readByte();
            return b1 | b2;
        };
        Data.prototype.writeUInt16 = function (val) {
            this.writeByte(val >> 8 & 0xff);
            return this.writeByte(val & 0xff);
        };
        Data.prototype.readInt16 = function () {
            var int;
            int = this.readUInt16();
            if (int >= 0x8000) {
                return int - 0x10000;
            } else {
                return int;
            }
        };
        Data.prototype.writeInt16 = function (val) {
            if (val < 0) {
                val += 0x10000;
            }
            return this.writeUInt16(val);
        };
        Data.prototype.readString = function (length) {
            var i, ret, _i;
            ret = [];
            for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
                ret[i] = String.fromCharCode(this.readByte());
            }
            return ret.join('');
        };
        Data.prototype.writeString = function (val) {
            var i, _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = val.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                _results.push(this.writeByte(val.charCodeAt(i)));
            }
            return _results;
        };
        Data.prototype.stringAt = function (pos, length) {
            this.pos = pos;
            return this.readString(length);
        };
        Data.prototype.readShort = function () {
            return this.readInt16();
        };
        Data.prototype.writeShort = function (val) {
            return this.writeInt16(val);
        };
        Data.prototype.readLongLong = function () {
            var b1, b2, b3, b4, b5, b6, b7, b8;
            b1 = this.readByte();
            b2 = this.readByte();
            b3 = this.readByte();
            b4 = this.readByte();
            b5 = this.readByte();
            b6 = this.readByte();
            b7 = this.readByte();
            b8 = this.readByte();
            if (b1 & 0x80) {
                return ((b1 ^ 0xff) * 0x100000000000000 + (b2 ^ 0xff) * 0x1000000000000 + (b3 ^ 0xff) * 0x10000000000 + (b4 ^ 0xff) * 0x100000000 + (b5 ^ 0xff) * 0x1000000 + (b6 ^ 0xff) * 0x10000 + (b7 ^ 0xff) * 0x100 + (b8 ^ 0xff) + 1) * -1;
            }
            return b1 * 0x100000000000000 + b2 * 0x1000000000000 + b3 * 0x10000000000 + b4 * 0x100000000 + b5 * 0x1000000 + b6 * 0x10000 + b7 * 0x100 + b8;
        };
        Data.prototype.writeLongLong = function (val) {
            var high, low;
            high = Math.floor(val / 0x100000000);
            low = val & 0xffffffff;
            this.writeByte(high >> 24 & 0xff);
            this.writeByte(high >> 16 & 0xff);
            this.writeByte(high >> 8 & 0xff);
            this.writeByte(high & 0xff);
            this.writeByte(low >> 24 & 0xff);
            this.writeByte(low >> 16 & 0xff);
            this.writeByte(low >> 8 & 0xff);
            return this.writeByte(low & 0xff);
        };
        Data.prototype.readInt = function () {
            return this.readInt32();
        };
        Data.prototype.writeInt = function (val) {
            return this.writeInt32(val);
        };
        Data.prototype.slice = function (start, end) {
            return this.data.slice(start, end);
        };
        Data.prototype.read = function (bytes) {
            var buf, i, _i;
            buf = [];
            for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
                buf.push(this.readByte());
            }
            return buf;
        };
        Data.prototype.write = function (bytes) {
            var byte, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = bytes.length; _i < _len; _i++) {
                byte = bytes[_i];
                _results.push(this.writeByte(byte));
            }
            return _results;
        };
        return Data;
    }();

    var Directory = function () {
        var checksum;

        function Directory(data) {
            var entry, i, _i, _ref;
            this.scalarType = data.readInt();
            this.tableCount = data.readShort();
            this.searchRange = data.readShort();
            this.entrySelector = data.readShort();
            this.rangeShift = data.readShort();
            this.tables = {};
            for (i = _i = 0, _ref = this.tableCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                entry = {
                    tag: data.readString(4),
                    checksum: data.readInt(),
                    offset: data.readInt(),
                    length: data.readInt()
                };
                this.tables[entry.tag] = entry;
            }
        }
        Directory.prototype.encode = function (tables) {
            var adjustment, directory, directoryLength, entrySelector, headOffset, log2, offset, rangeShift, searchRange, sum, table, tableCount, tableData, tag;
            tableCount = Object.keys(tables).length;
            log2 = Math.log(2);
            searchRange = Math.floor(Math.log(tableCount) / log2) * 16;
            entrySelector = Math.floor(searchRange / log2);
            rangeShift = tableCount * 16 - searchRange;
            directory = new Data();
            directory.writeInt(this.scalarType);
            directory.writeShort(tableCount);
            directory.writeShort(searchRange);
            directory.writeShort(entrySelector);
            directory.writeShort(rangeShift);
            directoryLength = tableCount * 16;
            offset = directory.pos + directoryLength;
            headOffset = null;
            tableData = [];
            for (tag in tables) {
                table = tables[tag];
                directory.writeString(tag);
                directory.writeInt(checksum(table));
                directory.writeInt(offset);
                directory.writeInt(table.length);
                tableData = tableData.concat(table);
                if (tag === 'head') {
                    headOffset = offset;
                }
                offset += table.length;
                while (offset % 4) {
                    tableData.push(0);
                    offset++;
                }
            }
            directory.write(tableData);
            sum = checksum(directory.data);
            adjustment = 0xB1B0AFBA - sum;
            directory.pos = headOffset + 8;
            directory.writeUInt32(adjustment);
            return directory.data;
        };
        checksum = function checksum(data) {
            var i, sum, tmp, _i, _ref;
            data = __slice.call(data);
            while (data.length % 4) {
                data.push(0);
            }
            tmp = new Data(data);
            sum = 0;
            for (i = _i = 0, _ref = data.length; _i < _ref; i = _i += 4) {
                sum += tmp.readUInt32();
            }
            return sum & 0xFFFFFFFF;
        };
        return Directory;
    }();

    var __extends = function __extends(child, parent) {
        for (var key in parent) {
            if ({}.hasOwnProperty.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

    var Table = function () {
        function Table(file) {
            var info;
            this.file = file;
            info = this.file.directory.tables[this.tag];
            this.exists = !!info;
            if (info) {
                this.offset = info.offset, this.length = info.length;
                this.parse(this.file.contents);
            }
        }
        Table.prototype.parse = function () {};
        Table.prototype.encode = function () {};
        Table.prototype.raw = function () {
            if (!this.exists) {
                return null;
            }
            this.file.contents.pos = this.offset;
            return this.file.contents.read(this.length);
        };
        return Table;
    }();

    var HeadTable = function (_super) {
        __extends(HeadTable, _super);

        function HeadTable() {
            return HeadTable.__super__.constructor.apply(this, arguments);
        }

        HeadTable.prototype.tag = 'head';

        HeadTable.prototype.parse = function (data) {
            data.pos = this.offset;
            this.version = data.readInt();
            this.revision = data.readInt();
            this.checkSumAdjustment = data.readInt();
            this.magicNumber = data.readInt();
            this.flags = data.readShort();
            this.unitsPerEm = data.readShort();
            this.created = data.readLongLong();
            this.modified = data.readLongLong();
            this.xMin = data.readShort();
            this.yMin = data.readShort();
            this.xMax = data.readShort();
            this.yMax = data.readShort();
            this.macStyle = data.readShort();
            this.lowestRecPPEM = data.readShort();
            this.fontDirectionHint = data.readShort();
            this.indexToLocFormat = data.readShort();
            return this.glyphDataFormat = data.readShort();
        };

        HeadTable.prototype.encode = function (loca) {
            var table;
            table = new Data();
            table.writeInt(this.version);
            table.writeInt(this.revision);
            table.writeInt(this.checkSumAdjustment);
            table.writeInt(this.magicNumber);
            table.writeShort(this.flags);
            table.writeShort(this.unitsPerEm);
            table.writeLongLong(this.created);
            table.writeLongLong(this.modified);
            table.writeShort(this.xMin);
            table.writeShort(this.yMin);
            table.writeShort(this.xMax);
            table.writeShort(this.yMax);
            table.writeShort(this.macStyle);
            table.writeShort(this.lowestRecPPEM);
            table.writeShort(this.fontDirectionHint);
            table.writeShort(loca.type);
            table.writeShort(this.glyphDataFormat);
            return table.data;
        };

        return HeadTable;
    }(Table);

    var CmapTable = function (_super) {
        __extends(CmapTable, _super);

        function CmapTable() {
            return CmapTable.__super__.constructor.apply(this, arguments);
        }

        CmapTable.prototype.tag = 'cmap';

        CmapTable.prototype.parse = function (data) {
            var entry, i, tableCount, _i;
            data.pos = this.offset;
            this.version = data.readUInt16();
            tableCount = data.readUInt16();
            this.tables = [];
            this.unicode = null;
            for (i = _i = 0; 0 <= tableCount ? _i < tableCount : _i > tableCount; i = 0 <= tableCount ? ++_i : --_i) {
                entry = new CmapEntry(data, this.offset);
                this.tables.push(entry);
                if (entry.isUnicode) {
                    if (this.unicode == null) {
                        this.unicode = entry;
                    }
                }
            }
            return true;
        };

        CmapTable.encode = function (charmap, encoding) {
            var result, table;
            if (encoding == null) {
                encoding = 'macroman';
            }
            result = CmapEntry.encode(charmap, encoding);
            table = new Data();
            table.writeUInt16(0);
            table.writeUInt16(1);
            result.table = table.data.concat(result.subtable);
            return result;
        };

        return CmapTable;
    }(Table);

    var CmapEntry = function () {
        function CmapEntry(data, offset) {
            var code, count, endCode, glyphId, glyphIds, i, idDelta, idRangeOffset, index, saveOffset, segCount, segCountX2, start, startCode, tail, _i, _j, _k, _len;
            this.platformID = data.readUInt16();
            this.encodingID = data.readShort();
            this.offset = offset + data.readInt();
            saveOffset = data.pos;
            data.pos = this.offset;
            this.format = data.readUInt16();
            this.length = data.readUInt16();
            this.language = data.readUInt16();
            this.isUnicode = this.platformID === 3 && this.encodingID === 1 && this.format === 4 || this.platformID === 0 && this.format === 4;
            this.codeMap = {};
            switch (this.format) {
                case 0:
                    for (i = _i = 0; _i < 256; i = ++_i) {
                        this.codeMap[i] = data.readByte();
                    }
                    break;
                case 4:
                    segCountX2 = data.readUInt16();
                    segCount = segCountX2 / 2;
                    data.pos += 6;
                    endCode = function () {
                        var _j, _results;
                        _results = [];
                        for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                            _results.push(data.readUInt16());
                        }
                        return _results;
                    }();
                    data.pos += 2;
                    startCode = function () {
                        var _j, _results;
                        _results = [];
                        for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                            _results.push(data.readUInt16());
                        }
                        return _results;
                    }();
                    idDelta = function () {
                        var _j, _results;
                        _results = [];
                        for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                            _results.push(data.readUInt16());
                        }
                        return _results;
                    }();
                    idRangeOffset = function () {
                        var _j, _results;
                        _results = [];
                        for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                            _results.push(data.readUInt16());
                        }
                        return _results;
                    }();
                    count = (this.length - data.pos + this.offset) / 2;
                    glyphIds = function () {
                        var _j, _results;
                        _results = [];
                        for (i = _j = 0; 0 <= count ? _j < count : _j > count; i = 0 <= count ? ++_j : --_j) {
                            _results.push(data.readUInt16());
                        }
                        return _results;
                    }();
                    for (i = _j = 0, _len = endCode.length; _j < _len; i = ++_j) {
                        tail = endCode[i];
                        start = startCode[i];
                        for (code = _k = start; start <= tail ? _k <= tail : _k >= tail; code = start <= tail ? ++_k : --_k) {
                            if (idRangeOffset[i] === 0) {
                                glyphId = code + idDelta[i];
                            } else {
                                index = idRangeOffset[i] / 2 + (code - start) - (segCount - i);
                                glyphId = glyphIds[index] || 0;
                                if (glyphId !== 0) {
                                    glyphId += idDelta[i];
                                }
                            }
                            this.codeMap[code] = glyphId & 0xFFFF;
                        }
                    }
            }
            data.pos = saveOffset;
        }

        CmapEntry.encode = function (charmap, encoding) {
            var charMap, code, codeMap, codes, delta, deltas, diff, endCode, endCodes, entrySelector, glyphIDs, i, id, indexes, last, map, nextID, offset, old, rangeOffsets, rangeShift, result, searchRange, segCount, segCountX2, startCode, startCodes, startGlyph, subtable, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _name, _o, _p, _q;
            subtable = new Data();
            codes = Object.keys(charmap).sort(function (a, b) {
                return a - b;
            });
            switch (encoding) {
                case 'macroman':
                    id = 0;
                    indexes = function () {
                        var _i, _results;
                        _results = [];
                        for (i = _i = 0; _i < 256; i = ++_i) {
                            _results.push(0);
                        }
                        return _results;
                    }();
                    map = {
                        0: 0
                    };
                    codeMap = {};
                    for (_i = 0, _len = codes.length; _i < _len; _i++) {
                        code = codes[_i];
                        if (map[_name = charmap[code]] == null) {
                            map[_name] = ++id;
                        }
                        codeMap[code] = {
                            old: charmap[code],
                            "new": map[charmap[code]]
                        };
                        indexes[code] = map[charmap[code]];
                    }
                    subtable.writeUInt16(1);
                    subtable.writeUInt16(0);
                    subtable.writeUInt32(12);
                    subtable.writeUInt16(0);
                    subtable.writeUInt16(262);
                    subtable.writeUInt16(0);
                    subtable.write(indexes);
                    return result = {
                        charMap: codeMap,
                        subtable: subtable.data,
                        maxGlyphID: id + 1
                    };
                case 'unicode':
                    startCodes = [];
                    endCodes = [];
                    nextID = 0;
                    map = {};
                    charMap = {};
                    last = diff = null;
                    for (_j = 0, _len1 = codes.length; _j < _len1; _j++) {
                        code = codes[_j];
                        old = charmap[code];
                        if (map[old] == null) {
                            map[old] = ++nextID;
                        }
                        charMap[code] = {
                            old: old,
                            "new": map[old]
                        };
                        delta = map[old] - code;
                        if (last == null || delta !== diff) {
                            if (last) {
                                endCodes.push(last);
                            }
                            startCodes.push(code);
                            diff = delta;
                        }
                        last = code;
                    }
                    if (last) {
                        endCodes.push(last);
                    }
                    endCodes.push(0xFFFF);
                    startCodes.push(0xFFFF);
                    segCount = startCodes.length;
                    segCountX2 = segCount * 2;
                    searchRange = 2 * Math.pow(Math.log(segCount) / Math.LN2, 2);
                    entrySelector = Math.log(searchRange / 2) / Math.LN2;
                    rangeShift = 2 * segCount - searchRange;
                    deltas = [];
                    rangeOffsets = [];
                    glyphIDs = [];
                    for (i = _k = 0, _len2 = startCodes.length; _k < _len2; i = ++_k) {
                        startCode = startCodes[i];
                        endCode = endCodes[i];
                        if (startCode === 0xFFFF) {
                            deltas.push(0);
                            rangeOffsets.push(0);
                            break;
                        }
                        startGlyph = charMap[startCode]["new"];
                        if (startCode - startGlyph >= 0x8000) {
                            deltas.push(0);
                            rangeOffsets.push(2 * (glyphIDs.length + segCount - i));
                            for (code = _l = startCode; startCode <= endCode ? _l <= endCode : _l >= endCode; code = startCode <= endCode ? ++_l : --_l) {
                                glyphIDs.push(charMap[code]["new"]);
                            }
                        } else {
                            deltas.push(startGlyph - startCode);
                            rangeOffsets.push(0);
                        }
                    }
                    subtable.writeUInt16(3);
                    subtable.writeUInt16(1);
                    subtable.writeUInt32(12);
                    subtable.writeUInt16(4);
                    subtable.writeUInt16(16 + segCount * 8 + glyphIDs.length * 2);
                    subtable.writeUInt16(0);
                    subtable.writeUInt16(segCountX2);
                    subtable.writeUInt16(searchRange);
                    subtable.writeUInt16(entrySelector);
                    subtable.writeUInt16(rangeShift);
                    for (_m = 0, _len3 = endCodes.length; _m < _len3; _m++) {
                        code = endCodes[_m];
                        subtable.writeUInt16(code);
                    }
                    subtable.writeUInt16(0);
                    for (_n = 0, _len4 = startCodes.length; _n < _len4; _n++) {
                        code = startCodes[_n];
                        subtable.writeUInt16(code);
                    }
                    for (_o = 0, _len5 = deltas.length; _o < _len5; _o++) {
                        delta = deltas[_o];
                        subtable.writeUInt16(delta);
                    }
                    for (_p = 0, _len6 = rangeOffsets.length; _p < _len6; _p++) {
                        offset = rangeOffsets[_p];
                        subtable.writeUInt16(offset);
                    }
                    for (_q = 0, _len7 = glyphIDs.length; _q < _len7; _q++) {
                        id = glyphIDs[_q];
                        subtable.writeUInt16(id);
                    }
                    return result = {
                        charMap: charMap,
                        subtable: subtable.data,
                        maxGlyphID: nextID + 1
                    };
            }
        };

        return CmapEntry;
    }();

    var HheaTable = function (_super) {
        __extends(HheaTable, _super);

        function HheaTable() {
            return HheaTable.__super__.constructor.apply(this, arguments);
        }

        HheaTable.prototype.tag = 'hhea';

        HheaTable.prototype.parse = function (data) {
            data.pos = this.offset;
            this.version = data.readInt();
            this.ascender = data.readShort();
            this.decender = data.readShort();
            this.lineGap = data.readShort();
            this.advanceWidthMax = data.readShort();
            this.minLeftSideBearing = data.readShort();
            this.minRightSideBearing = data.readShort();
            this.xMaxExtent = data.readShort();
            this.caretSlopeRise = data.readShort();
            this.caretSlopeRun = data.readShort();
            this.caretOffset = data.readShort();
            data.pos += 4 * 2;
            this.metricDataFormat = data.readShort();
            return this.numberOfMetrics = data.readUInt16();
        };

        HheaTable.prototype.encode = function (ids) {
            var i, table, _i, _ref;
            table = new Data();
            table.writeInt(this.version);
            table.writeShort(this.ascender);
            table.writeShort(this.decender);
            table.writeShort(this.lineGap);
            table.writeShort(this.advanceWidthMax);
            table.writeShort(this.minLeftSideBearing);
            table.writeShort(this.minRightSideBearing);
            table.writeShort(this.xMaxExtent);
            table.writeShort(this.caretSlopeRise);
            table.writeShort(this.caretSlopeRun);
            table.writeShort(this.caretOffset);
            for (i = _i = 0, _ref = 4 * 2; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                table.writeByte(0);
            }
            table.writeShort(this.metricDataFormat);
            table.writeUInt16(ids.length);
            return table.data;
        };

        return HheaTable;
    }(Table);

    var OS2Table = function (_super) {
        __extends(OS2Table, _super);

        function OS2Table() {
            return OS2Table.__super__.constructor.apply(this, arguments);
        }

        OS2Table.prototype.tag = 'OS/2';

        OS2Table.prototype.parse = function (data) {
            var i;
            data.pos = this.offset;
            this.version = data.readUInt16();
            this.averageCharWidth = data.readShort();
            this.weightClass = data.readUInt16();
            this.widthClass = data.readUInt16();
            this.type = data.readShort();
            this.ySubscriptXSize = data.readShort();
            this.ySubscriptYSize = data.readShort();
            this.ySubscriptXOffset = data.readShort();
            this.ySubscriptYOffset = data.readShort();
            this.ySuperscriptXSize = data.readShort();
            this.ySuperscriptYSize = data.readShort();
            this.ySuperscriptXOffset = data.readShort();
            this.ySuperscriptYOffset = data.readShort();
            this.yStrikeoutSize = data.readShort();
            this.yStrikeoutPosition = data.readShort();
            this.familyClass = data.readShort();
            this.panose = function () {
                var _i, _results;
                _results = [];
                for (i = _i = 0; _i < 10; i = ++_i) {
                    _results.push(data.readByte());
                }
                return _results;
            }();
            this.charRange = function () {
                var _i, _results;
                _results = [];
                for (i = _i = 0; _i < 4; i = ++_i) {
                    _results.push(data.readInt());
                }
                return _results;
            }();
            this.vendorID = data.readString(4);
            this.selection = data.readShort();
            this.firstCharIndex = data.readShort();
            this.lastCharIndex = data.readShort();
            if (this.version > 0) {
                this.ascent = data.readShort();
                this.descent = data.readShort();
                this.lineGap = data.readShort();
                this.winAscent = data.readShort();
                this.winDescent = data.readShort();
                this.codePageRange = function () {
                    var _i, _results;
                    _results = [];
                    for (i = _i = 0; _i < 2; i = ++_i) {
                        _results.push(data.readInt());
                    }
                    return _results;
                }();
                if (this.version > 1) {
                    this.xHeight = data.readShort();
                    this.capHeight = data.readShort();
                    this.defaultChar = data.readShort();
                    this.breakChar = data.readShort();
                    return this.maxContext = data.readShort();
                }
            }
        };

        OS2Table.prototype.encode = function () {
            return this.raw();
        };

        return OS2Table;
    }(Table);

    var PostTable = function (_super) {
        var POSTSCRIPT_GLYPHS;

        __extends(PostTable, _super);

        function PostTable() {
            return PostTable.__super__.constructor.apply(this, arguments);
        }

        PostTable.prototype.tag = 'post';

        PostTable.prototype.parse = function (data) {
            var i, length, numberOfGlyphs, _i, _results;
            data.pos = this.offset;
            this.format = data.readInt();
            this.italicAngle = data.readInt();
            this.underlinePosition = data.readShort();
            this.underlineThickness = data.readShort();
            this.isFixedPitch = data.readInt();
            this.minMemType42 = data.readInt();
            this.maxMemType42 = data.readInt();
            this.minMemType1 = data.readInt();
            this.maxMemType1 = data.readInt();
            switch (this.format) {
                case 0x00010000:
                    break;
                case 0x00020000:
                    numberOfGlyphs = data.readUInt16();
                    this.glyphNameIndex = [];
                    for (i = _i = 0; 0 <= numberOfGlyphs ? _i < numberOfGlyphs : _i > numberOfGlyphs; i = 0 <= numberOfGlyphs ? ++_i : --_i) {
                        this.glyphNameIndex.push(data.readUInt16());
                    }
                    this.names = [];
                    _results = [];
                    while (data.pos < this.offset + this.length) {
                        length = data.readByte();
                        _results.push(this.names.push(data.readString(length)));
                    }
                    return _results;
                    break;
                case 0x00025000:
                    numberOfGlyphs = data.readUInt16();
                    return this.offsets = data.read(numberOfGlyphs);
                case 0x00030000:
                    break;
                case 0x00040000:
                    return this.map = function () {
                        var _j, _ref, _results1;
                        _results1 = [];
                        for (i = _j = 0, _ref = this.file.maxp.numGlyphs; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
                            _results1.push(data.readUInt32());
                        }
                        return _results1;
                    }.call(this);
            }
        };

        PostTable.prototype.glyphFor = function (code) {
            var index;
            switch (this.format) {
                case 0x00010000:
                    return POSTSCRIPT_GLYPHS[code] || '.notdef';
                case 0x00020000:
                    index = this.glyphNameIndex[code];
                    if (index <= 257) {
                        return POSTSCRIPT_GLYPHS[index];
                    } else {
                        return this.names[index - 258] || '.notdef';
                    }
                    break;
                case 0x00025000:
                    return POSTSCRIPT_GLYPHS[code + this.offsets[code]] || '.notdef';
                case 0x00030000:
                    return '.notdef';
                case 0x00040000:
                    return this.map[code] || 0xFFFF;
            }
        };

        PostTable.prototype.encode = function (mapping) {
            var id, index, indexes, position, post, raw, string, strings, table, _i, _j, _k, _len, _len1, _len2;
            if (!this.exists) {
                return null;
            }
            raw = this.raw();
            if (this.format === 0x00030000) {
                return raw;
            }
            table = new Data(raw.slice(0, 32));
            table.writeUInt32(0x00020000);
            table.pos = 32;
            indexes = [];
            strings = [];
            for (_i = 0, _len = mapping.length; _i < _len; _i++) {
                id = mapping[_i];
                post = this.glyphFor(id);
                position = POSTSCRIPT_GLYPHS.indexOf(post);
                if (position !== -1) {
                    indexes.push(position);
                } else {
                    indexes.push(257 + strings.length);
                    strings.push(post);
                }
            }
            table.writeUInt16(Object.keys(mapping).length);
            for (_j = 0, _len1 = indexes.length; _j < _len1; _j++) {
                index = indexes[_j];
                table.writeUInt16(index);
            }
            for (_k = 0, _len2 = strings.length; _k < _len2; _k++) {
                string = strings[_k];
                table.writeByte(string.length);
                table.writeString(string);
            }
            return table.data;
        };

        POSTSCRIPT_GLYPHS = '.notdef .null nonmarkingreturn space exclam quotedbl numbersign dollar percent\nampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash\nzero one two three four five six seven eight nine colon semicolon less equal greater\nquestion at A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\nbracketleft backslash bracketright asciicircum underscore grave\na b c d e f g h i j k l m n o p q r s t u v w x y z\nbraceleft bar braceright asciitilde Adieresis Aring Ccedilla Eacute Ntilde Odieresis\nUdieresis aacute agrave acircumflex adieresis atilde aring ccedilla eacute egrave\necircumflex edieresis iacute igrave icircumflex idieresis ntilde oacute ograve\nocircumflex odieresis otilde uacute ugrave ucircumflex udieresis dagger degree cent\nsterling section bullet paragraph germandbls registered copyright trademark acute\ndieresis notequal AE Oslash infinity plusminus lessequal greaterequal yen mu\npartialdiff summation product pi integral ordfeminine ordmasculine Omega ae oslash\nquestiondown exclamdown logicalnot radical florin approxequal Delta guillemotleft\nguillemotright ellipsis nonbreakingspace Agrave Atilde Otilde OE oe endash emdash\nquotedblleft quotedblright quoteleft quoteright divide lozenge ydieresis Ydieresis\nfraction currency guilsinglleft guilsinglright fi fl daggerdbl periodcentered\nquotesinglbase quotedblbase perthousand Acircumflex Ecircumflex Aacute Edieresis\nEgrave Iacute Icircumflex Idieresis Igrave Oacute Ocircumflex apple Ograve Uacute\nUcircumflex Ugrave dotlessi circumflex tilde macron breve dotaccent ring cedilla\nhungarumlaut ogonek caron Lslash lslash Scaron scaron Zcaron zcaron brokenbar Eth\neth Yacute yacute Thorn thorn minus multiply onesuperior twosuperior threesuperior\nonehalf onequarter threequarters franc Gbreve gbreve Idotaccent Scedilla scedilla\nCacute cacute Ccaron ccaron dcroat'.split(/\s+/g);

        return PostTable;
    }(Table);

    var NameEntry = function () {
        function NameEntry(raw, entry) {
            this.raw = raw;
            this.length = raw.length;
            this.platformID = entry.platformID;
            this.encodingID = entry.encodingID;
            this.languageID = entry.languageID;
        }

        return NameEntry;
    }();

    var NameTable = function (_super) {
        var subsetTag;

        __extends(NameTable, _super);

        function NameTable() {
            return NameTable.__super__.constructor.apply(this, arguments);
        }

        NameTable.prototype.tag = 'name';

        NameTable.prototype.parse = function (data) {
            var count, entries, entry, format, i, name, stringOffset, strings, text, _i, _j, _len, _name;
            data.pos = this.offset;
            format = data.readShort();
            count = data.readShort();
            stringOffset = data.readShort();
            entries = [];
            for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
                entries.push({
                    platformID: data.readShort(),
                    encodingID: data.readShort(),
                    languageID: data.readShort(),
                    nameID: data.readShort(),
                    length: data.readShort(),
                    offset: this.offset + stringOffset + data.readShort()
                });
            }
            strings = {};
            for (i = _j = 0, _len = entries.length; _j < _len; i = ++_j) {
                entry = entries[i];
                data.pos = entry.offset;
                text = data.readString(entry.length);
                name = new NameEntry(text, entry);
                if (strings[_name = entry.nameID] == null) {
                    strings[_name] = [];
                }
                strings[entry.nameID].push(name);
            }
            this.strings = strings;
            this.copyright = strings[0];
            this.fontFamily = strings[1];
            this.fontSubfamily = strings[2];
            this.uniqueSubfamily = strings[3];
            this.fontName = strings[4];
            this.version = strings[5];
            this.postscriptName = strings[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
            this.trademark = strings[7];
            this.manufacturer = strings[8];
            this.designer = strings[9];
            this.description = strings[10];
            this.vendorUrl = strings[11];
            this.designerUrl = strings[12];
            this.license = strings[13];
            this.licenseUrl = strings[14];
            this.preferredFamily = strings[15];
            this.preferredSubfamily = strings[17];
            this.compatibleFull = strings[18];
            return this.sampleText = strings[19];
        };

        subsetTag = "AAAAAA";

        NameTable.prototype.encode = function () {
            var id, list, nameID, nameTable, postscriptName, strCount, strTable, string, strings, table, val, _i, _len, _ref;
            strings = {};
            _ref = this.strings;
            for (id in _ref) {
                val = _ref[id];
                strings[id] = val;
            }
            postscriptName = new NameEntry("" + subsetTag + "+" + this.postscriptName, {
                platformID: 1,
                encodingID: 0,
                languageID: 0
            });
            strings[6] = [postscriptName];
            subsetTag = successorOf(subsetTag);
            strCount = 0;
            for (id in strings) {
                list = strings[id];
                if (list != null) {
                    strCount += list.length;
                }
            }
            table = new Data();
            strTable = new Data();
            table.writeShort(0);
            table.writeShort(strCount);
            table.writeShort(6 + 12 * strCount);
            for (nameID in strings) {
                list = strings[nameID];
                if (list != null) {
                    for (_i = 0, _len = list.length; _i < _len; _i++) {
                        string = list[_i];
                        table.writeShort(string.platformID);
                        table.writeShort(string.encodingID);
                        table.writeShort(string.languageID);
                        table.writeShort(nameID);
                        table.writeShort(string.length);
                        table.writeShort(strTable.pos);
                        strTable.writeString(string.raw);
                    }
                }
            }
            return nameTable = {
                postscriptName: postscriptName.raw,
                table: table.data.concat(strTable.data)
            };
        };

        return NameTable;
    }(Table);

    var MaxpTable = function (_super) {
        __extends(MaxpTable, _super);

        function MaxpTable() {
            return MaxpTable.__super__.constructor.apply(this, arguments);
        }

        MaxpTable.prototype.tag = 'maxp';

        MaxpTable.prototype.parse = function (data) {
            data.pos = this.offset;
            this.version = data.readInt();
            this.numGlyphs = data.readUInt16();
            this.maxPoints = data.readUInt16();
            this.maxContours = data.readUInt16();
            this.maxCompositePoints = data.readUInt16();
            this.maxComponentContours = data.readUInt16();
            this.maxZones = data.readUInt16();
            this.maxTwilightPoints = data.readUInt16();
            this.maxStorage = data.readUInt16();
            this.maxFunctionDefs = data.readUInt16();
            this.maxInstructionDefs = data.readUInt16();
            this.maxStackElements = data.readUInt16();
            this.maxSizeOfInstructions = data.readUInt16();
            this.maxComponentElements = data.readUInt16();
            return this.maxComponentDepth = data.readUInt16();
        };

        MaxpTable.prototype.encode = function (ids) {
            var table;
            table = new Data();
            table.writeInt(this.version);
            table.writeUInt16(ids.length);
            table.writeUInt16(this.maxPoints);
            table.writeUInt16(this.maxContours);
            table.writeUInt16(this.maxCompositePoints);
            table.writeUInt16(this.maxComponentContours);
            table.writeUInt16(this.maxZones);
            table.writeUInt16(this.maxTwilightPoints);
            table.writeUInt16(this.maxStorage);
            table.writeUInt16(this.maxFunctionDefs);
            table.writeUInt16(this.maxInstructionDefs);
            table.writeUInt16(this.maxStackElements);
            table.writeUInt16(this.maxSizeOfInstructions);
            table.writeUInt16(this.maxComponentElements);
            table.writeUInt16(this.maxComponentDepth);
            return table.data;
        };

        return MaxpTable;
    }(Table);

    var HmtxTable = function (_super) {
        __extends(HmtxTable, _super);

        function HmtxTable() {
            return HmtxTable.__super__.constructor.apply(this, arguments);
        }

        HmtxTable.prototype.tag = 'hmtx';

        HmtxTable.prototype.parse = function (data) {
            var i, last, lsbCount, m, _i, _j, _ref, _results;
            data.pos = this.offset;
            this.metrics = [];
            for (i = _i = 0, _ref = this.file.hhea.numberOfMetrics; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                this.metrics.push({
                    advance: data.readUInt16(),
                    lsb: data.readInt16()
                });
            }
            lsbCount = this.file.maxp.numGlyphs - this.file.hhea.numberOfMetrics;
            this.leftSideBearings = function () {
                var _j, _results;
                _results = [];
                for (i = _j = 0; 0 <= lsbCount ? _j < lsbCount : _j > lsbCount; i = 0 <= lsbCount ? ++_j : --_j) {
                    _results.push(data.readInt16());
                }
                return _results;
            }();
            this.widths = function () {
                var _j, _len, _ref1, _results;
                _ref1 = this.metrics;
                _results = [];
                for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
                    m = _ref1[_j];
                    _results.push(m.advance);
                }
                return _results;
            }.call(this);
            last = this.widths[this.widths.length - 1];
            _results = [];
            for (i = _j = 0; 0 <= lsbCount ? _j < lsbCount : _j > lsbCount; i = 0 <= lsbCount ? ++_j : --_j) {
                _results.push(this.widths.push(last));
            }
            return _results;
        };

        HmtxTable.prototype.forGlyph = function (id) {
            var metrics;
            if (id in this.metrics) {
                return this.metrics[id];
            }
            return metrics = {
                advance: this.metrics[this.metrics.length - 1].advance,
                lsb: this.leftSideBearings[id - this.metrics.length]
            };
        };

        HmtxTable.prototype.encode = function (mapping) {
            var id, metric, table, _i, _len;
            table = new Data();
            for (_i = 0, _len = mapping.length; _i < _len; _i++) {
                id = mapping[_i];
                metric = this.forGlyph(id);
                table.writeUInt16(metric.advance);
                table.writeUInt16(metric.lsb);
            }
            return table.data;
        };

        return HmtxTable;
    }(Table);

    var __slice = [].slice;

    var GlyfTable = function (_super) {
        __extends(GlyfTable, _super);

        function GlyfTable() {
            return GlyfTable.__super__.constructor.apply(this, arguments);
        }

        GlyfTable.prototype.tag = 'glyf';

        GlyfTable.prototype.parse = function (data) {
            return this.cache = {};
        };

        GlyfTable.prototype.glyphFor = function (id) {
            var data, index, length, loca, numberOfContours, raw, xMax, xMin, yMax, yMin;
            if (id in this.cache) {
                return this.cache[id];
            }
            loca = this.file.loca;
            data = this.file.contents;
            index = loca.indexOf(id);
            length = loca.lengthOf(id);
            if (length === 0) {
                return this.cache[id] = null;
            }
            data.pos = this.offset + index;
            raw = new Data(data.read(length));
            numberOfContours = raw.readShort();
            xMin = raw.readShort();
            yMin = raw.readShort();
            xMax = raw.readShort();
            yMax = raw.readShort();
            if (numberOfContours === -1) {
                this.cache[id] = new CompoundGlyph(raw, xMin, yMin, xMax, yMax);
            } else {
                this.cache[id] = new SimpleGlyph(raw, numberOfContours, xMin, yMin, xMax, yMax);
            }
            return this.cache[id];
        };

        GlyfTable.prototype.encode = function (glyphs, mapping, old2new) {
            var glyph, id, offsets, table, _i, _len;
            table = [];
            offsets = [];
            for (_i = 0, _len = mapping.length; _i < _len; _i++) {
                id = mapping[_i];
                glyph = glyphs[id];
                offsets.push(table.length);
                if (glyph) {
                    table = table.concat(glyph.encode(old2new));
                }
            }
            offsets.push(table.length);
            return {
                table: table,
                offsets: offsets
            };
        };

        return GlyfTable;
    }(Table);

    var SimpleGlyph = function () {
        function SimpleGlyph(raw, numberOfContours, xMin, yMin, xMax, yMax) {
            this.raw = raw;
            this.numberOfContours = numberOfContours;
            this.xMin = xMin;
            this.yMin = yMin;
            this.xMax = xMax;
            this.yMax = yMax;
            this.compound = false;
        }

        SimpleGlyph.prototype.encode = function () {
            return this.raw.data;
        };

        return SimpleGlyph;
    }();

    var CompoundGlyph = function () {
        var ARG_1_AND_2_ARE_WORDS, MORE_COMPONENTS, WE_HAVE_AN_X_AND_Y_SCALE, WE_HAVE_A_SCALE, WE_HAVE_A_TWO_BY_TWO;

        ARG_1_AND_2_ARE_WORDS = 0x0001;

        WE_HAVE_A_SCALE = 0x0008;

        MORE_COMPONENTS = 0x0020;

        WE_HAVE_AN_X_AND_Y_SCALE = 0x0040;

        WE_HAVE_A_TWO_BY_TWO = 0x0080;

        function CompoundGlyph(raw, xMin, yMin, xMax, yMax) {
            var data, flags;
            this.raw = raw;
            this.xMin = xMin;
            this.yMin = yMin;
            this.xMax = xMax;
            this.yMax = yMax;
            this.compound = true;
            this.glyphIDs = [];
            this.glyphOffsets = [];
            data = this.raw;
            while (true) {
                flags = data.readShort();
                this.glyphOffsets.push(data.pos);
                this.glyphIDs.push(data.readShort());
                if (!(flags & MORE_COMPONENTS)) {
                    break;
                }
                if (flags & ARG_1_AND_2_ARE_WORDS) {
                    data.pos += 4;
                } else {
                    data.pos += 2;
                }
                if (flags & WE_HAVE_A_TWO_BY_TWO) {
                    data.pos += 8;
                } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
                    data.pos += 4;
                } else if (flags & WE_HAVE_A_SCALE) {
                    data.pos += 2;
                }
            }
        }

        CompoundGlyph.prototype.encode = function (mapping) {
            var i, id, result, _i, _len, _ref;
            result = new Data(__slice.call(this.raw.data));
            _ref = this.glyphIDs;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                id = _ref[i];
                result.pos = this.glyphOffsets[i];
                result.writeShort(mapping[id]);
            }
            return result.data;
        };

        return CompoundGlyph;
    }();

    var LocaTable = function (_super) {
        __extends(LocaTable, _super);

        function LocaTable() {
            return LocaTable.__super__.constructor.apply(this, arguments);
        }

        LocaTable.prototype.tag = 'loca';

        LocaTable.prototype.parse = function (data) {
            var format, i;
            data.pos = this.offset;
            format = this.file.head.indexToLocFormat;
            if (format === 0) {
                return this.offsets = function () {
                    var _i, _ref, _results;
                    _results = [];
                    for (i = _i = 0, _ref = this.length; _i < _ref; i = _i += 2) {
                        _results.push(data.readUInt16() * 2);
                    }
                    return _results;
                }.call(this);
            } else {
                return this.offsets = function () {
                    var _i, _ref, _results;
                    _results = [];
                    for (i = _i = 0, _ref = this.length; _i < _ref; i = _i += 4) {
                        _results.push(data.readUInt32());
                    }
                    return _results;
                }.call(this);
            }
        };

        LocaTable.prototype.indexOf = function (id) {
            return this.offsets[id];
        };

        LocaTable.prototype.lengthOf = function (id) {
            return this.offsets[id + 1] - this.offsets[id];
        };

        LocaTable.prototype.encode = function (offsets) {
            var o, offset, ret, table, _i, _j, _k, _len, _len1, _len2, _ref;
            table = new Data();
            for (_i = 0, _len = offsets.length; _i < _len; _i++) {
                offset = offsets[_i];
                if (!(offset > 0xFFFF)) {
                    continue;
                }
                _ref = this.offsets;
                for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                    o = _ref[_j];
                    table.writeUInt32(o);
                }
                return ret = {
                    format: 1,
                    table: table.data
                };
            }
            for (_k = 0, _len2 = offsets.length; _k < _len2; _k++) {
                o = offsets[_k];
                table.writeUInt16(o / 2);
            }
            return ret = {
                format: 0,
                table: table.data
            };
        };

        return LocaTable;
    }(Table);

    var invert = function invert(object) {
        var key, ret, val;
        ret = {};
        for (key in object) {
            val = object[key];
            ret[val] = key;
        }
        return ret;
    };

    var successorOf = function successorOf(input) {
        var added, alphabet, carry, i, index, isUpperCase, last, length, next, result;
        alphabet = 'abcdefghijklmnopqrstuvwxyz';
        length = alphabet.length;
        result = input;
        i = input.length;
        while (i >= 0) {
            last = input.charAt(--i);
            if (isNaN(last)) {
                index = alphabet.indexOf(last.toLowerCase());
                if (index === -1) {
                    next = last;
                    carry = true;
                } else {
                    next = alphabet.charAt((index + 1) % length);
                    isUpperCase = last === last.toUpperCase();
                    if (isUpperCase) {
                        next = next.toUpperCase();
                    }
                    carry = index + 1 >= length;
                    if (carry && i === 0) {
                        added = isUpperCase ? 'A' : 'a';
                        result = added + next + result.slice(1);
                        break;
                    }
                }
            } else {
                next = +last + 1;
                carry = next > 9;
                if (carry) {
                    next = 0;
                }
                if (carry && i === 0) {
                    result = '1' + next + result.slice(1);
                    break;
                }
            }
            result = result.slice(0, i) + next + result.slice(i + 1);
            if (!carry) {
                break;
            }
        }
        return result;
    };

    var __indexOf = [].indexOf || function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) return i;
        }
        return -1;
    };

    var Subset = function () {
        function Subset(font) {
            this.font = font;
            this.subset = {};
            this.unicodes = {};
            this.unicodeCmap = {};
            this.next = 33;
        }

        Subset.prototype.use = function (character) {
            var i, _i, _ref;
            if (typeof character === 'string') {
                for (i = _i = 0, _ref = character.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    this.use(character.charCodeAt(i));
                }
                return;
            }
            if (!this.unicodes[character]) {
                this.subset[this.next] = character;
                return this.unicodes[character] = this.next++;
            }
        };

        Subset.prototype.encodeText = function (text) {
            var char, i, string, _i, _ref;
            string = '';
            for (i = _i = 0, _ref = text.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                char = this.unicodes[text.charCodeAt(i)];
                string += String.fromCharCode(char);
            }
            return string;
        };

        Subset.prototype.generateCmap = function () {
            var mapping, roman, unicode, unicodeCmap, _ref;
            unicodeCmap = this.font.cmap.tables[0].codeMap;
            mapping = {};
            _ref = this.subset;
            for (roman in _ref) {
                unicode = _ref[roman];
                mapping[roman] = unicodeCmap[unicode];
            }
            return mapping;
        };

        Subset.prototype.glyphIDs = function () {
            var ret, roman, unicode, unicodeCmap, val, _ref;
            unicodeCmap = this.font.cmap.tables[0].codeMap;
            ret = [0];
            _ref = this.subset;
            for (roman in _ref) {
                unicode = _ref[roman];
                val = unicodeCmap[unicode];
                if (val != null && __indexOf.call(ret, val) < 0) {
                    ret.push(val);
                }
            }
            return ret.sort();
        };

        Subset.prototype.glyphsFor = function (glyphIDs) {
            var additionalIDs, glyph, glyphs, id, _i, _len, _ref;
            glyphs = {};
            for (_i = 0, _len = glyphIDs.length; _i < _len; _i++) {
                id = glyphIDs[_i];
                glyphs[id] = this.font.glyf.glyphFor(id);
            }
            additionalIDs = [];
            for (id in glyphs) {
                glyph = glyphs[id];
                if (glyph != null ? glyph.compound : void 0) {
                    additionalIDs.push.apply(additionalIDs, glyph.glyphIDs);
                }
            }
            if (additionalIDs.length > 0) {
                _ref = this.glyphsFor(additionalIDs);
                for (id in _ref) {
                    glyph = _ref[id];
                    glyphs[id] = glyph;
                }
            }
            return glyphs;
        };

        Subset.prototype.encode = function () {
            var cmap, code, glyf, glyphs, id, ids, loca, name, new2old, newIDs, nextGlyphID, old2new, oldID, oldIDs, tables, _ref, _ref1;
            cmap = CmapTable.encode(this.generateCmap(), 'unicode');
            glyphs = this.glyphsFor(this.glyphIDs());
            old2new = {
                0: 0
            };
            _ref = cmap.charMap;
            for (code in _ref) {
                ids = _ref[code];
                old2new[ids.old] = ids["new"];
            }
            nextGlyphID = cmap.maxGlyphID;
            for (oldID in glyphs) {
                if (!(oldID in old2new)) {
                    old2new[oldID] = nextGlyphID++;
                }
            }
            new2old = invert(old2new);
            newIDs = Object.keys(new2old).sort(function (a, b) {
                return a - b;
            });
            oldIDs = function () {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = newIDs.length; _i < _len; _i++) {
                    id = newIDs[_i];
                    _results.push(new2old[id]);
                }
                return _results;
            }();
            glyf = this.font.glyf.encode(glyphs, oldIDs, old2new);
            loca = this.font.loca.encode(glyf.offsets);
            name = this.font.name.encode();
            this.postscriptName = name.postscriptName;
            this.cmap = {};
            _ref1 = cmap.charMap;
            for (code in _ref1) {
                ids = _ref1[code];
                this.cmap[code] = ids.old;
            }
            tables = {
                cmap: cmap.table,
                glyf: glyf.table,
                loca: loca.table,
                hmtx: this.font.hmtx.encode(oldIDs),
                hhea: this.font.hhea.encode(oldIDs),
                maxp: this.font.maxp.encode(oldIDs),
                post: this.font.post.encode(oldIDs),
                name: name.table,
                head: this.font.head.encode(loca)
            };
            if (this.font.os2.exists) {
                tables['OS/2'] = this.font.os2.raw();
            }
            return this.font.directory.encode(tables);
        };

        return Subset;
    }();

    var PDFObject = function () {
        var pad, swapBytes;

        function PDFObject() {}

        pad = function pad(str, length) {
            return (Array(length + 1).join('0') + str).slice(-length);
        };

        PDFObject.convert = function (object) {
            var e, items, key, out, val;
            if (Array.isArray(object)) {
                items = function () {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = object.length; _i < _len; _i++) {
                        e = object[_i];
                        _results.push(PDFObject.convert(e));
                    }
                    return _results;
                }().join(' ');
                return '[' + items + ']';
            } else if (typeof object === 'string') {
                return object.indexOf(' 0 R') === -1 ? '/' + object : object;
            } else if (object != null ? object.isString : void 0) {
                return '(' + object + ')';
            } else if (object instanceof Date) {
                return '(D:' + pad(object.getUTCFullYear(), 4) + pad(object.getUTCMonth(), 2) + pad(object.getUTCDate(), 2) + pad(object.getUTCHours(), 2) + pad(object.getUTCMinutes(), 2) + pad(object.getUTCSeconds(), 2) + 'Z)';
            } else if ({}.toString.call(object) === '[object Object]') {
                out = ['<<'];
                for (key in object) {
                    val = object[key];
                    out.push('/' + key + ' ' + PDFObject.convert(val));
                }
                out.push('>>');
                return out.join('\n');
            } else {
                return '' + object;
            }
        };

        swapBytes = function swapBytes(buff) {
            var a, i, l, _i, _ref;
            l = buff.length;
            if (l & 0x01) {
                throw new Error("Buffer length must be even");
            } else {
                for (i = _i = 0, _ref = l - 1; _i < _ref; i = _i += 2) {
                    a = buff[i];
                    buff[i] = buff[i + 1];
                    buff[i + 1] = a;
                }
            }
            return buff;
        };

        PDFObject.s = function (string, swap) {
            if (swap == null) {
                swap = false;
            }
            string = string.replace(/\\/g, '\\\\\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
            if (swap) {
                string = swapBytes(new Buffer('\uFEFF' + string, 'ucs-2')).toString('binary');
            }
            return {
                isString: true,
                toString: function toString() {
                    return string;
                }
            };
        };

        return PDFObject;
    }();

    jsPDFAPI.events.push(['addFont', function (font) {
        if (jsPDFAPI.existsFileInVFS(font.postScriptName)) {
            font.metadata = TTFFont.open(font.postScriptName, font.fontName, jsPDFAPI.getFileFromVFS(font.postScriptName), font.encoding);
            font.encoding = font.metadata.hmtx.widths.length > 500 ? "MacRomanEncoding" : "WinAnsiEncoding";
            font.metadata.Unicode = font.metadata.Unicode || {
                encoding: {},
                kerning: {},
                widths: []
            };
        }
    }]);
})(jsPDF.API);

/**
 * jsPDF virtual FileSystem functionality
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
* Use the VFS to handle files
*/

(function (jsPDFAPI) {
    "use strict";

    var VFS = {};

    /* Check if the file exists in the VFS
    * @returns {boolean}
    * @name existsFileInVFS
    * @example
    * doc.existsFileInVFS("someFile.txt");
    */
    jsPDFAPI.existsFileInVFS = function (filename) {
        return VFS.hasOwnProperty(filename);
    };

    /* Add a file to the VFS
    * @returns {jsPDF}
    * @name addFileToVFS
    * @example
    * doc.addFileToVFS("someFile.txt", "BADFACE1");
    */
    jsPDFAPI.addFileToVFS = function (filename, filecontent) {
        VFS[filename] = filecontent;
        return this;
    };

    /* Get the file from the VFS
    * @returns {string}
    * @name addFileToVFS
    * @example
    * doc.getFileFromVFS("someFile.txt");
    */
    jsPDFAPI.getFileFromVFS = function (filename) {
        if (VFS.hasOwnProperty(filename)) {
            return VFS[filename];
        }
        return null;
    };
})(jsPDF.API);

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				};
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		};
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| undefined.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define("FileSaver.js", function() {
    return saveAs;
  });
}

/**
 * JavaScript Polyfill functions for jsPDF
 * Collected from public resources by
 * https://github.com/diegocr
 */

(function (global) {
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	if (typeof global.btoa === 'undefined') {
		global.btoa = function(data) {
			//  discuss at: http://phpjs.org/functions/base64_encode/
			// original by: Tyler Akins (http://rumkin.com)
			// improved by: Bayron Guevara
			// improved by: Thunder.m
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Rafal Kukawski (http://kukawski.pl)
			// bugfixed by: Pellentesque Malesuada
			//   example 1: base64_encode('Kevin van Zonneveld');
			//   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='

			var o1,o2,o3,h1,h2,h3,h4,bits,i = 0,ac = 0,enc = '',tmp_arr = [];

			if (!data) {
				return data;
			}

			do { // pack three octets into four hexets
				o1 = data.charCodeAt(i++);
				o2 = data.charCodeAt(i++);
				o3 = data.charCodeAt(i++);

				bits = o1 << 16 | o2 << 8 | o3;

				h1 = bits >> 18 & 0x3f;
				h2 = bits >> 12 & 0x3f;
				h3 = bits >> 6 & 0x3f;
				h4 = bits & 0x3f;

				// use hexets to index into b64, and append result to encoded string
				tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
			} while (i < data.length);

			enc = tmp_arr.join('');

			var r = data.length % 3;

			return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
		};
	}

	if (typeof global.atob === 'undefined') {
		global.atob = function(data) {
			//  discuss at: http://phpjs.org/functions/base64_decode/
			// original by: Tyler Akins (http://rumkin.com)
			// improved by: Thunder.m
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			//    input by: Aman Gupta
			//    input by: Brett Zamir (http://brett-zamir.me)
			// bugfixed by: Onno Marsman
			// bugfixed by: Pellentesque Malesuada
			// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			//   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
			//   returns 1: 'Kevin van Zonneveld'

			var o1,o2,o3,h1,h2,h3,h4,bits,i = 0,ac = 0,dec = '',tmp_arr = [];

			if (!data) {
				return data;
			}

			data += '';

			do { // unpack four hexets into three octets using index points in b64
				h1 = b64.indexOf(data.charAt(i++));
				h2 = b64.indexOf(data.charAt(i++));
				h3 = b64.indexOf(data.charAt(i++));
				h4 = b64.indexOf(data.charAt(i++));

				bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

				o1 = bits >> 16 & 0xff;
				o2 = bits >> 8 & 0xff;
				o3 = bits & 0xff;

				if (h3 == 64) {
					tmp_arr[ac++] = String.fromCharCode(o1);
				} else if (h4 == 64) {
					tmp_arr[ac++] = String.fromCharCode(o1, o2);
				} else {
					tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
				}
			} while (i < data.length);

			dec = tmp_arr.join('');

			return dec;
		};
	}

	if (!Array.prototype.map) {
		Array.prototype.map = function(fun /*, thisArg */) {
			if (this === void 0 || this === null || typeof fun !== "function")
				throw new TypeError();

			var t = Object(this), len = t.length >>> 0, res = new Array(len);
			var thisArg = arguments.length > 1 ? arguments[1] : void 0;
			for (var i = 0; i < len; i++) {
				// NOTE: Absolute correctness would demand Object.defineProperty
				//       be used.  But this method is fairly new, and failure is
				//       possible only if Object.prototype or Array.prototype
				//       has a property |i| (very unlikely), so use a less-correct
				//       but more portable alternative.
				if (i in t)
					res[i] = fun.call(thisArg, t[i], i, t);
			}

			return res;
		};
	}


	if(!Array.isArray) {
		Array.isArray = function(arg) {
			return Object.prototype.toString.call(arg) === '[object Array]';
		};
	}

	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(fun, thisArg) {
			"use strict";

			if (this === void 0 || this === null || typeof fun !== "function")
				throw new TypeError();

			var t = Object(this), len = t.length >>> 0;
			for (var i = 0; i < len; i++) {
				if (i in t)
					fun.call(thisArg, t[i], i, t);
			}
		};
	}

	if (!Object.keys) {
		Object.keys = (function () {
			'use strict';

			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
				dontEnums = ['toString','toLocaleString','valueOf','hasOwnProperty',
					'isPrototypeOf','propertyIsEnumerable','constructor'],
				dontEnumsLength = dontEnums.length;

			return function (obj) {
				if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
					throw new TypeError();
				}
				var result = [], prop, i;

				for (prop in obj) {
					if (hasOwnProperty.call(obj, prop)) {
						result.push(prop);
					}
				}

				if (hasDontEnumBug) {
					for (i = 0; i < dontEnumsLength; i++) {
						if (hasOwnProperty.call(obj, dontEnums[i])) {
							result.push(dontEnums[i]);
						}
					}
				}
				return result;
			};
		}());
	}

	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	if (!String.prototype.trimLeft) {
		String.prototype.trimLeft = function() {
			return this.replace(/^\s+/g, "");
		};
	}
	if (!String.prototype.trimRight) {
		String.prototype.trimRight = function() {
			return this.replace(/\s+$/g, "");
		};
	}

})(typeof self !== "undefined" && self || typeof window !== "undefined" && window || undefined);

return jsPDF;

})));
