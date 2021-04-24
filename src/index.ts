import 'reflect-metadata'
import { container } from 'tsyringe'
import { GitReporterController } from './gitReporter/gitReporter.controller'

export const gitReporterController = container.resolve(GitReporterController)
