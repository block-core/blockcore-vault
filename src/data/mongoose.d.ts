import { Types, Document } from 'mongoose';

export type ID = Types.ObjectId;

export type Populated<M, K extends keyof M> =
    Omit<M, K> &
    {
        [P in K]: Exclude<M[P], ID[] | ID>
    }

export type UnPopulated<M, K extends keyof M> =
    Omit<M, K> &
    {
        [P in K]: Extract<M[P], ID[] | ID>
    }

export type Select<M, K extends keyof M>
    = Pick<M, K> & Document