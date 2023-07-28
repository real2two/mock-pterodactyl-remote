import HyperExpress from 'hyper-express';
import { validate } from 'uuid';
import { addServer, getServer, getServerInstallation } from '../lib/servers';

export const installationRouter = new HyperExpress.Router();

installationRouter.get('/:uuid', async (req, res) => {
  if (!validate(req.params.uuid)) return res.status(404).send('404 not found');

  const fetchedServer = await getServer(req.params.uuid);
  if (fetchedServer) return res.json(fetchedServer);

  const createdServer = await addServer({
    uuid: req.params.uuid,
    ip: '192.168.228.128',
    port: 25566 // WIP
  });
  
  console.log('Created server', req.params.uuid);

  return res.json(createdServer);
});

installationRouter.get('/:uuid/install', async (req, res) => {
  const installation = await getServerInstallation(req.params.uuid);
  if (!installation) return res.status(404).send('404 not found');
  
  res.json(installation);
});

installationRouter.post('/:uuid/install', (req, res) => {
  console.log('Finished installation', req.params.uuid, req.body);
  res.status(204).send('204 no content');
});

installationRouter.post('/:uuid/transfer/success', (req, res) => {
  
});

installationRouter.post('/:uuid/transfer/failure', (req, res) => {
  
});
