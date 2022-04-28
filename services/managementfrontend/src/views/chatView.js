import { Comment, List, PageHeader } from "antd";
import { LiveScoreboard } from "../organisms/liveScoreboard";
import { useLazyQuery, useSubscription } from '@apollo/client';
import { GET_SERVERINFO, LIST_PLAYERS } from '../graphql/queries';
import { useEffect, useState } from "react";
import { LiveServerInfo } from "../organisms/liveServerInfo";
import { CHAT_MESSAGE_RECEIVED } from "../graphql/subscriptions";
import { renderMessageTime } from "../molecules/messageTime";

export function ChatView() {
    const [messages, setMessages] = useState([])
    const { data, loading } = useSubscription(
        CHAT_MESSAGE_RECEIVED,
        // { variables: { postID } }
    );

    useEffect(() => {
        if (data?.chatMessageReceived != null) {
            setMessages([data?.chatMessageReceived, ...messages])
        }
    }, [data])

    return (
        <div
            className="site-layout-background"
            style={{ padding: 0, minHeight: '100%' }}
        >
            <PageHeader
                className="site-page-header"
                title="Chat"
                subTitle=""
            >
                <List
                    className="comment-list"
                    header={`${messages.length} messages`}
                    itemLayout="horizontal"
                    dataSource={messages}
                    renderItem={item => (
                        <li>
                            <Comment
                                author={item?.player}
                                avatar={item?.avatar}
                                content={item?.message}
                                datetime={renderMessageTime(item)}
                            />
                        </li>
                    )}
                />
            </PageHeader>
        </div>
    );
}