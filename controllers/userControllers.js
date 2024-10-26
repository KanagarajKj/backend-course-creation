import express from 'express';
import userServices from '../services/userServices.js';
import authMiddleware from '../middleware/authMiddleware.js';

const userDataRouter = express.Router();

userDataRouter.get('/me/:userId', authMiddleware, async (req, res) => {
  try {
      const { userId } = req.params;
      if (!userId) {
      return res.status(404).json({
        errors: {
          body: ["User ID not found"],
          code: ["USER_ID_NOT_FOUND"],
        },
      });
    }
    const userData = await userServices.getSingleUser(userId);
    res.status(200).json({data: userData});
  } catch (error) {
    console.log("Error:", error);
    res.status(422).json({
      errors: {
        body: ["User registration failed!", error.message],
        code: [error.code],
      },
    });
  }
});

export default userDataRouter;
