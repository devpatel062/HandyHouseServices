const router = express.Router();

router.post("/logout", (req, res) => {
    res.cookie("token", "", { maxAge: 0 }).json({ message: "Logged out" });
  });
  