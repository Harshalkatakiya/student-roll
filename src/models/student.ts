import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IStudent extends Document {
  _id: mongoose.Types.ObjectId;
  __v?: number;
  enrollmentNumber?: number | string;
  firstName: string;
  lastName: string;
  fatherName?: string;
  division: string;
  program: string;
  mobileNumber?: number | string;
  rollNo?: number | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const StudentSchema: Schema<IStudent> = new mongoose.Schema(
  {
    enrollmentNumber: {
      type: Number,
      required: false
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    fatherName: {
      type: String,
      required: false
    },
    division: {
      type: String,
      required: false
    },
    program: {
      type: String,
      required: false
    },
    mobileNumber: {
      type: Number,
      required: true
    },
    rollNo: {
      type: Number,
      required: false
    }
  },
  {
    timestamps: true
  }
);

const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
