import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Lightbox from 'react-native-lightbox';
import { TouchableRipple } from 'react-native-paper';

const Message = ({ item, onLongPress, index, data }) => {

    // Utils.js

    const formatTimestamp = (timestamp, includeDaySeparator) => {
        const currentDate = new Date();
        const messageDate = new Date(timestamp);

        const options = {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        };

        if (includeDaySeparator) {
            const diffInDays = Math.floor((currentDate - messageDate) / (1000 * 60 * 60 * 24));

            if (diffInDays === 0) {
                return 'Today';
            } else if (diffInDays === 1) {
                return 'Yesterday';
            } else if (diffInDays < 7) {
                return messageDate.toLocaleDateString(undefined, { weekday: 'long' });
            } else {
                return messageDate.toLocaleDateString(undefined, options);
            }
        } else {
            if (currentDate - messageDate > 7 * 24 * 60 * 60 * 1000) {
                return messageDate.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
            } else {
                return messageDate.toLocaleDateString(undefined, options);
            }
        }
    };

    // console.log('message screen ', item)
    const showDateSeparator = index === 0 || item.timestamp.toDateString() !== data[index - 1]?.timestamp.toDateString();
    return (
        <>
            {showDateSeparator && (
                <Text style={styles.dateSeparator}>
                    {formatTimestamp(item.timestamp, true)} {/* Pass true as a second argument to formatTimestamp function to get only the date */}
                </Text>
            )}
            <TouchableRipple
                style={styles.feedbackContainer}
                borderless={false}
                onLongPress={() => onLongPress(item)}
            >
                <View
                    style={item?.fromMe ? styles.messageFromMe : styles.messageFromFriend}
                >
                    {item.image ? (
                        <Lightbox
                            underlayColor="white"
                            springConfig={{ tension: 15, friction: 7 }}
                            renderContent={() => (
                                <Image source={{ uri: item.image }} style={styles.lightboxImage} />
                            )}
                        >
                            <Image
                                source={{ uri: item.image }}
                                style={
                                    item.fromMe
                                        ? styles.imageMessageFromMe
                                        : styles.imageMessageFromFriend
                                }
                            />
                        </Lightbox>
                    ) : (
                        <Text
                            style={[
                                styles.messageText,
                                !item.fromMe && { color: 'black' },
                            ]}
                        >
                            {item.text ? item.text : item.content}
                        </Text>
                    )}

                    <Text style={styles.timestampText}>
                        {formatTimestamp(item.timestamp)}
                    </Text>
                </View>
            </TouchableRipple>
        </>
    );
};

export default Message
const styles = StyleSheet.create({
    messageContainer: {
        padding: 10,
    },
    messageFromMe: {
        alignSelf: 'flex-end',
        marginVertical: 5,
        maxWidth: '80%',
    },
    messageFromFriend: {
        alignSelf: 'flex-start',
        marginVertical: 5,
        maxWidth: '80%',
    },
    messageText: {
        color: '#ffffff',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#075e54',
    },
    imageMessageFromMe: {
        width: 200,
        height: 200,
        borderRadius: 8,
        borderWidth: 1,
    },
    imageMessageFromFriend: {
        width: 200,
        height: 200,
        borderRadius: 8,
        borderWidth: 1,
    },
    lightboxImage: {
        flex: 1,
        height: 300,
        resizeMode: 'contain',
    },
    timestampText: {
        fontSize: 12,
        color: '#777',
        marginTop: 5,
    },

    dateSeparator: {
        textAlign: 'center',
        backgroundColor: '#ccc',
        color: '#333',
        paddingVertical: 5,
        marginVertical: 10,
        borderRadius: 5,
    },
})