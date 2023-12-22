export function getCurrentDateTime() {
  const currentDate = new Date();
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, 
  };

  const formattedDateTime = new Intl.DateTimeFormat('en-GB', options).format(currentDate);

  return formattedDateTime;
}

