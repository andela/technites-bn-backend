/* eslint-disable no-unused-vars */
import dotenv from 'dotenv';
import passport from 'passport';
import { LocalStrategy } from 'passport-local';
import FacebookStrategy from 'passport-facebook';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import OAuthCallback from '../utils/OAuthCallback';

dotenv.config();

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: '/api/v1/auth/fb/callback',
  profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
}, OAuthCallback));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/v1/auth/google/callback'
}, OAuthCallback));

export default passport;
