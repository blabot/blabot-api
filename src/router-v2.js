var express = require('express'),
    B       = require('blabot-core'),
    router  = express.Router(),
    dm      = require('./dict-manager');

// Init  ================================

var dicts,
    dictsFolder = (__dirname + '/../node_modules/blabot-core/dict');

var limitDefault = 1000,
    dictDefault  = 'cs';

dm.readDictionariesInHashmap(dictsFolder)
  .then(function (d) {
    dicts = d;
  });

// Universal handlers ====================

function defaults(req, res, next) {
  if (typeof req.params.count == 'undefined')
    req.count = 1;
  if (typeof req.params.dictionary == 'undefined')
    req.dictionary = dicts[dictDefault];
  next();
}

// Param handlers ==========================

router.param('dictionary', function (req, res, next, dictName) {
  if (typeof dicts[dictName] === 'undefined')
    return res.status(406).json({
      'status': 406,
      'message': 'No such a dictionary \'' + dictName + '\''
    });
  req.dictionary = dicts[dictName];
  next();
});

router.param('count', function (req, res, next, count) {
  if (count > limitDefault)
    return res.status(406).json({
      'status': 406,
      'message': 'Sorry, API is limited to ' + limitDefault + ' items per request'
    });
  req.count = count;
  next();
});

// Root route ==============================

router.get('/', function (req, res) {
  res.redirect('docs');
});

// Blabot routes ===========================

router.get('/:dictionary?/word/:count?',
  defaults,
  function (req, res) {
    res.json(B.getWords(req.dictionary, req.count));
  }
);

router.get('/:dictionary?/sentence/:count?',
  defaults,
  function (req, res) {
    res.json(B.getSentences(req.dictionary, req.count));
  }
);

router.get('/:dictionary?/paragraph/:count?',
  defaults,
  function (req, res) {
    res.json(B.getParagraphs(req.dictionary, req.count));
  }
);

// Docs Route ==============================

function docsRoute(req, res) {
  var restDoc = {
    "resources": [
      {
        "id": "Dictionaries",
        "description": "List of available dictionaries",
        "path": "/dictionaries",
        "methods": {
          "GET": {
            "statusCodes": {"200": "OK"}
          }
        }
      },
      {
        "id": "Words",
        "description": "Return random word(s) from dictionary",
        "path": "/{?dictionary}/word/{?count}",
        "params": {
          "dictionary": {
            "description": "Dictionary name",
            "validations": [
              {
                "type": "match",
                "pattern": "[a-z_\\-]+"
              },
              {
                "type": "matchResource", //non standard
                "pattern": "/dictionaries"
              }
            ]
          },
          "count": {
            "description": "Count of items required",
            "validations": [
              {
                "type": "match",
                "pattern": "\\d+"
              },
              {
                "type": "limit", //non standard
                "pattern": limitDefault
              }
            ]
          }
        },
        "methods": {
          "GET": {
            "description": "Array; Random words",
            "statusCodes": {
              "200": "OK",
              "406": "Bad params"
            }
          }
        }
      },
      {
        "id": "Sentences",
        "description": "Return random sentence(s) from dictionary",
        "path": "/{?dictionary}/sentence/{?count}",
        "params": {
          "dictionary": {
            "description": "Dictionary name",
            "validations": [
              {
                "type": "match",
                "pattern": "[a-z_\\-]+"
              },
              {
                "type": "matchResource", //non standard
                "pattern": "/dictionaries"
              }
            ]
          },
          "count": {
            "description": "Count of items required",
            "validations": [
              {
                "type": "match",
                "pattern": "\\d+"
              },
              {
                "type": "limit", //non standard
                "pattern": limitDefault
              }
            ]
          }
        },
        "methods": {
          "GET": {
            "description": "array, random words",
            "statusCodes": {
              "200": "OK",
              "406": "Bad params"
            }
          }
        }
      },
      {
        "id": "Paragraph",
        "description": "Return random paragraph(s) from dictionary",
        "path": "/{?dictionary}/paragraph/{?count}",
        "params": {
          "dictionary": {
            "description": "Dictionary name",
            "validations": [
              {
                "type": "match",
                "pattern": "[a-z_\\-]+"
              },
              {
                "type": "matchResource", //non standard
                "pattern": "/dictionaries"
              }
            ]
          },
          "count": {
            "description": "Count of items required",
            "validations": [
              {
                "type": "match",
                "pattern": "\\d+"
              },
              {
                "type": "limit", //non standard
                "pattern": limitDefault
              }
            ]
          }
        },
        "methods": {
          "GET": {
            "description": "array, random words",
            "statusCodes": {
              "200": "OK",
              "406": "Bad params"
            }
          }
        }
      }
    ]
  };
  res.json(restDoc);
}

router.get('/docs', docsRoute)
  .options('/docs', docsRoute)
  .options('/', docsRoute);

// Exports =================================

module.exports = router;