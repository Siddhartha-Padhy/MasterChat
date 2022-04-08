const users = []

function addUser(id, username, room) {
  const user = { id, username, room }
  users.push(user)
  return user
}

function getUser(id) {
  return users.find((user) => {
    return user.id === id
  })
}

function removeUser(id) {
  const index = users.indexOf(getUser(id))
  users.splice(index, 1)
}

function getTime() {
  const current = new Date()

  let hours = current.getHours()
  let minutes = current.getMinutes()
  let ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  let strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

function getAllUsers(room) {
  return users.filter((user) => {
    return room === user.room
  })
}

module.exports = {
  addUser,
  getUser,
  removeUser,
  getTime,
  getAllUsers,
}
