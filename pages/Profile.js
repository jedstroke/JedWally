import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Alert
} from 'react-native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Clipboard from '@react-native-community/clipboard';
const {width} = Dimensions.get("screen");
const myCounter = {
    toastState:false
}
export default class Profile extends React.Component {
    state = {
        name:"Jedidiah", 
        email:"holla@jedsock.com",
        walletID:"undefined",
        phone:"+234 814 006 6686",
        toast:"-200%", 
        infoText:" ",
        clipBoard:"-200%" 
    };
copyToClipboard = (text) => {
        Clipboard.setString(text);
        this.setState({clipBoard:"4%"});
        setTimeout(() => {
            this.setState({
                clipBoard:"-200%"
            });
        }, 2500)
    };    
      infoToastHandler = (value) => {
        let exe2 = () => {
        myCounter.toastState = true;
        if(myCounter.toastState == true){   
            this.setState({ 
            toast: "10%"
        });
        myCounter.toastState = false;
        setTimeout(() => {
            this.setState({
                toast:"-200%" 
            });
        }, 6000);
        if(value == "wallet"){
            this.setState({
               infoText: this.state.walletID 
            });
        }else if(value == "email"){
            this.setState({
                infoText:this.state.email
            }); 
        }else if(value == "phone"){
            this.setState({
                infoText:this.state.phone
            });
        }     
    }    
    };
    exe2();
    };    
componentDidMount(){
}
render() {
        return (
        <> 
        <StatusBar 
            backgroundColor="#5D1767"
            barStyle="light-content"
            hidden={true}
            />
            <SafeAreaView style={styles.mainView}>
            <View style={styles.nav}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}><Icon type="entypo"
            name="chevron-thin-left" color="#CDCDCD" size={20} style={styles.navIcon} 
            /></TouchableOpacity>    
            <Text style={[styles.navText]}>Profile</Text>
            </View>
            <View style={styles.profileBoard}>
            <Text style={{fontSize:23, fontFamily:"Raleway-Regular", color:"#D4D4D4", textAlign:"center", top:"-5.9%"}}>Hello, It's Jedshock 😎</Text>
            </View>
            <TouchableNativeFeedback onPress={() => this.infoToastHandler("wallet")}>
            <View style={[styles.profileCard, {top:"30%"}]}>
                    <View style={styles.profileCont1}>
                    <Icon type="antdesign" name="wallet" color={"#567DF4"} size={20} />
                    </View>
                    <View style={styles.profileCont2}>
                        <Text style={{fontFamily:"Raleway-Regular", color:"#380958"}}>Wallet ID</Text>
                    </View>
                    </View>
                    </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => this.infoToastHandler("phone")}>
            <View style={[styles.profileCard, {top:"40%"}]}>
                    <View style={styles.profileCont1}>
                    <Icon type="antdesign" name="phone" color={"#567DF4"} size={20} />
                    </View>
                    <View style={styles.profileCont2}>
                        <Text style={{fontFamily:"Raleway-Regular", color:"#380958"}}>Phone</Text>
                    </View>
                    </View>
                    </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => this.infoToastHandler("email")}>        
            <View style={[styles.profileCard, {top:"50%"}]}>
                    <View style={styles.profileCont1}>
                    <Icon type="fontisto" name="email" color={"#567DF4"} size={20} />
                    </View>
                    <View style={styles.profileCont2}>
                        <Text style={{fontFamily:"Raleway-Regular", color:"#380958"}}>Email Address</Text>
                    </View>
                    </View>
                    </TouchableNativeFeedback>
            <TouchableNativeFeedback>
            <View style={[styles.profileCard, {top:"60%"}]}>
                    <View style={styles.profileCont1}>
                    <Icon type="material-icon" name="feedback" color={"#567DF4"} size={20} />
                    </View>
                    <View style={styles.profileCont2}>
                        <Text style={{fontFamily:"Raleway-Regular", color:"#380958"}}>Support</Text>
                        </View>
                    </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback>
            <View style={[styles.profileCard, {top:"70%"}]}>
                    <View style={styles.profileCont1}> 
                    <Icon type="simple-line-icon" name="logout" color={"#567DF4"} size={20} />
                    </View>
                    <View style={styles.profileCont2}>
                        <Text style={{fontFamily:"Raleway-Regular", color:"#380958"}}>Sign Out</Text>
                    </View>
                    </View>
            </TouchableNativeFeedback>
            <View style={styles.tabs}>
            <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate("Home")}>
                <View style={{marginLeft:"6%"}}>
                    <Icon
                    type="font-awesome"
                    name="home"
                    color="#959595"
                    size={24}
                    />
                    <Text style={{color:"#959595", fontSize:10}}>Home</Text>
                </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate("Wallet")}>
                <View>
                <Icon
                    type="font-awesome-5"
                    name="wallet"
                    size={24}
                    color="#959595"
                    />
                    <Text style={{color:"#959595", fontSize:10}}>Wallet</Text>
                </View>
                </TouchableWithoutFeedback>
                <View style={{marginRight:"6%"}}>
                <Icon
                    type="font-awesome"
                    name="user"
                    size={24}
                    color="#31055A"
                    />
                    <Text style={{color:"#31055A", fontSize:10}}>Profile</Text>
                </View>
                </View>
            <View style={{display:"flex", position:"absolute", bottom:this.state.toast, width:"95%", height:"8%", elevation:3, backgroundColor:"#2B2929", alignSelf:"center", borderRadius:9, flexDirection:"row"}}>
            <TouchableNativeFeedback onPress={() => this.copyToClipboard(this.state.infoText)}>
            <View style={{flex:1, alignSelf:"auto", alignItems:"center", borderRadius:9, justifyContent:"center"}}>
            <Text style={{fontFamily:"Raleway-Light", alignSelf:"auto", color:"#CDCDCD", fontSize:14}}>{this.state.infoText}</Text></View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback onPress={() => this.copyToClipboard(this.state.infoText)}>
            <View style={{flex:0.1, alignSelf:"auto", borderRadius:9, alignItems:"center", justifyContent:"center"}}>
            <Icon type="font-awesome" name="clone" color="white" /></View></TouchableNativeFeedback>
            </View>
            <View style={{display:"flex", position:"absolute", bottom:this.state.clipBoard, width:"95%", height:"5%", elevation:11, backgroundColor:"#2B2929", alignSelf:"center", borderRadius:9, flexDirection:"row"}}>
            <View style={{flex:1, alignSelf:"auto", alignItems:"center", borderRadius:9, justifyContent:"center"}}>
            <Text style={{fontFamily:"Raleway-Light", alignSelf:"auto", color:"white", fontSize:12}}>Copied to clipboard</Text></View>
            </View>
      </SafeAreaView>
        </>);
    }
}
    const styles = StyleSheet.create({
        mainView:{
            flex: 1,
            flexDirection: "column",
            backgroundColor: "#D4D4D4",
            elevation: -3,
            zIndex: -3
        },
        nav:{
            flex:0.08,
            backgroundColor: "#31055A",
            paddingLeft: 6,
            paddingRight: 5,
            justifyContent: "center",
            alignContent: "center"
        },
        navText:{
            fontFamily: "Roboto",
            fontSize: 15,
            color:"#E06A30",
            alignSelf: "flex-start",
            position: "absolute",
            marginLeft:"10%"
        },
        naviconTouch:{
            width:"5.5%"
        },
        navIcon:{
            fontSize: 16,
            alignSelf: "flex-start",
            color:"white"
        },
        profileBoard:{
            backgroundColor:"#31055A",
            position:"absolute",
            height: "25%",
            width: "100%",
            top:"7.5%",
            zIndex:2,
            elevation:1,
            justifyContent: "center",
            borderBottomLeftRadius: 65,
            borderBottomRightRadius: 65
        },
        profileCard:{
            position:"absolute",
            display: "flex",
            flexDirection:"row",
            height: "8%",
            width: "92%",
            alignSelf:"center",
            backgroundColor:"#E6E6FA",
            shadowColor: 'black',
            shadowOffset: {width: 1, height: 1},
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 2,
            borderRadius:9
        },
        profileCont1:{
            flex:0.25,
            borderRadius:9,
            alignItems:"center",
            justifyContent:"center"
        },
        profileCont2:{
            flex:0.75,
            borderRadius:9,
            alignItems:"flex-start",
            justifyContent:"center",
        },
        tabs:{
            display:"flex",
            flexDirection:"row",
            position:"absolute",
            bottom:0,
            width:width,
            height:"8%",
            padding:7,
            backgroundColor:"#E6E6FA",
            justifyContent:"space-between",
            alignContent:"space-between",
            elevation:9
        }
});