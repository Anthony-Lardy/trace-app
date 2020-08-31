@preprocessor typescript
@{%
var appendItem = function (a, b) { return function (d) { return d[a].concat([d[b]]); } };
var appendItemChar = function (a, b) { return function (d) { return d[a].concat(d[b]); } };
var empty = function (d) { return []; };
var emptyStr = function (d) { return ""; };
var nuller = function (d) { return null; };
%}

exprs -> expr | exprs __ expr {% appendItem(0,2) %}

expr -> field ":(" inWords ")"  {% (d) => { return {...d[0], terms:d[2], op: "in" }} %}
    | field ":(" allWords ")"  {% (d) => { return {...d[0], terms:d[2], op: "all" }} %}
    | field ":" numOrDates ".." numOrDates {% (d) => { return {...d[0], minTerm:d[2], maxTerm:d[4], op: "rng" }} %}
    | field ":~" word {% (d) => { return { ...d[0], op:"txt", term: d[2]} } %}
    | field ">=" numOrDates {% (d) => { return { ...d[0], op:"gte", term: d[2]} } %}
    | field "<=" numOrDates {% (d) => { return { ...d[0], op:"lte", term: d[2]} } %}
    | field "<" numOrDates {% (d) => { return { ...d[0], op:"lt", term: d[2]} } %}
    | field ">" numOrDates {% (d) => { return { ...d[0], op:"gt", term: d[2]} } %}
    | field ":(" word ")" {% (d) => { return {...d[0], terms: [d[2]], op: "in" }} %}
    | field ":" word {% (d) => { return {...d[0], term: d[2], op: "eq" }} %}
    | [\-\+]:? word {% (d) => { return {field: "<default>", prefix: d[0], term: d[1], op: "txt"} } %}

field -> "-":? fieldStart fieldPart:* {% (d) => { var paths = [d[1]].concat(d[2]); return { prefix:d[0], field: paths.join('.'), fieldParts: paths} } %}

fieldPart -> "." [a-zA-Z0-9_\/-]:+ {% (d) => d[1].join("") %}
fieldStart -> [a-zA-Z0-9_]:+ {% (d) => d[0].join("") %}

inWords -> word "|" word {% (d) => { return [d[0],d[2]] } %} | inWords "|" word {% appendItem(0,2) %}

allWords -> word " " word {% (d) => { return [d[0],d[2]] } %} | allWords " " word {% appendItem(0,2) %}

numOrDates -> [0-9T\:\Z\+\-\.]:+ {% (d) => d[0].join("") %}
    | word {% id %}

word -> unquoted_word {% id %}
    | "\"" quoted_word "\"" {% function (d) { return d[1]; } %}

quoted_word -> null {% emptyStr %} # allow empty strings
    | quoted_word quoted_word_char {% appendItemChar(0,1) %}

quoted_word_char -> [^"] {% id %}

unquoted_word -> char {% id %}
    | unquoted_word char {% (d,l, reject) => { if (d[0] && d[0].indexOf("..")>-1) {
                                                    return reject;
                                                }
                                                return appendItemChar(0,1)(d);} 
                        %}

char -> [^\n\r\"\s\(\)\|\~\<\>\=\:] {% id %}

newline -> "\r" "\n" {% empty %}
    | "\r" | "\n" {% empty %}

# is a null-returning function. This is a memory efficiency trick.
_ -> [\s]:* {% nuller %}
__ -> [\s]:+ {% nuller %}
