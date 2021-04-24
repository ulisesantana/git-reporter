#!/usr/bin/env node
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
  projects: {
    key: 'p',
    args: '*',
    description: 'List of project paths to check.',
    default: []
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
    allInDirectory: options.allInDirectory,
    anonymize: Boolean(options.anonymize),
    projects: options.projects,
    slackUrl: options.slackUrl,
    weeks: options.weeks
  })
  .catch(err => console.error(err.toString()))
