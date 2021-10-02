import {Command, flags} from '@oclif/command'
import {version} from '../../../../package.json'
import {container} from 'tsyringe'
import {GitReportController} from '../git-report.controller'

export class GitReportCli extends Command {
  static strict = false

  static description = `A command line tool for contribution reporting on git projects. The
committers will be sorted based on contributions, taking into account
commits, files changed, insertions and deletions.`

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
    help: flags.help({char: 'h'}),
    slackUrl: flags.string({
      char: 's',
      description: 'Slack url for publishing report.',
      default: '',
    }),
    version: flags.version({char: 'v'}),
    weeks: flags.integer({
      char: 'w',
      description: 'Number of weeks in the past to look for commits.',
      default: 4,
    }),
  }

  async run(): Promise<void> {
    this.log(`Initializing git reporter ${version}`)
    const {
      argv: projects,
      flags: {
        anonymize,
        directory,
        slackUrl,
        weeks,
      },
    } = this.parse(GitReportCli)

    try {
      await container.resolve(GitReportController).exec({
        anonymize,
        directory,
        projects,
        slackUrl,
        weeks,
      })
    } catch (error) {
      this.error(error.toString())
    }
  }
}

