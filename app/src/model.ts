import { Id } from "convex-dev/values";

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
    yesVote: boolean;
  };
  
  export type Group = {
    _id: Id;
    name: string;
    description: string;
    members: Set<string>;
    admins: Set<string>;
    // Add optional member data field here?
    creator: Id;
  }

  export type JoinRequest = {
    _id: Id;
    user: Id;
    group: Id;
  }
  
  export type GroupData = {
    group: Group;
    memberData: User[];
    openVote: Vote | null;
    votes: Vote[];
  }
  
  export type Vote = {
    _id: Id;
    name: string;
    creator: Id;
    group: Id;
    status: VoteStatus;
    time: number;
    winner: string;
  }
  
  export enum VoteStatus {
    Completed,
    Nominating,
    Voting,
    Canceled,
  }

  export type Message = {
      _id: Id,
      nomination: Id,
      body: string;
      author: string;
      time: number;
  }