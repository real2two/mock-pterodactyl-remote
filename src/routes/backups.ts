import HyperExpress from 'hyper-express';

export const backupsRouter = new HyperExpress.Router();

backupsRouter.get('/:backup', (req, res) => {
  // res.status(200).json({
  //  parts: ['s3 url'],
  //  part_size: 0,
  // });

  res.status(400).json({
    errors: [{
      code: 'BadRequestHttpException',
      status: '400',
      detail: 'The configured backup adapter is not an S3 compatible adapter.',
    }],
  });

  // res.status(404).json({
  //   errors: [{
  //     code: 'NotFoundHttpException',
  //     status: '404',
  //     detail: 'The requested resource could not be found on the server.',
  //   }],
  // });
  
  // res.status(409).json({
  //   errors: [{
  //     code: 'ConflictHttpException',
  //     status: '409',
  //     detail: 'This backup is already in a completed state.',
  //   }],
  // });
});

backupsRouter.post('/:backup', (req, res) => {
  res.status(204).send('204 no content');

  // res.status(404).send('404 not found'); // The backup was not found
  // res.status(400).send('400 bad request'); // The backup is already in complete state
});

backupsRouter.post('/:backup/restore', (req, res) => {
  res.status(204).send('204 no content');

  // res.status(404).send('404 not found'); // The backup was not found
});
