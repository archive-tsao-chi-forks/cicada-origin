export const elim = {
  $grammar: {
    "elim:var": [{ name: "identifier" }],
    "elim:ap": [
      { target: "elim" },
      { args: { $ap: ["one_or_more", '"("', "exps", '")"'] } },
    ],
    "elim:car": ['"car"', '"("', { target: "exp" }, '")"'],
    "elim:cdr": ['"cdr"', '"("', { target: "exp" }, '")"'],
    "elim:dot_field": [{ target: "elim" }, '"."', { name: "identifier" }],
    "elim:dot_method": [
      { target: "elim" },
      '"."',
      { name: "identifier" },
      { args: { $ap: ["one_or_more", '"("', "exps", '")"'] } },
    ],
    "elim:nat_ind": [
      '"nat_ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "elim:nat_rec": [
      '"nat_rec"',
      '"("',
      { target: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "elim:list_ind": [
      '"list_ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "elim:list_rec": [
      '"list_rec"',
      '"("',
      { target: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "elim:vector_head": ['"vector_head"', '"("', { target: "exp" }, '")"'],
    "elim:vector_tail": ['"vector_tail"', '"("', { target: "exp" }, '")"'],
    "elim:vector_ind": [
      '"vector_ind"',
      '"("',
      { length: "exp" },
      '","',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "elim:replace": [
      '"replace"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '")"',
    ],
    "elim:absurd_ind": [
      '"absurd_ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '")"',
    ],
    "elim:either_ind": [
      '"either_ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base_left: "exp" },
      '","',
      { base_right: "exp" },
      '")"',
    ],
    "elim:the": ['"the"', '"("', { t: "exp" }, '","', { exp: "exp" }, '")"'],
    // NOTE about `is(exp, t)`
    // In set theory, the symbol "∈" is a stylized lowercase Greek letter epsilon ("ϵ"),
    // the first letter of the word ἐστί, which means "is".
    // - https://en.wikipedia.org/wiki/Element_(mathematics)
    "elim:is": ['"is"', '"("', { exp: "exp" }, '","', { t: "exp" }, '")"'],
  },
}

export const cons = {
  $grammar: {
    "cons:pi": [
      '"("',
      { bindings: "bindings" },
      '")"',
      '"-"',
      '">"',
      { ret_t: "exp" },
    ],
    "cons:fn": ['"("', { names: "names" }, '")"', '"="', '">"', { ret: "exp" }],
    "cons:fn_flower": [
      '"("',
      { names: "names" },
      '")"',
      '"{"',
      { ret: "exp" },
      '"}"',
    ],
    "cons:sigma": [
      '"("',
      { bindings: "bindings" },
      '")"',
      '"*"',
      { cdr_t: "exp" },
    ],
    "cons:cons": [
      '"cons"',
      '"("',
      { car: "exp" },
      '","',
      { cdr: "exp" },
      '")"',
    ],
    "cons:cls": [
      '"class"',
      '"{"',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"}"',
    ],
    "cons:ext": [
      '"class"',
      '"extends"',
      { parent: "elim" },
      '"{"',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"}"',
    ],
    "cons:obj": [
      '"{"',
      { properties: { $ap: ["zero_or_more", "property"] } },
      '"}"',
    ],
    "cons:nat": ['"Nat"'],
    "cons:zero": ['"zero"'],
    "cons:add1": ['"add1"', '"("', { prev: "exp" }, '")"'],
    "cons:number": [{ value: { $pattern: ["number"] } }],
    "cons:list": ['"List"', '"("', { elem_t: "exp" }, '")"'],
    "cons:nil": ['"nil"'],
    "cons:nil_sugar": ['"li"', '"!"', '"["', '"]"'],
    "cons:li": ['"li"', '"("', { head: "exp" }, '","', { tail: "exp" }, '")"'],
    "cons:li_sugar": ['"li"', '"!"', '"["', { exps: "exps" }, '"]"'],
    "cons:vector": [
      '"Vector"',
      '"("',
      { elem_t: "exp" },
      '","',
      { length: "exp" },
      '")"',
    ],
    "cons:vecnil": ['"vecnil"'],
    "cons:vec": [
      '"vec"',
      '"("',
      { head: "exp" },
      '","',
      { tail: "exp" },
      '")"',
    ],
    "cons:vec_sugar": ['"vec"', '"!"', '"["', { exps: "exps" }, '"]"'],
    "cons:equal": [
      '"Equal"',
      '"("',
      { t: "exp" },
      '","',
      { from: "exp" },
      '","',
      { to: "exp" },
      '")"',
    ],
    "cons:same": ['"same"'],
    "cons:trivial": ['"Trivial"'],
    "cons:sole": ['"sole"'],
    "cons:absurd": ['"Absurd"'],
    "cons:str": ['"String"'],
    "cons:quote": [{ value: { $pattern: ["string"] } }],
    "cons:either": [
      '"Either"',
      '"("',
      { left_t: "exp" },
      '","',
      { right_t: "exp" },
      '")"',
    ],
    "cons:inl": ['"inl"', '"("', { left: "exp" }, '")"'],
    "cons:inr": ['"inr"', '"("', { right: "exp" }, '")"'],
    "cons:type": ['"Type"'],
    "cons:let": [
      '"let"',
      { name: "identifier" },
      '"="',
      { exp: "exp" },
      { ret: "exp" },
    ],
    "cons:let_the": [
      '"let"',
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
      { ret: "exp" },
    ],
    "cons:let_fn": [
      '"let"',
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      '"{"',
      { ret: "exp" },
      '"}"',
      { body: "exp" },
    ],
  },
}

export const exp = {
  $grammar: {
    "exp:elim": [{ elim: "elim" }],
    "exp:cons": [{ cons: "cons" }],
  },
}

export const cls_entry = {
  $grammar: {
    "cls_entry:field_demanded": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "cls_entry:field_fulfilled": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "cls_entry:method_demanded": [
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "cls_entry:method_fulfilled": [
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      '"="',
      { ret: "exp" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const bindings = {
  $grammar: {
    "bindings:bindings": [
      { entries: { $ap: ["zero_or_more", "binding_entry", '","'] } },
      { last_entry: "binding_entry" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const binding_entry = {
  $grammar: {
    "binding_entry:nameless": [{ exp: "exp" }],
    "binding_entry:named": [{ name: "identifier" }, '":"', { exp: "exp" }],
    "binding_entry:multi_named": [
      { names: { $ap: ["one_or_more", "identifier"] } },
      '":"',
      { exp: "exp" },
    ],
  },
}

export const names = {
  $grammar: {
    "names:names": [
      { entries: { $ap: ["zero_or_more", "identifier", '","'] } },
      { last_entry: "identifier" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const exps = {
  $grammar: {
    "exps:exps": [
      { entries: { $ap: ["zero_or_more", "exp", '","'] } },
      { last_entry: "exp" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const property = {
  $grammar: {
    "property:field_shorthand": [
      { name: "identifier" },
      { $ap: ["optional", '","'] },
    ],
    "property:field": [
      { name: "identifier" },
      '":"',
      { exp: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "property:method": [
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      { $ap: ["optional", '","'] },
    ],
    "property:spread": [
      '"."',
      '"."',
      '"."',
      { exp: "exp" },
      { $ap: ["optional", '","'] },
    ],
  },
}
