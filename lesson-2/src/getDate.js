function getCurDateTime() {
  const date = new Date(Date.now());
  const dateStr = `${date.getFullYear()}.${('0'+(date.getMonth() + 1)).slice(-2)}.${('0'+date.getDate()).slice(-2)}`;
  const timeStr = `${('0' + date.getHours()).slice(-2)}:${('0' + date.getMinutes()).slice(-2)}:${('0' + date.getSeconds()).slice(-2)}`;
  return `${dateStr} ${timeStr}`;
}

module.exports = getCurDateTime;