import { Request, Response, Router } from "express";
import { Users } from "../../model/lib/user.model";
import jwt from "../../middleware/jwt";
import config from "../../helper/config";

class UserRoutes {
  getUsers() {
    return (req: Request, res: Response) => {
      Users.find()
        .then(data => {
          res.json(data);
        })
        .catch(error => {
          res.status(400).send({ message: error });
        });
    };
  }

  getUser() {
    return (req: Request, res: Response) => {
      const _id = req.params.id;

      Users.findById(_id)
        .then(data => {
          res.json(data);
        })
        .catch(error => {
          res.status(400).send({ message: error });
        });
    };
  }

  addUser() {
    return (req: Request, res: Response) => {
      const { name, account_type, password } = req.body;
      const user = new Users({ name, account_type, password });

      user
        .save()
        .then(data => {
          res.json({ data, message: "Added User!" });
        })
        .catch(error => {
          res.status(400).send({ message: error });
        });
    };
  }

  updateUser() {
    return (req: Request, res: Response) => {
      const _id = req.params.id;
      const body = req.body;

      Users.findByIdAndUpdate(_id, body)
        .then(data => {
          res.json({ data, message: "Updated User!" });
        })
        .catch(error => {
          res.status(400).send({ message: error });
        });
    };
  }

  deleteUser() {
    return (req: Request, res: Response) => {
      const _id = req.params.id;

      Users.findByIdAndRemove(_id)
        .then(data => {
          res.json({ data, message: "Deleted User!" });
        })
        .catch(error => {
          res.status(400).send({ message: error });
        });
    };
  }

  userLogin() {
    return (req: Request, res: Response) => {
      const { name, password } = req.body;

      Users.find({ name, password })
        .then(data => {
          const token = jwt.generateToken({ ...data }, config.SECRET, "30s");
          res.json({ token, message: "You are login" });
        })
        .catch(error => {
          res.status(400).send({ message: error });
        });
    };
  }
}

const router = Router();
const route = new UserRoutes();

router
  .get("", jwt.verifyToken, route.getUsers())
  .post("", jwt.verifyToken, route.addUser())
  .post("/login", route.userLogin())
  .delete("/:id", jwt.verifyToken, route.deleteUser())
  .get("/:id", jwt.verifyToken, route.getUser())
  .patch("/:id", jwt.verifyToken, route.updateUser());

export const user = router;
