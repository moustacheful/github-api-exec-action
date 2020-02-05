import * as core from '@actions/core'
import * as github from '@actions/github'
import { exec } from './exec'

async function run(): Promise<void> {
  try {
    const token: string = process.env.GITHUB_TOKEN || '';

    // Extract payload information and parse it.
    const payloadString = core.getInput('payload');
    const payload = JSON.parse(payloadString);

    // Extract command, which will be used as a path for the function to get
    const command: string = core.getInput('command');

    // Extract withRepo, which tells us whether we should add repo information on payload
    const withRepo: boolean = core.getInput('withRepo') === 'true';
    // Extract resultPath, if any
    const resultPath: string = core.getInput('resultPath');

    // Prepare the octokit with the token.
    const octokit = new github.GitHub(token);

    const finalPayload = {
      ...(withRepo && github.context.repo),
      ...payload
    }

    core.debug(`Payload: ${JSON.stringify(finalPayload, null, ' ')}`)

    const result = await exec(octokit, command, finalPayload, resultPath)

    core.debug(`result ${JSON.stringify(result)}`)

    core.setOutput('result',
      typeof result === 'object'
        ? JSON.stringify(result)
        : result.toString()
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
