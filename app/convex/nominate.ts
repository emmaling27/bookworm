import { mutation } from "convex-dev/server";
import { Id } from "convex-dev/values";

// Nominate a book for a vote
// TODO: once we have auth, put name in here
export default mutation(({ db }, vote: Id, book: string, user: Id) => {
  const nomination = {
    vote,
    book,
    user,
    votes: new Set([])
  };
  db.insert("nominations", nomination);
});
