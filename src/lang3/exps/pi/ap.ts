import { Evaluable, EvaluationMode } from "../../evaluable"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Env from "../../env"
import * as Trace from "../../../trace"

export type Ap = Evaluable & {
  kind: "Exp.ap"
  target: Exp
  arg: Exp
}

export function Ap(target: Exp, arg: Exp): Ap {
  return {
    kind: "Exp.ap",
    target,
    arg,
    evaluability: ({ mod, env, mode }) =>
      Evaluate.do_ap(
        Evaluate.evaluate(mod, env, target, { mode }),
        Evaluate.evaluate(mod, env, arg, { mode })
      ),
  }
}
