import * as core from '@actions/core'
import { GitHub } from '@actions/github'
import _ from 'lodash';

export async function exec(octokit: GitHub, command: string, payload: {}, resultPath?: string): Promise<{}> {
    const fn = _.get(octokit, command, () => {
        throw new Error(`Command '${command}' does not exist in octokit!`);
    })

    if (typeof fn !== 'function') {
        throw new Error(`Command '${command}' is not a command to execute.`)
    }

    const result = await fn(payload).then((res: any) => res.data);

    core.debug("resultPath: " + resultPath)

    if (resultPath) {
        core.debug(
           "extracted: " + _.get(result, resultPath)
        )
        
        return _.get(result, resultPath)
    }

    return result
}
