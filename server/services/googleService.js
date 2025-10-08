import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findUserByEmail, createUser } from './userService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await findUserByEmail(email);

        if (!user) {
          const randomPassword = crypto.randomBytes(32).toString('hex');
          const hashedPassword = await bcrypt.hash(randomPassword, 12);

          user = await createUser({
            username: profile.displayName,
            email,
            password: hashedPassword,
            photo: profile.photos[0].value,
          });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: '7d',
        });

        return done(null, { user, token });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
