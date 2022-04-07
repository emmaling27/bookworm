import { Id, mutation } from "@convex-dev/server";

// Create a new vote.
export default mutation(({ db }, name: string): Id => {
  return db.insert("votes", { name });
});