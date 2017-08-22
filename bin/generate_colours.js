// generate_colors
// Node program to maintain the vast supply of colour rules needed
// to defeat CSS cascading in Waterbear
//
// Used to generate the file $/css/block_colors.css
//
// Use sparingly. Void where prohibited.

var namespaces = [
    "control",
    "sprite",
    "music",
    "sound",
    "array",
    "boolean",
    "canvas",
    "color",
    "image",
    "math",
    "random",
    "vector",
    "object",
    "string",
    "path",
    "rect",
    "input",
    "motion",
    "shape",
    "geolocation",
    "size",
    "text",
    "date"
];

var typeToNamespace = {
    "number": "math",
    "color": "color",
    "text": "text",
    "boolean": "boolean",
    "sprite": "sprite",
    "any": "control",
    "sound": "sound",
    "array": "array",
    "wb-image": "image",
    "shape": "shape",
    "vector": "vector",
    "object": "object",
    "path": "path",
    "pathset": "path",
    "rect": "rect",
    "string": "string",
    "geolocation": "geolocation",
    "size": "size",
    "motion": "motion",
    "date": "date"
}

/* For 23 namespaces we want to scatter them across the hsl wheel

   Dividing the 23 namespaces by 7 gives us roughly thirds
   Dividing the wheel by 13-15 gives us nice segments without repeating
   Let's try 13 * 7 for jumps so the colours don't line up in rainbow order
*/

var hsljump = 15 * 7
var hues = {};
/* medium was found through trial and error. Light and dark are guesses for now */

/* background saturation and lightness */
var bgHighlighted = [95, 50];
var bgNormal = [50, 50];
var bgFaded = [50, 75];
/* border saturation and lightness */
var bdHighlighted = [50, 75];
var bdNormal = [50, 30];
var bdFaded = [50, 60];

for (var i = 0; i < namespaces.length; i++){
    hues[namespaces[i]] = i * hsljump % 360;
}
/* Color template used as part of all other templates */
var colorTemplate = '{background-color: hsl(${hue}, ${bgSaturation}%, ${bgLightness}%); border-color: hsl(${hue}, ${bdSaturation}%, ${bdLightness}%); }'
/* Block templates by namespace */
/* highlight: applied when a block is selected, unless user is dragging */
var nsTemplateHighlighted = '[ns="${ns}"].selected-block' + colorTemplate;
/* normal: default, also highlight while dragging for drop-targets */
var nsTemplateNormal = '[ns="${ns}"], .block-dragging [ns="${ns}"].drop-target, .block-dragging [ns="${ns}"].drop-target.selected-block' + colorTemplate;
/* faded: all script blocks while dragging, including selected, except for drop targets */
var nsTemplateFaded = '.block-dragging [ns="${ns}"],.block-dragging [ns="${ns}"].selected-block' + colorTemplate;

/* Block templates by return type */
/* highlight: applied when a block is selected, unless user is dragging */
var rtTemplateHighlighted = 'wb-expression[type="${type}"].selected-block' + colorTemplate;
/* medium: default, also highlight while dragging for drop-targets */
var rtTemplateNormal = 'wb-expression[type="${type}"], .block-dragging wb-expression[type="${type}"].drop-target' + colorTemplate;
/* dark: all script blocks while dragging, including selected, except for drop targets */
var rtTemplateFaded = '.block-dragging wb-expression[type="${type}"], .block-dragging wb-expression[type="${type}"].selected-block' + colorTemplate;


function template(t, values){
    var keys = Object.keys(values);
    var output = t;
    for (var i = 0; i < keys.length; i++){
        var key = keys[i];
        var value = values[key];
        var replaceKey = '${' + key + '}';
        while(output.indexOf(replaceKey) > -1){
            output = output.replace(replaceKey, value);
        }
    }
    return output;
}

function applyTemplate(namespace, tpl, background, border){
    console.log(template(tpl, {hue: hues[namespace], ns: namespace, bgSaturation: background[0], bgLightness: background[1], bdSaturation: border[0], 'bdLightness': border[1]}));
}

function applyAllNamespaceTemplates(namespace){
    applyTemplate(namespace, nsTemplateHighlighted, bgHighlighted, bdHighlighted);
    applyTemplate(namespace, nsTemplateNormal, bgNormal, bdNormal);
    applyTemplate(namespace, nsTemplateFaded, bgFaded, bdFaded);
}

function applyAllTypeTemplates(type){
    var namespace = typeToNamespace[type];
    applyTemplate(namespace, rtTemplateHighlighted, bgHighlighted, bdHighlighted);
    applyTemplate(namespace, rtTemplateNormal, bgNormal, bdNormal);
    applyTemplate(namespace, rtTemplateFaded, bgFaded, bdFaded);
}

function mainHeader(){
    console.log('/* This file is generated by $/bin/generate_colours.js');
    console.log(' * If you value your soul or your short time on earth,');
    console.log(' * then please make mods in that file and regenerate it.');
    console.log(' *');
    console.log(' * Life is too short to write this crap by hand.');
    console.log(' */\n');
}

function outputNamespaceRules(){
    console.log('/* Block colours by namespace, with handling for dimming');
    console.log(' * while dragging, highlighting drop-targets, and'); console.log(' * highlighting selected blocks.');
    console.log(' */\n');
    namespaces.forEach(applyAllNamespaceTemplates);
    console.log('\n\n');
}

function outputTypeRules(){
    console.log('/* Expression block colours by return type, with handling');
    console.log(' * for dimming while dragging, highlighting drop-targets,');
    console.log(' * and highlighting selected blocks.');
    console.log(' */\n');
    Object.keys(typeToNamespace).forEach(applyAllTypeTemplates);
    console.log('\n');
}

outputNamespaceRules();
outputTypeRules();
