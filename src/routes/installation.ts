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
  
  console.log('Created server |', req.params.uuid);

  return res.json(createdServer);
  
  // res.status(404).json({ // The server was not found
  //   errors: [{
  //     code: 'RecordNotFoundException',
  //     status: '404',
  //     detail: '',
  //   }],
  // });
});

installationRouter.get('/:uuid/install', async (req, res) => {
  const installation = await getServerInstallation(req.params.uuid);
  if (!installation) return res.status(404).send('404 not found');
  
  res.json(installation);

  // res.status(404).json({ // The server was not found
  //   errors: [{
  //     code: 'RecordNotFoundException',
  //     status: '404',
  //     detail: '',
  //   }],
  // });
});

installationRouter.post('/:uuid/install', (req, res) => {
  console.log('Finished installation |', req.params.uuid, req.body);
  res.status(204).send('204 no content');

  // res.status(404).send('404 not found'); // The server was not found
});

installationRouter.post('/:uuid/transfer/success', (req, res) => {
  res.status(204).send('204 no content');

  // res.status(404).send('404 not found'); // The server was not found
  // res.status(409).send('409 conflict'); // The server is not being transferred
});

installationRouter.post('/:uuid/transfer/failure', (req, res) => {
  res.status(204).send('204 no content');

  // res.status(404).send('404 not found'); // The server was not found
  // res.status(409).send('409 conflict'); // The server is not being transferred
});
