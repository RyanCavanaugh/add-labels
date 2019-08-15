import * as core from '@actions/core';
import * as github from '@actions/github';

async function run() {
  try {
    const token = core.getInput('repo-token', { required: true });
    const labels = core.getInput('labels', { required: true }).split(",").map(s => s.trim());
    const issueOrPrNumber = getPrNumber();
    if (!issueOrPrNumber) {
      console.log('Could not get issue number from context, exiting');
      return;
    }

    const client = new github.GitHub(token);

    if (labels.length > 0) {
      await client.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        number: issueOrPrNumber,
        labels: labels
      });
    }

  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

function getPrNumber(): number | undefined {
  const pullRequest = github.context.payload.pull_request;
  if (pullRequest) return pullRequest.number;
  const issue = github.context.payload.issue;
  if (issue) return issue.number;
  return undefined;
}

run();
