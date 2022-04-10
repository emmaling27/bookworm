import { mutation, Id } from "@convex-dev/server";

// Nominate a book for a vote
// TODO: once we have auth, put name in here
export default mutation(({ db }, vote: Id, book: string) => {
  const nomination = {
    vote,
    book,
  };
  db.insert("nominations", nomination);
});
