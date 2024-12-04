/**
 * To-Do Item Schemas.
 */
const Joi = require('joi');

const todoSchema = Joi.object({
  id: Joi.number().min(0).required(),
  data: Joi.string().min(1).max(32).required(),
  completed: Joi.boolean().default(false),
  completed_timestamp: Joi.number().min(0).allow(null).default(0)
});


const todosSchema = Joi.array().unique();

module.exports = {todoSchema, todosSchema};
