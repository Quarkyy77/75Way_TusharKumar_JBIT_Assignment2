"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongo_url = process.env.MONGO_URL;
const db_name = process.env.DB_NAME;
exports.dbConnect = mongoose_1.default
    .connect(mongo_url || " ", {
    dbName: db_name,
})
    .then(() => {
    console.log("Connected to MongoDB Database");
})
    .catch((err) => {
    console.log("Could not connect to database", err);
});
