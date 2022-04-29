import { ConvexReactClient } from "convex-dev/react";
import { Id } from "convex-dev/values";
import convexConfig from "../convex.json";

export const convex = new ConvexReactClient(convexConfig.origin);

export type User = {
  _id: Id;
  name: string;
  tokenIdentifier: string;
};

export type Nomination = {
  _id: Id;
  book: string;
  nominator: string;
  votes: number;
};

export type Group = {
  _id: Id;
  name: string;
  description: string;
  members: Set<string>;
  // Add optional member data field here?
  creator: Id;
}

export type GroupData = {
  group: Group,
  memberData: User[]
}