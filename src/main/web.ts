import HyperExpress from 'hyper-express';

import { activityRouter } from '../routes/activity';
import { backupsRouter } from '../routes/backups';
import { installationRouter } from '../routes/installation';
import { serversRouter } from '../routes/servers';
import { sftpRouter } from '../routes/sftp';

const app = new HyperExpress.Server();

app.use((req, res, next) => {
  if (req.headers.origin) {
    res.header('vary', 'Origin');
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

app.options("/*", (req, res) => {
  res.send('');
});

app.use('/api/remote/activity', activityRouter);
app.use('/api/remote/backups/', backupsRouter);
app.use('/api/remote/servers/', installationRouter);
app.use('/api/remote/servers', serversRouter);
app.use('/api/remote/sftp/', sftpRouter);

app.all("*", (req, res) => {
  res.status(404).send("404 page not found");
});

app.listen(process.env.PORT ? parseInt(process.env.PORT) : 80)
  .catch((err: any) => console.error(err));
