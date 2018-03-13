#!/usr/bin/env node
"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var updateNotifier = require("update-notifier");
var pkg = void 0;
try {
  pkg = require("../package.json");
} catch (e) {
  pkg = require("../../package.json");
}

updateNotifier({ pkg: pkg }).notify();

var RenderPDF = require("../index");
var argv = require("minimist")(process.argv.slice(2), {
  string: ["url", "pdf", "chrome-binary", "window-size", "paper-width", "paper-height", "extra-cli-options"],
  boolean: ["no-margins", "include-background", "landscape "]
});

if (argv["help"] || !argv["pdf"] || !argv["url"]) {
  printHelp();
  process.exit(2);
}

var urls = typeof argv["url"] === "string" ? [argv["url"]] : argv["url"];
var pdfs = typeof argv["pdf"] === "string" ? [argv["pdf"]] : argv["pdf"];

var windowSize = void 0;
if (typeof argv["window-size"] === "string") {
  windowSize = argv["window-size"].match(/^([0-9]+)[,x*]([0-9]+)$/);
  if (windowSize === null) {
    console.error("ERROR: Missing or bad input for --window-size \n");
    printHelp();
    process.exit(1);
  }
  windowSize = windowSize.splice(1, 3);
}

if (pdfs.length !== urls.length) {
  console.error("ERROR: Unpaired --url or --pdf found\n");
  printHelp();
  process.exit(1);
}

var chromeBinary = null;
if (typeof argv["chrome-binary"] === "string") {
  chromeBinary = argv["chrome-binary"];
}

var paperWidth = undefined;
if (typeof argv["paper-width"] === "string") {
  paperWidth = argv["paper-width"];
}

var paperHeight = undefined;
if (typeof argv["paper-height"] === "string") {
  paperHeight = argv["paper-height"];
}

var landscape = void 0;
if (argv["landscape"]) {
  landscape = true;
}

var extraCliOptions = void 0;
if (typeof argv["extra-cli-options"] === "string") {
  console.log(argv["extra-cli-options"]);
  extraCliOptions = require("string-argv")(argv["extra-cli-options"]);
}

var noMargins = void 0;
if (argv["margins"] !== undefined) {
  noMargins = !argv["margins"];
}

var includeBackground = void 0;
if (argv["include-background"]) {
  includeBackground = true;
}

(0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
  var jobs;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          jobs = generateJobList(urls, pdfs);
          _context.next = 4;
          return RenderPDF.generateMultiplePdf(jobs, {
            printLogs: true,
            landscape: landscape,
            noMargins: noMargins,
            includeBackground: includeBackground,
            chromeBinary: chromeBinary,
            windowSize: windowSize,
            paperWidth: paperWidth,
            paperHeight: paperHeight,
            extraCliOptions: extraCliOptions
          });

        case 4:
          _context.next = 10;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);

          console.error(_context.t0);
          process.exit(1);

        case 10:
          process.exit();

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, undefined, [[0, 6]]);
}))();

function generateJobList(urls, pdfs) {
  var jobs = [];
  for (var j = 0; j < urls.length; j++) {
    jobs.push({
      url: urls[j],
      pdf: pdfs[j]
    });
  }
  return jobs;
}

function printHelp() {
  console.log("chrome-headless-render-pdf [OPTIONS] --url=URL --pdf=OUTPUT-FILE [--url=URL2 --pdf=OUTPUT-FILE2] ...");
  console.log("  Options:");
  console.log("    --help                   this screen");
  console.log("    --url                    url to load, for local files use: file:///path/to/file");
  console.log("    --pdf                    output for generated file can be relative to current directory");
  console.log("    --chrome-binary          set chrome location (use this options when autodetection fail)");
  console.log("    --no-margins             disable default 1cm margins");
  console.log("    --include-background     include elements background");
  console.log("    --landscape              generate pdf in landscape orientation");
  console.log("    --window-size            specify window size, width(,x*)height (e.g. --window-size 1600,1200 or --window-size 1600x1200)");
  console.log("    --paper-width            specify page width in inches (defaults to 8.5 inches)");
  console.log("    --paper-height           specify page height in inches (defaults to 11 inches)");
  console.log('.   --extra-cli-options      extra command line options to be passed directly to the chrome binary on the command line (ex. --extra-cli-options="--ignore-certificate-errors --hide-scrollbars"');
  console.log("");
  console.log("  Example:");
  console.log("    Render single pdf file");
  console.log("      chrome-headless-render-pdf --url http://google.com --pdf test.pdf");
  console.log("    Render pdf from local file");
  console.log("      chrome-headless-render-pdf --url file:///tmp/example.html --pdf test.pdf");
  console.log("    Render multiple pdf files");
  console.log("      chrome-headless-render-pdf --url http://google.com --pdf test.pdf --url file:///tmp/example.html --pdf test.pdf");
}