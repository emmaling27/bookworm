import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

export default mutation(({ db }, name: string, description: String, creator: Id): Id => {
    // TODO: enforce uniqueness
  return db.insert("groups", { name, description, members: [creator], creator});
});