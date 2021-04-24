# git-reporter

A command line tool for contribution reporting on git projects.

```shell
git-reporter -p ./smarthome

Report for: 
    smarthome

Total commits in the last 4 weeks: 30
Contributions by author:
    Ulises Santana (ulisesantana@gmail.com): 30
```

## Usage

You can see the commits uploaded on different branches and projects for a 
period of time. Run the command with `-p` option followed by the relative 
path to the different projects you want to check separated by spaces. For 
example:

```shell
git-reporter -p ./node ./lodash
```

Other way to use the package is using `-a` option followed by the directory 
where you have all git projects you want to analyze. In this way the script 
will check all git projects inside the directory (only first level, it 
doesn't work recursively).

```shell
git-reporter -a projects
```

Command line options:
```shell
USAGE: git-reporter [OPTION1] [OPTION2]... arg1 arg2...
The following options are supported:
  -a, --allInDirectory <ARG1>   	Search for all git projects in a directory
  --anonymize                   	Anonymize author names and emails.
  -p, --projects <ARG1>...<ARGN>	List of project paths to check. ("" by default)
  -s, --slackUrl <ARG1>         	Slack url for publishing report.
  -w, --weeks <ARG1>            	Number of weeks in the past to look for commits. ("4" by default)
```

## ⚠️ Things to bear in mind

1. If any of the directories to analyze has uncommitted changes, the script 
   will fail.
1. For performing the git log across branches the script will perform a `git 
   fetch` and `git pull` right before reading the git log on each directory.

## Publishing on Slack

Create a Slack app and add a webhook. Use that url with `-s` or `--slack` 
option.
