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
          if (error.message.includes("Cast to ObjectId failed")) {
            res.status(400).send({ message: `User "${_id}" not found!` });
          } else {
            res.status(400).send({ message: error });
          }
        });
    };
  }

  addUser() {
    return (req: Request, res: Response) => {
      if (Object.entries(req.body).length === 0) {
        return res.status(400).send({ message: "Body is empty!" });
      } else if (typeof req.body.name === "undefined") {
        return res.status(400).send({ message: "Name is empty!" });
      } else if (typeof req.body.password === "undefined") {
        return res.status(400).send({ message: "Password is empty!" });
      } else if (typeof req.body.account_type === "undefined") {
        return res.status(400).send({ message: "Account Type is empty!" });
      } else {
        const user = new Users({ ...req.body });

        user
          .save()
          .then(data => {
            res.json({ data, message: "Added User!" });
          })
          .catch(error => {
            if (error.errmsg.includes("duplicate")) {
              res.status(400).send({ message: "User already exist!" });
            } else {
              res.status(400).send({ message: error });
            }
          });
      }
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
      try {
        Users.findByIdAndRemove(_id)
          .then(data => {
            if (data === null) {
              res.status(404).send({ message: `Can't delete ID of ${_id} because its not exist!` });
            } else {
              res.json({ data, message: "Deleted User!" });
            }
          })
          .catch(error => {
            res.status(400).send({ message: error });
          });
      } catch (error) {
        res.status(400).send({ message: error });
      }
    };
  }

  userLogin() {
    return (req: Request, res: Response) => {
      if (Object.entries(req.body).length === 0) {
        return res.status(400).send({ message: "Body is empty!" });
      } else if (typeof req.body.name === "undefined") {
        return res.status(400).send({ message: "Name is empty!" });
      } else if (typeof req.body.password === "undefined") {
        return res.status(400).send({ message: "Password is empty!" });
      } else {
        const { name, password } = req.body;

        Users.findOne({ name, password })
          .then(data => {
            if (data === null) {
              res.status(400).send({ message: "Incorrect username and password!" });
            } else {
              const token = jwt.generateToken({ name, password }, config.SECRET, "30s");
              res.json({ token, message: "You are login" });
            }
          })
          .catch(error => {
            console.log(error);

            res.status(400).send({ message: error });
          });
      }
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
