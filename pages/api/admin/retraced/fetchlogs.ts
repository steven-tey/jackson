import Chance from 'chance';
import * as Retraced from '@retraced-hq/retraced';
import { retracedOptions } from '@lib/env';
import { checkSession } from '@lib/middleware';

const chance = new Chance();

const actions = [
  'license.update',
  'spline.reticulate',
  'user.login',
  'release.promote',
  'wozniak.bore',
  'page.load',
];

const ips = ['192.168.1.1', '200.168.1.10', '12.18.12.13', '92.68.51.21'];

async function handler(req, res) {
  const actor_id = chance.guid();
  const actor_name = chance.name();

  //   use a random action
  const randomAction = actions[chance.integer({ min: 0, max: actions.length - 1 })];

  //   use random ips
  const randomIPs = ips[chance.integer({ min: 0, max: ips.length - 1 })];
  const { token, project } = req.query;

  const retraced = new Retraced.Client({
    apiKey: (token as string) || 'dev',
    projectId: (project as string) || 'dev',
    endpoint: retracedOptions?.host,
    viewLogAction: 'audit.log.view',
  });

  const team_id = req.query.group_id || 'dev';

  //   Report an event on every page load
  retraced.reportEvent({
    crud: 'u',
    action: randomAction,
    description: 'user <anonymous> reticulated the splines',
    created: new Date(),
    actor: {
      id: actor_id,
      name: actor_name,
    },
    group: {
      id: team_id,
      name: team_id,
    },
    sourceIp: randomIPs,
  });

  // Get A viewer token and send it to the client
  // the client will use this token to initialize the viewer
  console.log('Requesting viewer token for team', team_id);

  retraced
    .getViewerToken(team_id, '', true)
    .then((t) => res.send(JSON.stringify({ token: t, host: `${retracedOptions?.host}/viewer/v1` })))
    .catch((e) => {
      console.log(e);
      res.status(500).send({ error: 'An Unexpected Error Occured' });
    });
}

export default checkSession(handler);