import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  FlatList
} from 'react-native';
import { Icon, Input, Button } from 'react-native-elements';
import moment from 'moment';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-community/async-storage';
import Clipboard from '@react-native-community/clipboard';
const {height, width} = Dimensions.get("screen");  
const externalState= {
    intCoinCount:false,
    myCounter:{
        toastState:false
    },
    getAddress:true
};
export default class Wallet extends React.Component {
    state = {
        changeCurrency: false,
        detailAddrTo:"jedshock.com",
        detailAddrFrom:"jedshock.com",
        detailAmount:" ",
        detailTransactionType:" ",
        detailTimestamp:" ",
        detailStatus:" ",
        detailAddrFrom:"jedshock.com",
        detailAddrTo:"jedshock.com",
        currentBTC:0,
        currentLTC:0,
        currentETH:0,
        clipBoard:"-200%", 
        coinColor: {
            btc: {color:"#4B246E", selected:false},  
            eth: {color:"#4B246E", selected:false}, 
            ltc: {color:"#4B246E", selected:false},  
        },
        btcTxt: 0, 
        ltcTxt: 0,
        ethTxt: 0,
        balance:{
            btc:{bal:0},
            ltc:{bal:0},
            eth:{bal:0}
        },
        walletSplash:"55%",
        modalRecieve:"200%",
        modalSend:"200%",
        modalDetails:"200%",
        user:{
            btc:{addr:undefined},
            ltc:{addr:undefined},
            eth:{addr:undefined}
        },
        toast: "2.4%",
        qrSVG:"Thank you for choosing Jedshock",
        recipientAddr: "jedshock.com",
        rAmount: undefined,
        amount:undefined,
        corrCoinAmount:undefined,
        walletID:undefined,
        listViewData:[]  
    };
realTimePrices = async (cb) => {
let value = await AsyncStorage.getItem('@CurrentPrice:key');
let parsed = JSON.parse(value);
this.setState({
    currentBTC: parsed.btc,
    currentLTC: parsed.ltc,
    currentETH: parsed.eth
});
cb(this.getCurrentBalance, this.getTransactionsHistory, this.getAddresses, this.coinMet)
}
getAddresses = () => {
    fetch('', {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            WalletID: this.state.walletID
        })
    }).then(res => res.json())
    .then(resp => {
        this.setState({
            user:{
                btc:{addr:resp.BTCAddress},
                ltc:{addr:resp.LTCAddress},
                eth:{addr:resp.ETHAddress}
            }  
        })
    }).catch(err => {
        this.toastHandler("No network connection"); 
    });
};        
getWalletID = async (cb, cb2, cb3, cb4) => {
try {
let dataPro1 = await AsyncStorage.getItem('@UserInfo:key');
let data = JSON.parse(dataPro1);
this.setState({
    walletID: data.walletID
}); 
} catch (err) {
    this.setState({
        walletSplash:"55%"
    }); 
}
cb();
cb2();
if(externalState.getAddress == true){
 cb3();
}
cb4("btc");
};
getTransactionsHistory = () => {
    fetch('', { 
        method: 'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'appication/json'
        },
        body:JSON.stringify({
            walletID: this.state.walletID
        })
    })
    .then(res => res.json())
    .then(resp => {
        if(resp[0].TransactionType == "receiving" || resp[0].TransactionType == "sending"){
            this.setState({
                listViewData: resp, 
                walletSplash:"200%"
            }); 
        }
    })
    .catch(err => {
        this.toastHandler("No network connection");
        this.setState({ 
            walletSplash:"55%"
        });
    });
    
}; 
getCurrentBalance = () => {
    fetch('', {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body:JSON.stringify({WalletID:this.state.walletID}) 
    }).then(res => res.json())    
    .then(resp => {
       let proAmount = ((Number(resp.BTCBalance) * Number(this.state.currentBTC))+(Number(resp.LTCBalance) * Number(this.state.currentLTC))+
        (Number(resp.ETHBalance) * Number(this.state.currentETH))).toFixed(0);
        this.setState({
            amount: this.monetize(proAmount),
            balance:{
                btc:{bal:((resp.BTCBalance * this.state.currentBTC).toFixed(0))},
                ltc:{bal:((resp.LTCBalance * this.state.currentLTC).toFixed(0))},
                eth:{bal:((resp.ETHBalance * this.state.currentETH).toFixed(0))}
            }
         });
    }).catch(() => {
        this.toastHandler("No network connection");
    });
}
transaction = (val) => {
    this.toastHandler("Hold on, don't double spend");
    let data; 
    if(val == "send"){
        data = {
            header: "send",
            walletID: this.state.walletID,
            cryptoType: this.state.coinColor.btc.selected ? "BTC" : this.state.coinColor.ltc.selected ? "LTC" : this.state.coinColor.eth.selected ? "ETH" : null,
            timeStamp: moment().format('MMMM Do YYYY, h:mm:ss a'),
            transType:"sending",
            recepientAmount: this.state.corrCoinAmount,
            recepientAddress: this.state.recipientAddr
        };
    }
     fetch('', {
        method: 'POST',
         headers:{
            'Accept':'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)
     })
    .then(res => res.json())
    .then(resp => {
        if(resp.header == "Success"){
            this.realTimePrices(this.getWalletID);
            val == "receive" ? this.toggleRecModal(false):this.toggleSenModal(false);
        }else{
        }
    }).catch(() => {
        this.toastHandler("No network connection");
    });
}; 
monetize = (val) => {
    let comma = ",";
    let mainData;
    let pro1 = val;
    let pro2 = pro1.length;
    if (pro2 == 4){
        let pro21 = pro1[0];
        let pro22 = pro1.slice(1);
        mainData = pro21+comma+" "+pro22;
    }
    else if (pro2 == 5){
        let pro21L = pro1[0]+val[1];
        let pro22L = pro1.slice(2);
        mainData = pro21L+comma+" "+pro22L;
    }
    else if (pro2 == 6){
        let pro21L = pro1[0]+pro1[1]+val[2];
        let pro22L = pro1.slice(3);
        mainData = pro21L+comma+" "+pro22L;
    }
    else if (pro2 == 7){
        let pro21L = pro1[0]+comma+" "+val[1]+val[2]+val[3];
        let pro22L = pro1.slice(4);
        mainData = pro21L+comma+" "+pro22L;
    }
    else if (pro2 == 8){
        let pro21L = pro1[0]+val[1]+comma+" "+val[2]+val[2]+val[3];
        let pro22L = pro1.slice(5);
        mainData = pro21L+comma+" "+pro22L;
    }
    else{
        mainData = val;
    }
    return mainData;
    }          
setRAmount = (text) => {
    let dataPro1 = Number(text);
    let data = dataPro1 / (this.state.coinColor.btc.selected ? Number(this.state.currentBTC): this.state.coinColor.ltc.selected ? Number(this.state.currentLTC): this.state.coinColor.eth.selected ? Number(this.state.currentETH): null);
    this.setState({
        rAmount: text,
        corrCoinAmount: String(data)
    });
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
readAddress = e => {
    this.setState({recipientAddr: e.data});
}
toggleQrScanner = (bool) => {
    this.setState({recepientAddress:" "});
    let visible;
    if(bool){
        visible = true; 
    }else{
        visible = false;
    }
    this.setState({
        qrScanner: visible
    });
}    
qrCodeDisplay = (bool) => {
    let returnable;
    if(bool){
        returnable = (<View style={[styles.qrScanner, {elevation:12}]}> 
        <View style={{alignSelf:"flex-end", right:"-1.3%", top:"-0.8%"}}>
            <Icon
            raised 
            type="ant-design"
            name="close"
            size={10}
            color="#959595"
            reverse={true}
            onPress={() => this.toggleQrScanner(false)}
            />    
        </View>     
        <QRCodeScanner
        reactivate={bool}
        onRead={this.readAddress}
        vibrate={Platform.OS == "android"}
        flashMode={RNCamera.Constants.FlashMode.off} 
        cameraStyle={{alignSelf:"center", width:"98%", top:"-9.5%"}}
        />        
        <View style={{display:"flex", height:"20.5%", width:"98%", alignSelf:"center"}}>
        <TouchableWithoutFeedback onPress={() => this.copyToClipboard(this.state.recipientAddr)}> 
            <View style={{flex:0.5, justifyContent:"center", alignItems:"center", flexDirection:"row", top:"0%"}}>
                <View style={{flex:0.1}}>
            <Icon type="feather" name="clipboard" color="#FF9800"
                size={25}                
                />
                </View>
        <View style={{flex:0.9}}><Text style={{fontFamily:"Raleway-Medium", fontSize:12, textAlign:"center", color:"#5E666C"}}>{this.state.recipientAddr}</ Text></View>
            </View>
            </TouchableWithoutFeedback>            
            <View style={{flex:0.5, justifyContent:"center", alignItems:"center"}}>
            <Button 
            title="Got It?"
            titleStyle={{fontFamily:"Raleway-Bold", color:"#E6E6FA", fontSize:15}}
            containerStyle={{bottom:"0%"}}
            buttonStyle={{width:(width/2.7), height:37, borderRadius:20, alignSelf:"center"}}
            onPress={() => this.toggleQrScanner(false)}
            />
            </View>
        </View>
        </View>);
    }else{
        returnable = (<View style={[{top:"200%"}]}></View>);
    }
    return returnable;
};    
    toggleRecModal = (bool) => {
       let modal;
        if(bool){
            modal = "20.6%";
        }else{
            modal = "200%";
        }
        let qrSVG = this.state.coinColor.btc.selected ? this.state.user.btc.addr : this.state.coinColor.ltc.selected ? this.state.user.ltc.addr : this.state.coinColor.eth.selected ? this.state.user.eth.addr : "";
        this.setState({
            modalRecieve: modal,
            qrSVG: qrSVG
        });
    }    
    toggleSenModal = (bool) => {
        let modal;
        if(bool){
            modal = "20.6%";
        }else{
            modal = "200%";
        }
        this.setState({
            modalSend: modal
        });
    }
    coinMet = (coin) => {
        var coinColors = ["#4B246E", "#4B246E", "#4B246E"];
        var selectedArr = [false, false, false];
        var selectedTxt = [0, 0, 0]
        if(coin == "btc"){
            externalState.intCoinCount = true;
            coinColors[0] = "#E06A30";
            selectedArr[0] = true;
            selectedArr[1] = false;
            selectedArr[2] = false;
            selectedTxt[0] = 1;
            selectedTxt[1] = 0;
            selectedTxt[2] = 0;
        }
        if(coin == "eth"){
            coinColors[1] = "#E06A30";
            selectedArr[1] = true;  
            selectedArr[2] = false;
            selectedArr[0] = false;            
            selectedTxt[1] = 1;  
            selectedTxt[2] = 0;
            selectedTxt[0] = 0;            
        }
        if(coin == "ltc"){
            coinColors[2] = "#E06A30";
            selectedArr[2] = true;
            selectedArr[0] = false;
            selectedArr[1] = false;
            selectedTxt[2] = 1;
            selectedTxt[0] = 0;
            selectedTxt[1] = 0;
            }
        this.setState({            
            coinColor: {
            btc: {color: coinColors[0], selected:selectedArr[0]},
            eth: {color: coinColors[1], selected:selectedArr[1]},
            ltc: {color: coinColors[2], selected:selectedArr[2]} 
            }, 
            btcTxt: selectedTxt[0],
            ltcTxt: selectedTxt[2],
            ethTxt: selectedTxt[1]
        });        
}
toastHandler = (text) => {
    let exe2 = () => {
        externalState.toastState = true;
        if(externalState.toastState == true){   
        this.setState({ 
        toast: "2.4%",
        toastText:text
    });
    externalState.toastState = false;
    setTimeout(() => {
        this.setState({ 
            toast: "200%"
        });
    }, 5000);    
}    
};
exe2();
};
refreshHandler = () => {
    this.toastHandler("Refreshing . . .");
    this.realTimePrices(this.getWalletID);
}
modalDetailHandler = (indx, bool) => {
let data = this.state.listViewData;
let detailStatus = " ";
let detailTimestamp = " ";
let detailTransactionType = " ";
let detailAmount = " ";
let detailAddrTo = " ";
let detailAddrFrom = " ";
if(indx !== undefined){
let proData = data[indx];
detailStatus = proData.Status;
detailTimestamp = proData.Timestamp;
detailTransactionType = proData.TransactionType == "receiving" ? "Receiving":"Sending";
if(proData.TransactionType == "receiving"){
detailAmount = proData.CryptoType == "BTC" ? `${proData.AmountReceived == null ? "Pending":proData.AmountReceived} BTC`:proData.CryptoType == "LTC" ? `${proData.AmountReceived == null ? "Pending":proData.AmountReceived} LTC`:proData.CryptoType == "ETH" ? `${proData.AmountReceived == null ? "Pending":proData.AmountReceived} ETH`: null;
}else if(proData.TransactionType == "sending"){
detailAmount = proData.CryptoType == "BTC" ? `${proData.AmountSent == null ? "Pending":proData.AmountSent} BTC`:proData.CryptoType == "LTC" ? `${proData.AmountSent == null ? "Pending":proData.AmountSent} LTC`:proData.CryptoType == "ETH" ? `${proData.AmountSent == null ? "Pending":proData.AmountSent} ETH`: null;
}
detailAddrTo = proData.TransactionType == "receiving" ? (proData.CryptoType == "BTC" ? this.state.user.btc.addr : proData.CryptoType == "LTC" ? this.state.user.ltc.addr : proData.CryptoType == "ETH" ? this.state.user.eth.addr : "") : proData.ExternalAddress;
detailAddrFrom = proData.TransactionType == "sending" ? (proData.CryptoType == "BTC" ? this.state.user.btc.addr : proData.CryptoType == "LTC" ? this.state.user.ltc.addr : proData.CryptoType == "ETH" ? this.state.user.eth.addr : "") : proData.ExternalAddress;   
}else{
detailStatus = " ";
detailTimestamp = " ";
detailTransactionType = " ";
detailAmount = " ";
detailAddrTo = " ";
detailAddrFrom = " ";    
}
let modal;
    if(bool){
        modal = "25.6%";
    }else{
        modal = "200%";
    }
    this.setState({
        modalDetails: modal,
        detailStatus:detailStatus,
        detailTimestamp:detailTimestamp,
        detailTransactionType:detailTransactionType,
        detailAmount:detailAmount,
        detailAddrTo:detailAddrTo,
        detailAddrFrom:detailAddrFrom
    });
}
componentDidMount(){
// this.realTimePrices(this.getWalletID);
this.toastHandler("Hold on");
}
render() { 
    return (<> 
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
            <Text style={[styles.navText]}>Wallet</Text>
            </View>
            <View style={styles.profileBoard}>
            <TouchableWithoutFeedback onPress={() => {this.setState((prevState) => { 
            return {changeCurrency:!prevState.changeCurrency}
            })}}>
            <Icon type="simple-line-icon" name="shuffle" color="#CDCDCD" size={15} containerStyle={{positon:"relative"}} /></TouchableWithoutFeedback>
            <Text style={{fontSize:20, fontFamily:"Raleway-Regular", color:"#D4D4D4", textAlign:"center", top:"3%"}}>Combined Balance</Text> 
            <View style={{display:"flex", height:"16%", width:"100%", alignSelf:"center", top:"2.4%", flexDirection:"row"}}>
                <View style={{flex:1, justifyContent:"center"}}>
                <Text style={{fontSize:17, top:"4%", fontFamily:"Raleway-Regular", color:"#D4D4D4", textAlign:"right"}}>USD </Text>    
                </View>
                <View style={{flex:1, justifyContent:"center"}}>
                <Text style={{fontSize:17, fontFamily:"Raleway-SemiBold", top:"-3.5%", color:"#D4D4D4", textAlign:"left"}}>{this.state.amount}</Text>    
                </View>
            </View>
            </View>
            <View style={styles.coins}>
            <View style={styles.btcCont}>
            <TouchableWithoutFeedback onPress={() => this.coinMet("btc")}>    
            <Icon type="material-community" name="bitcoin" reverse={true} reverseColor="white" color={this.state.coinColor.btc.color} size={15} containerStyle={[styles.coinIcon]} />
            </TouchableWithoutFeedback>    
            <Text style={[{fontFamily:"Raleway-Light", opacity:this.state.btcTxt, color:"#E6E6FA"}]}>{this.state.changeCurrency == false ? `USD ${this.monetize(this.state.balance.btc.bal)}`:`${String((Number(this.state.balance.btc.bal)/Number(this.state.currentBTC)).toFixed(2))} BTC`}</Text> 
            </View> 
            <View style={styles.ltcCont}>
            <TouchableWithoutFeedback onPress={() => this.coinMet("ltc")}>
            <Icon type="material-community" name="litecoin" reverse={true} reverseColor="white" color={this.state.coinColor.ltc.color} size={15} containerStyle={[styles.coinIcon]} 
             /></TouchableWithoutFeedback>
            <Text style={[{fontFamily:"Raleway-Light", color:"#E6E6FA", opacity:this.state.ltcTxt,}]}>{this.state.changeCurrency == false ? `USD ${this.monetize(this.state.balance.ltc.bal)}`:`${String((Number(this.state.balance.ltc.bal)/Number(this.state.currentLTC)).toFixed(2))} LTC`}</Text>
            </View>
            <View style={styles.ethCont}>
            <TouchableWithoutFeedback onPress={() => this.coinMet("eth")}>
            <Icon type="material-community" name="ethereum" reverse={true} reverseColor="white" color={this.state.coinColor.eth.color} size={15} containerStyle={[styles.coinIcon]}  />
            </TouchableWithoutFeedback>    
            <Text style={[{fontFamily:"Raleway-Light", color:"#E6E6FA", opacity:this.state.ethTxt} ]}>{this.state.changeCurrency == false ? `USD ${this.monetize(this.state.balance.eth.bal)}`:`${String((Number(this.state.balance.eth.bal)/Number(this.state.currentETH)).toFixed(2))} ETH`}</Text> 
            </View>    
            </View>
            <View style={styles.transCard}>
            <TouchableWithoutFeedback onPress={() => this.toggleSenModal(true)}>
                <View style={styles.transact}>   
                    <Icon
                    type="font-awesome"
                     name="send" 
                    color="#31055A"
                    size={22}
                    />
                    <Text style={{color:"#31055A", fontSize:11, fontFamily:"Roboto-Medium"}}>Send</Text>
                </View>
                </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => this.toggleRecModal(true)}>
                <View style={styles.transact}>
                    <Icon
                    type="font-awesome"
                    name="send"
                    color="#31055A"
                    size={22}
                    style={styles.recieveIco}
                    />
                    <Text style={{color:"#31055A", fontSize:11, textAlign:"center", fontFamily:"Roboto-Medium"}}>Recieve</Text>
                    </View>
                    </TouchableWithoutFeedback>
                </View>
                <TouchableWithoutFeedback onPress={() => this.refreshHandler()}> 
                <View style={{position:"absolute", top:"41.1%", left:"80%", height:"5%", width:"18%"}}><Icon type="antdesign" name="reload1" size={18} color="#6D6C6B" /></View></TouchableWithoutFeedback>
                <Text style={{fontFamily:"Raleway-Medium", fontSize:20, position:"absolute", top:"40%", alignSelf:"center", color:"#4B246E"}}>Transaction History</Text>
                <FlatList  
                    style={{
                    display:"flex",    
                    position:"absolute",
                    top:"46.3%",
                    height:"40%", 
                    width:"100%", 
                    alignSelf:"center",
                    backgroundColor:"#D4D4D4",
                    borderRadius:9}}
                    data={this.state.listViewData}
                    renderItem={({ item, index }) => 
                    (<TouchableNativeFeedback onPress={() => this.modalDetailHandler(index, true)}>
                    <View style={{height:(height/11), width:width-11,   alignSelf:"center", marginBottom:"2%", backgroundColor:"#E6E6FA", elevation:2, borderRadius:9}}>
                    <View style={{flex:2}}><View style={{height:"100%", width:"100%", elevation:2, flexDirection:"row"}}><View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <Icon 
                    type="material-community" 
                    name={item.CryptoType == "BTC" ? "bitcoin": item.CryptoType == "LTC" ? "litecoin": item.CryptoType == "ETH" ? "ethereum": null} reverse={true} reverseColor="white" 
                    color={item.CryptoType == "BTC" ? "#BC5841": item.CryptoType == "LTC" ? "#E06A30": item.CryptoType == "ETH" ? "#FB5348": null} 
                    size={17} />
                    </View>
                    <View style={{flex:3.2}}>
                    <Text style={{color:"#4B246E", fontFamily:"Raleway-SemiBold"}}>
                    Timestamp
                    </Text>
                    <Text style={{fontFamily:"Raleway-Regular", color:"#4A4A4A"}}>
                    {item.Timestamp}   
                    </Text>
                    </View>    
                    <View style={{flex:2}}>
                    {item.Status == "Pending" ? (
                    <View style={{width:"100%", height:"100%", justifyContent:"center", alignItems:"center", backgroundColor:"#C9BF1E"}}>
                    <Text style={{fontFamily:"Raleway-Regular", color:"#4A4A4A", fontSize:17}}>Pending</Text>
                    </View>):item.Status == "Success" ? (<View style={{width:"100%", height:"100%",justifyContent:"center", alignItems:"center", backgroundColor:"#FFCD40"}}>
                    <Text style={{fontFamily:"Raleway-Regular", color:"#4A4A4A", fontSize:17}}>Success</Text>
                    </View>):item.Status == "Unsuccess" ? (
                    <View style={{width:"100%", height:"100%", justifyContent:"center", alignItems:"center", backgroundColor:"#FB5348"}}>
                    <Text style={{fontFamily:"Raleway-Regular", color:"white", fontSize:17}}>Unsuccess</Text>
                    </View>   
                    ): null}
                    </View>
                    </View>
                    </View>    
                    </View>
                    </TouchableNativeFeedback>)}
                    keyExtractor={ item => item.Timestamp }   
                />      
                <View style={{height:"50%", width:"100%", position:"absolute", top:this.state.walletSplash}}>    
                    <Icon 
                    type="evilicon"
                    name="calendar"
                    color="#D88D73"
                    size={100}
                    />
                    <Text style={{textAlign:"center", fontFamily:"Raleway-Light", fontSize:17, color:"#959595"}}>No entries yet</Text>
                </View>
                <View style={{position:"absolute", bottom:"9%", left:this.state.toast, width:"95%", height:"8%", elevation:3, justifyContent:"center", alignItems:"center", backgroundColor:"#2B2929", alignSelf:"center", borderRadius:5}}>
        <Text style={{fontFamily:"Raleway-Light", textAlign:"left", color:"white", fontSize:15}}>{this.state.toastText}</Text>
            </View>
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
                <View>
                <Icon
                    type="font-awesome-5"
                    name="wallet"
                    size={24}
                    color="#31055A"
                    />
                    <Text style={{color:"#31055A", fontSize:10}}>Wallet</Text>
                </View>
                <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate("Profile")}>
                <View style={{marginRight:"6%"}}>
                <Icon
                    type="font-awesome"
                    name="user"
                    size={24}
                    color="#959595"
                    />
                    <Text style={{color:"#959595", fontSize:10}}>Profile</Text>
                </View>
                </TouchableWithoutFeedback>
                </View>
                <View style={[styles.modalSend, {top:this.state.modalSend}]}>
            <View style={{alignSelf:"flex-end"}}>
            <Icon
            raised 
            type="ant-design"
            name="close"
            size={10}
            color="#9E9E9E"
            reverse={true}
            onPress={() => this.toggleSenModal(false)} 
            />    
            </View>
            <View style={{alignSelf:"center", top:"-7%"}}>
                <Icon
                reverse 
                type="material-community"
                name={this.state.coinColor.btc.selected ? "bitcoin": this.state.coinColor.ltc.selected ? "litecoin": this.state.coinColor.eth.selected ? "ethereum": null}
                size={30}
                color="#FF9800"
                /> 
            </View>
            <Text style={{fontFamily:"Raleway-Medium", fontSize:20, color:"#9E9E9E", textAlign:"center", top:"-7%"}}>{this.state.coinColor.btc.selected ? "BTC": this.state.coinColor.ltc.selected ? "LTC": this.state.coinColor.eth.selected ? "ETH": null} {this.state.corrCoinAmount == "NaN" ? " ":this.state.corrCoinAmount}</Text>
            <Input
            value={this.state.rAmount}
            inputStyle={{fontFamily:"Raleway-Medium", fontSize:20, color:"#9E9E9E"}}
            onChangeText={rAmount => this.setRAmount(rAmount)} 
            keyboardType="numeric"
            leftIcon={{type:"font-awesome-5", name:"money-bill", size:20, color:"#89C440"}}
            placeholder="Amount (USD)"
            containerStyle={{width:"89%", height:"15%", alignSelf:"center", top:"-5.6%"}}
            />
            <Input
            inputStyle={{fontFamily:"Raleway-Medium", fontSize:20, color:"#9E9E9E"}}
            value={this.state.recipientAddr}
            onChangeText={recipientAddr => this.setState({recipientAddr})} 
            leftIcon={
                <Icon 
                type="entypo"
                name="address"
                color="#89C440"
                size={20}
                />
            }
            containerStyle={{width:"89%", height:"15%", alignSelf:"center", top:"-5.6%"}}
            placeholder="Address"
            />
            <Text style={{color:"#9E9E9E", textAlign:"center", fontFamily:"Raleway-SemiBold", fontSize:15, top:"-2.56%"}}>Our fees are dynamic, and negligible. It'd reflect on your wallet history.</Text>
            <View style={{alignSelf:"center", top:"20.3%"}}>
            </View>
            <View style={{display:"flex", flexDirection:"row", alignSelf:"center", position:"absolute", bottom:"-1.8%", width:"89%", height:"17%"}}>
            <View style={{flex:0.5}}>
            <Button 
            title="SCAN"
            onPress={() => this.toggleQrScanner(true)}
            icon={
                <Icon 
                type="font-awesome-5"
                name="qrcode"
                size={15}
                color="#8D99A3"
                style={{top:"1%", right:"1%"}}
                />
            }
            titleStyle={{fontFamily:"Raleway-Bold", color:"#E6E6FA", fontSize:15}}
            buttonStyle={{width:(width/2.7), height:37, borderRadius:20, alignSelf:"center"}}
            />
            </View>
            <View style={{flex:0.5}}>
            <Button 
            onPress={() => this.transaction("send")}
            title="SEND"
            titleStyle={{fontFamily:"Raleway-Bold", color:"#E6E6FA", fontSize:15}}
            buttonStyle={{width:(width/2.7), height:37, borderRadius:20, alignSelf:"center"}}
            />
            </View>
            </View>
            </View>
            <View style={[styles.modalRecieve, {top:this.state.modalRecieve}]}>
            <View style={{alignSelf:"flex-end"}}>
            <Icon
            raised 
            type="ant-design"
            name="close"
            size={10}
            color="#959595"
            reverse={true}
            onPress={() => this.toggleRecModal(false)}
            />    
            </View>
                <View style={{alignSelf:"center", top:"-7%"}}>
                <Icon
                reverse 
                type="material-community"
                name={this.state.coinColor.btc.selected ? "bitcoin": this.state.coinColor.ltc.selected ? "litecoin": this.state.coinColor.eth.selected ? "ethereum": null}
                size={33}
                color="#FF9800"
                />
                </View>
                <View style={{alignSelf:"center", padding:10, backgroundColor:"#E6E6FA", borderRadius:5, elevation:1,
                top:"-4.85%"}}>
                <QRCode 
                value={this.state.qrSVG}
                size={130}
                />                
                </View>
                <TouchableWithoutFeedback onPress={() => this.copyToClipboard(`${this.state.coinColor.btc.selected ? this.state.user.btc.addr : this.state.coinColor.ltc.selected ? this.state.user.ltc.addr : this.state.coinColor.eth.selected ? this.state.user.eth.addr : ""}`)}>
                <View style={{display:"flex", height:"6.5%", width:"98%", alignSelf:"center", flexDirection:"row", top:"-1%"}}>
                <View style={{flex:0.06}}><Icon type="feather" name="clipboard" size={20} color="#567DF4" /></View><View style={{flex:0.94}}><Text style={{textAlign:"center", fontFamily:"Raleway-Light", color:"#4A4A4A", fontSize:13}}>{this.state.coinColor.btc.selected ? this.state.user.btc.addr : this.state.coinColor.ltc.selected ? this.state.user.ltc.addr : this.state.coinColor.eth.selected ? this.state.user.eth.addr : null}</Text></View></View></TouchableWithoutFeedback>
                <View style={{alignSelf:"center", position:"absolute", bottom:"4%", width:"65%", height:"10%"}}>
                <Button
                title="DONE" 
                titleStyle={{fontFamily:"Raleway-Bold", color:"#E6E6FA", fontSize:15}}
                buttonStyle={{width:(width/2.4), height:37, borderRadius:20, alignSelf:"center"}}
                onPress={() => this.toggleRecModal(false)}
                />
                </View>
            </View>
            {this.qrCodeDisplay(this.state.qrScanner)}
            <View style={[styles.modalDetails, {top:this.state.modalDetails}]}>
            <View style={{alignSelf:"flex-end"}}>
            <Icon
            raised 
            type="ant-design"
            name="close"
            size={10}
            color="#9E9E9E"
            reverse={true}
            onPress={() => this.modalDetailHandler(undefined, false)} 
            />
            </View>
            <Text style={{color:"#4B246E", textAlign:"center", fontFamily:"Raleway-SemiBold", fontSize:18}}>Status</Text>
            <Text style={{fontFamily:"Raleway-Regular", textAlign:"center", color:"#4A4A4A", marginBottom:"3%"}}>{this.state.detailStatus}</Text>
            <Text style={{color:"#4B246E", textAlign:"center", fontFamily:"Raleway-SemiBold", fontSize:18}}>Timestamp</Text>
            <Text style={{fontFamily:"Raleway-Regular", textAlign:"center", color:"#4A4A4A", marginBottom:"3%"}}>{this.state.detailTimestamp}</Text>    
            <Text style={{color:"#4B246E", textAlign:"center", fontFamily:"Raleway-SemiBold", fontSize:18}}>Transaction Type</Text>
            <Text style={{fontFamily:"Raleway-Regular", textAlign:"center", color:"#4A4A4A", marginBottom:"3%"}}>{this.state.detailTransactionType}</Text>    
            <Text style={{color:"#4B246E", textAlign:"center", fontFamily:"Raleway-SemiBold", fontSize:18}}>Amount</Text>
            <Text style={{fontFamily:"Raleway-Regular", textAlign:"center", color:"#4A4A4A", marginBottom:"3%"}}>{this.state.detailAmount}</Text>
            <Text style={{color:"#4B246E", textAlign:"center", fontFamily:"Raleway-SemiBold", fontSize:18}}>From</Text>
            <Text style={{fontFamily:"Raleway-Regular", textAlign:"center", color:"#4A4A4A", marginBottom:"3%"}}>{this.state.detailAddrFrom}</Text>
            <Text style={{color:"#4B246E", textAlign:"center", fontFamily:"Raleway-SemiBold", fontSize:18}}>To</Text>
            <Text style={{fontFamily:"Raleway-Regular", textAlign:"center", color:"#4A4A4A"}}>{this.state.detailAddrTo}</Text>    
            </View>
            <View style={{display:"flex", position:"absolute", bottom:this.state.clipBoard, width:"95%", height:"5%", elevation:11, backgroundColor:"#2B2929", alignSelf:"center", borderRadius:9, flexDirection:"row"}}>
            <View style={{flex:1, alignSelf:"auto", alignItems:"center", borderRadius:9, justifyContent:"center"}}>
            <Text style={{fontFamily:"Raleway-Light", alignSelf:"auto", color:"#FF9800", fontSize:12}}>Copied to clipboard</Text></View>
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
            color:"white", 
        },
        profileBoard:{
            backgroundColor:"#31055A",
            position:"absolute",
            height: "30%",
            width: "100%",
            top:"7.5%",
            elevation:1,
            borderBottomLeftRadius: 65,
            borderBottomRightRadius: 65
        },
        coins:{
            display:"flex",
            flexDirection:"row",
            alignSelf: "center",
            height:"22%",
            width:"80%",
            position:"absolute",
            top:"19%",
            elevation:3
        },
        coinIcon:{
            position:"relative",
            top:"5%"
        },
        btcCont:{
            flex:1,
            alignItems:"center"
        },
        ethCont:{
            flex:1,
            alignItems:"center"
        },
        ltcCont:{
            flex:1,
            alignItems:"center"
        },
        transCard:{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            top: "32%",
            borderRadius: 6,
            height: "7%",
            width: "85%",
            alignSelf: "center",
            backgroundColor: "#E6E6FA",
            elevation: 2
        },
        transact:{
            alignItems:"center",
            justifyContent:"center",
            width:"50%",
            borderTopLeftRadius: 10,
            borderRadius: 10,
        },
        recieveIco:{
            transform: [{ rotate:"180deg" }],
        },
        crytoCard:{
            position:"absolute",
            display: "flex",
            flexDirection:"row",
            height: "8%",
            width: "92%",
            alignSelf:"center",
            backgroundColor:"#E6E6FA",
            elevation: 2,
            borderRadius:9
        },
        cryptoCont1:{
            flex:0.25,
            borderRadius:9,
            alignItems:"center",
            justifyContent:"center"
        },
        cryptoCont2:{
            flex:0.75,
            borderRadius:9,
            alignItems:"flex-start",
            justifyContent:"center",
        },
        modalRecieve:{
            height:"60%",
            width:"97%",
            backgroundColor:"#D4D4D4",
            borderRadius:10,
            position:"absolute",
            alignSelf:"center",
            elevation:5
        },
        modalSend:{
            height:"60%",
            width:"97%",
            backgroundColor:"#D4D4D4",
            borderRadius:10,
            position:"absolute",
            alignSelf:"center",
            elevation:4
        },
        modalDetails:{
            height:"75%",
            width:"97%",
            backgroundColor:"#D4D4D4",
            borderRadius:10,
            position:"absolute",
            alignSelf:"center",
            elevation:4
        },
        qrScanner:{
            height:"98%",
            width:"98%",
            backgroundColor:"#D4D4D4",
            borderRadius:10,
            position:"absolute",
            alignSelf:"center"
        },
        centerText: {
            flex: 1,
            fontSize: 18,
            padding: 32,
            color: '#777'
          }, 
        textBold: {
            fontWeight: '500',
            color: '#000'
          },
        buttonText: {
            fontSize: 21,
            color: 'rgb(0,122,255)'
          },
        buttonTouchable: {
            padding: 16
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