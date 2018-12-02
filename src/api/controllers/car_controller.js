import smartcar ,{Vehicle} from 'smartcar';
import log from '../../logger';

const {SMARTCAR_ID, SMARTCAR_SECRET, SMARTCAR_CALLBACK_URI, VEHICLE_ID} = process.env;
const client = new smartcar.AuthClient({
  clientId: SMARTCAR_ID,
  clientSecret: SMARTCAR_SECRET,
  redirectUri: SMARTCAR_CALLBACK_URI || 'https://02b56390.ngrok.io/api/car/callback',
  scope: ['read_vehicle_info'],
  testMode: true, // launch the Smartcar auth flow in test mode
});


class CarController {
  constuctor(){
    this.access = {};
  }
  login(req, res){
    const link = client.getAuthUrl({state: 'MY_STATE_PARAM'});
    res.redirect(link);
  }

  async garage(req, res) {
    try {
      const ids = await smartcar.getVehicleIds(this.access.accessToken);
      const cars = ids.map(id => new Vehicle(ids[0], this.access.accessToken).info());
      res.json({succes: true, data: cars});
      return cars;
    } catch(err){
      log.error(err)
      res.status(500).json({succes: false, err});
    }
  }

  async callback(req, res) {
    if (req.query.error)
      return next(new Error(req.query.error));

    try {
      const access = await client.exchangeCode(req.query.code);

      this.access = access;
      res.json("We successfully registered your vehicle, you can now close the the browser");
    } catch(err) {
      log.error(err)
      res.status(500).json({succes: false, err});
    }
  }

  async lock(req, res) {
    try {
      const vehicles = await smartcar.getVehicleIds(this.access.accessToken);
      const car = new Vehicle(vehicles[0], this.access.accessToken).info();

      this.access = access;
      res.json(vehicles);
    } catch(err) {
      log.error(err)
      res.status(500).json({succes: false, err});
    }
  }
}

export default new CarController();
