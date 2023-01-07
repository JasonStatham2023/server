const timeZoneTimestamp = 10800000;
export const getCurrentMonthTimestamp = (): {
  toMonthStartTimestamp: number;
  toMonthEndTimestamp: number;
  currentTimestamp: number;
} => {
  // 巴西时间
  const brazilTimestamp = new Date().getTime() - timeZoneTimestamp;
  const brazilDate = new Date(brazilTimestamp);
  const brazilDateYear = brazilDate.getFullYear();
  const brazilDateMonth = brazilDate.getMonth() + 1;
  const toMonthStartTimestamp =
    new Date(brazilDateYear, brazilDateMonth - 1, 1).getTime() / 1000;
  const toMonthEndTimestamp =
    new Date(brazilDateYear, brazilDateMonth, 0).getTime() / 1000;
  return {
    toMonthStartTimestamp,
    toMonthEndTimestamp,
    currentTimestamp: (brazilTimestamp / 1000) | 0,
  };
};
