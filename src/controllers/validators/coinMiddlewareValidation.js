const coinSchema = require("./coinSchema");

const validationMiddleware = async (req, res, next) => {
    const { pair } = req.params;
    const { from, to, range } = req.query

    try {
        await coinSchema.validate({ pair, from, to, range });
        next();
    } catch(e) {
        console.error(e);
        res.status(400).json({ error: e.errors.join(', ') });
    }
}

module.exports = { validationMiddleware }