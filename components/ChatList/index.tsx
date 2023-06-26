import { ChatZone } from '@components/ChatList/styles';
import React, { FC } from "react";
import { IDM } from "@typings/db";
import Chat from "@components/Chat";

interface Props {
  chatData?: IDM[];
}

const ChatList: FC<Props> = ({chatData}) => {
  return (
    <ChatZone>
      {chatData?.map((chat) => (
        <Chat key={chat.id} data={chat} />
      ))}
    </ChatZone>
  );
};

export default ChatList;
