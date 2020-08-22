// SPDX-License-Identifier: Apache-2.0

/* 
This code was written by Zac Delventhal @delventhalz. 
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/client/src/app.js
 */
 
'use strict'

const $ = require('jquery')
const {
  getKeys,
  makeKeyPair,
  saveKeys,
  getState,
  submitUpdate
} = require('./state')
const {
  addOption,
  addRow,
  addAction,
  teste
} = require('./components')
const concatNewOwners = (existing, ownerContainers) => {
  return existing.concat(ownerContainers
    .filter(({ owner }) => !existing.includes(owner))
    .map(({ owner }) => owner))
}

// Application Object
const app = { user: null, keys: [], assets: [], transfers: [] }

app.refresh = function () {
  getState(({ assets, transfers }) => {
    this.assets = assets
    this.transfers = transfers

    // Clear existing data views
    $('#assetList').empty()
    $('#transferList').empty()
    $('[name="assetSelect"]').children().slice(1).remove()
    $('[name="transferSelect"]').children().slice(1).remove()

    // Populate asset views
    assets.forEach(asset => {
      addRow('#assetList', asset.name, asset.weight, asset.situation, asset.owner, asset.description)//@luana
      if (this.user && asset.owner === this.user.public) {
        addOption('[name="assetSelect"]', asset.name)
      }
    })

    // Populate transfer list for selected user
    transfers.filter(transfer => transfer.owner === this.user.public)
      .forEach(transfer => addAction('#transferList', transfer.asset, 'Accept'))

    // Populate transfer select with both local and blockchain keys
    let publicKeys = this.keys.map(pair => pair.public)
    publicKeys = concatNewOwners(publicKeys, assets)
    publicKeys = concatNewOwners(publicKeys, transfers)
    publicKeys.forEach(key => addOption('[name="transferSelect"]', key))
  })
}

app.update = function (action, asset, weight, situation, description, owner) {//@luana add atributes
  if (this.user) {
    submitUpdate(
      { action, asset, weight, situation, description, owner},
      this.user.private,
      success => success ? this.refresh() : null
    )
  }
}

// Select User
$('[name="keySelect"]').on('change', function () {
  if (this.value === 'new') {
    app.user = makeKeyPair()
    app.keys.push(app.user)
    saveKeys(app.keys)
    addOption(this, app.user.public, true)
    addOption('[name="transferSelect"]', app.user.public)
  } else if (this.value === 'none') {
    app.user = null
  } else {
    app.user = app.keys.find(key => key.public === this.value)
    app.refresh()
  }
})

// Create Asset
$('#createSubmit').on('click', function () {//@luana 
  const asset = $('#createName').val()
  const weight = $('#createWeight').val()
  const description = $('#createDescription').val()
  if (asset && weight && description) app.update('create', asset, weight, "ON_WAY", description)
})

// Transfer Asset
$('#transferSubmit').on('click', function () {
  const asset = $('[name="assetSelect"]').val()
  const owner = $('[name="transferSelect"]').val()
  if (asset && owner) app.update('transfer', asset, owner)
})

// Accept Asset
$('#transferList').on('click', '.accept', function () {
  const asset = $(this).prev().text()
  if (asset) app.update('accept', asset)
})

$('#transferList').on('click', '.reject', function () {
  const asset = $(this).prev().prev().text()
  if (asset) app.update('reject', asset)
})

//update Asset @luana 
$('#assetList').on('click', '.updateButton', function () {
  var asset = $(this).data('asset');
  var weight = $(this).data('weight');
  var situation = $(this).data('situation');
  var owner = $(this).data('owner');

    var updateDialog = document.getElementById('updateDialog');
    var cancelButton = document.getElementById('cancel');
    var submitButton = document.getElementById('submit');

    updateDialog.showModal();
  
    submitButton.addEventListener('click', function() {
      const description = $('#updateDescription').val()
       if (description) app.update('update', asset, weight, situation,  description, owner)
       updateDialog.close();
       });
     
       cancelButton.addEventListener('click', function() {
         updateDialog.close();
       });

})

// Initialize
app.keys = getKeys()
app.keys.forEach(pair => addOption('[name="keySelect"]', pair.public))
app.refresh()
