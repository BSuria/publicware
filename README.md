## Playtime Leaderboards

your glitch (or alternative server) link e.g. http://a3-bryan-suria.glitch.me

- the goal of the application
- challenges you faced in realizing the application
- what authentication strategy you chose to use and why (choosing one because it seemed the easiest to implement is perfectly acceptable)
- what CSS framework you used and why
  - include any modifications to the CSS framework you made via custom CSS you authored

This application is a continuation of my the one I previously made for a2. It is a leaderboard website that lets users compare their
time playing certain games with anybody else. I used passport-local authentication because it was the first one that was required and I didn't want
to change after I started implementing it when it wasn't required anymore. What troubled me the most with this was trying to use it with mongodb
since most of the documentation that I could find was in SQL, it took me a while to get it working. I used the NES.css css framework because
my website is mainly about video games and I thought a retro game theme would go along with that premise. My css modifications were mainly to center
the elements or change the font sizes

## Technical Achievements
- **Tech Achievement 1**: I used the passport-local method of authentication following this documentation https://www.passportjs.org/packages/passport-local/.
This documentation used a different database then the one I was using so I had to modify it heavily to work with mongodb.

- **Tech Achievement 2**: I used 3 middleware packages in this app.
    Passport: Authenticate users with Passport-local.
    session: To keep users logged in for the rest of their session.
    Crypto: To encrypt users' passwords.
