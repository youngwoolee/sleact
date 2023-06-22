import React, { useCallback } from 'react';
import { Container } from '@pages/Channel/styles';
import gravatar from 'gravatar';
import { Header } from '@pages/DirectMessage/styles';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import fetcher from '@utils/fethcer';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR<IUser>(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR<IUser>('/api/users', fetcher);
  const [chat, onChangeChat] = useInput('');
  const onSubmitForm = useCallback((e: any) => {
    e.preventDefault();
    console.log('submit');
  }, []);

  if (!userData || !myData) {
    return null;
  }

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat="" onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default DirectMessage;
