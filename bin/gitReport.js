#!/usr/bin/env node
const { version } = require('../package.json')
const { getopt } = require('stdio')
const { gitReporter } = require('../build')

const options = getopt({
  allInDirectory: {
    key: 'a',
    args: 1,
    description: 'Search for all git projects in a directory',
    default: ''
  },
  anonymize: {
    description: 'Anonymize author names and emails.'
  },
  slackUrl: {
    key: 's',
    args: 1,
    description: 'Slack url for publishing report.',
    default: ''
  },
  weeks: {
    key: 'w',
    args: 1,
    description: 'Number of weeks in the past to look for commits.',
    default: 4
  },
  version: {
    key: 'v',
    args: 0,
    description: 'Return the version for git-reporter.'
  }
})

if (options.version) {
  console.log(version)
} else {
  console.log(`Initializing git reporter ${version}`)
  gitReporter
    .exec({
      allInDirectory: options.allInDirectory,
      anonymize: Boolean(options.anonymize),
      projects: Array.isArray(options.args) ? options.args : [],
      slackUrl: options.slackUrl,
      weeks: options.weeks
    })
    .catch(err => console.error(err.toString()))
}
