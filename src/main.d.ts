export type RangeResult = string[];
export type GetRangeFnc = (count: number) => RangeResult;
export type RangeFactory = (start: number) => GetRangeFnc;
export type TextPastryCommand = () => void | Promise<void>;
