import { ConvexReactClient } from "convex-dev/react";
import { Id } from "convex-dev/values";
import convexConfig from "../convex.json";

export const convex = new ConvexReactClient(convexConfig.origin);

export type User = {
  _id: Id;
  name: string;
  tokenIdentifier: string;
};
