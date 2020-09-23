import * as Task from "../task"
import * as Value from "../../../value"
import chalk from "chalk"

export function repr(task: Task.Task): string {
  let s = ""
  s += task.grammar_name + ":" + task.choice_name
  s += "@" + task.index
  s += " -> "
  for (let i = 0; i < task.parts.length; i++) {
    if (i === task.program_counter) {
      s += chalk.bold(chalk.red("» "))
    }
    const { name, value } = task.parts[i]
    s += Value.present(value, {
      on_grammar: "only_show_name",
    })
    if (i < task.program_counter) {
      const { choice_name, index } = task.matched_indexes[i]
      if (choice_name) {
        s += `:${choice_name}@${index}`
      } else {
        s += `@${index}`
      }
    }
    s += " "
  }
  return s
}
