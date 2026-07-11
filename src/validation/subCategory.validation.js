import Joi from "joi";

const createSubCategorySchema = Joi.object({
  name: Joi.string().required(),
});

const getSingleSubCategorySchema = Joi.object({
  id: Joi.string().required().hex().length(24),
});

const updateSubCategorySchema = Joi.object({
  name: Joi.string().min(3),
  id: Joi.string().required().hex().length(24),
});
export {
  createSubCategorySchema,
  getSingleSubCategorySchema,
  updateSubCategorySchema,
};
