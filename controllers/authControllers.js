import express from 'express';
import authServices from '../services/authServices.js';
import authMiddleware from '../middleware/authMiddleware.js';

const userAuthRouter = express.Router();

userAuthRouter.post('/signup', async (req, res) => {
  try {
    let { userName, email, password } = req.body;

    // Check required fields
    if (!userName || !email || !password) {
      res.status(400).json({
        errors: {
          message: "All fields are required!",
          code: ["required"],
        },
      });
      return;
    }

    // Check password length
    if (password.length < 8 || password.length > 32) {
      res.status(400).json({
        errors: {
          message: "Password should be between 8 to 32 characters",
          code: ["not_valid"],
        },
      });
      return;
    }

    // Validate userName for letters only
    const namePattern = /^[A-Za-z]+$/;
    if (!namePattern.test(userName)) {
      res.status(400).json({
        errors: {
          message: "Username should contain only letters.",
          code: ["not_valid"],
        },
      });
      return;
    }

    // Check userName length
    if (userName.length > 25) {
      res.status(400).json({
        errors: {
          message: "Please enter a valid username.",
          code: ["not_valid"],
        },
      });
      return;
    }

    // Email pattern validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      res.status(400).json({
        errors: {
          message: "Please enter a valid email address.",
          code: ["400"],
        },
      });
      return;
    }
    const signupResponse = await authServices.SignUp(userName, email, password);

    if(signupResponse?.token && signupResponse?.refreshToken) {
      res.status(200).json({signupResponse});
    } else {
      res.status(400).json({signupResponse});
    }

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

userAuthRouter.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    // Check required fields
    if ( !email || !password) {
      res.status(400).json({
        errors: {
          message: "All fields are required!",
          code: ["required"],
        },
      });
      return;
    }

    // Check password length
    if (password.length < 8 || password.length > 32) {
      res.status(400).json({
        errors: {
          message: "Password should be between 8 to 32 characters",
          code: ["not_valid"],
        },
      });
      return;
    }

    // Email pattern validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      res.status(400).json({
        errors: {
          message: "Please enter a valid email address.",
          code: ["400"],
        },
      });
      return;
    }
    const loginResponse = await authServices.LogIn(email, password);

    if(loginResponse?.token && loginResponse?.refreshToken) {
      res.status(200).json({loginResponse});
    } else {
      res.status(400).json({loginResponse});
    }
    
  } catch (error) {
    console.log("Error:", error);
    res.status(422).json({
      errors: {
        body: ["User Login failed!", error.message],
        code: [error.code],
      },
    });
  }
});

userAuthRouter.post('/google-login', async (req, res) => {
  try {
    let { token } = req.body;

    if(!token) {
      return res.status(401).json({
      errors: {
        body: ["Authorization failed", "Token Required"],
        code: ["failedAuthentication"],
      },
    });
    }

    const loginResponse = await authServices.GoogleLogIn(token);

    if(loginResponse?.token && loginResponse?.refreshToken) {
      return res.status(200).json({loginResponse});
    } else {
      res.status(400).json({loginResponse});
    }
    
  } catch (error) {
    console.log("Error:", error);
    res.status(422).json({
      errors: {
        body: ["User Login failed!", error.message],
        code: [error.code],
      },
    });
  }
});

userAuthRouter.post('/github-login', async (req, res) => {
  try {
    let { code } = req.body;

    if(!code) {
      return res.status(401).json({
      errors: {
        body: ["Authorization failed", "Code Required"],
        code: ["failedAuthentication"],
      },
    });
    }

    const loginResponse = await authServices.GithubLogIn(code);

    if(loginResponse?.token && loginResponse?.refreshToken) {
      return res.status(200).json({loginResponse});
    } else {
      res.status(400).json({loginResponse});
    }
    
  } catch (error) {
    console.log("Error:", error);
    res.status(422).json({
      errors: {
        body: ["User Login failed!", error.message],
        code: [error.code],
      },
    });
  }
});

userAuthRouter.post('/logout', authMiddleware, async (req, res) => {
  try {
    let { logoutDevices, userId } = req.body;

    if(!userId || !logoutDevices) {
      return res.status(401).json({
      errors: {
        body: ["Logout Data Required"],
        code: ["dataRequired"],
      },
    });
    }

    const logoutResponse = await authServices.Logout(logoutDevices, userId);

    if(logoutResponse) {
      return res.status(200).json({logoutResponse});
    }
    
  } catch (error) {
    console.log("Error:", error);
    res.status(422).json({
      errors: {
        body: ["User Login failed!", error.message],
        code: [error.code],
      },
    });
  }
});

userAuthRouter.post('/refresh-token', async (req, res) => {
  try {
    let { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({
      errors: {
        body: ["Authorization failed", "No Authorization header"],
        code: ["failedAuthentication"],
      },
    });
  }
    const response = await authServices.updateAccessToken(refreshToken);

    if(response?.token) {
      res.status(200).json({response});
    } else {
      res.status(400).json({response});
    }
    
  } catch (error) {
    console.log("Error:", error);
    res.status(422).json({
      errors: {
        body: ["User Login failed!", error.message],
        code: [error.code],
      },
    });
  }
})

export default userAuthRouter;
