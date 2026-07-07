const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        if (!email) {
          return done(new Error('No email returned from Google'), null);
        }

        // Check if a user with this Google ID already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if a local account with the same email exists — link them
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          user.provider = 'google';
          if (!user.avatarUrl && profile.photos?.[0]?.value) {
            user.avatarUrl = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }

        // Create a brand-new user via Google
        user = await User.create({
          name: profile.displayName || email.split('@')[0],
          email,
          googleId: profile.id,
          provider: 'google',
          role: 'donor',
          avatarUrl: profile.photos?.[0]?.value || '',
          isVerified: true // Google emails are already verified
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Minimal session serialization (we use JWT, not sessions long-term)
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
