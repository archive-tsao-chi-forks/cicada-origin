import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { pi_evaluable } from "./pi-evaluable"
import { pi_inferable } from "./pi-inferable"

export type Pi = Exp & {
  kind: "Exp.pi"
  name: string
  arg_t: Exp
  ret_t: Exp
}

export function Pi(name: string, arg_t: Exp, ret_t: Exp): Pi {
  return {
    kind: "Exp.pi",
    name,
    arg_t,
    ret_t,
    ...pi_evaluable(name, arg_t, ret_t),
    ...pi_inferable(name, arg_t, ret_t),
    repr: () => `(${name}: ${arg_t.repr()}) -> ${ret_t.repr()}`,
    alpha_repr: (opts) => {
      const arg_t_repr = arg_t.alpha_repr(opts)
      const ret_t_repr = ret_t.alpha_repr({
        depth: opts.depth + 1,
        depths: new Map([...opts.depths, [name, opts.depth]]),
      })
      return `(${arg_t_repr}) -> ${ret_t_repr}`
    },
  }
}
