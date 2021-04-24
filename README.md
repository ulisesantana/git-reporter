# git-reporter

A command line tool for contribution reporting on git projects.

```shell
git-reporter ./smarthome

Report for: 
    smarthome

Total commits in the last 4 weeks: 30
Contributions by author:
    Ulises Santana (ulisesantana@gmail.com): 30
```

## Usage

You can see the commits uploaded on different branches and projects for a 
period of time. Run the command followed by the relative path to the 
different projects you want to check separated by spaces. For example:

```shell
git-reporter ./node ./lodash
```

Command line options:
```shell
USAGE: git-reporter [OPTION1] [OPTION2]... arg1 arg2...
The following options are supported:
  -a, --anonymize       	Anonymize author names and emails.
  -s, --slackUrl <ARG1> 	Slack url for publishing report.
  -w, --weeks <ARG1>    	Number of weeks in the past to look for commits. ("4" by default)
```

## Publishing on Slack

Create a Slack app and add a webhook. Use that url with `-s` or `--slack` 
option.
