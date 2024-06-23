import mongoose from "mongoose";

const pulpJoinedSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    initiativeId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const Pulp = mongoose.model("Pulp", pulpJoinedSchema);
export default Pulp;
