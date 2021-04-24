import 'reflect-metadata'
import { container } from 'tsyringe'
import { GitReporterController } from './gitReporter/gitReporter.controller'

export const gitReporter = container.resolve(GitReporterController)
