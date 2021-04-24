import { inject, injectable } from 'tsyringe'
import { GitReporterService } from './gitReporter.service'

@injectable()
export class GitReporterController {
  constructor (
    @inject(GitReporterService) private readonly service: GitReporterService
  ) {}

  async exec (projectPaths: string[]) {
    const report = await this.service.exec(projectPaths)
    console.log('Report for:')
    console.log(projectPaths.join('\n'))
    console.log(`Total commits: ${report.totalCommits}`)
    console.log('Contributions by author:')
    for (const { name, email, totalCommits } of report.committers) {
      console.log(`   ${name} (${email}): ${totalCommits}`)
    }
  }
}
