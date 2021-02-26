import { Normal } from "../normal"

import { VarNeutral } from "../core"
import { ApNeutral } from "../core"
import { CarNeutral } from "../core"
import { CdrNeutral } from "../core"
import { AbsurdIndNeutral } from "../core"

export type Neutral = v | ap | car | cdr | nat_ind | replace | absurd_ind

type v = VarNeutral
export const v = (name: string): v => new VarNeutral(name)

type ap = ApNeutral
export const ap = (target: Neutral, arg: Normal): ap =>
  new ApNeutral(target, arg)

type car = CarNeutral
export const car = (target: Neutral): car => new CarNeutral(target)

type cdr = CdrNeutral
export const cdr = (target: Neutral): cdr => new CdrNeutral(target)

type nat_ind = {
  kind: "Neutral.nat_ind"
  target: Neutral
  motive: Normal
  base: Normal
  step: Normal
}

export const nat_ind = (
  target: Neutral,
  motive: Normal,
  base: Normal,
  step: Normal
): nat_ind => ({
  kind: "Neutral.nat_ind",
  target,
  motive,
  base,
  step,
})

type replace = {
  kind: "Neutral.replace"
  target: Neutral
  motive: Normal
  base: Normal
}

export const replace = (
  target: Neutral,
  motive: Normal,
  base: Normal
): replace => ({
  kind: "Neutral.replace",
  target,
  motive,
  base,
})

type absurd_ind = AbsurdIndNeutral
export const absurd_ind = (target: Neutral, motive: Normal): absurd_ind =>
  new AbsurdIndNeutral(target, motive)
