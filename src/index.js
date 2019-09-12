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
import expressValidator from 'express-validator';
import passport from './config/passport';
import routes from './routes';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// Create global app object
const app = express();

app.enable('trust proxy');

app.use(cors());
app.use(passport.initialize());
// Normal express config defaults
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
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
  err.status = 404;
  next(err);
});

// / error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use((err, req, res, next) => {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on port ${server.address().port}`);
});

export default server;
