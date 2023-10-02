import firestore from '@react-native-firebase/firestore'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { Image, Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import { useDispatch, useSelector } from 'react-redux'
import SearchIcon from '../../assets/icons/Search.svg'
import DropDownIcon from '../../assets/icons/dropdown.svg'
import CommanAlertBox from '../../components/CommanAlertBox'
import { GlobalStyle } from '../../globalStyle'
import { setLoading } from '../../redux/action/General/GeneralSlice'
import { RootState } from '../../redux/store'
import { getGigByUser, matchProuserwithgig_id } from '../../services/gigService/gigService'
import { getMatchedGigbyuserid } from '../../services/proUserService/proUserService'
import { getUserByUserID } from '../../services/userService/userServices'

const MessageScreen = ({ navigation }: any) => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedValue, setSelectValue] = useState<any>()
  const [profiles, setProfiles] = useState<any[]>([])
  const [profilesfilter, setProfilesfilter] = useState<any[]>([])
  const [gigList, setGigList] = useState<any[]>([])
  const user: any = useSelector((state: RootState) => state.user.user);
  const { userType }: any = useSelector((state: RootState) => state.userType)
  const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
  const [matchedprouserList, setmatchedprouserList] = useState([])
  const dispatch = useDispatch();

  const onChangeSearch = (value: any) => {
    if (value.length === 0) {
      setProfiles([...profilesfilter]);
      return;
    }

    const filteredRows = profilesfilter.filter((row) => {
      const searchString = value.toLowerCase();
      return (
        row.gig_title.toLowerCase().includes(searchString) ||
        row.latest_message.toLowerCase().includes(searchString) ||
        row.to_userName.toLowerCase().includes(searchString) // Make sure to convert to lowercase for case-insensitive search
      );
    });

    setProfiles(filteredRows);
    // setSearchValue(value);
  }
  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc(user.user_id)
      .collection('messages')
      .orderBy('latest_messageTime', 'desc')
      .onSnapshot(querySnapshot => {
        const allProfiles = querySnapshot.docs.map((doc) => {
          if (doc.data().status === 'active') {
            return doc.data()
          } else {
            return null; // Return null for non-active documents
          }

        }).filter((profile) => profile !== null);

        setProfiles(allProfiles)
        setProfilesfilter(allProfiles)
      });

    return () => subscriber();
  }, []);

  useEffect(() => {
    if (userType === "CREATOR")
      getList();
    else
      getProList()
  }, [userType])
  const matchedProprofile = () => {
    dispatch(setLoading(true))
    matchProuserwithgig_id(selectedValue.gig_id, firstToken).then((res) => {
      setmatchedprouserList(res)
      dispatch(setLoading(false))
    }).catch((error) => {
      CommanAlertBox({
        title: 'Error',
        message: error.message,
      });
      dispatch(setLoading(false))
    })
  }
  const getList = () => {
    dispatch(setLoading(true))
    getGigByUser(user.user_id, firstToken).then((res) => {

      let activegig = res.filter((item: any) => item.status === "active")
      setGigList(activegig)

      dispatch(setLoading(false))
    }).catch((error) => {
      CommanAlertBox({
        title: 'Error',
        message: error.message,
      });
      console.error(JSON.stringify(error));
      // setRefreshing(false);

      dispatch(setLoading(false))
    })
  }
  const getProList = async () => {
    try {
      dispatch(setLoading(true));
      const matchedGigs = await getMatchedGigbyuserid(user.user_id, firstToken);
      setGigList(matchedGigs);
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

  const onGigSelection = async (selecteditem: any) => {
    if (userType === "CREATOR") {
      dispatch(setLoading(true));

      try {
        // Assuming user is defined elsewhere
        const user_id = user.user_id;
        const querySnapshot = await firestore()
          .collection('chats')
          .doc(user_id) // Use user_id from user object
          .collection('messages')
          .get();

        const allProfiles = querySnapshot.docs
          .filter((doc) => {
            // Check if selecteditem is defined
            if (!selecteditem) {
              return doc.data().status === 'active';
            } else {
              // Check if gig_id exists in doc.data() before accessing it
              return (
                doc.data().status === 'active' &&
                doc.data().gig_id === (selecteditem.gig_id || null)
              );
            }
          })
          .map((doc) => doc.data())
          .filter((profile) => profile !== null);

        let matchedProfile = allProfiles;

        if (userType === 'CREATOR' && selecteditem) {
          const res = await matchProuserwithgig_id(selecteditem.gig_id, firstToken);

          if (res.length > 0) {
            matchedProfile = res.map((item: any) => {
              const matchedProfile = allProfiles.find(
                (data: any) => data.to_useruid === item.user_id
              );

              if (matchedProfile) {
                return matchedProfile;
              } else {
                // Use selecteditem.gig_id instead of selectedValue.gig_id
                return {
                  gig_title: selecteditem.title,
                  gig_id: selecteditem.gig_id,
                  to_userName: item.fname + ' ' + item.lname,
                  to_useruid: item.user_id,
                  to_userProfilepic: item.base64_img,
                };
              }
            });
          }
        }
        setProfiles(matchedProfile);
        setProfilesfilter(matchedProfile);

      } catch (error: any) {
        console.error(error);

        CommanAlertBox({
          title: 'Error',
          message: error.message,
        });
      } finally {
        dispatch(setLoading(false));
      }
    } else {
      dispatch(setLoading(true));

      try {
        // Assuming user is defined elsewhere
        const user_id = user.user_id;

        const querySnapshot = await firestore()
          .collection('chats')
          .doc(user_id)
          .collection('messages')
          .get();

        const allProfiles = querySnapshot.docs
          .filter((doc) => {
            // Check if selecteditem is defined
            if (!selecteditem) {
              return doc.data().status === 'active';
            } else {
              // Check if gig_id exists in doc.data() before accessing it
              return (
                doc.data().status === 'active' &&
                doc.data().gig_id === (selecteditem.gig_id || null)
              );
            }
          })
          .map((doc) => doc.data())
          .filter((profile) => profile !== null);

        let matchedProfile = [...allProfiles]; // Clone the array

        if (allProfiles.length < 1 && selecteditem) {
          const response = await getUserByUserID(selecteditem.user_id, firstToken);
          matchedProfile = [
            {
              gig_title: selecteditem.title,
              gig_id: selecteditem.gig_id,
              to_userName: response.fname + ' ' + response.lname,
              to_useruid: response.user_id,
              to_userProfilepic: response.base64_img,
            },
          ];
        }

        setProfiles(matchedProfile);
      } catch (error: any) {
        console.error(error);

        CommanAlertBox({
          title: 'Error',
          message: error.message,
        });
      } finally {
        dispatch(setLoading(false));
      }
    }
  };


  return (
    <SafeAreaView>
      <ScrollView>
        <View style={[GlobalStyle.container, { marginTop: 0 }]}>
          <View
            style={{
              backgroundColor: '#fff',
              borderColor: '#05E3D5',
              borderWidth: 1,
              borderRadius: 10,
              marginTop: 15,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 5
            }}>
            <TextInput
              onChangeText={text => onChangeSearch(text)}
              // value={searchValue}
              placeholder='Search chats'
              style={{ padding: 5, flex: 1, fontSize: 16 }}
            />
            <SearchIcon height={20} width={20} />
          </View>
          <View
            style={[{
              marginTop: 10,
              backgroundColor: '#F9F9F9',
              borderColor: '#05E3D5',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }]}>
            <View style={{ flex: 1, padding: 5 }}>
              <SelectDropdown
                data={gigList} // Pass the entire GigList array
                onSelect={(selectedItem) => {
                  onGigSelection(selectedItem);
                  setSelectValue(selectedItem);
                }}
                buttonStyle={{ backgroundColor: 'transparent', width: '100%' }}
                defaultButtonText='Select Gig'
                buttonTextStyle={{ textAlign: 'left' }}
                dropdownStyle={{ width: '85%', borderRadius: 10 }}
                buttonTextAfterSelection={(selectedItem) => selectedValue ? selectedValue.title : 'Select Gig'}
                renderCustomizedRowChild={(item: any) => (
                  <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: 16 }}>{item.title}</Text> // Render the title or any other property you want to display
                )}
              />
            </View>
            <DropDownIcon style={{ marginEnd: 10 }} />
            {/* <Image source={require('../../assets/icons/dropdown.png')} style={{ marginEnd: 10 }} /> */}
          </View>
          {profiles.length > 0 ? profiles.map((data, index) => (
            <Pressable onPress={() => navigation.navigate('Chat', { user_id: data.to_useruid, gig_id: data.gig_id })} key={index}>
              <View style={[GlobalStyle.card, GlobalStyle.shadowProp, { paddingHorizontal: 10 }]} >
                <View style={[{ display: 'flex', flexDirection: 'row', alignItems: 'center' }]}>
                  <View style={{ height: 70, width: 70, backgroundColor: 'black', borderRadius: 35 }}>
                    <Image style={{ height: 70, width: 70, borderRadius: 35 }} resizeMode='contain' source={data.to_userProfilepic ? { uri: `data:image/jpeg;base64,${data.to_userProfilepic}` } : require('../../assets/images/avatar-1.png')} />
                    <View style={{ height: 20, width: 20, borderRadius: 10, backgroundColor: '#36CC36', position: 'absolute', bottom: 0, right: 0 }}></View>
                  </View>
                  <View style={{ flex: 1, marginStart: 10 }}>
                    <Text style={[GlobalStyle.blackColor, { fontSize: 18 }]}>{data.to_userName}</Text>
                    <Text style={[GlobalStyle.blackColor]}>{data.gig_title}</Text>
                    {data.latest_message &&
                      <Text numberOfLines={1} style={[GlobalStyle.greyColor]}>{data.latest_message}</Text>}
                    {data.img &&
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Image resizeMode='contain' style={{ width: 25, height: 25 }} source={require('../../assets/images/photo.png')} />
                        <Text style={[GlobalStyle.greyColor]}>Photo</Text>
                      </View>

                    }
                  </View>
                  <View>
                    <Text style={[GlobalStyle.themeColor, { fontWeight: 'bold' }]}>{data.latest_messageTime ? moment(data.latest_messageTime.toDate()).format('hh:mm A') : ''}</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )) : <>

            <View style={{ marginTop: 50 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
                Be first to write!
              </Text>
            </View>

          </>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MessageScreen