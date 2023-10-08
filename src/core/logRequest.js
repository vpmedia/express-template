import logger from './logger.js';

/**
 * TBD.
 * @param {object} req - TBD.
 * @param {object} res - TBD.
 * @param {object} responseData - TBD.
 */
function logRequest(req, res, responseData) {
  logger.info({
    path: req.path,
    scheme: req.protocol,
    sid: req.sessionID,
    request_data: req.body,
    response_data: responseData,
  });
}

export default logRequest;
