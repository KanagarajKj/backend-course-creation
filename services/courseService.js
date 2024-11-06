import Course from "../models/Course.js";

const createCourse = async (data) => {
  try {
    const { faq } = data;
    if (faq && Array.isArray(faq)) {
      const validFaqs = faq.filter(item => 
        item.question && item.answer && 
        item.question.trim() !== '' && 
        item.answer.trim() !== ''
      );
      if (validFaqs.length > 0) {
        data.faq = validFaqs;
      } else {
        delete data.faq;
      }
    } else {
      delete data.faq;
    }

    const course = new Course(data);
    const savedCourse = await course.save();
    return savedCourse;
  } catch (error) {
    console.error("Error in course creation:", error);
    return {
      message: "Course creation failed",
      code: "creationError",
      error: error.message,
    };
  }
};

const getCoursesByUserId = async (userId) => {
  try {
    const courses = await Course.find({ userId });
    
    const data = courses.map((course, index) => {
      const object = {
        id: course._id,
        ...course.toObject(),
        isOpen: index === 0,
      };
      delete object._id;
      return object;
    });
    
    return data;
  } catch (error) {
    console.error("Error in fetching courses by user ID:", error);
    throw new Error("Unable to fetch courses");
  }
};

export default {
  createCourse,
  getCoursesByUserId, 
};