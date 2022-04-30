/* eslint-disable */
// Generated by convex-dev@0.1.1
// based on the contents of this directory.
// To regenerate, run `convex codegen`.
import type addGroup from "./addGroup";
import type addGroupMember from "./addGroupMember";
import type addVote from "./addVote";
import type changeVote from "./changeVote";
import type endVoting from "./endVoting";
import type getGroupData from "./getGroupData";
import type getUser from "./getUser";
import type listGroups from "./listGroups";
import type listNominations from "./listNominations";
import type nominate from "./nominate";
import type removeGroupMember from "./removeGroupMember";
import type startVoting from "./startVoting";
import type storeUser from "./storeUser";

// This jumpstarts TypeScript completion of the convex-dev/values entry point.
import type { Id } from "convex-dev/values";
if ("VSCode" === "sees" + "that this module is imported") {
  const msg = "you get great autocompletion for" + ("Id" as unknown as Id);
  throw new Error("Unreachable");
}
import type { MutationCtx, QueryCtx } from "convex-dev/server";

type DropFirst<T extends unknown[]> = T extends [any, ...infer U] ? U : never;
type UndefinedToNull<T extends unknown> = T extends void ? null : T;

type ClientMutation<F extends (first: MutationCtx, ...args: any) => any> = (
  ...args: DropFirst<Parameters<F>>
) => UndefinedToNull<Awaited<ReturnType<F>>>;
type ClientQuery<F extends (first: QueryCtx, ...args: any) => any> = (
  ...args: DropFirst<Parameters<F>>
) => UndefinedToNull<Awaited<ReturnType<F>>>;

/**
 * A type describing your app's public Convex API.
 *
 * This `ConvexAPI` type includes information about the arguments and return
 * types of your app's query and mutation functions.
 *
 * This type should be used with type-parameterized classes like
 * `ConvexReactClient` to create app-specific types.
 */
export type ConvexAPI = {
  queries: {
    getGroupData: ClientQuery<typeof getGroupData>;
    getUser: ClientQuery<typeof getUser>;
    listGroups: ClientQuery<typeof listGroups>;
    listNominations: ClientQuery<typeof listNominations>;
  };
  mutations: {
    addGroup: ClientMutation<typeof addGroup>;
    addGroupMember: ClientMutation<typeof addGroupMember>;
    addVote: ClientMutation<typeof addVote>;
    changeVote: ClientMutation<typeof changeVote>;
    endVoting: ClientMutation<typeof endVoting>;
    nominate: ClientMutation<typeof nominate>;
    removeGroupMember: ClientMutation<typeof removeGroupMember>;
    startVoting: ClientMutation<typeof startVoting>;
    storeUser: ClientMutation<typeof storeUser>;
  };
};

import { makeUseQuery, makeUseMutation, makeUseConvex } from "convex-dev/react";

/**
 * Load a reactive query within a React component.
 *
 * This React hook contains internal state that will cause a rerender whenever
 * the query result changes.
 *
 * This relies on the {@link ConvexProvider} being above in the React component tree.
 *
 * @param name - The name of the query function.
 * @param args - The arguments to the query function.
 * @returns `undefined` if loading and the query's return value otherwise.
 */
export const useQuery = makeUseQuery<ConvexAPI>();

/**
 * Construct a new {@link ReactMutation}.
 *
 * Mutation objects can be called like functions to request execution of the
 * corresponding Convex function, or further configured with
 * [optimistic updates](https://docs.convex.dev/using/optimistic-updates).
 *
 * The value returned by this hook is stable across renders, so it can be used
 * by React dependency arrays and memoization logic relying on object identity
 * without causing rerenders.
 *
 * This relies on the {@link ConvexProvider} being above in the React component tree.
 *
 * @param name - The name of the mutation.
 * @returns The {@link ReactMutation} object with that name.
 */
export const useMutation = makeUseMutation<ConvexAPI>();

/**
 * Get the {@link ConvexReactClient} within a React component.
 *
 * This relies on the {@link ConvexProvider} being above in the React component tree.
 *
 * @returns The active {@link ConvexReactClient} object, or `undefined`.
 */
export const useConvex = makeUseConvex<ConvexAPI>();
