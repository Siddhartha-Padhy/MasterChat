const socket = io()

queries = window.location.search
let searchParams = new URLSearchParams(queries)
const username = searchParams.get('username')
const room = searchParams.get('room')
document.getElementById('room').textContent = room

socket.emit('connection')
socket.emit('setUser', { username, room })

function send_message() {
  message = document.getElementById('input-message').value
  document.getElementById('input-message').value = ''
  console.log(message)
  document.getElementById('input-message').focus()
  socket.emit('serveMessage', message)
}

socket.on('connect', () => {
  console.log(`Connected: ${socket.connected}`)
})

socket.on('participants', (data) => {
  participants = data.participants
  console.log(data.participants)
  document.getElementById('participants').value = ''
  let participants_list = ''
  participants.forEach((participant) => {
    participants_list += `
    <li>
      <i class="fa fa-user" aria-hidden="true" style="color: green"></i>&nbsp;
        ${participant.username}
    </li>
  `
  })
  document.getElementById('participants').innerHTML = participants_list
})

socket.on('notify', (data) => {
  message_box = document.getElementById('message-section')
  message_box.innerHTML =
    `
    <div class="notify">
      <p>
        ${data.message}&nbsp;<span id="time">${data.time}</span>
      </p>
    </div>
  ` + message_box.innerHTML
})

socket.on('message', (data) => {
  console.log(data.message)
  message_box = document.getElementById('message-section')
  message_box.innerHTML =
    `
    <div class="message">
      <h4>${data.user}<span id="time">${data.time}</span></h4>
      <p>
        ${data.message}
      </p>
    </div>
  ` + message_box.innerHTML
})
