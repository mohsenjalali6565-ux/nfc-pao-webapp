export function getPAOEndDate(openedAt: string, paoMonths: number): Date {
  const openedDate = new Date(openedAt);
  const paoEndDate = new Date(openedDate);
  paoEndDate.setMonth(openedDate.getMonth() + paoMonths);
  return paoEndDate;
}
