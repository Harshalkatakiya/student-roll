import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAttendance extends Document {
  _id: mongoose.Types.ObjectId | string;
  __v?: number;
  studentId?: mongoose.Types.ObjectId[];
  date: string;
  lecture?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const AttendanceSchema: Schema<IAttendance> = new mongoose.Schema(
  {
    studentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: false
      }
    ],
    date: {
      type: String,
      required: true
    },
    lecture: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

const Attendance: Model<IAttendance> =
  mongoose.models.Attendance ||
  mongoose.model<IAttendance>('Attendance', AttendanceSchema);

export default Attendance;
