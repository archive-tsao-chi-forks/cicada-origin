import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { infer } from "../infer"
import { evaluate } from "../evaluate"
import * as Value from "../value"
import * as Explain from "../explain"
import * as Neutral from "../neutral"
import * as Trace from "../trace"
import { Car } from "../core"
import { NotYetValue } from "./not-yet-value"
import { SigmaValue } from "./sigma-value"
import { ConsValue } from "./cons-value"

export class Cdr implements Exp {
  target: Exp

  constructor(target: Exp) {
    this.target = target
  }

  evaluate(env: Env): Value.Value {
    return Cdr.apply(evaluate(env, this.target))
  }

  infer(ctx: Ctx): Value.Value {
    const target_t = infer(ctx, this.target)
    const sigma = Value.is_sigma(ctx, target_t)
    const car = Car.apply(evaluate(ctx.to_env(), this.target))
    return Value.Closure.apply(sigma.cdr_t_cl, car)
  }

  repr(): string {
    return `cdr(${this.target.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `cdr(${this.target.alpha_repr(ctx)})`
  }

  static apply(target: Value.Value): Value.Value {
    if (target instanceof ConsValue) {
      return target.cdr
    } else if (target instanceof NotYetValue) {
      if (target.t instanceof SigmaValue) {
        return new NotYetValue(
          Value.Closure.apply(target.t.cdr_t_cl, Car.apply(target)),
          Neutral.cdr(target.neutral)
        )
      } else {
        throw new Trace.Trace(
          Explain.explain_elim_target_type_mismatch({
            elim: "cdr",
            expecting: ["Value.sigma"],
            reality: target.t.constructor.name,
          })
        )
      }
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_mismatch({
          elim: "cdr",
          expecting: ["Value.cons", "new NotYetValue"],
          reality: target.constructor.name,
        })
      )
    }
  }
}