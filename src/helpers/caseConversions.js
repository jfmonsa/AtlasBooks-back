import { iterateObjectDeep } from "./iterateObjectDeep.js";

/**
 * @file utility functions to convert objects from camelCase to snake_case and vice versa
 * for db operations
 */

export const camelToSnake = str =>
  str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const snakeToCamel = str =>
  str.replace(/_[a-z]/g, letter => letter[1].toUpperCase());

export const camelToSnakeObjectDeep = obj =>
  iterateObjectDeep(obj, (value, key) => ({
    convertedKey: camelToSnake(key),
    convertedValue: value,
  }));

export const snakeToCamelObjectDeep = obj =>
  iterateObjectDeep(obj, (value, key) => ({
    convertedKey: snakeToCamel(key),
    convertedValue: value,
  }));
