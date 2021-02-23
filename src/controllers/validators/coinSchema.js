const yup = require('yup')

const coinSchema = yup.object({
    pair: yup.string().required(),
    from: yup.number().required(),
    to: yup.number(),
    range: yup.number().test((value) => value === 20 || value === 50 || value === 200).required()
});

module.exports = coinSchema