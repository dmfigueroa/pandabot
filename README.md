# Cual Panda Bot

[![es](https://img.shields.io/badge/lang-es-yellow.svg)](https://github.com/dmfigueroa/cual-panda-bot/blob/main/README.es.md)

This is just a simple bot made for jokes with the purpose to learn how Bun and Twitch auth flow works. It doesn't use Bun anymore but Node.js. I want to avoid any build steps if it is possible but Typescript is still used for the development.

> As I said before this was made for fun so even though there have been many changes I didn't pay much attention to best practices at first and some code may be not very readable or may not follow best practices. It will be improved progressively as I keep adding stuff though.

## Requirements

1. Node.js >= 20 - [docs](https://nodejs.org/en)
1. SQLite3
1. A Twitch application with Client and Secret ids - [docs](https://dev.twitch.tv/docs/irc/)

## Previous steps

### Environment files

You can look at the `.env.sample` file that contains the required environment variables to run the bot. The environment variables are validated so the bot won't run unless all the required are set.

### Required files

There are 2 JSON files necessary to run the bot. Both of them should be created on the root folder. The schema of these files will be validated and it will not run if it's invalid.

#### 1. Channels `channels.json`:

This file provides the information of all the channels where the bot runs and the features that each of them will have.

> Keep in mind that all the channels will use the same moderator credentials and in order to use the bot properly on some features you need moderator role.

##### Structure

```json
{
  "${channel}": {
    "broadcasterId": "21312312312",
    "features": ["feature1", "feature2"],
    "exclude": ["streamelements", "nightbot", "channel1", "channel2"]
  }
}
```

##### Supported features

- `cualPanda`: This is the reason the bot was created and just spams the words "Cuál panda?" to any user that writes the words "panda" on the channel.
- `banPoli`: This feature timeouts the user [Polipelon](https://www.twitch.tv/polipelon) for 1 second each time someone sends the "magic words" (see implementation)

> _Like I said this is just a joke and I have permission on every channel I add these features_

### How to start

Once you have all the required files you may run the following commands.

#### 1. Install dependencies

```bash
npm install
```

> You can use any other package manager like pnpm or yarn

#### 2. Create the database

The bot uses a SQLite database so it can store the token and update it from there. Running a migration will create the database and update the schema if it is changed. This will create the `sqlite.db` file.

```bash
npm run migrate
```

#### 3. Run the server

You can run the server using npm.

```bash
npm run start
```

Or [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/) if you want to keep it running as a service.

```bash
pm2 start src/index.js
```

#### 4. Login on Twitch

This is necessary only the first time the bot runs. The bot starts a server on localhost that will be used to get your credentials. Keep in mind that you need to register the callback URL on the Twitch developers console.

The bot will print the auth URL that will redirect to Twitch and store the tokens on the database.
