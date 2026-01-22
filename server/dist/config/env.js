"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.MONGO_URI = exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
const env = typeof process !== "undefined" && process.env ? process.env : {};
(0, dotenv_1.config)({ path: `.env.${env.NODE_ENV || "development"}.local` });
_a = process.env, exports.PORT = _a.PORT, exports.NODE_ENV = _a.NODE_ENV, exports.MONGO_URI = _a.MONGO_URI, exports.JWT_SECRET = _a.JWT_SECRET, exports.JWT_EXPIRES_IN = _a.JWT_EXPIRES_IN;
//# sourceMappingURL=env.js.map