/*
  just-i18n package for Meteor.js
  author: Hubert OG <hubert@orlikarnia.com>
*/

Anti = {};

var maps            = {};
var language        = '';
var defaultLanguage = 'en';
var missingTemplate = '';
var showMissing     = false;
var dep             = new Deps.Dependency();




/*
  Convert key to internationalized version
*/
Anti.i18n = function() {
  dep.depend();

  var label;
  var args = _.toArray(arguments);

  /* remove extra parameter added by blaze */
  if(typeof args[args.length-1] === 'object') {
    args.pop();
  }

  var label = args[0];
  args.shift();


  if(typeof label !== 'string') return '';
  var str = (maps[language] && maps[language][label]) ||
         (maps[defaultLanguage] && maps[defaultLanguage][label]) ||
         (showMissing && _.template(missingTemplate, {language: language, defaultLanguage: defaultLanguage, label: label})) ||
         '';
  str = replaceWithParams(str, args)
  return str;
};


/*
  Anti.i18n but with language as first param
*/
Anti.i18nWithLanguage = function() {

  // var label;r
  var args = _.toArray(arguments);

  var localLanguage= args[0];
  var label = args[1];
  args.shift();
  args.shift();


  if(typeof label !== 'string') return '';
    var str = (maps[localLanguage] && maps[localLanguage][label]) ||
         (maps[defaultLanguage] && maps[defaultLanguage][label]) ||
         (showMissing && _.template(missingTemplate, {language: localLanguage, defaultLanguage: defaultLanguage, label: label})) ||
         '';

  str = replaceWithParams(str, args)
  return str;
};
/*
  Register handlebars helper
*/
if(Meteor.isClient) {
  if(UI) {
    UI.registerHelper('i18n', function () {
      return Anti.i18n.apply(this, arguments);
    });
  } else if(Handlebars) {
    Handlebars.registerHelper('i18n', function () {
      return Anti.i18n.apply(this, arguments);
    });
  }
}

function replaceWithParams(string, params) {
  var formatted = string;
  params.forEach(function(param , index){
    var pos = index + 1;
    formatted = formatted.replace("{$" + pos + "}", param);
  });

  return formatted;
};

/*
  Settings
*/
Anti.i18n.setLanguage = function(lng) {
  language = lng;
  dep.changed();
};

Anti.i18n.setDefaultLanguage = function(lng) {
  defaultLanguage = lng;
  dep.changed();
};

Anti.i18n.getLanguage = function() {
  dep.depend();
  return language;
};

Anti.i18n.showMissing = function(template) {
  if(template) {
    if(typeof template === 'string') {
      missingTemplate = template;
    } else {
      missingTemplate = '[<%= label %>]';
    }
    showMissing = true;
  } else {
    missingTemplate = '';
    showMissing = false;
  }
};

/*
  Register map
*/
Anti.i18n.map = function(language, map) {
  if(!maps[language]) maps[language] = {};
  registerMap(language, '', false, map);
  dep.changed();
};

var registerMap = function(language, prefix, dot, map) {
  if(typeof map === 'string') {
    maps[language][prefix] = map;
  } else if(typeof map === 'object') {
    if(dot) prefix = prefix + '.';
    _.each(map, function(value, key) {
      registerMap(language, prefix + key, true, value);
    });
  }
};
