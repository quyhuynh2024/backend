
  import { Router } from "express";
import { login, logout, refreshToken, register } from "../controllers/AuthController";
  
  const router = Router();
  
  router.route("/register").post(register);
  router.route("/login").post(login);
  router.route("/refresh-token").post(refreshToken);
  router.route("/logout").delete(logout);
  
  export default router;