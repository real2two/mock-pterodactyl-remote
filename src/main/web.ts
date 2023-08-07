import HyperExpress from 'hyper-express';

import { activityRouter } from '../routes/activity';
import { backupsRouter } from '../routes/backups';
import { serversRouter } from '../routes/servers';
import { installationRouter } from '../routes/installation';
import { sftpRouter } from '../routes/sftp';

const app = new HyperExpress.Server();

app.use((req, res, next) => {
  console.debug(`\n${req.method} ${req.path}${req.path_query ? `?${req.path_query}` : ''}`);
  
  // CORs
  if (req.headers.origin) {
    // TODO: Add a way to customize this, because leaving it like this is a security issue.
    res.header('vary', 'Origin');
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // Authorization
  console.log('Authorization token |', req.headers.authorization);
  // res.status(403).json({
  //   errors: [{
  //     code: 'AccessDeniedHttpException',
  //     status: '403',
  //     detail: 'You are not authorized to access this resource.',
  //   }],
  // });

  next();
});

app.options('/*', (req, res) => {
  res.send('');
});

app.use('/api/remote/activity', activityRouter);
app.use('/api/remote/backups', backupsRouter);
app.use('/api/remote/servers', serversRouter);
app.use('/api/remote/servers', installationRouter);
app.use('/api/remote/sftp', sftpRouter);

app.all('*', (req, res) => {
  res.status(404).send('404 page not found');
});

app.listen(process.env.PORT ? parseInt(process.env.PORT) : 80)
  .catch((err: any) => console.error(err));
