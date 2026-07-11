import Joi from "joi";
let createCategorySchema = Joi.object({
  name: Joi.string().required().min(3),
});

let getCategorySchema = Joi.object({
  id: Joi.string().required().hex().length(24),
});
let updateCategorySchema = Joi.object({
  name: Joi.string().min(3),
  id: Joi.string().required().hex().length(24),
});
export { createCategorySchema, getCategorySchema, updateCategorySchema };
