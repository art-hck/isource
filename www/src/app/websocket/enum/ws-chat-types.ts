export enum WsChatTypes {
  AUTHORIZE = 'authorize',
  REJECTED = 'rejected',
  ATTACHMENTS_CANCEL = 'attachments.cancel',
  ATTACHMENTS_UPLOAD = 'attachments.upload',
  ATTACHMENTS_FILE = 'attachments.file.', // attachments.file.{id}
  CONTEXTS_GET = 'contexts.get',
  CONTEXTS_CREATE = 'contexts.create',
  CONTEXTS_SET_STATUS = 'contexts.setStatus',
  CONTEXTS_SET_SUPERVISOR = 'contexts.setSupervisor',
  CONTEXTS_MERGE = 'contexts.merge',
  CONTEXTS_ADD_ITEMS = 'contexts.addItems',
  CONTEXTS_REMOVE_ITEMS = 'contexts.removeItems',
  CONVERSATIONS_GET = 'conversations.get',
  CONVERSATIONS_CREATE = 'conversations.create',
  CONVERSATIONS_ADD_PARTICIPANTS = 'conversations.addParticipants',
  CONVERSATIONS_REMOVE_PARTICIPANTS = 'conversations.removeParticipants',
  CONVERSATIONS_UNREADCOUNT = 'conversations.unreadcount',
  MESSAGES_GET = 'messages.get',
  MESSAGES_NEW = 'messages.new',
  MESSAGES_SEND = 'messages.send',
  MESSAGES_UNREADCOUNT = 'messages.unreadcount',
  MESSAGES_MARKSEEN = 'messages.markseen',
  USERS_GET = 'users.get',
  USERS_GETSELF = 'users.getself',

  CONVERSATION_NEW = 'conversation.new',
  GRANTED = 'granted'

}
