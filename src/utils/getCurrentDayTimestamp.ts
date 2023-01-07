// 设定巴西所在时区与 UTC 时间之间的时间差为 10800000 毫秒
const timeZoneTimestamp = 10800000;

export const getCurrentDayTimestamp = (): {
  toDayStartTimestamp: number;
  toDayEndTimestamp: number;
  currentTimestamp: number;
} => {
  // 巴西时间
  const brazilTimestamp = new Date().getTime() - timeZoneTimestamp;
  const brazilDate = new Date(brazilTimestamp);
  const brazilDateYear = brazilDate.getFullYear();
  const brazilDateMonth = brazilDate.getMonth() + 1;
  const brazilDateDay = brazilDate.getDate();
  const todayDate = `${brazilDateYear}-${brazilDateMonth}-${brazilDateDay}`;
  const toDayStartTimestamp = (new Date(todayDate).getTime() / 1000) | 0;
  const toDayEndTimestamp = toDayStartTimestamp + 86399;
  return {
    toDayStartTimestamp,
    toDayEndTimestamp,
    currentTimestamp: (brazilTimestamp / 1000) | 0,
  };
};
