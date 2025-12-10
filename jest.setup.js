process.env.NODE_ENV = 'test';

// Import jest-dom matchers
require('@testing-library/jest-dom');

// Polyfill for TextEncoder/TextDecoder (required by react-router-dom v7 in jsdom)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;