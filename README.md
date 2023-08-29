This frontend aims to completly replace the old frontend, as it was a mix
of SSR and dynamic rendering through inlnie vanilla JS. This new frontend
aims to use a more modern approach of developing a web frontend, while trying
to stay minimalistic, performant and target mobile devices better.

In order to run the frontend, you just need NodeJS.

```shell
npm run dev
```

If you wish to test against a live scribble.rs instance, you can spin up a local
instance. First you should place this `.env` file in your working directory:

```dotenv
NETWORK_ADDRESS=localhost
LOBBY_SETTING_DEFAULTS_PUBLIC=true
LOBBY_SETTING_DEFAULTS_CLIENTS_PER_IP_LIMIT=4
CORS_ALLOWED_ORIGINS=http://localhost:4173,http://localhost:5173,http://localhost:8080
CORS_ALLOW_CREDENTIALS=true
LOBBY_CLEANUP_INTERVAL=0
```

*Note that this config is not recommended for production use.*

Then run in the same directory you've placed the `.env` file in:

```shell
go run github.com/scribble-rs/scribble.rs/cmd/scribblers
```

Alternatively, head to the scribble.rs repository and check out how to start
the docker container.
