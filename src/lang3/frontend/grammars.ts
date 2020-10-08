import * as pt from "../../partech"

const preserved = ["Equal", "same", "replace", "Absurd", "String", "Type"]

export const identifier = {
  $pattern: ["identifier", `^(?!(${preserved.join("|")}))`],
}

export const zero_or_more = pt.grammars.zero_or_more

export const one_or_more = pt.grammars.one_or_more

export const $start = "exp"

export const exp = {
  "exp:var": [{ name: "identifier" }],
  "exp:pi": [
    '"("',
    { name: "identifier" },
    '":"',
    { arg_t: "exp" },
    '")"',
    '"-"',
    '">"',
    { ret_t: "exp" },
  ],
  "exp:arrow": ['"("', { arg_t: "exp" }, '")"', '"-"', '">"', { ret_t: "exp" }],
  "exp:fn": [
    '"("',
    { name: "identifier" },
    '")"',
    '"="',
    '">"',
    { body: "exp" },
  ],
  "exp:ap": [
    { target: "identifier" },
    { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
  ],
  // "exp:cls": ['"{"', { sat: "sat" }, { scope: "scope" }, '"}"'],
  "exp:fill": [
    { target: "identifier" },
    { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
  ],
  // "exp:obj": ['"{"', { properties: "properties" }, '"}"'],
  "exp:dot": [{ target: "exp" }, '"."', { name: "identifier" }],
  "exp:equal": [
    '"Equal"',
    '"("',
    { t: "exp" },
    '","',
    { from: "exp" },
    '","',
    { to: "exp" },
    '")"',
  ],
  "exp:same": ['"same"'],
  "exp:replace": [
    '"replace"',
    '"("',
    { target: "exp" },
    '","',
    { motive: "exp" },
    '","',
    { base: "exp" },
    '")"',
  ],
  "exp:absurd": ['"Absurd"'],
  "exp:absurd_ind": [
    '"Absurd"',
    '"."',
    '"ind"',
    '"("',
    { target: "exp" },
    '","',
    { motive: "exp" },
    '")"',
  ],
  "exp:str": ['"String"'],
  "exp:quote": [{ value: { $pattern: ["string"] } }],
  "exp:type": ['"Type"'],
  "exp:suite": ['"{"', { stmts: "stmts" }, { ret: "exp" }, '"}"'],
  "exp:the": [{ exp: "exp" }, '":"', { t: "exp" }],
}

export const stmts = {
  "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
}

export const stmt = {
  "stmt:def": [{ name: "identifier" }, '"="', { exp: "exp" }],
  "stmt:claim": [
    { claim: "identifier" },
    '":"',
    { t: "exp" },
    { define: "identifier" },
    '"="',
    { exp: "exp" },
  ],
  "stmt:show": ['"@"', '"show"', { exp: "exp" }],
}
