# micro-trackjs

`micro-trackjs` allows you to send [`micro`](https://github.com/zeit/micro) errors to [TrackJS](https://trackjs.com).

This little library was inspired it's "siblings" here:

https://github.com/amio/awesome-micro#loggers-errors--reporting

## Usage

```sh
npm i micro-trackjs
```

## Basic Example

```js
const trackjs = require("micro-trackjs");
const token = "your trackjs app token";

module.exports = trackjs(token)(async (req, res) => {
  throw Error("hello micro-trackjs");
});
```

## Example with options

See docs for full options:  
https://docs.trackjs.com/node-agent/sdk-reference/agent-options/

```javascript
const trackjs = require("micro-trackjs");
const token = "your trackjs app token";

module.exports = trackjs(key, { application: "my-application" })(
  async (req, res) => {
    throw Error("hellow micro-trackjs");
  }
);
```

## Development

```
git clone git@github.com:pauldariye/micro-trackjs.git
cd micro-trackjs && yarn # or npm install
yarn test
```

## Acknowledgements

- [micro-notify](https://github.com/pauldariye/micro-notify)
- [micro-sentry](https://github.com/tanmulabs/micro-sentry)

## License

MIT
