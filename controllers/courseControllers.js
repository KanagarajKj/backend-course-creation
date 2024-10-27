import express from 'express';
import courseService from '../services/courseService.js';
import authMiddleware from '../middleware/authMiddleware.js';

const courseDataRouter = express.Router();

courseDataRouter.post('/create-course', authMiddleware, async (req, res) => {
  try {
    const { data } = req.body;

    if (data) {
      return res.status(404).json({
        message: "Course Data Required"
      });
    }

    const requiredFields = [
      'title',
      'chapter',
    //   'level',
    //   'description',
    //    'faq',
    //   'coverImage',
    //   'salesVideo'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields
      });
    }
    const courseData = await courseService.createCourse(data);
    res.status(201).json({ data: courseData });
  } catch (error) {
    console.error("Error in create course controller:", error);
    res.status(500).json({
      message: "An error occurred while creating the course",
      error: error.message
    });
  }
});

export default courseDataRouter;
