export const formatToGraphQLDate = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date)
  }

  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2) // add leading zero if needed
  const day = ('0' + date.getDate()).slice(-2) // add leading zero if needed
  const hours = ('0' + date.getHours()).slice(-2) // add leading zero if needed
  const minutes = ('0' + date.getMinutes()).slice(-2) // add leading zero if needed
  const seconds = ('0' + date.getSeconds()).slice(-2) // add leading zero if needed
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

  return formattedDate
}
