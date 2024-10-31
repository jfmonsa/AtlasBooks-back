import { iterateObjectDeep } from "./iterateObjectDeep.js";
import Sqids from "sqids";

const sqids = new Sqids({
  minLength: 4,
  alphabet: process.env.SQIDS_ALPHABET,
});

function encodeId(rawId) {
  return sqids.encode([rawId]);
}

function decodeId(encodedId) {
  try {
    return sqids.decode(encodedId)[0];
  } catch (error) {
    console.error("Error decoding id", error);
  }
}

/**
 * Transforms IDs in an object (encoding/decoding based on the action).
 * @param {Object} data - The object to transform IDs in
 * @param {Function} transformFn - The transformation function (encode/decode)
 * @returns {Object} - The object with transformed IDs
 */
function transformIdsInObject(data, transformFn) {
  return iterateObjectDeep(data, (value, key) => {
    const isIdKey = key.includes("Id") || key === "id";
    if (isIdKey) {
      if (typeof value === "string" || typeof value === "number") {
        return { convertedKey: key, convertedValue: transformFn(value) };
      } else if (Array.isArray(value)) {
        return {
          convertedKey: key,
          convertedValue: value.map(val => transformFn(val)),
        };
      }
    }
    return { convertedKey: key, convertedValue: value };
  });
}

/**
 * Encodes IDs in an object
 * @param {Object} data - The object to encode IDs in
 * @returns {Object} - The object with encoded IDs
 */
export function encodeIdsInObject(data) {
  return transformIdsInObject(data, encodeId);
}

/**
 * Decodes IDs in an object
 * @param {Object} data - The object to decode IDs in
 * @returns {Object} - The object with decoded IDs
 */
export function decodeIdsInObject(data) {
  return transformIdsInObject(data, decodeId);
}

/**
 * Decodes IDs in a request object's body, query, and params
 * @param {Object} req - Express request object
 * @returns {Object} - Request object with decoded IDs
 */
export function decodeIdsOfRequest(req) {
  req.body = decodeIdsInObject(req.body);
  req.query = decodeIdsInObject(req.query);
  req.params = decodeIdsInObject(req.params);
  return req;
}
