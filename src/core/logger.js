import winston from 'winston';

const level = process.env.NODE_ENV === 'production' ? 'http' : 'debug';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.msZZ' }),
  winston.format.json()
);

const transports = [new winston.transports.File({ filename: 'logs/access.log', level: 'debug' })];

if (process.env.NODE_ENV !== 'production') {
  transports.push(new winston.transports.Console({ format: format }));
}

const logger = winston.createLogger({
  level,
  levels,
  format,
  transports,
});

export default logger;
