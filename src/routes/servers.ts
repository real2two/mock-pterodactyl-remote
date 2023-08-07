import HyperExpress from 'hyper-express';
import { getServers, getServerCount } from '../lib/servers';

export const serversRouter = new HyperExpress.Router();

serversRouter.get('/', async (req, res) => {
  // List servers
  const page = Number(typeof req.query['page'] === 'string' ? req.query['page'] : 0) || 0;
  const limit = Number(typeof req.query['per_page'] === 'string' ? req.query['per_page'] : 50) || 50;

  const servers = await getServers(page, limit);
  const serverCount = await getServerCount();
  const lastPage = Math.ceil(serverCount / limit);
  const to = ((page + 1) * limit) - 1;

  res.json({
    data: servers,
    links: {
      first: `${process.env.PANEL_URL}/api/remote/servers?page=1`,
      last: `${process.env.PANEL_URL}/api/remote/servers?page=1`,
      prev: page === 0 ? null : `${process.env.PANEL_URL}/api/remote/servers?page=${page - 1}`,
      next: page === lastPage ? null : `${process.env.PANEL_URL}/api/remote/servers?page=${page + 1}`,
    },
    meta: {
      current_page: page,
      from: page * limit,
      last_page: lastPage,
      links: [], // WIP - didn't finish links.
      path: `${process.env.PANEL_URL}/api/remote/servers`,
      per_page: limit,
      to: to > serverCount ? serverCount : to,
      total: serverCount,
    },
  });
});

serversRouter.post('/reset', (req, res) => {
  // This should reset all of the states of the server
  res.status(204).send('204 no content');
});
