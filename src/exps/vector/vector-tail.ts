import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class VectorTail extends Exp {
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const vector_t = expect(ctx, inferred_target.t, Cores.VectorValue)
    const length = expect(ctx, vector_t.length, Cores.Add1Value)

    return {
      t: new Cores.VectorValue(vector_t.elem_t, length.prev),
      core: new Cores.VectorTail(inferred_target.core),
    }
  }

  repr(): string {
    return `vector_tail(${this.target.repr()})`
  }
}