export function computePAO(openedAt: string, months: number) {
  const opened = new Date(openedAt)
  const end = new Date(opened)
  end.setMonth(end.getMonth() + months)
  const now = new Date()
  const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000*60*60*24)))
  return { end, daysRemaining }
}
