import { ConvexReactClient } from "@convex-dev/react";
import { Id } from "@convex-dev/server";
import convexConfig from "../convex.json";

export type Message = {
  _id: Id;
  channel: Id;
  body: string;
  author: string;
  time: number;
};

export type Channel = {
  _id: Id;
  name: string;
};

export const convex = new ConvexReactClient(convexConfig.origin);
