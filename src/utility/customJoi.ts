import JoiImport, { ExtensionFactory, AnySchema, CustomHelpers } from "joi";
import mongoose from "mongoose";

const objectIdExtension: ExtensionFactory = (joi) => ({
  type: "objectId",
  base: joi.any(),
  messages: {
    "objectId.invalid": '"{{#label}}" must be a valid MongoDB ObjectId',
  },
  validate(value: any, helpers: CustomHelpers): { value: any; errors?: Error } {
    if (mongoose.Types.ObjectId.isValid(value)) {
      return { value };
    }
    return { value, errors: helpers.error("objectId.invalid") };
  },
});

const CustomJoi = JoiImport.extend(objectIdExtension);

export default CustomJoi as typeof JoiImport & {
  objectId(): AnySchema;
};
