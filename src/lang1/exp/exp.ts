import * as Stmt from "../stmt"
import * as Ty from "../ty"

import { Var } from "../exps/var"
import { Fn } from "../exps/fn"
import { Ap } from "../exps/ap"
import { Zero } from "../exps/zero"
import { Add1 } from "../exps/add1"

export type Exp = Var | Fn | Ap | Zero | Add1 | rec | begin | the

export type v = Var
export const v = Var

export type fn = Fn
export const fn = Fn

export type ap = Ap
export const ap = Ap

export type zero = Zero
export const zero = Zero

export type add1 = Add1
export const add1 = Add1

export type rec = {
  kind: "Exp.rec"
  t: Ty.Ty
  target: Exp
  base: Exp
  step: Exp
}

export const rec = (t: Ty.Ty, target: Exp, base: Exp, step: Exp): rec => ({
  kind: "Exp.rec",
  t,
  target,
  base,
  step,
})

export type begin = {
  kind: "Exp.begin"
  stmts: Array<Stmt.Stmt>
  ret: Exp
}

export const begin = (stmts: Array<Stmt.Stmt>, ret: Exp): begin => ({
  kind: "Exp.begin",
  stmts,
  ret,
})

export type the = {
  kind: "Exp.the"
  t: Ty.Ty
  exp: Exp
}

export const the = (t: Ty.Ty, exp: Exp): the => ({ kind: "Exp.the", t, exp })
