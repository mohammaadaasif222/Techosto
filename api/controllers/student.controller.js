import bcryptjs from "bcryptjs";
import Student from "../models/student.model.js";
import { errorHandler } from "../utils/error.js";

export const updateStudent = async (req, res, next) => {
  if (req.student.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account!"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          gravatar: req.body.gravatar,
          techStacks: req.body.techStacks,
          location: req.body.location,
          fieldOfIntrest: req.body.fieldOfIntrest,
          seeking: req.body.seeking,
          bio: req.body.bio,
          githubURL: req.body.githubURL,
          twitterURL: req.body.twitterURL,
          website_URL: req.body.website_URL,
          linkedinURL: req.body.linkedinURL,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedStudent._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteStudent = async (req, res, next) => {
  if (req.student.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account!"));
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("Student has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) return next(errorHandler(404, "Student not found!"));

    console.log(student);
    // const { password: pass, ...rest } = student._doc;

    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
};

export const allStudents = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    let query = {
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { seeking: { $regex: searchTerm, $options: "i" } },
        { techStacks: { $regex: searchTerm, $options: "i" } },
      ],
    };

    if (req.query.interest) {
      query.fieldOfIntrest = req.query.interest;
    }

    if (req.query.tech) {
      query.techStacks = req.query.tech;
    }

    if (req.query.seeking) {
      query.seeking = req.query.seeking;
    }

    const students = await Student.find(query)
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json(students);
  } catch (err) {
    next(err);
  }
};
