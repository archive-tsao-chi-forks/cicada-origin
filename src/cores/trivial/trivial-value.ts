import { Ctx } from "../../ctx"
import { Core } from "../../core"
import { Value } from "../../value"
import { TypeValue } from "../../cores"
import { Trivial, Sole } from "../../cores"

export class TrivialValue {
  readback(ctx: Ctx, t: Value): Core | undefined {
    if (t instanceof TypeValue) {
      return new Trivial()
    }
  }

  eta_expand(ctx: Ctx, value: Value): Core {
    // NOTE the η-rule for trivial states that
    //   all of its inhabitants are the same as sole.
    //   This is implemented by reading the all back as sole.
    return new Sole()
  }
}
