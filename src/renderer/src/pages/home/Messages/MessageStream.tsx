import { useAppSelector } from '@renderer/store'
import { selectStreamMessage } from '@renderer/store/messages'
import { Assistant, Topic } from '@renderer/types'
import styled from 'styled-components'

import Message from './Message'

interface MessageStreamProps {
  assistant: Assistant
  topic: Topic
}

const MessageStreamContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const MessageStream: React.FC<MessageStreamProps> = ({ assistant, topic }) => {
  const streamMessage = useAppSelector((state) => selectStreamMessage(state, topic.id))

  if (!streamMessage) {
    return null
  }

  return (
    <MessageStreamContainer>
      <Message message={streamMessage} topic={topic} assistant={assistant} isStreaming />
    </MessageStreamContainer>
  )
}

export default MessageStream
