import Joi from "joi";
const createBrandSchema = Joi.object({
  name: Joi.string().required().min(3),
});

const getSingleBrandSchema = Joi.object({
  id: Joi.string().required().hex().length(24),
});
const updateBrandSchema = Joi.object({
  name: Joi.string().min(3),
  id: Joi.string().required().hex().length(24),
});
export { createBrandSchema, getSingleBrandSchema, updateBrandSchema };
