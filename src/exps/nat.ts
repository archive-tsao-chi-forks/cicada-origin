import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"

import * as Value from "../value"

export class Nat implements Exp {
  kind = "Nat"

  constructor() {}

  evaluate(env: Env): Value.Value {
    return Value.nat
  }

  infer(ctx: Ctx): Value.Value {
    return Value.type
  }

  repr(): string {
    return "Nat"
  }

  alpha_repr(opts: AlphaCtx): string {
    return "Nat"
  }
}
