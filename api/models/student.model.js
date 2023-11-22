import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name:String, 
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    gravatar: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    techStacks:Array,
    location: String,
    fieldOfIntrest: Array,
    seeking:Array,
    bio:String,
    githubURL:String,
    twitterURL:String,
    website_URL: String,
    linkedinURL:String,
  },
  { timestamps: true }
  
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
