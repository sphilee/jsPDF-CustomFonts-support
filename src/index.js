import * as jsPDF from 'jspdf';
import TTFFont from './ttffont';
import {putFont, postProcessText} from './ttfsupport';


jsPDF.API.TTFFont = TTFFont;

jsPDF.API.events.splice(-4);

jsPDF.API.events.push(['addFont', function(font){
    const {id, fontName, postScriptName} = font;
    if (jsPDF.API.existsFileInVFS(postScriptName)) {
        font.metadata = jsPDF.API.TTFFont.open(postScriptName, fontName, jsPDF.API.getFileFromVFS(postScriptName));
        const {hmtx : {widths}, capHeight} = font.metadata;
        font.encoding = (widths.length < 500 && capHeight < 800) ? "WinAnsiEncoding" : "MacRomanEncoding";
    } else if (id.slice(1) >= 15) {
        console.error(`Font does not exist in FileInVFS, import fonts or remove declaration doc.addFont('${postScriptName}').`);
    }
}]);

jsPDF.API.events.push(['putFont', putFont]);

jsPDF.API.events.push(['postProcessText', postProcessText]);