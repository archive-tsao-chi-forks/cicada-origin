export { ClsEntry } from "./cls-entry"

import { Exp } from "../../exp"
import { Core } from "../../core"
import { Value } from "../../value"
import { Ctx } from "../../ctx"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import * as Cores from "../../cores"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export class Cls extends Exp {
  entries: Array<Exps.ClsEntry>
  name?: string

  constructor(entries: Array<Exps.ClsEntry>, opts?: { name?: string }) {
    super()
    this.entries = entries
    this.name = opts?.name
  }

  free_names(bound_names: Set<string>): Set<string> {
    let free_names: Set<string> = new Set()

    for (const entry of this.entries) {
      free_names = new Set([...free_names, ...entry.free_names(bound_names)])
      bound_names = new Set([...bound_names, entry.local_name])
    }

    return free_names
  }

  subst(name: string, exp: Exp): Exp {
    return new Cls(Exps.ClsEntry.subst_entries(this.entries, name, exp), {
      name: this.name,
    })
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    return {
      t: new Cores.TypeValue(),
      core: new Cores.Cls(infer_entries(ctx, this.entries), {
        name: this.name,
      }),
    }
  }

  repr(): string {
    const name = this.name || ""

    if (this.entries.length === 0) {
      return `class ${name} {}`
    }

    const entries = this.entries.map((entry) => entry.repr()).join("\n")
    return `class ${name} {\n${ut.indent(entries, "  ")}\n}`
  }
}

function infer_entries(
  ctx: Ctx,
  entries: Array<Exps.ClsEntry>
): Array<Cores.ClsEntry> {
  if (entries.length === 0) return []

  const [entry, ...rest] = entries
  const { field_name, local_name, t, exp } = entry
  const fresh_name = ut.freshen_name(new Set(ctx.names), local_name)
  const t_core = check(ctx, t, new Cores.TypeValue())
  const t_value = evaluate(ctx.to_env(), t_core)
  const exp_core = exp ? check(ctx, exp, t_value) : undefined

  return [
    new Cores.ClsEntry(field_name, t_core, exp_core),
    ...infer_entries(
      ctx.extend(fresh_name, t_value),
      Exps.ClsEntry.subst_entries(rest, local_name, new Exps.Var(fresh_name))
    ),
  ]
}
