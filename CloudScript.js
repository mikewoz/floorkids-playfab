///////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Floor Kids Cloud Scripts
//
// PlayFab Game Server API: https://api.playfab.com/Documentation/Server
//
///////////////////////////////////////////////////////////////////////////////////////////////////////

handlers.ConsumeCards = function (args)
{
  var msg = "CloudScript.ConsumeCards: ";
  for (var id in args.cards)
  {
    msg += " CARD "+id+" x "+args.cards[id];
    var ConsumeRequest = {
      "PlayFabId" : currentPlayerId,
      "ItemInstanceId": id,
      "ConsumeCount": parseInt(args.cards[id])
    };
    
    var ConsumeRequestResult = server.ConsumeItem(ConsumeRequest);    
    msg += " result=" + ConsumeRequestResult.RemainingUses;
  }
  return msg;
}

function HasPacks(vcBalnces)
{
	if(vcBalnces != null && vcBalnces.hasOwnProperty("PA") && vcBalnces["PA"] > 0)
		return true;
	else
		return false;
}

function AddVc(vcBalnces, code, qty)
{ 
	if(vcBalnces != null && vcBalnces.hasOwnProperty(code) &&  vcBalnces[code] > 0)
	{
		vcBalnces[code] += qty;
	}

	var AddUserVirtualCurrencyRequest = {
    "PlayFabId" : currentPlayerId,
    "VirtualCurrency": code,
    "Amount": qty
  };
  
  var AddUserVirtualCurrencyResult = server.AddUserVirtualCurrency(AddUserVirtualCurrencyRequest);
}

function SubtractVc(vcBalnces, code, qty)
{
	if(vcBalnces != null && vcBalnces.hasOwnProperty(code) &&  vcBalnces[code] > 0)
	{
		vcBalnces[code] -= qty;
	}

	var SubtractUserVirtualCurrencyRequest = {
    "PlayFabId" : currentPlayerId,
    "VirtualCurrency": code,
    "Amount": qty
  };

  var SubtractUserVirtualCurrencyResult = server.SubtractUserVirtualCurrency(SubtractUserVirtualCurrencyRequest);
}

// Photon Webhooks Integration
//
// The following functions are examples of Photon Cloud Webhook handlers. 
// When you enable the Photon Add-on (https://playfab.com/marketplace/photon/)
// in the Game Manager, your Photon applications are automatically configured
// to authenticate players using their PlayFab accounts and to fire events that 
// trigger your Cloud Script Webhook handlers, if defined. 
// This makes it easier than ever to incorporate multiplayer server logic into your game.


// Triggered automatically when a Photon room is first created
handlers.RoomCreated = function (args) {
    log.debug("Room Created - Game: " + args.GameId + " MaxPlayers: " + args.CreateOptions.MaxPlayers);
}

// Triggered automatically when a player joins a Photon room
handlers.RoomJoined = function (args) {
    log.debug("Room Joined - Game: " + args.GameId + " PlayFabId: " + args.UserId);
}

// Triggered automatically when a player leaves a Photon room
handlers.RoomLeft = function (args) {
    log.debug("Room Left - Game: " + args.GameId + " PlayFabId: " + args.UserId);
}

// Triggered automatically when a Photon room closes
// Note: currentPlayerId is undefined in this function
handlers.RoomClosed = function (args) {
    log.debug("Room Closed - Game: " + args.GameId);
}

// Triggered automatically when a Photon room game property is updated.
// Note: currentPlayerId is undefined in this function
handlers.RoomPropertyUpdated = function(args) {
    log.debug("Room Property Updated - Game: " + args.GameId);
}

// Triggered by calling "OpRaiseEvent" on the Photon client. The "args.Data" property is 
// set to the value of the "customEventContent" HashTable parameter, so you can use
// it to pass in arbitrary data.
handlers.RoomEventRaised = function (args) {
    var eventData = args.Data;
    log.debug("Event Raised - Game: " + args.GameId + " Event Type: " + eventData.eventType);

    switch (eventData.eventType) {
        case "playerMove":
            processPlayerMove(eventData);
            break;

        default:
            break;
    }
}
