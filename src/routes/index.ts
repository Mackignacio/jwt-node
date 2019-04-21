import { user } from "./lib/user.routes";

export class Routes {
  constructor(private app: any) {
    this.app = app;
  }

  setRoutes() {
    this.app.use("/user", user);
  }
}
