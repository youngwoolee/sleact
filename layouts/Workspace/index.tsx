import axios from "axios";
import React, {FC, useCallback, useState} from "react";
import useSWR from "swr";
import fetcher from '@utils/fethcer';
import { Redirect, Route, Switch } from "react-router";
import { Header, ProfileImg, RightMenu, WorkspaceWrapper, Workspaces, Channels, Chats, WorkspaceName, MenuScroll, ProfileModal, LogOutButton, WorkspaceButton, AddButton } from "@layouts/Workspace/styles";
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from "@components/Menu";
import { Link } from "react-router-dom";
import { IUser } from "@typings/db";
import { Button, Input, Label } from "@pages/SignUp/styles";
import useInput from "@hooks/useInput";
import Modal from "@components/Modal";
import {toast, ToastContainer} from 'react-toastify';

const DirectMessage = loadable(() => import('@pages/DirectMessage'));
const Channel = loadable(() => import('@pages/Channel'));

const Workspace: FC<React.PropsWithChildren<{}>> = ({children}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const {data: userData, error, mutate} = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher);
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials: true,
    }).then(() => {
      mutate(false, false);
    })
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onCloseUserProfile = useCallback((e: any) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
  }, []);

  const onCreateWorkspace = useCallback((e: any) => {
    e.preventDefault();
    if(!newWorkspace || !newWorkspace.trim()) return;
    if(!newUrl || !newUrl.trim()) return;
    axios.post('http://localhost:3095/api/workspacesttt', {
      workspace: newWorkspace,
      url: newUrl
    }, {
      withCredentials: true
    })
      .then(() => {
        mutate();
        setShowCreateWorkspaceModal(false);
        setNewWorkspace('');
        setNewUrl('');
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      });
  }, [newWorkspace, newUrl]);

  if(!userData) {
    return <Redirect to={"/login"}/>;
  }


  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, {s: '28px', d:'retro'})} alt={userData.nickname}/>
            {showUserMenu && (
              <Menu style={{right: 0, top:38}} show={showUserMenu} onCloseModal={onClickUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, {s: '28px', d:'retro'})} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces.map((ws) => {
          return (
            <Link key={ws.id} to={'workspace/${123}/channel/일반'}>
              <WorkspaceButton>{ws.name.slice(0,1).toUpperCase()}</WorkspaceButton>
            </Link>
          );
        })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path={'/workspace/channel'} component={Channel} />
            <Route path={'/workspace/dm'} component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace}/>
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl}/>
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  )
}

export default Workspace;