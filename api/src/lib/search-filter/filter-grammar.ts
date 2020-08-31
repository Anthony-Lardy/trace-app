// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

var appendItem = function (a, b) { return function (d) { return d[a].concat([d[b]]); } };
var appendItemChar = function (a, b) { return function (d) { return d[a].concat(d[b]); } };
var empty = function () { return []; };
var emptyStr = function () { return ""; };
var nuller = function () { return null; };

export interface Token { value: any; [key: string]: any };

export interface Lexer {
  reset: (chunk: string, info: any) => void;
  next: () => Token | undefined;
  save: () => any;
  formatError: (token: Token) => string;
  has: (tokenType: string) => boolean
};

export interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any
};

export type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

export var Lexer: Lexer | undefined = undefined;

export var ParserRules: NearleyRule[] = [
    {"name": "exprs", "symbols": ["expr"]},
    {"name": "exprs", "symbols": ["exprs", "__", "expr"], "postprocess": appendItem(0,2)},
    {"name": "expr$string$1", "symbols": [{"literal":":"}, {"literal":"("}], "postprocess": (d) => d.join('')},
    {"name": "expr", "symbols": ["field", "expr$string$1", "inWords", {"literal":")"}], "postprocess": (d) => { return {...d[0], terms:d[2], op: "in" }}},
    {"name": "expr$string$2", "symbols": [{"literal":":"}, {"literal":"("}], "postprocess": (d) => d.join('')},
    {"name": "expr", "symbols": ["field", "expr$string$2", "allWords", {"literal":")"}], "postprocess": (d) => { return {...d[0], terms:d[2], op: "all" }}},
    {"name": "expr$string$3", "symbols": [{"literal":"."}, {"literal":"."}], "postprocess": (d) => d.join('')},
    {"name": "expr", "symbols": ["field", {"literal":":"}, "numOrDates", "expr$string$3", "numOrDates"], "postprocess": (d) => { return {...d[0], minTerm:d[2], maxTerm:d[4], op: "rng" }}},
    {"name": "expr$string$4", "symbols": [{"literal":":"}, {"literal":"~"}], "postprocess": (d) => d.join('')},
    {"name": "expr", "symbols": ["field", "expr$string$4", "word"], "postprocess": (d) => { return { ...d[0], op:"txt", term: d[2]} }},
    {"name": "expr$string$5", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "expr", "symbols": ["field", "expr$string$5", "numOrDates"], "postprocess": (d) => { return { ...d[0], op:"gte", term: d[2]} }},
    {"name": "expr$string$6", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "expr", "symbols": ["field", "expr$string$6", "numOrDates"], "postprocess": (d) => { return { ...d[0], op:"lte", term: d[2]} }},
    {"name": "expr", "symbols": ["field", {"literal":"<"}, "numOrDates"], "postprocess": (d) => { return { ...d[0], op:"lt", term: d[2]} }},
    {"name": "expr", "symbols": ["field", {"literal":">"}, "numOrDates"], "postprocess": (d) => { return { ...d[0], op:"gt", term: d[2]} }},
    {"name": "expr$string$7", "symbols": [{"literal":":"}, {"literal":"("}], "postprocess": (d) => d.join('')},
    {"name": "expr", "symbols": ["field", "expr$string$7", "word", {"literal":")"}], "postprocess": (d) => { return {...d[0], terms: [d[2]], op: "in" }}},
    {"name": "expr", "symbols": ["field", {"literal":":"}, "word"], "postprocess": (d) => { return {...d[0], term: d[2], op: "eq" }}},
    {"name": "expr$ebnf$1", "symbols": [/[\-\+]/], "postprocess": id},
    {"name": "expr$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "expr", "symbols": ["expr$ebnf$1", "word"], "postprocess": (d) => { return {field: "<default>", prefix: d[0], term: d[1], op: "txt"} }},
    {"name": "field$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "field$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "field$ebnf$2", "symbols": []},
    {"name": "field$ebnf$2", "symbols": ["field$ebnf$2", "fieldPart"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "field", "symbols": ["field$ebnf$1", "fieldStart", "field$ebnf$2"], "postprocess": (d) => { var paths = [d[1]].concat(d[2]); return { prefix:d[0], field: paths.join('.'), fieldParts: paths} }},
    {"name": "fieldPart$ebnf$1", "symbols": [/[a-zA-Z0-9_\/-]/]},
    {"name": "fieldPart$ebnf$1", "symbols": ["fieldPart$ebnf$1", /[a-zA-Z0-9_\/-]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "fieldPart", "symbols": [{"literal":"."}, "fieldPart$ebnf$1"], "postprocess": (d) => d[1].join("")},
    {"name": "fieldStart$ebnf$1", "symbols": [/[a-zA-Z0-9_]/]},
    {"name": "fieldStart$ebnf$1", "symbols": ["fieldStart$ebnf$1", /[a-zA-Z0-9_]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "fieldStart", "symbols": ["fieldStart$ebnf$1"], "postprocess": (d) => d[0].join("")},
    {"name": "inWords", "symbols": ["word", {"literal":"|"}, "word"], "postprocess": (d) => { return [d[0],d[2]] }},
    {"name": "inWords", "symbols": ["inWords", {"literal":"|"}, "word"], "postprocess": appendItem(0,2)},
    {"name": "allWords", "symbols": ["word", {"literal":" "}, "word"], "postprocess": (d) => { return [d[0],d[2]] }},
    {"name": "allWords", "symbols": ["allWords", {"literal":" "}, "word"], "postprocess": appendItem(0,2)},
    {"name": "numOrDates$ebnf$1", "symbols": [/[0-9T\:\Z\+\-\.]/]},
    {"name": "numOrDates$ebnf$1", "symbols": ["numOrDates$ebnf$1", /[0-9T\:\Z\+\-\.]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "numOrDates", "symbols": ["numOrDates$ebnf$1"], "postprocess": (d) => d[0].join("")},
    {"name": "numOrDates", "symbols": ["word"], "postprocess": id},
    {"name": "word", "symbols": ["unquoted_word"], "postprocess": id},
    {"name": "word", "symbols": [{"literal":"\""}, "quoted_word", {"literal":"\""}], "postprocess": function (d) { return d[1]; }},
    {"name": "quoted_word", "symbols": [], "postprocess": emptyStr},
    {"name": "quoted_word", "symbols": ["quoted_word", "quoted_word_char"], "postprocess": appendItemChar(0,1)},
    {"name": "quoted_word_char", "symbols": [/[^"]/], "postprocess": id},
    {"name": "unquoted_word", "symbols": ["char"], "postprocess": id},
    {"name": "unquoted_word", "symbols": ["unquoted_word", "char"], "postprocess":  (d, _l, reject) => { if (d[0] && d[0].indexOf("..")>-1) {
            return reject;
        }
        return appendItemChar(0,1)(d);} 
                                },
    {"name": "char", "symbols": [/[^\n\r\"\s\(\)\|\~\<\>\=\:]/], "postprocess": id},
    {"name": "newline", "symbols": [{"literal":"\r"}, {"literal":"\n"}], "postprocess": empty},
    {"name": "newline", "symbols": [{"literal":"\r"}]},
    {"name": "newline", "symbols": [{"literal":"\n"}], "postprocess": empty},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": nuller},
    {"name": "__$ebnf$1", "symbols": [/[\s]/]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": nuller}
];

export var ParserStart: string = "exprs";
