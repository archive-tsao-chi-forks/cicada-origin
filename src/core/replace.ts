import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { evaluate } from "../evaluate"
import { check } from "../check"
import { infer } from "../infer"
import * as Explain from "../explain"
import * as Value from "../value"
import { Normal } from "../normal"
import * as Neutral from "../neutral"
import * as Trace from "../trace"
import { Pi, Ap } from "../core"
import { Type } from "../core"
import { Var } from "../core"
import { NotYetValue } from "../core"
import { EqualValue, SameValue } from "../core"
import { PiValue } from "../core"

export class Replace implements Exp {
  target: Exp
  motive: Exp
  base: Exp

  constructor(target: Exp, motive: Exp, base: Exp) {
    this.target = target
    this.motive = motive
    this.base = base
  }

  evaluate(env: Env): Value.Value {
    return do_replace(
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base)
    )
  }

  infer(ctx: Ctx): Value.Value {
    const target_t = infer(ctx, this.target)
    const equal = Value.is_equal(ctx, target_t)
    const motive_t = evaluate(
      new Env().extend("t", equal.t),
      new Pi("x", new Var("t"), new Type())
    )
    check(ctx, this.motive, motive_t)
    const motive_value = evaluate(ctx.to_env(), this.motive)
    check(ctx, this.base, Ap.apply(motive_value, equal.from))
    return Ap.apply(motive_value, equal.to)
  }

  repr(): string {
    return `replace(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `replace(${this.target.alpha_repr(ctx)}, ${this.motive.alpha_repr(
      ctx
    )}, ${this.base.alpha_repr(ctx)})`
  }
}

export function do_replace(
  target: Value.Value,
  motive: Value.Value,
  base: Value.Value
): Value.Value {
  if (target instanceof SameValue) {
    return base
  } else if (target instanceof NotYetValue) {
    if (target.t instanceof EqualValue) {
      const base_t = Ap.apply(motive, target.t.from)
      const closure = Value.Closure.create(new Env(), "x", new Type())
      const motive_t = new PiValue(target.t.t, closure)
      return new NotYetValue(
        Ap.apply(motive, target.t.to),
        Neutral.replace(
          target.neutral,
          new Normal(motive_t, motive),
          new Normal(base_t, base)
        )
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "replace",
          expecting: ["Value.equal"],
          reality: target.t.constructor.name,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "replace",
        expecting: ["Value.same", "new NotYetValue"],
        reality: target.constructor.name,
      })
    )
  }
}