import {Command, flags} from '@oclif/command'
import {container} from 'tsyringe'
import {GitReportController} from '../git-report.controller'
import {GitReportCliPrinter} from './git-report.cli.printer'

export class GitReportCli extends Command {
  static strict = false

  static description = 'A command line tool for contribution reporting on git projects. The committers will be sorted based on contributions, taking into account commits, files changed, insertions and deletions.'

  static flags = {
    anonymize: flags.boolean({
      char: 'a',
      description: 'Anonymize author names and emails.',
      default: false,
    }),
    directory: flags.string({
      char: 'd',
      description: 'Search for all git projects in a directory.',
      default: '',
    }),
    forceUpdate: flags.boolean({
      char: 'f',
      description: 'Update git projects before generating report.',
      default: false,
    }),
    help: flags.help({char: 'h'}),
    slackUrl: flags.string({
      char: 's',
      description: 'Slack url for publishing report.',
      default: '',
    }),
    verbose: flags.boolean({
      description: 'Set multiline committer contribution info displaying total insertions and deletions. Otherwise the committer contribution info is display in one line with total commits and total files changed.',
      default: false,
    }),
    version: flags.version({char: 'v'}),
    weeks: flags.integer({
      char: 'w',
      description: 'Number of weeks in the past to look for commits.',
      default: 4,
    }),
  }

  async run(): Promise<void> {
    const printer = container.resolve(GitReportCliPrinter)
    printer.printInit()
    const {
      argv: projects,
      flags: {
        anonymize,
        directory,
        forceUpdate,
        slackUrl,
        verbose,
        weeks,
      },
    } = this.parse(GitReportCli)

    try {
      await container.resolve(GitReportController).exec({
        anonymize,
        directory,
        forceUpdate,
        projects,
        slackUrl,
        verbose,
        weeks,
      })
    } catch (error) {
      printer.error(error.toString())
    }
  }
}

