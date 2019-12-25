package xieyuheng.cicada

import scala.util.{ Try, Success, Failure }
import collection.immutable.ListMap

import xieyuheng.util.console._

import eval._
import check._
import infer._
import pretty._
import equivalent._

object api {

  def run(
    top_list: List[Top],
    config: ListMap[String, List[String]],
  ): Unit = {
    try {
      top_list_check_and_eval(top_list, config)
    } catch {
      case report: Report =>
        report_print(report, config)
        System.exit(1)
    }
  }

  def report_print(
    report: Report,
    config: ListMap[String, List[String]],
  ): Unit = {
    console_print_with_color_when {
      config.get("--nocolor") == None
    } (Console.RED) {
      case () =>
        Console.println("------")
        report.message_list.foreach {
          case message =>
            Console.print(s"${message}")
            Console.println("------")
        }
    }
  }

  def top_list_check_and_eval(
    top_list: List[Top],
    config: ListMap[String, List[String]],
  ): Unit = {
    var local_env = Env()
    var local_ctx = Ctx()

    top_list.foreach {
      case TopLet(name, exp) =>
        val t = infer(local_env, local_ctx, exp)
        val value = eval(local_env, exp)
        local_ctx = local_ctx.ext(name, t)
        local_env = local_env.ext(name, value)
        if (config.get("--verbose") != None) {
          println(s"let ${name} = ${pretty_exp(exp)}")
          console_print_with_color_when {
            config.get("--nocolor") == None
          } (Console.CYAN) {
            case () =>
              println(s"let ${name} = ${pretty_value(value)} : ${pretty_value(t)}")
              println()
          }
        }

      case TopDefine(name, t_exp, exp) =>
        val t_expected = eval(local_env, t_exp)
        check(local_env, local_ctx, exp, t_expected)
        val t = infer(local_env, local_ctx, exp)
        val value = eval(local_env, exp)
        local_ctx = local_ctx.ext(name, t)
        local_env = local_env.ext(name, value)
        if (config.get("--verbose") != None) {
          println(s"define ${name} : ${pretty_exp(t_exp)} = ${pretty_exp(exp)}")
          console_print_with_color_when {
            config.get("--nocolor") == None
          } (Console.CYAN) {
            case () =>
              println(s"define ${name} : ${pretty_value(t)} = ${pretty_value(value)}")
              println()
          }
        }

      case TopKeywordRefuse(exp, t_exp) =>
        val t_expected = eval(local_env, t_exp)
        Try {
          check(local_env, local_ctx, exp, t_expected)
        } match {
          case Success(()) =>
            throw Report(List(
              s"@refuse fail\n" +
                s"should refuse the following type membership assertion\n" +
                s"@refuse ${pretty_exp(exp)} : ${pretty_exp(t_exp)}\n"
            ))
          case Failure(_report: Report) =>
            if (config.get("--verbose") != None) {
              println(s"@refuse ${pretty_exp(exp)} : ${pretty_exp(t_exp)}")
            }
          case Failure(error) =>
            throw error
        }

      case TopKeywordAccept(exp, t_exp) =>
        val t_expected = eval(local_env, t_exp)
        Try {
          check(local_env, local_ctx, exp, t_expected)
        } match {
          case Success(()) =>
            if (config.get("--verbose") != None) {
              println(s"@accept ${pretty_exp(exp)} : ${pretty_exp(t_exp)}")
            }
          case Failure(report: Report) =>
            report_print(report, config)
            throw Report(List(
              s"@accept fail\n" +
                s"should accept the following type membership assertion\n" +
                s"@accept ${pretty_exp(exp)} : ${pretty_exp(t_exp)}\n"
            ))
          case Failure(error) =>
            throw error
        }

      case TopKeywordShow(exp) =>
        val t = infer(local_env, local_ctx, exp)
        val value = eval(local_env, exp)
        println(s"@show ${pretty_exp(exp)}")
        console_print_with_color_when {
          config.get("--nocolor") == None
        } (Console.CYAN) {
          case () =>
            println(s"@show ${pretty_value(value)} : ${pretty_value(t)}")
            println()
        }

      case TopKeywordEqual(rhs: Exp, lhs: Exp) =>
        infer(local_env, local_ctx, rhs)
        infer(local_env, local_ctx, lhs)
        Try {
          equivalent(local_ctx, eval(local_env, rhs), eval(local_env, lhs))
        } match {
          case Success(()) =>
            if (config.get("--verbose") != None) {
              println(s"@equal ${pretty_exp(rhs)} = ${pretty_exp(lhs)}")
            }
          case Failure(report: Report) =>
            report_print(report, config)
            throw Report(List(
              s"@equal fail\n" +
                s"should accept the following equivalent assertion\n" +
                s"@equal ${pretty_exp(rhs)} = ${pretty_exp(lhs)}\n"
            ))
          case Failure(error) =>
            throw error
        }

    }
  }

}
