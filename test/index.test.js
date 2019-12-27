/*eslint no-unused-vars: off*/

jest.unmock("trackjs-node");
const { TrackJS } = require.requireActual("trackjs-node");
const listen = require("test-listen");
const fetch = require("isomorphic-fetch");
const micro = require("micro");

const trackjs = require("../src");

describe("micro-trackjs", () => {
  test("throws error if no API key provided", () => {
    expect(() => trackjs()()).toThrow(
      "micro-trackjs must be initialized with a TrackJS API key."
    );
  });

  test("throws error if no function provided", () => {
    const token = "sometoken";
    expect(() => trackjs(token)()).toThrow(
      "micro-trackjs must be passed a function."
    );
  });

  test("sends error to trackjs", async done => {
    const service = async (req, res) => {
      throw new Error("Test error send");
    };

    const token = "sometoken";
    const server = micro(trackjs(token)(service));
    const url = await listen(server);

    TrackJS.track = jest.fn();

    const response = await fetch(url);

    expect(TrackJS.track).toBeCalled();

    await server.close(done);
    done();
  });
});

test("works as expected if no errors", async done => {
  const service = async (req, res) => {
    return { message: "no error" };
  };

  const token = "sometoken";
  const server = micro(trackjs(token)(service));
  const url = await listen(server);

  TrackJS.track = jest.fn();

  const response = await fetch(url);
  const body = await response.json();

  expect(body.message).toBe("no error");

  await server.close(done);
  done();
});
