import * as Exp from "../exp"
import process from "process"
import fs from "fs"

export function run(file: string, opts: any): void {
  const text = fs.readFileSync(file, { encoding: "utf-8" })
  const exp = Exp.parse(text)
  try {
    console.log(Exp.repr(Exp.normalize(exp)))
  } catch (error) {
    if (error instanceof Exp.Trace.Trace) {
      const trace = error
      console.log(Exp.Trace.repr(trace))
      process.exit(1)
    } else {
      throw error
    }
  }
}
