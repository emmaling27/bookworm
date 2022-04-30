import { ConvexReactClient } from "convex-dev/react";
import convexConfig from "../convex.json";

export const convex = new ConvexReactClient(convexConfig.origin);

