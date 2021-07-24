import 'reflect-metadata'
import { container } from 'tsyringe'
import { GitReportController } from './gitReport/infrastructure/gitReport.controller'

export const gitReporter = container.resolve(GitReportController)
