#!/usr/bin/env node
const { gitReporterController } = require('../build')

const projectsPaths = process.argv.slice(2)

// TODO add options for time period
gitReporterController
  .exec(projectsPaths)
  .catch(err => console.error(err.toString()))
