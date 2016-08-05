Template.channelSettings.helpers
	canEdit: ->
		return RocketChat.authz.hasAllPermission('edit-room', @rid)
	canArchiveOrUnarchive: ->
		return RocketChat.authz.hasAtLeastOnePermission(['archive-room', 'unarchive-room'], @rid)
	editing: (field) ->
		return Template.instance().editing.get() is field
	notDirect: ->
		return ChatRoom.findOne(@rid, { fields: { t: 1 }})?.t isnt 'd'
	roomType: ->
		return ChatRoom.findOne(@rid, { fields: { t: 1 }})?.t
	channelSettings: ->
		return RocketChat.ChannelSettings.getOptions()
	roomTypeDescription: ->
		roomType = ChatRoom.findOne(@rid, { fields: { t: 1 }})?.t
		if roomType is 'c'
			return t('Channel')
		else if roomType is 'p'
			return t('Private_Group')
	roomName: ->
		return ChatRoom.findOne(@rid, { fields: { name: 1 }})?.name
	roomTopic: ->
		return ChatRoom.findOne(@rid, { fields: { topic: 1 }})?.topic
	roomTopicUnescaped: ->
		return s.unescapeHTML ChatRoom.findOne(@rid, { fields: { topic: 1 }})?.topic
	roomDescription: ->
		return ChatRoom.findOne(@rid, { fields: { description: 1 }})?.description
	archivationState: ->
		return ChatRoom.findOne(@rid, { fields: { archived: 1 }})?.archived
	archivationStateDescription: ->
		archivationState = ChatRoom.findOne(@rid, { fields: { archived: 1 }})?.archived
		if archivationState is true
			return t('Room_archivation_state_true')
		else
			return t('Room_archivation_state_false')
	canDeleteRoom: ->
		roomType = ChatRoom.findOne(@rid, { fields: { t: 1 }})?.t
		return roomType? and RocketChat.authz.hasAtLeastOnePermission("delete-#{roomType}", @rid)

Template.channelSettings.events
	'click .delete': ->
		swal {
			title: t('Are_you_sure')
			text: t('Delete_Room_Warning')
			type: 'warning'
			showCancelButton: true
			confirmButtonColor: '#DD6B55'
			confirmButtonText: t('Yes_delete_it')
			cancelButtonText: t('Cancel')
			closeOnConfirm: false
			html: false
		}, =>
			swal.disableButtons()

			Meteor.call 'eraseRoom', @rid, (error, result) ->
				if error
					handleError(error)
					swal.enableButtons()
				else
					swal
						title: t('Deleted')
						text: t('Room_has_been_deleted')
						type: 'success'
						timer: 2000
						showConfirmButton: false

	'keydown input[type=text]': (e, t) ->
		if e.keyCode is 13
			e.preventDefault()
			t.saveSetting()

	'click [data-edit]': (e, t) ->
		e.preventDefault()
		t.editing.set($(e.currentTarget).data('edit'))
		setTimeout (-> t.$('input.editing').focus().select()), 100

	'click .cancel': (e, t) ->
		e.preventDefault()
		t.editing.set()

	'click .save': (e, t) ->
		e.preventDefault()
		t.saveSetting()

Template.channelSettings.onCreated ->
	@editing = new ReactiveVar

	@validateRoomType = =>
		type = @$('input[name=roomType]:checked').val()
		if type not in ['c', 'p']
			toastr.error t('error-invalid-room-type', type)
		return true

	@validateRoomName = =>
		rid = Template.currentData()?.rid
		room = ChatRoom.findOne rid

		if not RocketChat.authz.hasAllPermission('edit-room', rid) or room.t not in ['c', 'p']
			toastr.error t('error-not-allowed')
			return false

		name = $('input[name=roomName]').val()

		try
			nameValidation = new RegExp '^' + RocketChat.settings.get('UTF8_Names_Validation') + '$'
		catch
			nameValidation = new RegExp '^[0-9a-zA-Z-_.]+$'

		if not nameValidation.test name
			toastr.error t('error-invalid-room-name', { room_name: name: name })
			return false

		return true

	@validateRoomTopic = =>
		return true

	@saveSetting = =>
		room = ChatRoom.findOne @data?.rid
		switch @editing.get()
			when 'roomName'
				if $('input[name=roomName]').val() is room.name
					toastr.success TAPi18n.__ 'Room_name_changed_successfully'
					RocketChat.callbacks.run 'roomNameChanged', ChatRoom.findOne(room._id)
				else
					if @validateRoomName()
						RocketChat.callbacks.run 'roomNameChanged', { _id: room._id, name: @$('input[name=roomName]').val() }
						Meteor.call 'saveRoomSettings', room._id, 'roomName', @$('input[name=roomName]').val(), (err, result) ->
							return handleError err if err
							toastr.success TAPi18n.__ 'Room_name_changed_successfully'
			when 'roomTopic'
				if @validateRoomTopic()
					Meteor.call 'saveRoomSettings', room._id, 'roomTopic', @$('input[name=roomTopic]').val(), (err, result) ->
						return handleError err if err
						toastr.success TAPi18n.__ 'Room_topic_changed_successfully'
						RocketChat.callbacks.run 'roomTopicChanged', ChatRoom.findOne(result.rid)
			when 'roomType'
				if @validateRoomType()
					RocketChat.callbacks.run 'roomTypeChanged', room
					Meteor.call 'saveRoomSettings', room._id, 'roomType', @$('input[name=roomType]:checked').val(), (err, result) ->
						return handleError err if err
						toastr.success TAPi18n.__ 'Room_type_changed_successfully'
			when 'roomDescription'
				if @validateRoomTopic()
					Meteor.call 'saveRoomSettings', room._id, 'roomDescription', @$('input[name=roomDescription]').val(), (err, result) ->
						return handleError err if err
						toastr.success TAPi18n.__ 'Room_description_changed_successfully'
			when 'archivationState'
				if @$('input[name=archivationState]:checked').val() is 'true'
					if room.archived isnt true
						Meteor.call 'archiveRoom', room._id, (err, results) ->
							return handleError err if err
							toastr.success TAPi18n.__ 'Room_archived'
							RocketChat.callbacks.run 'archiveRoom', ChatRoom.findOne(room._id)
				else
					if room.archived is true
						Meteor.call 'unarchiveRoom', room._id, (err, results) ->
							return handleError err if err
							toastr.success TAPi18n.__ 'Room_unarchived'
							RocketChat.callbacks.run 'unarchiveRoom', ChatRoom.findOne(room._id)
		@editing.set()
