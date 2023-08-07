import HyperExpress from 'hyper-express';

export const activityRouter = new HyperExpress.Router();

activityRouter.post('/', async (req, res) => {
  console.log('Activity log |', await req.json());
  res.status(200).send('200 ok');

  // res.status(422).send('422 unprocessable content'); // Invalid field data
});
