// TODO: Add authentication handler that relies on JWTs signed with Blockcore Extension.
// Until then, we'll rely on API Key.

// import { getUser } from "../data/users";
// import { Handler } from "../types";

// export const login: Handler = (req, res) => {
//   const { username, password } = req.body;
//   const found = getUser({ username, password });

//   if (!found) {
//     return res.status(401).send("Login failed");
//   }

//   res.status(200).send("Success");
// };
