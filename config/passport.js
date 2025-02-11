import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/users/auth/google/callback',
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (!user) {
        // Create new user if doesn't exist
        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          userType: 'student', // default type
          password: 'googleauth' // placeholder password
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

export default passport; 