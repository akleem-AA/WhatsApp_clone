import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Background from './Background';
import Button from './Button';

const OTPScreen = ({navigation}) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120); // in seconds
  const [isResendDisabled, setResendDisabled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(interval);
          setResendDisabled(false); // Enable resend button when the timer expires
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const otpCodeChanged = (code) => {
    setOtp(code);
  };

  const handleResendOTP = () => {
    // Implement logic to resend OTP
    // For now, just resetting the timer and disabling the resend button
    setTimer(120);
    setResendDisabled(true);
    console.log('Resend OTP');
  };

  const handleVerifyOTP = () => {
    if (otp.length === 4) {
      // Verify the OTP here, for now, just display a success alert
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      })
    } else {
      Alert.alert('Error', 'Please enter a valid OTP.');
    }
  };

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    return formattedTime;
  };

  return (
    <View style={styles.container}>
      <Background>
        <View style={styles.box}>
          <OTPInputView
            style={styles.otpInput}
            pinCount={4}
            onCodeChanged={otpCodeChanged}
            keyboardAppearance="default"
            editable
            // codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {
              console.log(`Code is ${code}, you are good to go!`);
            }}
          />
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>Time Remaining: {formatTimer(timer)}</Text>
            <TouchableOpacity
              style={[styles.resendButton]}
              onPress={handleResendOTP}
              disabled={isResendDisabled}
            >
              <Text style={styles.resendButtonText}>Resend OTP</Text>
            </TouchableOpacity>

          </View>
        </View>
        {/* <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
        </TouchableOpacity> */}
        <Button
         mode="outlined"
          onPress={handleVerifyOTP}>
          Verify OTP
        </Button>
      </Background>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    alignItems: 'center',
    backgroundColor: '#128C7E',
    // backgroundColor:'#075E54',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  otpInput: {
    width: '80%',
    height: 200,
    borderRadius: 8,
    borderColor: '#3498db',
    // marginVertical: 20,

  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    margin: 10
  },
  underlineStyleHighLighted: {
    // borderColor: '#03DAC6',
    borderColor: '#03DAC6',

  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginTop: 20,
  },
  timerText: {
    fontSize: 18,
  },
  resendButton: {
    padding: 10,
    borderRadius: 5,
  },
  resendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  verifyButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2ecc71',
    borderRadius: 5,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OTPScreen;
