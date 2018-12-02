require('now-env')

import fs from 'fs';
import api from './api';
import log from './logger';

const { PORT=3000, APP_NAME='API'} = process.env;
const path = `${__dirname}/logs`;

!fs.existsSync(path) && fs.mkdirSync(path)
api.listen(PORT, () => log.info(`${APP_NAME} is up & running on port: ${PORT}`));
