import HyperExpress from 'hyper-express';

export const sftpRouter = new HyperExpress.Router();

interface RemoteApiError {
  code: string;
  status: string;
  detail: string;
  meta?: {
    source_field: string;
    rule: string;
  }
};

sftpRouter.post('/auth', async (req, res) => {
  const { type, username, password } = await req.json();
  console.log('SFTP authorization |', { type, username, password });

  let errors: RemoteApiError[] = [];

  if (type) {
    if (!['public_key', 'password'].includes(type)) {
      errors.push({
        code: 'ValidationException',
        status: '422',
        detail: 'The selected type is invalid.',
        meta: {
          source_field: 'type',
          rule: 'in',
        },
      });
    }
  }

  if (username == undefined) {
    errors.push({
      code: 'ValidationException',
      status: '422',
      detail: 'The username field is required.',
      meta: {
        source_field: 'username',
        rule: 'required',
      },
    });
  } else if (typeof username !== 'string') {
    errors.push({
      code: 'ValidationException',
      status: '422',
      detail: 'The username must be a string.',
      meta: {
        source_field: 'username',
        rule: 'string',
      },
    });
  }
  
  if (password == undefined) {
    errors.push({
      code: 'ValidationException',
      status: '422',
      detail: 'The password field is required.',
      meta: {
        source_field: 'password',
        rule: 'required',
      },
    });
  } else if (typeof username !== 'string') {
    errors.push({
      code: 'ValidationException',
      status: '422',
      detail: 'The password must be a string.',
      meta: {
        source_field: 'password',
        rule: 'string',
      },
    });
  }
  
  if (errors.length) res.status(422).json({ errors }); // Missing fields (ex. username, password)

  if (type !== 'public_key') {
    // Check password authorization here
  } else {
    // Check public_key authorization here
  }

  // res.status(403).json({ // Incorrect credentials
  //   errors: [{
  //     code: 'HttpForbiddenException',
  //     status: '403',
  //     detail: 'Authorization credentials were not correct, please try again.',
  //   }],
  // });

  res.status(200).json({
    user: 'user uuid here',
    server: 'server uuid here',
    permissions: ['*', 'admin.websocket.errors', 'admin.websocket.install', 'admin.websocket.transfer'],
  });
});
