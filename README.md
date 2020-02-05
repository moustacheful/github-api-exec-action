# Github API exec action

Execute arbitrary commands on Github's API, using octokit, such as creating pull requests.

This just passes a payload to the JS Octokit library. If the command doesn't exist, it will fail. Other than that, it _should_ let you to do whatever you need with the GitHub API without having to create a new action.

**Disclaimer**: I'm not responsible if you nuke your whole repository/account/existence. Be responsible and create a scoped PAT that can only do what you need it to do!

If you do use `secrets.GITHUB_TOKEN` keep in mind the breadth of the [permissions given to this token](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret)

### Why?

Needed a quick way to execute GitHub's API commands, and GitHub's CLI doesn't seem to provide all possible commands (i.e. creating a PR, adding labels,etc.). This might work best for "prototyping" purposes, for which you can later create a proper action.

### Examples

Creating a pull request:

```yml
jobs:
  create-pr:
    runs-on: ubuntu-latest
    steps:
      - uses: moustacheful/github-api-exec-action@v0
        with:
          # This will add the repo name and owner to the payload
          withRepo: true
          # See https://octokit.github.io/rest.js/ for available commands
          command: pulls.create 
          # You can use interpolation here!
          payload: > 
            {
              "title": "Test PR by ${{ github.actor }}",
              "head": "feature/some-feature",
              "base": "master"
            }
          # The path of the result, this uses dot notation to access the data, for instance
          # for labels, we could use labels.0.name  to get the first label's name. If you want 
          # the whole response, just dont include this, and the result will be the whole json
          # You can later acess this data using the steps context 
          # https://help.github.com/en/actions/automating-your-workflow-with-github-actions/contexts-and-expression-syntax-for-github-actions#steps-context
          resultPath: 'number' 
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### TODO:

- Tests!
- Common derived data, maybe? (e.g. PR id -- stuff that might not be immeditely available without parsing first)