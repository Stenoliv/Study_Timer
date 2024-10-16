import dotenv from "dotenv";
import sequelize from "./db/connection";
import { Request, Response } from "express";
import app from "./app";
import { User } from "./db/models/user.model";

dotenv.config();

const port = process.env.PORT || 5000;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database & Tables created!");
  })
  .catch((err) => {
    console.error("Error creating database: ", err);
  });

const users = [
  { username: "Test", email: "test@email.com", password: "1234" },
  { username: "Rasmus", email: "rasmus@mail.com", password: "1234" },
  { username: "Oliver", email: "oliver@mail.com", password: "1234" },
];

const saveUsers = async () => {
  for (const userData of users) {
    const user = new User(userData);
    user
      .save()
      .then(() => console.log(`User created: ${user.username}`))
      .catch((error) => {});
  }
};

saveUsers();

app.get("/health-check", (req: Request, res: Response) => {
  res.send("Ok");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
