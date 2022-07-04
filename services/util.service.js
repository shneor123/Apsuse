export const utilService = {
    makeId,
    capitalFirstLetter,
    getTimeFromStamp,
    debounce,
    getYoutubeId,
    embedURL,
    getCurrencySign
  }
  
  function makeId(length = 6) {
    var txt = ''
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  
    for (var i = 0; i < length; i++) {
      txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
  }
  
  function capitalFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  
  function getTimeFromStamp(timestamp) {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    const months = [
      'January',
      'Febuary',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const date = new Date(timestamp)
    const time = timeFormat(date.getHours()) + ':' + timeFormat(date.getMinutes())
    const currTimestamp = Date.now()
    const currDate = new Date(currTimestamp)
    const day = 1000 * 60 * 60 * 24
    if (currTimestamp - timestamp < day) return 'Today ' + time
    if (currTimestamp - timestamp < day * 2) return 'Yesterday ' + time
    if (currTimestamp - timestamp < day * 7) return days[date.getDay()]
    if (currDate.getFullYear() !== date.getFullYear())
      return months[date.getMonth()].slice(0, 3) + ' ' + date.getFullYear()
    return date.getDate() + ' ' + months[date.getMonth()].slice(0, 3)
  }
  
  function debounce(func, wait) {
    let timeout
    return function (...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  function getYoutubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }
  
  function embedURL(url){
    return url.replace('https://www.youtube.com/watch?v=','')
  }
  
  function timeFormat(time) {
    return time < 10 ? '0' + time : time
  }
  
  function getCurrencySign(sign) {
    switch (sign) {
      case 'EUR':
        return '€'
      case 'ILS':
        return '₪'
      case 'USD':
        return '$'
      default:
        return ''
    }
  }
  