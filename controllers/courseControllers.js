import express from 'express';
import courseService from '../services/courseService.js';
import authMiddleware from '../middleware/authMiddleware.js';

const courseDataRouter = express.Router();

courseDataRouter.post('/create-course', authMiddleware, async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
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

courseDataRouter.get('/get-course/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the ID is provided
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    // Fetch course data
    const courseData = await courseService.getCoursesByUserId(userId);

    // Check if the course exists
    if (!courseData) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.status(200).json({ data: courseData });
  } catch (error) {
    console.error("Error in get course controller:", error);
    res.status(500).json({
      message: "An error occurred while fetching the course",
      error: error.message
    });
  }
});

export default courseDataRouter;
