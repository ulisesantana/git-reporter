# git-reporter
[![Build Status](https://travis-ci.com/ulisesantana/git-reporter.png?branch=main)](https://travis-ci.com/ulisesantana/git-reporter)
[![codecov](https://codecov.io/gh/ulisesantana/git-reporter/branch/main/graph/badge.svg?token=6N32FMeuth)](https://codecov.io/gh/ulisesantana/git-reporter)

A command line tool for contribution reporting on git projects.

```shell
npx git-reporter smarthome -w 12 
(1/1) Read git log for smarthome

Report for: 
    smarthome

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
USAGE: git-reporter [OPTION1] [OPTION2]... arg1 arg2...
The following options are supported:
  -a, --allInDirectory <ARG1>   	Search for all git projects in a directory
  --anonymize                   	Anonymize author names and emails.
  -s, --slackUrl <ARG1>         	Slack url for publishing report.
  -w, --weeks <ARG1>            	Number of weeks in the past to look for commits. ("4" by default)
  -v, --version               	Return the version for git-reporter.
```

## ⚠️ Things to bear in mind

1. If any of the directories to analyze has uncommitted changes, the script 
   will fail.
1. For performing the git log across branches the script will perform a `git 
   fetch` and `git pull` right before reading the git log on each directory.

## Publishing on Slack

Create a Slack app and add a webhook. Use that url with `-s` or `--slack` 
option.
