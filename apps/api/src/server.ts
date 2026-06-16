import "dotenv/config";
import app from "./app";
import config from "./config";

const port = config.port;

app.listen(port, () => {
  console.log(`FinFlow API listening on port ${port}`);
});
