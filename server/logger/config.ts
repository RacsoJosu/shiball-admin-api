import winston from 'winston';
import 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
import colors from 'colors';
// Obtener fecha actual formateada
const now = dayjs();
const year = now.format('YYYY'); // "2025"
const month = now.format('MM'); // "06"
const day = now.format('DD'); // "26"

// Construir rutas
const logsDir = path.join('logs', 'errors', year, month);
const logFilePath = path.join(logsDir, `${day}.log`);

// Asegurar que las carpetas existen
fs.mkdirSync(logsDir, { recursive: true });
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: logFilePath,
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});
const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};
const logger = winston.createLogger({
  level: 'info',
  levels: logLevels,
  format: winston.format.combine(
    winston.format.errors({ stack: true }),

    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })
  ),
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),

        winston.format.printf(
          (info) =>
            `[${colors.magenta(`${info.timestamp}`)}] ${info.level}: ${info.message}`
        )
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: logFilePath,
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
      level: 'error',
      format: winston.format.json(),
    }),
  ],
});

export default logger;
