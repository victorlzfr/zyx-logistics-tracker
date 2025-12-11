"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.query = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433'),
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME || 'zyx_logistics',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};
const pool = new pg_1.Pool(poolConfig);
exports.pool = pool;
pool.on('connect', () => {
    console.log('Conectado ao banco de dados PostgreSQL');
});
pool.on('error', (err) => {
    console.error('Erro na conexão com o banco:', err);
});
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log(`Query executada em ${duration}ms: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
        return {
            rows: res.rows,
            rowCount: res.rowCount || 0
        };
    }
    catch (error) {
        console.error(`Erro na query: ${text}`, error);
        throw error;
    }
};
exports.query = query;
exports.default = { query, pool };
//# sourceMappingURL=connection.js.map