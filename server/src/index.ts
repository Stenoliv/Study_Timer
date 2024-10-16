import dotenv from "dotenv";
import sequelize from "./db/connection";
import { Request, Response } from "express";
import app from "./app";

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

app.get("/health-check", (req: Request, res: Response) => {
  res.send("Ok");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
