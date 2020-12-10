import { Evaluable, EvaluationMode } from "../../evaluable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import { dot_evaluable } from "./dot-evaluable"

export type Dot = Evaluable &
  Repr & {
    kind: "Exp.dot"
    target: Exp
    name: string
  }

export function Dot(target: Exp, name: string): Dot {
  return {
    kind: "Exp.dot",
    target,
    name,
    ...dot_evaluable(target, name),
    repr: () => `${target.repr()}.${name}`,
  }
}
