const fs = require('fs');
const morgan = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`, {
  autoIndex: false,
  // useNewUrlParser: true,
  // useFindAndModify: false,
  // useUnifiedTopology: true,
});
mongoose.connection.on('error', (err) => {
  if (err) {
    throw new Error(`Unable to connect to database: ${err.toString()}`);
  }
});

const app = require('./config/express');
const helpers = require('./src/helpers');

if (process.env.NODE_ENV === 'production') {
  const dir = './logs';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  app.use(morgan('combined', {
    stream: fs.createWriteStream(`${__dirname}/logs/access.log`, { flags: 'a' }),
  }));
} else {
  app.use(morgan('dev'));
}

const routes = require('./src/modules/routes');

app.use('/admin', (req, res, next) => {
  res.locals.formatDate = helpers.formatDate;
  res.locals.truncateText = helpers.truncateText;

  res.locals.flash_messages = req.session.flash;
  delete req.session.flash;

  next();
});

app.use(routes);

const PORT = process.env.PORT || 3000;

const server = http.Server(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  console.log('a user connected');
  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('user disconnected');
  });
});
global.io = io;

server.listen(PORT, (err) => {
  if (err) {
    throw new Error(`Unable to list to port: ${err.toString()}`);
  }

  // eslint-disable-next-line no-console
  console.info(`🚀 Server running on http://${process.env.HOST}:${PORT}`);
});
