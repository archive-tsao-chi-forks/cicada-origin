import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { evaluate } from "../../evaluate"
import { Value, match_value } from "../../value"
import { Closure } from "../../closure"
import { Trace } from "../../trace"
import { Car, SigmaValue, ConsValue, CdrNeutral } from "../../cores"
import { NotYetValue } from "../../cores"

export class Cdr implements Core {
  target: Core

  constructor(target: Core) {
    this.target = target
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return Cdr.apply(evaluate(ctx, env, this.target))
  }

  repr(): string {
    return `cdr(${this.target.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `cdr(${this.target.alpha_repr(ctx)})`
  }

  static apply(target: Value): Value {
    return match_value(target, [
      [ConsValue, (cons: ConsValue) => cons.cdr],
      [
        NotYetValue,
        ({ t, neutral }: NotYetValue) =>
          match_value(t, [
            [
              SigmaValue,
              (sigma: SigmaValue) =>
                new NotYetValue(
                  sigma.cdr_t_cl.apply(Car.apply(target)),
                  new CdrNeutral(neutral)
                ),
            ],
          ]),
      ],
    ])
  }
}