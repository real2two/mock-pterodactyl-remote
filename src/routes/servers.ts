import HyperExpress from 'hyper-express';

export const serversRouter = new HyperExpress.Router();

serversRouter.get('/', (req, res) => {

});

serversRouter.post('/reset', (req, res) => {

});

serversRouter.post('/:uuid/transfer/success', (req, res) => {
  
});

serversRouter.post('/:uuid/transfer/failure', (req, res) => {
  
});
