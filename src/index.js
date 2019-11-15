/* eslint-disable no-irregular-whitespace */
/* eslint-disable import/no-cycle */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import methods from 'methods';
import express from 'express';
import morgan from 'morgan';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import errorhandler from 'errorhandler';
import * as Sentry from '@sentry/node';
import expressValidator from 'express-validator';
import path from 'path';
import http from 'http';
import socketIo from 'socket.io';
import cron from 'node-cron';
import { Op } from 'sequelize';
import passport from './config/passport';
import routes from './routes';
import errorLogger from './utils/ErrorLogger';
import initializeEventListeners from './utils/EventListeners';
import RoomService from './services/RoomServices';
import BookingCronJobs from './utils/BookingCronJobs';
import ChatService from './services/ChatServices';
import eventEmitter from './utils/EventEmitter';
dotenv.config();

const { bookings } = BookingCronJobs;
const { getRoomByDate, releaseBooking, changeRoomStatus } = RoomService;
const { storeChat } = ChatService;
const isProduction = process.env.NODE_ENV === 'production';
// Create global app object
const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer);

app.use(express.static(path.join(__dirname, '../client')));

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());

app.enable('trust proxy');

app.use(cors());
app.use(passport.initialize());
// Normal express config defaults
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride());

if (!isProduction) {
  app.use(errorhandler());
}
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && isProduction) {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

app.use('/api/v1/', routes);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.message = 'Not Found';
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => {
    errorLogger.error(err.stack);
    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}
const time = '59 * * * *';
bookings(time);

// production error handler
app.use(Sentry.Handlers.errorHandler());

// no stacktraces leaked to user
app.use((err, req, res, next) => {
  errorLogger.error(err.stack);
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

io.on('connection', (socket) => {
  socket.emit('welcome', 'Welcome to barefoot nomad');
  socket.on('message', async (message) => {
    const newChat = await storeChat(message);
    message.to = 'All';
    eventEmitter.emit('send_message', message);
  });
});

// finally, let's start our server...
const server = httpServer.listen(process.env.PORT || 3000, () => {
  initializeEventListeners();
  console.log(`Listening on port ${server.address().port}`);
});

export { io };

export default server;
