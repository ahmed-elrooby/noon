const validate = (schema) => {
  return (req, res, next) => {
    let inputs = { ...req.body, ...req.params, ...req.query };
    let { error } = schema.validate(inputs, { abortEarly: false });
    if (!error) return next();
    let errors = error.details.map((detail) => detail.message);
    res.json(errors);
  };
};
export default validate;
