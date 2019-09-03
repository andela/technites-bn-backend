const router = require("express").Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../../swagger.json');

router.use("/api", require("./api"));
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

module.exports = router;
