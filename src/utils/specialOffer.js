import { FORTY_EIGHT_HOURS, FIVE_DAYS } from './constants'


export const checkAndManageSpecialOffer = (expirationTime, now) => {
  let newExpirationTime = expirationTime
  let isActive = false

  // If no expiration time exists (first time), create one (48 hours)
  if (!expirationTime) {
    newExpirationTime = now + FORTY_EIGHT_HOURS
    isActive = true
  }
  // If special offer is currently active
  else if (expirationTime > now) {
    isActive = true
  }
  // If special offer expired, check if 5 days have passed to reactivate
  else if (expirationTime <= now) {
    const timeSinceExpiration = now - expirationTime
    if (timeSinceExpiration >= FIVE_DAYS) {
      // Reactivate special offer (48 hours)
      newExpirationTime = now + FORTY_EIGHT_HOURS
      isActive = true
    }
  }

  return {
    expirationTime: newExpirationTime,
    isActive,
  }
}


export const formatTimeRemaining = (remaining) => {
  const hours = Math.floor(remaining / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}


export const getCurrentMonthDeal = (messages) => {
  const now = new Date()
  const monthIndex = now.getMonth()
  const monthKeys = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ]
  
  return `${messages[monthKeys[monthIndex]]} ${messages.deal}`
}

