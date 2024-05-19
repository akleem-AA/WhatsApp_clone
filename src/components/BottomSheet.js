import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import ActionSheet from 'react-native-actionsheet';

const BottomSheet = ({ visible, onSelect }) => {
    const actionSheetRef = useRef(null);

    const showBottomSheet = () => {
        actionSheetRef.current.show();
    };
    useEffect(() => {
        if (visible) {
            showBottomSheet()
        }
    }, [visible])

    const handleBottomSheetSelection = index => {
        onSelect(index);
    };

    return (
        <ActionSheet
            ref={actionSheetRef}
            title={'Select a photo'}
            options={['Take Photo', 'Choose from Gallery', 'Cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={2}
            onPress={handleBottomSheetSelection}
            visible={visible}
        />
    );
};

export default BottomSheet

const styles = StyleSheet.create({})