import { ChatZone, StickyHeader, Section } from '@components/ChatList/styles';
import React, { FC, useCallback, useRef, forwardRef } from 'react';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars';
import {
  MutableRefObject
} from '../../../../../../../Applications/IntelliJ IDEA.app/Contents/plugins/JavaScriptLanguage/jsLanguageServicesImpl/external/react';

interface Props {
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>
  isEmpty: boolean;
  isReachingEnd: boolean;
}


const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd, }, scrollRef) => {
  const onScroll = useCallback((values: any) => {
    if(values.scrollTop === 0 && !isReachingEnd) {
      console.log('가장 위');
      //데이터 추가 로딩
      setSize((prevSize) => prevSize + 1)
        .then(() => {
          //스크롤 위치 유지
          const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
          if (current) {
            current.scrollTop(current.getScrollHeight() - values.scrollHeight);
          }
        });
    }
  }, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats?.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          )
          }
        )}

      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
