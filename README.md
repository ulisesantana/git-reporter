git-reporter
============

A command line tool for contribution reporting on git projects. The
committers will be sorted based on contributions, taking into account
commits, files changed, insertions and deletions.

[![Build Status](https://travis-ci.com/ulisesantana/git-reporter.svg?branch=master)](https://travis-ci.com/ulisesantana/git-reporter)
[![codecov](https://codecov.io/gh/ulisesantana/git-reporter/branch/master/graph/badge.svg?token=6N32FMeuth)](https://codecov.io/gh/ulisesantana/git-reporter)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/git-reporter.svg)](https://npmjs.org/package/git-reporter)
[![Downloads/week](https://img.shields.io/npm/dw/git-reporter.svg)](https://npmjs.org/package/git-reporter)
[![License](https://img.shields.io/npm/l/git-reporter.svg)](https://github.com/ulisesantana/git-reporter/blob/master/package.json)



```shell
npx git-reporter smarthome -w 12 
🔍 Starting to fetch git logs for: 
  - smarthome

PROGRESS | ████████████████████████████████████████ | 1/1 git projects loaded.
Report for:
  - smarthome


Total commits in the last 12 weeks: 17
Contributions by author:

    Ulises Santana (ulisesantana@gmail.com):
      Commits: 17
      Files changed: 127
      Insertions: 1337
      Deletions: 997
```

## Usage

You can see the commits uploaded on different branches and projects for a 
period of time. Run the command with followed by the relative 
path to the different projects you want to check separated by spaces. For 
example:

```shell
git-reporter ./node ./lodash
```

Other way to use the package is using `-a` option followed by the directory 
where you have all git projects you want to analyze. In this way the script 
will check all git projects inside the directory (only first level, it 
doesn't work recursively). Furthermore, this option ignore the paths passed 
as arguments.

```shell
git-reporter -a projects
```

Command line options:
```shell
Initializing git reporter 3.0.0

A command line tool for contribution reporting on git projects. The committers will be sorted based on contributions, taking into account commits, files changed, insertions and deletions.

USAGE
  $ git-reporter

OPTIONS
  -a, --anonymize            Anonymize author names and emails.
  -d, --directory=directory  Search for all git projects in a directory.
  -h, --help                 show CLI help
  -s, --slackUrl=slackUrl    Slack url for publishing report.
  -v, --version              show CLI version
  -w, --weeks=weeks          [default: 4] Number of weeks in the past to look for commits.
```

## ⚠️ Things to bear in mind

1. If any of the directories to analyze has uncommitted changes, the script 
   will fail.
1. For performing the git log across branches the script will perform a `git 
   fetch` and `git pull` right before reading the git log on each directory.

## Publishing on Slack

Create a Slack app and add a webhook. Use that url with `-s` or `--slack` 
option.
