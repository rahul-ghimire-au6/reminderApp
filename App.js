import React, { useState, useEffect } from "react";
import { PermissionsAndroid, Image, ScrollView, ToastAndroid, Dimensions, Button, Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import noReminder from './assets/noReminder.png'
import noReminder2 from './assets/noReminder2.jpg'
import RNCalendarEvents from "react-native-calendar-events";

const App = () => {
  const [reminder, setReminder] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullDate, setFullDate] = useState(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const handlePermission = async () => {
    try {
      RNCalendarEvents.checkPermissions((readOnly = false)).then(data => console.log(data)).catch(err => console.log(err))

      RNCalendarEvents.requestPermissions((readOnly = false)).then(data => console.log(data)).catch(err => console.log(err))
      write_calender = await PermissionsAndroid.WRITE_CALENDAR
      read_calender = await PermissionsAndroid.READ_CALENDAR
      if (granted === PermissionsAndroid.check(write_calender) &&
        granted === PermissionsAndroid.check(read_calender)) {
        console.log('You can use the CALENDAR');
      } else {
        console.log('CALENDAR permission denied');
      }

    } catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    handlePermission()
    let a = new Date()
    let temp1 = `${a.getDate()}/${a.getMonth() + 1}/${a.getFullYear()}`
    let temp2 = `${a.getHours()}:${a.getMinutes()}`
    setDate(temp1)
    setTime(temp2)
  }, [])

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    let temp3 = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    let temp4 = `${currentDate.getHours()}:${currentDate.getMinutes()}`;
    setDate(temp3)
    setTime(temp4)
    setFullDate(currentDate);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const handleTitleOnChange = (event) => {
    setTitle(event)
  }

  const handleDescriptionOnChange = (event) => {
    setDescription(event)
  }
  const handleDisplayDate = (getDate) => {
    const temp159 = new Date(getDate)
    const monthName = [
      'Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    const date159 = `${temp159.getDate()} ${monthName[temp159.getMonth()]}, ${temp159.getHours()}:${temp159.getMinutes()}`
    return date159
  }

  const handleFormSubmit = async () => {
    const currentTime2 = new Date();
    if (title === '') {
      return ToastAndroid.show("Title should not be empty", ToastAndroid.SHORT);
    }
    if (title.length < 5) {
      return ToastAndroid.show("Title should be min 5 character long", ToastAndroid.SHORT);
    }
    if (fullDate <= currentTime2) {
      return ToastAndroid.show("Please Select valid Time", ToastAndroid.SHORT)
    }
    if (fullDate.getDate() <= currentTime2.getDate()
      && fullDate.getMonth() <= currentTime2.getMonth()
      && fullDate.getFullYear() <= currentTime2.getFullYear()) {
      if (fullDate.getHours() <= currentTime2.getHours()) {
        if (fullDate.getMinutes() < currentTime2.getMinutes())
          return ToastAndroid.show("Please Select valid Time", ToastAndroid.SHORT)
      }
    }
    const colorArray = ['#33cc33', '#ff9900', '#ff6699', '#ffff66', '#cc3300', '#3399ff', '#9900ff', '#669999', '#999966', '#cc0000']
    let newArrayData = [{
      id: reminder.length + 1,
      title: title,
      description: description,
      time: fullDate,
      color: colorArray[Math.floor(Math.random() * 11)]
    }]
    const endDate = `${fullDate.getFullYear()}-${fullDate.getMonth + 1}-${fullDate.getDate()}T${fullDate.getHours + 2}:${fullDate.getMinutes}:00.000Z`
    setReminder([...reminder, ...newArrayData])
    setModalVisible(false)
    RNCalendarEvents.saveEvent(title, {
      startDate: fullDate,  //needs string
      endDate: endDate,    //needs string
      alarms: [{
        date: fullDate      //needs string
      }]
    }).then(data => console.log(data)).catch(err => console.log(err))
  }

  return (
    <View style={styles.centeredView}>
      {/* start of showing reminders */}
      <View style={styles.reminderViewContainer}>
        {/* heading */}
        <View>
          <Text style={styles.reminderHeading}>Reminders</Text>
        </View>
        {/* end of heading */}

        <View style={styles.reminderRootView}>
          <ScrollView>
            <View style={styles.reminderBlockContainer}>
              {/* start of reminder block here */}
              {reminder.length === 0 ? <View><Image source={noReminder2} /></View> : reminder.map((element) => (
                <View key={element.id} style={[styles.reminderDiv, { backgroundColor: element.color }]}>
                  <View style={styles.reminderSubDiv}>
                    <View><Text style={styles.titleText}>{element.title}</Text></View>
                    <View><Text style={styles.descriptionText}>{element.description}</Text></View>
                    <View style={styles.dateTextContainer}><Text style={styles.dateText}>{handleDisplayDate(element.time)}</Text></View>
                  </View>
                </View>
              ))}

            </View>
          </ScrollView>
        </View>
      </View>







      {/* // start of modal code */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View>
          <View style={styles.modalView}>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <View style={styles.modalOpenSubViewCloseIcon}>
                <AntDesign name="closecircle" size={20} color="black" />
              </View>
            </Pressable>
            <Text style={styles.modalText}>Add Reminder</Text>
            {/* start of form to get reminder details */}
            <View style={styles.formContainer}>
              <View><TextInput
                placeholder="Title"
                value={title}
                onChangeText={handleTitleOnChange}
                mode='outlined'
                outlineColor="#2196F3"
                activeOutlineColor="#000"
              /></View>
              <View style={{ marginTop: 10 }}><TextInput
                placeholder="Description"
                value={description}
                onChangeText={handleDescriptionOnChange}
                mode='outlined'
                outlineColor="#2196F3"
                activeOutlineColor="#000"
              /></View>



              {/* date and time picker  */}

              <View style={styles.datePickerContainer}>
                <TextInput
                  mode='outlined'
                  outlineColor="#fff"
                  activeOutlineColor="#fff"
                  value={date}
                  disabled
                  style={styles.dateInputTextStyle}
                />
                <View style={styles.dateButtonStyle}>
                  <Button onPress={showDatepicker} title="Select Date" />
                </View>
              </View>
              <View style={styles.datePickerContainer}>
                <TextInput
                  mode='outlined'
                  outlineColor="#fff"
                  activeOutlineColor="#fff"
                  value={time}
                  disabled
                  style={styles.dateInputTextStyle}
                />
                <View style={styles.dateButtonStyle}>
                  <Button onPress={showTimepicker} title="Select Time" />
                </View>
              </View>
              {/* <View>
                <Button onPress={showTimepicker} title="Show time picker!" />
              </View> */}
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={fullDate}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChangeDate}
                />
              )}
              {/* end of date and time picker */}
              {/* start of submit button */}
              <View style={styles.formSubmitButton}>
                <Button title="Submit" onPress={handleFormSubmit} />
              </View>
              {/* end of submit button */}
            </View>
            {/* end of form to get reminder details */}
          </View>
        </View>
      </Modal>
      {/* end of modal code */}
      <Pressable onPress={() => setModalVisible(true)}>
        <View style={styles.modalOpenView}>
          <View style={styles.modalOpenSubViewAddIcon}><AntDesign name="plus" size={24} color="black" /></View>
        </View>
      </Pressable>
    </View>
  );
};

const { height, width } = Dimensions.get('window')

const styles = StyleSheet.create({
  modalView: {
    marginTop: width / 2.5,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 50,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    width: width - 40,

    // padding: 10,
    // elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  modalText: {
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 20
  },
  modalOpenView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    left: 0,
    marginLeft: width / 1.2,
    marginTop: height / 30,
    width: 50,
    height: 50,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: '#3399ff'
  },
  modalOpenSubViewAddIcon: {
    marginTop: 12,
    alignSelf: 'center',
  },
  modalOpenSubViewCloseIcon: {
    marginLeft: width - 100,
  },
  //form styles
  formContainer: {
    width: width - 150,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  datePickerContainer: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  dateInputTextStyle: {
    height: 34,
    width: '60%',
    textAlign: 'center'
  },
  dateButtonStyle: {
    marginTop: 6,
  },
  formSubmitButton: {
    marginTop: 50,
    width: width - 250,
    alignSelf: 'center'
  },
  reminderHeading: {
    fontSize: 45,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10
  },
  reminderViewContainer: {
    marginTop: height / 20,
    marginLeft: width / 20,
    marginRight: width / 20,
    alignSelf: "center"
  },
  reminderRootView: {
    // borderWidth: 1,
    // borderColor: '#000',
    width: width / 1.05,
    height: height / 1.4
  },
  reminderBlockContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reminderDiv: {
    // borderWidth: 1,
    // borderColor: "black",
    borderRadius: 10,
    width: 205,
    height: 205,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reminderSubDiv: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 30
  },
  descriptionText: {
    fontWeight: 'bold',
    fontSize: 15
  },
  dateTextContainer: {
    marginTop: 10,
    borderWidth: 0.5,
    borderColor: '#000',
    width: 100,
    height: 25,
    borderRadius: 5

  },
  dateText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 15
  },
});

export default App;