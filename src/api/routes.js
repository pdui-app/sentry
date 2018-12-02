import express from 'express';
import log from '../logger';
import { UserController, CarController } from './controllers';

const temp = (req, res) => res.json({status: 'success', msg: 'Method not yet implemented', data: req.data});
const router = express.Router();

router.map = routes => {
  Object.keys(routes).forEach(path => {
    const route = router.route(path);
    Object.keys(routes[path])
      .forEach(action =>route[action](routes[path][action]) || temp)
  });
}

router.map({
  // '/healthcheck': {get: ''},
  '/user/:id': {
    get: UserController.findById,
    // post: ''
  },
  '/garage': {get: CarController.garage},
  '/car/login': {get: CarController.login},
  '/car/callback': {get: CarController.callback},
});

export default router;

