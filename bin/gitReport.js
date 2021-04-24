#!/usr/bin/env node
const { getopt } = require('stdio')
const { gitReporter } = require('../build')

const options = getopt({
  anonymize: {
    key: 'a',
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
  }
})

gitReporter
  .exec({
    anonymize: Boolean(options.anonymize),
    projects: options.args,
    slackUrl: options.slackUrl,
    weeks: options.weeks
  })
  .catch(err => console.error(err.toString()))
