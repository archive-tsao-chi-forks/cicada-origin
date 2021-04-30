import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"

export type Core = {
  evaluate(ctx: Ctx, env: Env): Value
  repr(): string
  alpha_repr(ctx: AlphaCtx): string
}

export class AlphaCtx {
  depth: number
  depths: Map<string, number>

  constructor(depth: number = 0, depths: Map<string, number> = new Map()) {
    this.depth = depth
    this.depths = depths
  }

  extend(name: string): AlphaCtx {
    return new AlphaCtx(
      this.depth + 1,
      new Map([...this.depths, [name, this.depth]])
    )
  }
}