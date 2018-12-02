import smartcar ,{Vehicle} from 'smartcar';
import log from '../../logger';

const {SMARTCAR_ID, SMARTCAR_SECRET, SMARTCAR_CALLBACK_URI, VEHICLE_ID} = process.env;
const auth = new smartcar.AuthClient({
  clientId: SMARTCAR_ID,
  clientSecret: SMARTCAR_SECRET,
  redirectUri: SMARTCAR_CALLBACK_URI || 'https://02b56390.ngrok.io/api/car/callback',
  scope: ['read_vehicle_info'],
  testMode: true, // launch the Smartcar auth flow in test mode
});

let credentials = {};


class CarController {
  refresh(){
    auth
  }

  login(req, res){
    const link = auth.getAuthUrl();
    log.debug(`redirecting users to ${link}`);
    res.redirect(link);
  }

  async garage(req, res) {
    try {
      res.json({succes: true, data: []});
      return cars;
    } catch(err){
      log.error(err)
      res.status(500).json({succes: false, err});
    }
  }

  async callback(req, res) {
    const {error, code} = req.query
    log.info('Receiving payload')
    if (error)
      return res.status(500).json({succes: fail, error});

    try {
      log.debug(`Fetching access token from payload using code: ${code}`);
      const access = await auth.exchangeCode(code);
      credentials = access;
      console.log(access);
      log.info('Successfully retrieved and configured the access token');

      log.debug('Fetching list of all available cars.');
      const ids = await smartcar.getVehicleIds(access.accessToken);

      log.debug(`Found: ${ids.vehicles.join()}`);

      const cars = ids.vehicles.map(id => new Vehicle(id, access.accessToken).info());
      res.json({success: true, data: await Promise.all(cars)});
    } catch(err) {
      log.error(err)
      res.status(500).json({succes: false, err});
    }
  }

  async lock(req, res) {
    const {accessToken} = credentials;
    try {
      log.info(`using access_token: ${accessToken} to fetch all vehicles`);
      const vehicles = await smartcar.getVehicleIds(accessToken);

      vehicles.map(id => {
        log.debug(`Locking vechicle with id: ${id}`);
        return new Vehicle(id, accessToken).lock();
      });

      res.json({success: true});
    } catch(err) {
      log.error(err)
      res.status(500).json({succes: false, err});
    }
  }

  async unlock(req, res) {
    const {accessToken} = credentials;
    try {
      log.info(`using access_token: ${accessToken} to fetch all vehicles`);
      const vehicles = await smartcar.getVehicleIds(accessToken);

      vehicles.map(id => {
        log.debug(`Locking vechicle with id: ${id}`);
        return new Vehicle(id, accessToken).unlock();
      });

      res.json({success: true});
    } catch(err) {
      log.error(err)
      res.status(500).json({succes: false, err});
    }
  }
}

export default new CarController();
