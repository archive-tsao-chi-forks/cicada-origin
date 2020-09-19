export type Sym = Terminal | NonTerminal
export type Terminal = lit
export type NonTerminal = v | ap

interface v {
  kind: "Sym.v"
  name: string
}

export const v = (name: string): v => ({
  kind: "Sym.v",
  name,
})

interface ap {
  kind: "Sym.ap"
  target: Sym
  args: Array<Sym>
  main: NonTerminal
}

export const ap = (target: Sym, args: Array<Sym>, main: NonTerminal): ap => ({
  kind: "Sym.ap",
  target,
  args,
  main,
})

interface lit {
  kind: "Sym.lit"
  value: string
}

export const lit = (value: string): lit => ({
  kind: "Sym.lit",
  value,
})
