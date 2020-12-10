import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"

export function absurd_ind_evaluable(target: Exp, motive: Exp): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) =>
      Evaluate.do_absurd_ind(
        evaluator.evaluate(target, { mod, env, mode }),
        evaluator.evaluate(motive, { mod, env, mode })
      ),
  })
}
