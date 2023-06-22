import React from "react";
import {Container} from "@pages/Channel/styles";
import gravatar from "gravatar";
import { Header } from "@pages/DirectMessage/styles";
import useSWR from "swr";
import {IUser} from "@typings/db";
import fetcher from "@utils/fethcer";
import {useParams} from "react-router";
import ChatBox from "@components/ChatBox";

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR<IUser>('/api/users', fetcher);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro'})} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      {/*<ChatList />*/}
      <ChatBox chat="hello" />
    </Container>
  );
};

export default DirectMessage;