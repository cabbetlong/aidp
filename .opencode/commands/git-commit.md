---
description: Collect code modification information and submit a git commit once
agent: build
model: alibaba-coding-plan-cn/glm-4.7
---

## Execution Steps
1. Create a git commit
2. Fill in the git commit information
3. Submit the git commit
4. Execution completed. Only one git commit needs to be created per command execution

## Requirements
1. The number of code lines in a single commit must be less than 500. Line count is only applicable to .ts, .js, .vue files; test code and non-ts/js files are excluded from the line count.
2. Under the premise of satisfying requirement 1, submit as much code as possible in a single commit.
3. After each commit, the code must compile and run normally.
4. The commit format is as follows:
```text
[SR/DTS] $1
[Description] Description of this commit content. Summarize the code changes of this commit here.
[Author] $2
```
