export const putFont = ({ font,newObject,out }) => {
    if (font.id.slice(1) < 15) return;

    const dictionary = font.metadata.embedTTF(font.encoding, newObject, out);
    if (dictionary) {
        font.objectNumber = dictionary;
        font.isAlreadyPutted = true;
    }
}

export const postProcessText = (args) => {
    const {text, mutex :{activeFontKey, fonts}} = args;
    const isHex = activeFontKey.slice(1) >= 15;
    const activeFont = fonts[activeFontKey];
    const {encode, subset} = activeFont.metadata;

    args.text = isHex ? text.map(str => Array.isArray(str) ? [encode(subset, str[0]), str[1], str[2]] : encode(subset, str)) : text;
    args.mutex.isHex = isHex;
}