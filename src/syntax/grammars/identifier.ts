import pt from "@cicada-lang/partech"

const preserved = [
  "cons",
  "car",
  "cdr",
  "Nat",
  "nat_ind",
  "nat_rec",
  "nat_iter",
  "nat_which",
  "zero",
  "add1",
  "List",
  "nil",
  "li",
  "list_ind",
  "list_rec",
  "Equal",
  "same",
  "replace",
  "Trivial",
  "sole",
  "Absurd",
  "absurd_ind",
  "String",
  "Type",
]

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)
