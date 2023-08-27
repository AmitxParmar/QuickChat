import { Schema, model, type Document } from "mongoose";

export interface IUser extends Document {
  fistname: string;
  lastname: string;
  email: string;
  password: string;
  userType: "Developer" | "Organization" | "Company";
  organization?: string;
  company?: string;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["developer", "organization", "company"],
      default: "developer",
    },
    organization: {
      type: String,
    },
    company: {
      type: String,
    },
    hostingType: {
      type: String,
      enum: ["xerocode", "self"],
    },
  },
  {
    timestamps: true,
  },
);

export default model("User", userSchema);
