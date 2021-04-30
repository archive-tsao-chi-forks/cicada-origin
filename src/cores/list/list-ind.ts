import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import { Trace } from "../../trace"
import { Type, TypeValue } from "../../cores"
import { Var, Pi, Ap } from "../../cores"
import {
  ListValue,
  Nil,
  NilValue,
  List,
  Li,
  LiValue,
  ListIndNeutral,
} from "../../cores"
import { PiValue } from "../../cores"
import { NotYetValue } from "../../cores"

export class ListInd implements Core {
  target: Core
  motive: Core
  base: Core
  step: Core

  constructor(target: Core, motive: Core, base: Core, step: Core) {
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return ListInd.apply(
      evaluate(ctx, env, this.target),
      evaluate(ctx, env, this.motive),
      evaluate(ctx, env, this.base),
      evaluate(ctx, env, this.step)
    )
  }

  repr(): string {
    return `list_ind(${this.target.repr()}, ${this.motive.repr()}, ${this.base.repr()}, ${this.step.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `list_ind(${this.target.alpha_repr(ctx)}, ${this.motive.alpha_repr(
      ctx
    )}, ${this.base.alpha_repr(ctx)}, ${this.step.alpha_repr(ctx)})`
  }

  static apply(target: Value, motive: Value, base: Value, step: Value): Value {
    return match_value(target, [
      [NilValue, (_: NilValue) => base],
      [
        LiValue,
        ({ head, tail }: LiValue) =>
          Ap.apply(
            Ap.apply(Ap.apply(step, head), tail),
            ListInd.apply(tail, motive, base, step)
          ),
      ],
      [
        NotYetValue,
        ({ t, neutral }: NotYetValue) =>
          match_value(t, [
            [
              ListValue,
              (list_t: ListValue) => {
                const motive_t = new PiValue(
                  list_t,
                  new Closure(
                    new Ctx(),
                    new Env(),
                    "target_list",
                    list_t,
                    new Type()
                  )
                )
                const base_t = Ap.apply(motive, new NilValue())
                const elem_t = list_t.elem_t
                const step_t = list_ind_step_t(motive_t, motive, elem_t)
                return new NotYetValue(
                  Ap.apply(motive, target),
                  new ListIndNeutral(
                    neutral,
                    new Normal(motive_t, motive),
                    new Normal(base_t, base),
                    new Normal(step_t, step)
                  )
                )
              },
            ],
          ]),
      ],
    ])
  }
}

function list_ind_step_t(motive_t: Value, motive: Value, elem_t: Value): Value {
  const ctx = new Ctx()
    .extend("motive", motive_t, motive)
    .extend("elem_t", new TypeValue(), elem_t)
  const env = new Env()
    .extend("motive", motive_t, motive)
    .extend("elem_t", new TypeValue(), elem_t)

  const step_t = new Pi(
    "head",
    new Var("elem_t"),
    new Pi(
      "tail",
      new List(new Var("elem_t")),
      new Pi(
        "almost",
        new Ap(new Var("motive"), new Var("tail")),
        new Ap(new Var("motive"), new Li(new Var("head"), new Var("tail")))
      )
    )
  )

  return evaluate(ctx, env, step_t)
}