import axios from "axios";
import React, {FC, useCallback} from "react";
import useSWR from "swr";
import fetcher from '@utils/fethcer';
import { Redirect, Route, Switch } from "react-router";
import { Header, ProfileImg, RightMenu, WorkspaceWrapper, Workspaces, Channels, Chats, WorkspaceName, MenuScroll } from "@layouts/Workspace/styles";
import gravatar from 'gravatar';
import loadable from '@loadable/component';
const DirectMessage = loadable(() => import('@pages/DirectMessage'));
const Channel = loadable(() => import('@pages/Channel'));

const Workspace: FC<React.PropsWithChildren<{}>> = ({children}) => {
  const {data, error, mutate} = useSWR('http://localhost:3095/api/users', fetcher);
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      withCredentials: true,
    }).then(() => {
      mutate(false, false);
    })
  }, []);

  if(!data) {
    return <Redirect to={"/login"}/>;
  }
  return (
    <div>
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, {s: '28px', d:'retro'})} alt={data.nickname}/>
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
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
    </div>
  )
}

export default Workspace;