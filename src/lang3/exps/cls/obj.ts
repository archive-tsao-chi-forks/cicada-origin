import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as ut from "../../../ut"
import { obj_evaluable } from "./obj-evaluable"
import { obj_checkable } from "./obj-checkable"

export type Obj = Evaluable &
  Checkable &
  Repr & {
    kind: "Exp.obj"
    properties: Map<string, Exp>
  }

export function Obj(properties: Map<string, Exp>): Obj {
  return {
    kind: "Exp.obj",
    properties,
    ...obj_evaluable(properties),
    ...obj_checkable(properties),
    repr: () => {
      const s = Array.from(properties)
        .map(([name, exp]) => `${name} = ${exp.repr()}`)
        .join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
  }
}
