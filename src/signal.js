/*
 * Copyright 2015 Paradone
 *
 * This file is part of Paradone <https://paradone.github.io>
 *
 * Paradone is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * Paradone is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public
 * License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Paradone.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @flow weak
 */
'use strict'

export default Signal

/**
 * Client-side implementation of Signal working with the ParadoneServer.
 *
 * @class Signal
 * @param {Peer} peer
 * @param {Object} options
 *
 * @property {WebSocket} socket - Connection to the signaling system
 */
function Signal(peer, options) {
  if(typeof options === 'undefined' ||
     typeof options.url === 'undefined') {
    throw new Error('Signal\'s options argument malformed')
  }
  var url = options.url
  var socket = new WebSocket(url)

  socket.addEventListener('open', () => this.status = 'open')
  socket.addEventListener('close', () => this.status = 'close')
  socket.addEventListener('error', (error) => console.error(error))
  socket.addEventListener('message', (event) => {
    var message = JSON.parse(event.data)
    peer.dispatchMessage(message)
  })

  this.socket = socket
}

/**
 * Sends message to the signaling system
 *
 * @function Signal#send
 * @param {Message} message
 */
Signal.prototype.send = function(message) {
  message.ttl = 0
  message = JSON.stringify(message)
  this.socket.send(message)
}
