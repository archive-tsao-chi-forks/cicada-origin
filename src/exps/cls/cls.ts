import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Telescope } from "../../telescope"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Cls extends Exp {
  entries: Array<{ name: string; t: Exp; exp?: Exp }>
  name?: string

  constructor(
    entries: Array<{ name: string; t: Exp; exp?: Exp }>,
    opts?: { name?: string }
  ) {
    super()
    this.entries = entries
    this.name = opts?.name
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const core_entries: Array<{
      name: string
      t: Core
      exp?: Core
    }> = new Array()
    for (const { name, t, exp } of this.entries) {
      const t_core = check(ctx, t, new Cores.TypeValue())
      const t_value = evaluate(ctx.to_env(), t_core)
      const exp_core = exp ? check(ctx, exp, t_value) : undefined
      core_entries.push({ name, t: t_core, exp: exp_core })
      ctx = ctx.extend(name, t_value)
    }

    const t = new Cores.TypeValue()
    const core = new Cores.Cls(core_entries, { name: this.name })
    return { t, core }
  }

  repr(): string {
    const name = this.name ? `${this.name} ` : ""

    if (this.entries.length === 0) {
      return name + "[]"
    }

    const entries = this.entries.map(({ name, t, exp }) => {
      return exp
        ? `${name}: ${t.repr()} = ${exp.repr()}`
        : `${name}: ${t.repr()}`
    })

    const s = entries.join("\n")

    return name + `[\n${ut.indent(s, "  ")}\n]`
  }
}
