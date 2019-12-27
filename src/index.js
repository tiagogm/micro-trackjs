const { send } = require("micro");
const Boom = require("boom");
const { TrackJS } = require("trackjs-node");

/**
 * Track-js micro middleware
 *
 * @param {sting} token
 * @param {object} opt - see https://docs.trackjs.com/node-agent/installation/#install-options
 * @returns function
 */
module.exports = exports = (token, opts = {}) => fn => {
  if (!token) {
    throw new Error(
      "micro-trackjs must be initialized with a TrackJS API key."
    );
  }

  if (!fn || typeof fn !== "function") {
    throw new Error("micro-trackjs must be passed a function.");
  }

  !TrackJS.isInstalled() && TrackJS.install(Object.assign({}, { token }, opts));

  return async function(req, res) {
    try {
      return await fn(req, res);
    } catch (error) {
      console.error(error);
      TrackJS.track(error);

      let status = res.statusCode || 500;

      if (error.isBoom) {
        status = error.output.statusCode;
      } else if (error.statusCode) {
        status = error.statusCode;
      }

      // Not sure if this is should the case in all cases, maybe should be an option passed in
      if (status < 400) {
        status = 500;
      }

      const err = error.isBoom
        ? Boom.boomify(error)
        : Boom.boomify(error, status);

      send(
        res,
        status,
        Object.assign({}, err.output.payload, err.data && { data: err.data })
      );
    }
  };
};
