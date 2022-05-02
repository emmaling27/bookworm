import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

// Delete a nomination
export default mutation(({ db }, nomination: Id) => {
  db.delete(nomination);
});
