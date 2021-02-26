import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import * as Value from "../value"
import { evaluate } from "../evaluate"
import { check } from "../check"
import { ConsValue } from "../core"

export class Cons implements Exp {
  car: Exp
  cdr: Exp

  constructor(car: Exp, cdr: Exp) {
    this.car = car
    this.cdr = cdr
  }

  evaluate(env: Env): Value.Value {
    return new ConsValue(evaluate(env, this.car), evaluate(env, this.cdr))
  }

  check(ctx: Ctx, t: Value.Value): void {
    const sigma = Value.is_sigma(ctx, t)
    const cdr_t = Value.Closure.apply(
      sigma.cdr_t_cl,
      evaluate(ctx.to_env(), this.car)
    )
    check(ctx, this.car, sigma.car_t)
    check(ctx, this.cdr, cdr_t)
  }

  repr(): string {
    return `cons(${this.car.repr()}, ${this.cdr.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `cons(${this.car.alpha_repr(ctx)}, ${this.cdr.alpha_repr(ctx)})`
  }
}
