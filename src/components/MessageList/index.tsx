import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import { api } from '../../services/api';

import styles from './styles.module.scss';
import logoImg from '../../assets/logo.svg';



type Message = {
    id: string;
    text: string;
    user: {
        name: string;
        avatar_url: string;
    }
    created_at: string
} | null;
const messagesQueue: Message[] = [];

const socket = io('http://192.168.0.114:4000');

export function MessageList() {

    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        socket.on('new_message', (newMessage: Message) => {
            if (newMessage) {
                setMessages(prevState => [
                    newMessage,
                    prevState[0],
                    prevState[1]
                ].filter(Boolean));
                newMessage = null;
            }
        });
    }, []);

    useEffect(() => {
        api.get<Message[]>('messages/last3').then(response => {
            setMessages(response.data);
        })
    }, [])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DO While" />
            <ul className={styles.messageList}>
                {messages.map(message => {
                    return (
                        <motion.li
                            initial={{ opacity: 0, translateX: -50 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 50,
                                damping: 20,
                            }}
                            className={styles.message}
                            key={message?.id}
                        >
                            <p className={styles.messageContent}>{message?.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message?.user.avatar_url} alt={message?.user.name} />
                                </div>
                                <span>{message?.user.name}</span>
                            </div>
                        </motion.li>
                    )
                })}
            </ul>
        </div>
    )
}