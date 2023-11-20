import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, Platform, Pressable, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MicIcon from '../../assets/icons/Mic1.svg';
import CommanAlertBox from '../../components/CommanAlertBox';
import { GlobalStyle } from '../../globalStyle';
import { setLoading } from '../../redux/action/General/GeneralSlice';
import { RootState } from '../../redux/store';
import { audioToText, checkPermission, readAudioFile, startRecord, stopRecord } from '../../services/audioServices/audioServices';
import { getGigByUser } from '../../services/gigService/gigService';
import { createProUsers, getMatchedGigbyuserid, getProdetailsbyuserid, updateProUsersDetails } from '../../services/proUserService/proUserService';
import { Toast } from 'react-native-toast-message/lib/src/Toast'
var heightY = Dimensions.get("window").height;

const HomeScreen = ({ navigation }: any) => {
  const [selectedIndex, SetSelectedIndex] = useState(0);
  const { isGigCreated } = useSelector((state: RootState) => state.isGigCreated)
  const [alreadyProuser, setalreadyprouser] = useState(false)
  const [isRecording, setIsRecording] = useState(false);
  const [isError, setIsError] = useState(false);
  const [audioPath, setAudioPath] = useState<string>('');
  const [lists, setLists] = useState([])
  const [proLists, setProLists] = useState<any[]>([])
  const [skillValue, setSkillValue] = useState<any>("")
  const [isSkillAvailable, setIsSkillAvailable] = useState<any>(false)
  const { userType }: any = useSelector((state: RootState) => state.userType)
  const user: any = useSelector((state: RootState) => state.user.user);
  const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
  const dispatch = useDispatch();
  const focus = useIsFocused();  // useIsFocused as shown         
  const skillInputRef = useRef<any>(null);

  const [interestGigType, setInterestGigType] = useState('unpaid')
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const isRequired = (value: any) => value.trim() !== '';
  const isWithinRange = (value: any, min: any, max: any) => value.length >= min && value.length <= max;


  useEffect(() => {
    if (userType === "CREATOR")
      getList();
    // else
    //   getProList()
  }, [userType, selectedIndex])


  useEffect(() => {
    if (focus) {
      if (userType === "CREATOR")
        getList();
      else {
        getProDetails()
        getProList()
      }
    }
  }, [focus])

  const startRecognizing = async () => {
    const granted = await checkPermission();
    if (!granted) {
      // Permissions not granted, return early
      console.log('Permissions not granted');
      return;
    }


    startRecord(setAudioPath, setIsRecording);

  }
  const stopRecording = async () => {
    stopRecord(setIsRecording).then((res) => {
      dispatch(setLoading(true))
      readAudioFile(audioPath)
        .then((base64Data) => {
          if (base64Data) {
            const audioDataToSend = {
              audio_base64: base64Data,
              audio_format: Platform.OS === "ios" ? 'aac' : 'mp4', // Set the desired audio format
              platform: Platform.OS

            };
            audioToText(audioDataToSend, firstToken).then((res) => {
              handleInputChange(res.text)
              dispatch(setLoading(false))
            }).catch((error) => {
              CommanAlertBox({
                title: 'Error',
                message: error.message,
              });
              console.error('error', error);
              dispatch(setLoading(false))
            })
          }
        })
        .catch((error) => {
          dispatch(setLoading(false))
          CommanAlertBox({
            title: 'Error',
            message: error.message,
          });
          console.error('Error reading audio file:', error);
        });
    })
  }
  const getProDetails = () => {
    getProdetailsbyuserid(user.user_id, firstToken).then((res) => {
      setSkillValue(res.raw_skills_text)
      setIsSkillAvailable(res.raw_skills_text ? true : false)
      setInterestGigType(res.interest_gig_type)
      setalreadyprouser(true)
      setRefreshing(false);
      dispatch(setLoading(false));
    }).catch((e) => {
      CommanAlertBox({
        title: 'Error',
        message: e.message,
      });
      setRefreshing(false);
      dispatch(setLoading(false))
    })
  }
  const updateProprofile = () => {
    if (error !== '') {
      return
    }
    return new Promise((resolve, reject) => {
      let provalue = {
        "user_id": user.user_id,
        "raw_skills_text": skillValue,
        "interest_gig_type": interestGigType,
      }
      dispatch(setLoading(true))
      if (alreadyProuser) {
        updateProUsersDetails(provalue, firstToken).then((res) => {
          dispatch(setLoading(false));
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Skill Added Successfully',
          });
          setIsSkillAvailable(true)
          resolve(true)
        }).catch((e) => {
          CommanAlertBox({
            title: 'Error',
            message: e.message,
          });
          dispatch(setLoading(false))
        })
      } else {
        createProUsers(provalue, firstToken).then((res) => {
          dispatch(setLoading(false));
          resolve(true)
        }).catch((e) => {
          CommanAlertBox({
            title: 'Error',
            message: e.message,
          });
          dispatch(setLoading(false))
        })
      }

    })
  }
  const getList = () => {
    dispatch(setLoading(true))
    getGigByUser(user.user_id, firstToken).then((res) => {
      console.log('res', res);

      if (selectedIndex === 0) {
        let activegig = res.filter((item: any) => item.status === "active")
        setLists(activegig)
      } else {
        let inactivgig = res.filter((item: any) => item.status === "inactive")
        setLists(inactivgig)
      }
      setRefreshing(false);
      dispatch(setLoading(false))
    }).catch((error) => {
      CommanAlertBox({
        title: 'Error',
        message: error.message,
      });
      console.error(JSON.stringify(error));
      setRefreshing(false);

      dispatch(setLoading(false))
    })
  }
  const getProList = async () => {
    try {
      dispatch(setLoading(true));
      const matchedGigs = await getMatchedGigbyuserid(user.user_id, firstToken);
      setProLists(matchedGigs);
      dispatch(setLoading(false));
    } catch (error: any) {
      CommanAlertBox({
        title: 'Error',
        message: error.message,
      });
      console.error(JSON.stringify(error));
      dispatch(setLoading(false));
    }
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (userType === "CREATOR")
      getList();
    else {
      getProDetails()
      getProList()
    }

  }, []);
  const CreatorHome = () => {
    return (
      <>
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <SegmentedControl
            values={['Active Gigs', 'Inactive Gigs']}
            selectedIndex={selectedIndex}
            backgroundColor={'#fff'}
            onChange={(event) => {
              SetSelectedIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            style={[GlobalStyle.shadowProp, {
              width: '85%',
              height: 40,
              backgroundColor: '#fff',
              borderRadius: 10,
            }]}
            tintColor={Platform.OS === 'ios' ? '#000' : '#05E3D5'}
            activeFontStyle={{ color: '#fff', fontSize: 20 }}
            fontStyle={{ color: Platform.OS === 'ios' ? '#000' : '#000', fontSize: heightY * 0.024 }}
          />
        </View>
        <ScrollView>
          <View style={[GlobalStyle.container]}>
            <View style={Style.cardContainer}>
              {selectedIndex === 0 ?
                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Active Gigs</Text>
                :
                <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Inactive Gigs</Text>
              }
              {
                lists?.length > 0 ?
                  <>
                    {lists.map((item: any, index) => (
                      <View key={index} style={[GlobalStyle.card, GlobalStyle.shadowProp, {
                        paddingVertical: 0,
                        paddingHorizontal: 0
                      }]}>
                        <Pressable onPress={() => navigation.navigate('Help', item)}
                          style={{
                            display: 'flex', flexDirection: 'row',
                          }} >
                          <View>
                            <Image resizeMode={Platform.OS === 'ios' ? 'cover' : 'contain'} style={Style.imageStyle}
                              defaultSource={require('../../assets/images/image.png')}
                              source={item.thumbnail_img_url ? { uri: item.thumbnail_img_url } : require('../../assets/images/image.png')}
                            />
                          </View>
                          <View style={{ flex: 1, width: 100 }}>
                            <View style={{
                              display: 'flex', flexDirection: 'row',
                            }}>
                              <Text style={[GlobalStyle.blackColor, Style.title, { flex: 1 }]}>
                                {item.title}
                              </Text>
                              <View style={{ padding: 10 }}>
                                <Pressable style={{ backgroundColor: item.gig_type === 'paid' ? '#21AF2F' : '#989898', borderRadius: 5, paddingHorizontal: 10, width: 'auto' }}>
                                  <Text style={{ color: '#fff', textTransform: 'capitalize' }}>{item.gig_type}</Text>
                                </Pressable>
                              </View>
                            </View>
                            <Text style={[GlobalStyle.blackColor, Style.message]}>
                              {item.informal_description}
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    ))

                    }

                  </>
                  :
                  <>
                    <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                      <Text style={[GlobalStyle.blackColor, { fontSize: 20 }]}>
                        What do you need help with? You have no active gigs, CREATE a Gig to get started
                      </Text>
                    </View>
                    <View style={{ margin: 18 }}>
                      <Pressable style={GlobalStyle.button} onPress={() => navigation.navigate('Create')}>
                        <Text style={GlobalStyle.btntext}>Create New Gig</Text>
                      </Pressable>
                    </View>
                  </>
              }
            </View>
          </View>
        </ScrollView>
      </>
    )
  }
  const handleInputChange = (msg: any) => {
    setSkillValue(msg);
    setError('');
    if (!isRequired(msg)) {
      setError('This field is required');
    } else if (!isWithinRange(msg, 10, 200)) { // Adjust min and max length as needed
      setError('Skills must be between 10 and 200 characters');
    }
  }
  useEffect(() => {
    if (skillInputRef.current) {
      skillInputRef.current.focus();
    }
  }, []);


  return (
    <SafeAreaView>
      <ScrollView keyboardShouldPersistTaps="never" refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content" // Here is where you change the font-color
        />
        {
          userType === "CREATOR" ? <CreatorHome /> :
            <ScrollView keyboardShouldPersistTaps="always" >
              <View style={[GlobalStyle.container]}>
                <View style={Style.cardContainer}>
                  <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Suggested Gigs</Text>
                  {
                    proLists?.length > 0 ?
                      <>
                        {proLists.map((item: any, index) => (
                          <View key={index} style={[GlobalStyle.card, GlobalStyle.shadowProp, {
                            paddingVertical: 0,
                            paddingHorizontal: 0
                          }]}>
                            <Pressable onPress={() => navigation.navigate('View-gig', item)}
                              style={{
                                display: 'flex', flexDirection: 'row',
                              }} >
                              <View>
                                <Image resizeMode={Platform.OS === 'ios' ? 'cover' : 'contain'} style={Style.imageStyle}
                                  source={{ uri: item.thumbnail_img_url }}
                                />
                              </View>
                              <View style={{ flex: 1, width: 100 }}>
                                <View style={{
                                  display: 'flex', flexDirection: 'row',
                                }}>
                                  <Text style={[GlobalStyle.blackColor, Style.title, { flex: 1 }]}>
                                    {item.title}
                                  </Text>
                                  <View style={{ padding: 10 }}>
                                    <Pressable style={{ backgroundColor: item.gig_type === 'paid' ? '#21AF2F' : '#989898', borderRadius: 5, paddingHorizontal: 10, width: 'auto' }}>
                                      <Text style={{ color: '#fff', textTransform: 'capitalize' }}>{item.gig_type}</Text>
                                    </Pressable>
                                  </View>
                                </View>
                                <Text style={[GlobalStyle.blackColor, Style.message]}>
                                  {item.informal_description}
                                </Text>
                              </View>
                            </Pressable>
                          </View>

                        ))}
                      </>
                      :
                      <>
                        <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                          <Text style={[GlobalStyle.blackColor, { fontSize: 20 }]}>
                            {isSkillAvailable ? "There are currently no matches for you at the moment." :
                              "To receive Gig suggestions, please add your skills and/or types of work you would like to do  below."}                      </Text>
                        </View>
                        {!isSkillAvailable ?
                          <><View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>
                            <Text style={[GlobalStyle.blackColor, { fontSize: 20, fontWeight: 'bold' }]}>
                              My Skills or How I Can Help Others</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                              <TextInput
                                multiline
                                numberOfLines={5}
                                placeholder="Type here..."
                                placeholderTextColor="#000"
                                value={skillValue ? skillValue : ''}
                                editable={true}
                                onChangeText={(msg: string) => handleInputChange(msg)}
                                style={{ flex: 1, fontSize: 18, color: '#000' }}
                              />

                              <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity onPress={isRecording ? stopRecording : startRecognizing} >
                                  {isRecording ? <Image resizeMode='contain' source={require('../../assets/images/stopRecording.png')} style={{ width: 50, height: 50 }} /> : <MicIcon height={50} width={50} />}
                                </TouchableOpacity>
                              </View>
                            </View>
                            {error !== '' && <Text style={{ color: 'red' }}>{error}</Text>}
                          </View>

                            <View style={{ margin: 20 }}>
                              <Pressable style={GlobalStyle.button} onPress={() => updateProprofile()}>
                                <Text style={GlobalStyle.btntext}>Add Skills</Text>
                              </Pressable>
                            </View></> : null}

                      </>
                  }
                </View>
              </View>
            </ScrollView>
        }
      </ScrollView>
    </SafeAreaView>
  )
}
const Style = StyleSheet.create({
  cardContainer: { marginBottom: 10 },
  commanFont: {
    fontSize: heightY * 0.024,
    fontWeight: 'bold'
  },
  title: {
    fontSize: heightY * 0.022,
    marginHorizontal: 10,
    paddingTop: 10,
    fontWeight: 'bold'
  },
  message: {
    fontSize: heightY * 0.018,
    margin: 10
  },
  imageStyle: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    height: 120,
    width: 100
  }
})

export default HomeScreen