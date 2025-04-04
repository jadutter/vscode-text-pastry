export type RangeNArgs = [number, number, number];
export type RangeEntry = string;
export type RangeResult = RangeEntry[];
export type GetNextRangeEntryFnc = () => RangeEntry;
export type GetRangeFnc = (count?: number) => RangeResult;
export type RangeFactory = (start: number) => GetRangeFnc;
export type TextPastryCommand = () => void | Promise<void>;
export type CreateRangeFactory = (...args: RangeNArgs) => GetNextRangeEntryFnc;
