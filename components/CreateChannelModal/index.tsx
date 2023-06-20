import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import React, { CSSProperties, FC, PropsWithChildren, useCallback, VFC, useState } from 'react';
import { Button, Input, Label } from "@pages/SignUp/styles";
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fethcer';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({show, onCloseModal, setShowCreateChannelModal}) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const {workspace, channel} = useParams<{workspace: string; channel: string}>();
  const {data: userData, error, mutate} = useSWR<IUser | false>(
    'http://localhost:3095/api/users',
    fetcher,
    {
      dedupingInterval: 2000
    }
  );
  const {mutate: mutateChannel } = useSWR<IChannel[]>(
    userData ? `http://localhost:3095/api/workspaces/${workspace}/channels` : null,
    fetcher
  );
  const onCreateChannel = useCallback((e: any) => {
    e.preventDefault();
    axios.post(`http://localhost:3095/api/workspaces/${workspace}/channels`, {
      name: newChannel,
    }, {
      withCredentials: true,
    }).then((response) => {
      mutateChannel();
      setShowCreateChannelModal(false);
      setNewChannel('');
    }).catch((error) => {
      console.dir(error);
      toast.error(error.response?.data, { position: 'bottom-center'})
    });
  }, [newChannel]);

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="channel-label">
          <span>채널</span>
          <Input id="channel" value={newChannel} onChange={onChangeNewChannel}/>
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};


export default CreateChannelModal;
