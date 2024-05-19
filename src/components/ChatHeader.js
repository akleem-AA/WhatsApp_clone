import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ChatHeader = ({ friend }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.userInfo}>
                <TouchableOpacity>
                    {friend?.image ? (
                        <Image
                            source={{ uri: friend?.image }}
                            style={{ width: 30, height: 30, borderRadius: 15 }}
                        />
                    ) : (
                        <Icon name="account-circle" size={30} color="#ffffff" />
                    )}
                </TouchableOpacity>
                <Text style={styles.headerText}>{friend?.name || 'My Friend'}</Text>
            </View>
        </View>
    );
}

export default ChatHeader

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#075e54',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
})