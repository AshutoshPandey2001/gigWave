import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MicIcon from '../../assets/icons/Mic1.svg';
import { GlobalStyle } from '../../globalStyle';
import { setLoading } from '../../redux/action/General/GeneralSlice';
import { RootState } from '../../redux/store';
import { getGigByUser } from '../../services/gigService/gigService';
import { getMatchedGigbyuserid } from '../../services/proUserService/proUserService';
var heightY = Dimensions.get("window").height;

const HomeScreen = ({ navigation }: any) => {
  const [selectedIndex, SetSelectedIndex] = useState(0);

  const [lists, setLists] = useState([])
  const [proLists, setProLists] = useState<any[]>([])
  const [skillValue, setSkillValue] = useState("I do clean the house, cook and other various household tasks.  I also play the piano and violin at weddings.")
  const { userType }: any = useSelector((state: RootState) => state.userType)
  const user: any = useSelector((state: RootState) => state.user.user);
  const firstToken = useSelector((state: RootState) => state.firstToken.firstToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userType === "CREATOR")
      getList();
    else
      getProList()
  }, [userType, selectedIndex])

  const getList = () => {
    dispatch(setLoading(true))
    console.log('user.user_id', user.user_id);

    getGigByUser(user.user_id, firstToken).then((res) => {
      if (selectedIndex === 0) {
        let activegig = res.filter((item: any) => item.status === "active")
        setLists(activegig)

      } else {
        let inactivgig = res.filter((item: any) => item.status === "inactive")
        setLists(inactivgig)
      }
      // console.log('all gig this user', res);

      dispatch(setLoading(false))
    }).catch((error) => {
      console.error(JSON.stringify(error));
      dispatch(setLoading(false))
    })
  }
  const getProList = async () => {
    try {
      dispatch(setLoading(true));

      const matchedGigs = await getMatchedGigbyuserid(user.user_id, firstToken);
      setProLists(matchedGigs);
      dispatch(setLoading(false));
    } catch (error) {
      console.error(JSON.stringify(error));
      dispatch(setLoading(false));
    }
  }
  const CreatorHome = () => {
    return (
      <>
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <SegmentedControl
            values={['Active Gigs', 'Inactive Gigs']}
            selectedIndex={selectedIndex}
            backgroundColor='#fff'
            onChange={(event) => {
              SetSelectedIndex(event.nativeEvent.selectedSegmentIndex);
            }}
            style={[GlobalStyle.shadowProp, {
              width: '85%',
              height: 40,
              backgroundColor: "#fff",
              borderRadius: 10,
            }]}
            tintColor='#05E3D5'
            activeFontStyle={{ color: '#fff', fontSize: 20 }}
            fontStyle={{ color: '#000', fontSize: heightY * 0.024 }}
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
                            <Image resizeMode='contain' style={Style.imageStyle}
                              source={{ uri: item.thumbnail_img_url }}
                              onError={(error) => console.error('Image loading error:', error)} />

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

  const ProHome = () => {
    return (
      <ScrollView>
        <View style={[GlobalStyle.homecontainer]}>
          <View style={Style.cardContainer}>
            <Text style={[GlobalStyle.blackColor, Style.commanFont]}>Suggested Gigs</Text>
            {
              proLists?.length > 0 ?
                <>
                  {proLists.map((item: any, index) => (
                    <View key={index}>
                      <Pressable onPress={() => navigation.navigate('View-gig', item)} style={[GlobalStyle.card, GlobalStyle.shadowProp,
                      {
                        display: 'flex', flexDirection: 'row', paddingVertical: 0,
                        paddingHorizontal: 0
                      }]} >
                        <View>
                          <Image resizeMode='contain' style={Style.imageStyle} source={{ uri: item.thumbnail_img_url }}
                            onError={(error) => console.error('Image loading error:', error)} />

                        </View>
                        <View style={{ flex: 1, width: 100 }}>
                          <Text style={[GlobalStyle.blackColor, Style.title]}>
                            {item.title}
                          </Text>
                          <Text style={[GlobalStyle.blackColor, Style.message]}>
                            {item.summary}
                          </Text>
                        </View>
                        <View style={{ padding: 10 }}>
                          <Pressable style={{ backgroundColor: item.gig_type === 'paid' ? '#21AF2F' : '#989898', borderRadius: 5, paddingHorizontal: 10, width: 'auto' }}>
                            <Text style={{ color: '#fff' }}>{item.gig_type}</Text>
                          </Pressable>
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
                      To receive Gig suggestions, please add your skills and/or types of work you would like to do  below.                      </Text>
                  </View>

                  <View style={[GlobalStyle.card, GlobalStyle.shadowProp]}>

                    <Text style={[GlobalStyle.blackColor, { fontSize: 20, fontWeight: 'bold' }]}>
                      My Skills or How I Can Help Others</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                      <TextInput
                        multiline
                        numberOfLines={5}
                        placeholder="Type here..."
                        placeholderTextColor="#fff"
                        value={skillValue ? skillValue : ''}
                        editable={false}
                        onChangeText={(msg: string) => setSkillValue(msg)}
                        style={{ flex: 1, fontSize: 18, color: '#000' }}
                      />
                      <View style={{ alignItems: 'center' }}>
                        {/* <Image source={require('../../assets/icons/mic1.png')} /> */}
                        <MicIcon height={50} width={50} />
                      </View>
                    </View>
                  </View>
                  <View style={{ margin: 20 }}>
                    <Pressable style={GlobalStyle.button} onPress={() => navigation.navigate('Create')}>
                      <Text style={GlobalStyle.btntext}>Add Skills</Text>
                    </Pressable>
                  </View>
                </>
            }
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <SafeAreaView>
      <StatusBar
        backgroundColor="#fff"
        barStyle="dark-content" // Here is where you change the font-color
      />
      {
        userType === "CREATOR" ? <CreatorHome /> : <ProHome />
      }

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