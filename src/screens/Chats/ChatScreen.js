import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {gql, useQuery, useMutation, useSubscription} from '@apollo/client';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Message from '../../components/Message';
import BottomSheet from '../../components/BottomSheet';
import ChatHeader from '../../components/ChatHeader';
import NetInfo from '@react-native-community/netinfo';

// const GET_MESSAGES = gql`
//   query Messages($roomId: ID!) {
//     messages(roomId: $roomId) {
//       content
//       id
//       createdAt
//       sender {
//         id
//       }
//     }
//   }
// `;
const GET_MESSAGES = gql`
  query Messages($roomId: ID!) {
    messages(roomId: $roomId) {
      content
      id
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!, $roomId: ID!) {
    sendMessage(content: $content, roomId: $roomId) {
      id
      content
      createdAt
      #      sender {
      #        id
      #      }
    }
  }
`;
const SUBSCRIBE_MESSAGES = gql`
  subscription Subscription($roomId: ID!) {
    newMessage(roomId: $roomId) {
      content
      id
    }
  }
`;
const COMMENTS_SUBSCRIPTION = gql`
  subscription OnCommentAdded($postID: ID!) {
    commentAdded(postID: $postID) {
      id
      content
    }
  }
`;

const ROOMID = '19e7bb92-8d78-42dd-9c38-f5c7b0f3874c';
const ChatScreen = ({route}) => {
  const navigation = useNavigation();
  const {friend} = route?.params;
  // console.log('friend', friend);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isConnected, setIsConnected] = useState(true); // State to track network connectivity
  const flatListRef = useRef(null);

  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(GET_MESSAGES, {
    variables: {roomId: ROOMID},
  });

  console.log('first query message .>>>>', queryData);

  const {data: subscriptionData, error} = useSubscription(SUBSCRIBE_MESSAGES, {
    variables: {roomId: ROOMID},
  });

  useEffect(() => {
    if (!queryLoading && queryData) {
      const oldMessages = queryData.messages.map(message => ({
        id: message.id,
        image: null,
        fromMe: false,
        timestamp: new Date(message.createdAt),
        text: message.content,
      }));
      let obj={
        id: '1',
        image: "null",
        fromMe: false,
        timestamp: new Date(),
        text: "message.content",
      }

      setMessages(obj);
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, []);

  //check the user is online or offline
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected); // Update isConnected state based on network connectivity
    });

    return () => {
      unsubscribe();
    };
  }, []);

  //subscription handler
  console.log('fetch subscription message>>>>>>>>', subscriptionData, error);

  useEffect(() => {
    if (subscriptionData) {
      // Handle the new message received from the subscription
      const newMessage = {
        id: Date.now(),
        image: null,
        fromMe: false,
        timestamp: new Date(),
        text: subscriptionData?.newMessage?.content,
      };
      // setMessages(prevMessages => [...prevMessages, newMessage]);
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [subscriptionData]);

  const [sendMessageMutation] = useMutation(SEND_MESSAGE);

  const sendMessage = async () => {
    const newMessage = {
      id: Date.now(),
      image: null,
      fromMe: true,
      timestamp: new Date(),
      text: message,
    };
    if (!message.trim()) {
      return;
    }

    try {
      const {data} = await sendMessageMutation({
        variables: {content: message, roomId: ROOMID},
      });

      console.log('send data', data);

      // setMessages(prevMessages => [...prevMessages, newMessage]);
      flatListRef.current.scrollToEnd({animated: true});
    } catch (error) {
      console.error('Error sending message:', error.message);
    } finally {
      setMessage('');
    }
  };

  const pickImage = () => {
    showBottomSheet();
  };

  const showBottomSheet = () => {
    setBottomSheetVisible(true);
  };

  const handleBottomSheetSelection = index => {
    setBottomSheetVisible(false);

    if (index === 0) {
      handleCameraLaunch();
    } else if (index === 1) {
      openImagePicker();
    }
  };

  const handleCameraLaunch = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    requestCameraPermission(options);
  };

  const requestCameraPermission = async options => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission given');
        launchCamera(options, response =>
          handleImagePickerResponse(response, true),
        );
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response =>
      handleImagePickerResponse(response, false),
    );
  };

  const handleImagePickerResponse = (response, fromCamera) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else {
      const selectedImage = {
        uri: fromCamera ? response.assets?.[0]?.uri : response.assets?.[0]?.uri,
        type: fromCamera ? 'image/jpeg' : response.type,
        name: fromCamera ? 'image.jpg' : response.fileName,
      };

      const newMessage = {
        id: Date.now(),
        image: selectedImage.uri,
        fromMe: true,
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);

      // sendMessageMutation({
      //   variables: {
      //     text: '',
      //     image: selectedImage.uri,
      //   },
      // });

      flatListRef.current.scrollToEnd({animated: true});
    }
  };

  const renderMessage = ({item, index}) => {
    return (
      <Message
        item={item}
        onLongPress={handleLongPress}
        index={index}
        data={messages}
      />
    );
  };

  const handleLongPress = item => {
    Alert.alert(
      'Are you sure want to delete',
      'Select an option',
      [
        {text: 'Delete Message', onPress: () => handleDeleteMessage(item)},
        {text: 'Cancel', style: 'cancel'},
      ],
      {cancelable: true},
    );
  };

  const handleDeleteMessage = item => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== item.id));
  };

  return (
    <View style={styles.container}>
      <ChatHeader friend={friend} />
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            You're offline. Messages will be sent when you're back online.
          </Text>
        </View>
      )}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item?.id?.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageContainer}
        onContentSizeChange={() =>
          flatListRef.current.scrollToEnd({animated: true})
        }
        onLayout={() => flatListRef.current.scrollToEnd({animated: true})}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.uploadIcon} onPress={pickImage}>
          <Icon name="photo-camera" size={24} color="#000000" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={message}
          onChangeText={text => setMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <BottomSheet
        visible={bottomSheetVisible}
        onSelect={handleBottomSheetSelection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },

  messageContainer: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: '#bdc3c7',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  uploadIcon: {
    marginLeft: 10,
  },
  sendButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#075e54',
  },
  sendButtonText: {
    color: '#ffffff',
  },
  offlineBanner: {
    backgroundColor: 'red',
    padding: 10,
    alignItems: 'center',
  },
  offlineText: {
    color: 'white',
  },
});

export default ChatScreen;
