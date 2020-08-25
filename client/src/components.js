// SPDX-License-Identifier: Apache-2.0

/* 
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here :https://github.com/delventhalz/transfer-chain-js/blob/master/client/src/components.js
 */

'use strict'

const $ = require('jquery')

// Add select option which may be set to selected
const addOption = (parent, value, selected = false) => {
  const selectTag = selected ? ' selected' : ''
  $(parent).append(`<option value="${value}"${selectTag}>${value}</option>`)
}

// Add a new table row with any number of cells
const addRow = (parent, ...cells) => {
  const tds = cells.map(cell => `<td>${cell}</td>`).join('')
  $(parent).append(`<tr>${tds}</tr>`)
}

//@luana
const addRowHolder = (parent, ...cells) => {
  const tds = cells.map(cell => `<td>${cell}</td>`).join('')
  if (cells[2] === "ON_PLACE") {
    $(parent).append(`<tr>${tds} <td><button class="updateButton" data-asset=${cells[0]} data-weight=${cells[1]} data-situation=${cells[2]} data-owner=${cells[3]} data-description=${cells[4]}>Update</button></td></tr>`)
  } else {
    $(parent).append(`<tr>${tds} <td><button class="updateButton" data-asset=${cells[0]} data-weight=${cells[1]} data-situation=${cells[2]} data-owner=${cells[3]} data-description=${cells[4]}>Update</button><button class="changeStateButton" data-asset=${cells[0]} data-weight=${cells[1]} data-situation=${cells[2]} data-owner=${cells[3]} data-description=${cells[4]}>Change State</button></td></td></tr>`)
  }
}

// Add div with accept/reject buttons
const addAction = (parent, label, action) => {
  $(parent).append(`<div>
  <span>${label}</span>
  <input class="accept btn btn-primary" type="button" value="Accept">
  <input class="reject btn btn-caution" type="button" value="Reject">
</div>`)
}

module.exports = {
  addOption,
  addRow,
  addRowHolder,
  addAction
}
