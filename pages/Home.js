import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  PanResponder,
  TouchableWithoutFeedback,
  BackHandler 
} from 'react-native';
import { Icon } from 'react-native-elements';
import Svg, {
    Defs,    
    Stop,
    LinearGradient,
    Path,
    } from 'react-native-svg';
import * as path from 'svg-path-properties';
import * as shape from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3';
import AsyncStorage from '@react-native-community/async-storage'
const {height, width} = Dimensions.get("screen");
const cheight = (height/4)+15;
const myCounter = {
    toastState:false,
    navicon: 0,
    menuColor: false,
    naviColor: "#CDCDCD",
    scrollViewShit: 1,
    intCoin: 0
};
const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var dateRef = undefined;
var defaultData = [
    {x: new Date(2018, 9, 1), y: 100},
    {x: new Date(2018, 9, 4), y: 300},
    {x: new Date(2018, 9, 7), y: 500},
    {x: new Date(2018, 9, 10), y: 700},
    {x: new Date(2018, 10, 1), y: 1000},
    {x: new Date(2018, 10, 4), y: 200}
];
let state = {
    currentBTC:undefined,
    currentLTC:undefined,
    currentETH:undefined,
    stop: false 
};
var defaultArrayLength =  defaultData.length;
var defaultScaleX = scaleTime().domain([defaultData[0].x, defaultData[defaultArrayLength-1].x]).range([0, width]);
var defaultScaleY = scaleLinear().domain([100, 100]).range([cheight, 0]);
var defaultLine = shape.line()
.x(d => defaultScaleX(d.x))
.y(d => defaultScaleY(d.y))
.curve(shape.curveBasis) (defaultData);
var defaultProperties = path.svgPathProperties(defaultLine);
var defaultLineLength = defaultProperties.getTotalLength();
const cursorRadius = 7;
const labelWidth = (width / 3  + 50);
export default class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            X: new Animated.Value(0),
            data: defaultData,
            arrayLength: defaultArrayLength,
            line: defaultLine,
            dataReverse: defaultData.reverse(),
            properties: defaultProperties,
            lineLength: defaultLineLength,
            color: "#CDCDCD",
            translate: new Animated.Value(-500), 
            coinColor: {
                btc: {color:"#31055A", selected:false},  
                eth: {color:"#31055A", selected:false}, 
                ltc: {color:"#31055A", selected:false},  
            },
            currency:"$",
            amountCombined: undefined,
            mainCurrency:"$",
            defaultDataState: true,
            currentBTC: undefined,
            currentLTC: undefined,
            currentETH: undefined,
            toast:0
        };
    }
realTimePrices = (msgx) => {
let msg = JSON.parse(msgx);
let arg = msgx;
if(arg.includes("bitcoin") || arg.includes("litecoin") || arg.includes("ethereum")){
msg.bitcoin !== undefined ? state.currentBTC = msg.bitcoin : state.currentBTC = state.currentBTC;
msg.litecoin !== undefined ? state.currentLTC = msg.litecoin : state.currentLTC = state.currentLTC;
msg.ethereum !== undefined ? state.currentETH = msg.ethereum : state.currentETH = state.currentETH;
}
this.setState({
    currentBTC: state.currentBTC,
    currentLTC: state.currentLTC,
    currentETH: state.currentETH
});
let kickStarter = async () => {if(state.currentBTC !== undefined && state.currentLTC !== undefined && state.currentETH !== undefined && state.stop == false){
    await AsyncStorage.setItem('@CurrentPrice:key', JSON.stringify({
        btc: state.currentBTC,
        ltc: state.currentLTC,
        eth: state.currentETH
    }));
    state.stop = true;
}};
kickStarter()
}
moveCursor(value) {
        var {x, y} = this.state.properties.getPointAtLength(this.state.lineLength - value);
        this.cursor.current.setNativeProps({top: y-cursorRadius, left: x-cursorRadius});
        const labelX = x;
        if(!this.state.defaultDataState) {
            if(dateRef == undefined) { 
          dateRef = Math.round(labelX);
        } 
        let procArrPos1 = (this.state.arrayLength*(labelX / dateRef))-1;
        let procArrPos = Math.round(procArrPos1);
        let ayl1 = procArrPos.toString();
        if(ayl1.includes("-")) {
          procArrPos = 0;
        }
        let monetize = (val) => {
            // localestring polyfill;
            let comma = ",";
            let mainData;
            let pro1 = val;
            let pro2 = pro1.length
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
            else{
                mainData = val;
            }
            return mainData;
        }
        let procDate = this.state.dataReverse[procArrPos].x;
        let labelMonth = month[(procDate.getMonth())];
        let labelDate = (procDate.getDate()).toString();
        this.labelX.current.setNativeProps({text:`${labelMonth} ${labelDate}`});
        let labelCash = Math.round(this.state.dataReverse[procArrPos].y);
        let labelCashY = labelCash.toString(); 
        this.labelY.current.setNativeProps({text:`${this.state.currency} ${monetize(labelCashY)}`}) ;
    }
      }
monetize = (val) => {
let comma = ",";
let mainData;
let pro1 = val;
let pro2 = pro1.length
if (pro2 == 4){
    let pro21 = pro1[0];
    let pro22 = pro1.slice(1);
    mainData = pro21+comma+" "+pro22;
}
else if (pro2 == 6){
    let pro21L = pro1[0]+val[1];
    let pro22L = pro1.slice(2);
    mainData = pro21L+comma+" "+pro22L;
}
else if (pro2 == 7){
    let pro21L = pro1[0]+val[1];
    let pro22L = pro1.slice(2);
    mainData = pro21L+comma+" "+pro22L;
}
else if (pro2 == 8){
    let pro21L = pro1[0]+val[1];
    let pro22L = pro1.slice(2);
    mainData = pro21L+comma+" "+pro22L;
}
else if (pro2 == 9){
    let pro21L = pro1[0]+val[1];
    let pro22L = pro1.slice(2);
    mainData = pro21L+comma+" "+pro22L;
}
else{
    mainData = val;
}
return mainData;
}
coinMet = (coin) => {
        let seleCoin = coin == "btc" ? "bitcoin": coin == "ltc" ? "litecoin": coin == "eth" ? "ethereum": null;
        fetch(`https://api.coingecko.com/api/v3/coins/${seleCoin}/market_chart?vs_currency=usd&days=7`)
        .then(res => res.json())
        .then(resp => {
        var dataStr = resp.prices;
        var data = [];
        var yHigh, yLow, properties, lineLength, line; 
        var yTestArr = [];
        var coinColors = ["#31055A", "#31055A", "#31055A"];
        var selectedArr = [false, false, false];
        dataStr.forEach(element => {
            let time = element[0];
            let cash = element[1];
            let dataPro = {x: new Date(time), y: cash}
            data.push(dataPro);
        });
        data.reverse();
        dataStr.forEach(element => {
            let yElem = element[1];
            yTestArr.push(yElem);
        }); 
        let arrYLength = yTestArr.length;
        yTestArr.sort((a, b) => b-a);
        yHigh = Math.round(yTestArr[0]);
        yLow = Math.round(yTestArr[arrYLength-1]);
        var newArrayLength =  data.length;
        var scaleBXD = scaleTime().domain([data[0].x, data[newArrayLength-1].x]).range([0, width]);
        var scaleBYD = scaleLinear().domain([yHigh, yLow]).range([cheight, 0]);
        line = shape.line()
        .x(d => scaleBXD(d.x))
        .y(d => scaleBYD(d.y))
        .curve(shape.curveBasis) (data);
        properties = path.svgPathProperties(line);
        lineLength = properties.getTotalLength();
        if(coin == "btc"){
            coinColors[0] = "#FF9800";
            selectedArr[0] = true;
            selectedArr[1] = false;
            selectedArr[2] = false;     
        }
        if(coin == "eth"){
            coinColors[1] = "#FF9800";
            selectedArr[1] = true;  
            selectedArr[2] = false;
            selectedArr[0] = false;            
        }
        if(coin == "ltc"){
            myCounter.intCoin = 1;
            coinColors[2] = "#FF9800";
            selectedArr[2] = true;
            selectedArr[0] = false;
            selectedArr[1] = false;
            }
        this.setState({
            defaultDataState: false,
            data: data, 
            line: line,
            dataReverse: data.reverse(),
            properties: properties,
            lineLength: lineLength,
            arrayLength: data.length,
            
            coinColor: {
            btc: {color: coinColors[0], selected:selectedArr[0]},
            eth: {color: coinColors[1], selected:selectedArr[1]},
            ltc: {color: coinColors[2], selected:selectedArr[2]} 
            }});
    this.moveCursor(0);
    this.scrollView.scrollTo({
        x: myCounter.scrollViewShit,
        animated: true      
    });
}).catch(() => {
    this.toastHandler();
});        
}
cursor = React.createRef();
labelY = React.createRef();
labelX = React.createRef();   
 menuHandler = () => {
 myCounter.naviColor="#CDCDCD";
 myCounter.navicon += 1;
 if(myCounter.navicon == 1){
     Animated.timing(this.state.translate, {
        toValue: 0,
        duration : 400,
        easing: Easing.linear,
        useNativeDriver: true
    }).start();
        myCounter.naviColor = "#0078B9";
 }else if(myCounter.navicon == 2) {
        myCounter.naviColor = "#CDCDCD";
    Animated.timing(this.state.translate, {
        toValue:  -500,
        duration: 400,
        easing: Easing.linear,
        useNativeDriver: true
    }).start();
    myCounter.navicon = 0;
 }
    if(myCounter.navicon == 4){
        myCounter.naviColor ="#CDCDCD";
        myCounter.navicon = 0;
    }
    this.setState({
        color: myCounter.naviColor    
    });    
}
panRes = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove:(evt, gestureState) => {
        if(gestureState.dx <= -65) {
            Animated.timing(this.state.translate, {
                toValue:  -500,
                duration: 400,
                easing: Easing.linear,
                useNativeDriver: true
            }
            ).start();
        myCounter.menuColor = true; 
            if (myCounter.menuColor == true){
                myCounter.navicon = 3;
                this.menuHandler();
            }
        } 
    }
});
altMenuClose = () => {
    if(myCounter.naviColor == "#0078B9"){
        this.menuHandler();        
    }else{
        return;
    }
};
myDrawerNavigator = (navalue) => {
    this.menuHandler();
    this.props.navigation.navigate(navalue);
};
toastHandler = () => {
    let exe2 = () => {
    myCounter.toastState = true;
    if(myCounter.toastState == true){   
        this.setState({ 
        toast: 1
    });
    myCounter.toastState = false;
    setTimeout(() => {
        this.setState({ 
            toast: 0
        });
    }, 5000);    
}    
};
exe2();
};
storeData = async () => {
    await AsyncStorage.setItem(
    '@LogOut:key',
        JSON.stringify({
            status:"No"
        })
    );
}          
logOutHandler = async (cb) => {
this.menuHandler();
    cb("Splash");
}
connect = () => {
    this.pricesWs = new WebSocket('wss://ws.coincap.io/prices?assets=bitcoin,ethereum,litecoin');
    this.pricesWs.onmessage = (msg) => {
    this.realTimePrices(msg.data);
    }
    this.pricesWs.onclose = () => {
        this.check()
    }
}
check = () => {
    if (this.pricesWs.readyState == WebSocket.CLOSED){
        this.connect();
    }
};
componentDidMount() {
this.connect();
    myCounter.intCoin = 0;
    this.state.X.addListener(({value}) => this.moveCursor(value));
    this.moveCursor(0);
    if (myCounter.intCoin == 0){
        this.coinMet("ltc");
    }
    this.storeData();
}    
render() {
    const {X} = this.state;
    const translateLX = X.interpolate({
        inputRange: [0, this.state.lineLength],
        outputRange: [(width - labelWidth), 0],
        extrapolate: "clamp"
    });
            return (
        <> 
            <StatusBar 
            backgroundColor="#5D1767"
            barStyle="light-content"
            hidden={true}
            />    
            <SafeAreaView style={[styles.mainView, {opacity:10}]}>
            <View style={styles.nav}>
            <TouchableOpacity onPress={this.menuHandler}><Icon type="ionicon" color={this.state.color} name="md-menu" style={styles.navIcon} 
            /></TouchableOpacity>    
            <Text style={[styles.navText]}>Home</Text>
            </View>
            <Animated.View style={[styles.menuCont,{translateX: this.state.translate},{translateY: this.state.translate}]} {...this.panRes.panHandlers}>
            <TouchableOpacity style={styles.menuItemsAdj}>
                <View style={styles.menuItems}>
                    <View style={{flex:5, justifyContent:"center", alignItems:"center"}}><Icon style={styles.menuIcon} type="material-icons" size={35} name="backup"
                    color="#0078B9"/></View><View style={{flex:5, justifyContent:"center", alignItems:"center"}}><Text style={{fontFamily:"Raleway-Medium", color:"white", alignSelf:"flex-start"}}>Backup</Text></View>
                </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItemsAdj}>
                    <View style={styles.menuItems}>
                <View style={{flex:5, justifyContent:"center", alignItems:"center"}}><Icon style={styles.menuIcon} type="antdesign" size={35} name="setting"
                    color="#0078B9"/></View><View style={{flex:5, justifyContent:"center", alignItems:"center"}}><Text style={{fontFamily:"Raleway-Medium", color:"white", alignSelf:"flex-start"}}>Settings</Text></View>
                </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItemsAdj}>
                    <View style={styles.menuItems}>
                    <View style={{flex:5, justifyContent:"center", alignItems:"center"}}><Icon style={styles.menuIcon} type="material-icons" size={35} name="feedback"
                    color="#0078B9"/></View><View style={{flex:5, justifyContent:"center", alignItems:"center"}}><Text style={{fontFamily:"Raleway-Medium", color:"white", alignSelf:"flex-start"}}>Support</Text></View>
                </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItemsAdj} onPress={() => BackHandler.exitApp()}>
                <View style={styles.menuItems}>
                    <View style={{flex:5, justifyContent:"center", alignItems:"center"}}><Icon style={styles.menuIcon} type="antdesign" size={35} name="logout"
                    color="#0078B9"/></View><View style={{flex:5, justifyContent:"center", alignItems:"center"}}><Text style={{fontFamily:"Raleway-Medium", color:"white", alignSelf:"flex-start"}}>Exit App</Text></View>
                </View>
                </TouchableOpacity>
            </Animated.View>                
            
            <View style={[styles.crytoCard, {top:"50%"}]}>
                    <View style={styles.cryptoCont1}>
                    <Icon type="material-community" name="bitcoin" reverse={true} reverseColor="white" color={"#BC5841"} size={18} />
                    </View>
                    <View style={styles.cryptoCont2}>
                        <Text style={styles.cryptoId}>Current Price</Text>
            <Text style={styles.cryptoBal}>${this.state.currentBTC}</Text>
                    </View>
                </View>
                <View style={[styles.crytoCard, {top:"60%"}]}>
                    <View style={styles.cryptoCont1}>
                    <Icon type="material-community" name="litecoin" reverse={true} reverseColor="white" color={"#E06A30"} size={18} />
                    </View>
                    <View style={styles.cryptoCont2}>
                <Text style={styles.cryptoId}>Current Price</Text>
                        <Text style={styles.cryptoBal}>${this.state.currentLTC}</Text>
                    </View>
                </View>
                <View style={[styles.crytoCard, {top:"70%"}]}>
                    <View style={styles.cryptoCont1}>
                    <Icon type="material-community" name="ethereum" reverse={true} reverseColor="white" color={"#FB5348"} size={18} />
                    </View>
                    <View style={styles.cryptoCont2}>
                        <Text style={styles.cryptoId}>Current Price</Text>
                        <Text style={styles.cryptoBal}>${this.state.currentETH}</Text>
                    </View>
                </View>
            <View style={styles.charting}>    
    <View style={{ height: cheight, width: width, padding: 20, position:"absolute", top:"12%", left:"-6.3%"}}>
        <Svg height={cheight} width={width}>
            <Defs>
        <LinearGradient id="gradient" x1="0%" x2="0%" y1="100%" y2="0%">          
        <Stop stopColor="#FF5B99" offset="0%" stopOpacity={0} />
        <Stop stopColor="#FF5B96" offset="45%" stopOpacity={0.4} />
        <Stop stopColor="#FF5B97" offset="45%" stopOpacity={0.3} />
        <Stop stopColor="#FF5B98" offset="45%" stopOpacity={0.4} />
        <Stop stopColor="#FF5447" offset="500%" stopOpacity={0} />
        </LinearGradient>     
            </Defs>    
            <Path d={`${this.state.line}`} strokeWidth={2} stroke={'#0078B9'} fill={'transparent'} />
            <Path d={`${this.state.line} L ${width} ${cheight} L 0 ${cheight}`} fill={'url(#gradient)'}  />
            <View ref={this.cursor} style={styles.cursor} />
        </Svg>
        <Animated.View style={[styles.label, {translateX: translateLX}]}>
        <View style={styles.labelDate}><TextInput ref={this.labelX} editable={false} style={styles.labelTxt1} /></View>
        <View style={styles.labelMoney}>
            <TextInput ref={this.labelY} editable={false} style={styles.labelTxt2} /></View>
        </Animated.View>
        <Animated.ScrollView style={{position: "absolute", width:width, height:cheight, marginLeft:"7%", marginTop:"7%" }}
        contentContainerStyle={{width: this.state.lineLength * 2}}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        bounces={false}
        ref={c => {
            return (this.scrollView = c);
        }}
        onScroll={Animated.event(
            [
                {
                    nativeEvent:{
                        contentOffset:{x: X},
                    },
                },
            ],
            {useNativeDriver: true}
        )}
        horizontal
        />        
            </View>
            </View>
            <View style={styles.coins}>
            <View style={styles.btcCont}>    
            <TouchableWithoutFeedback onPress={() => this.coinMet("btc")}>
            <Icon type="material-community" name="bitcoin" reverse={true} reverseColor="white" color={this.state.coinColor.btc.color} size={16} containerStyle={[styles.coinIcon]} /></TouchableWithoutFeedback> 
            <Text style={[{fontFamily:"Raleway-Medium", color:"#E6E6FA"}]}>BTC</Text> 
            </View>
            <View style={styles.ltcCont}>
            <TouchableWithoutFeedback onPress={() => this.coinMet("ltc")}>
            <Icon type="material-community" name="litecoin" reverse={true} reverseColor="white" color={this.state.coinColor.ltc.color} size={16} containerStyle={[styles.coinIcon]} 
             /></TouchableWithoutFeedback>
            <Text style={[{fontFamily:"Raleway-Medium", color:"#E6E6FA"}]}>LTC</Text>
            </View>
            <View style={styles.ethCont}>
            <TouchableWithoutFeedback onPress={() => this.coinMet("eth")}>
            <Icon type="material-community" name="ethereum" reverse={true} reverseColor="white" color={this.state.coinColor.eth.color} size={16} containerStyle={[styles.coinIcon]}  />
            </TouchableWithoutFeedback>    
            <Text style={[{fontFamily:"Raleway-Medium", color:"#E6E6FA"} ]}>ETH</Text> 
            </View>    
            </View>
            <View style={{position:"absolute", bottom:"10%",  opacity:this.state.toast, width:"95%", height:"8%", elevation:3, justifyContent:"center", alignItems:"center", backgroundColor:"#2B2929", alignSelf:"center", borderRadius:5}}>
            <Text style={{fontFamily:"Raleway-Light", textAlign:"left", color:"white", fontSize:15}}>No network connection</Text>
            </View>    
            <View style={styles.tabs}>
                <View style={{marginLeft:"6%"}}>
                    <Icon
                    type="font-awesome"
                    name="home"
                    color= "#31055A"
                    size={24}
                    />
                    <Text style={{color:"#31055A", fontSize:10}}>Home</Text>
                </View>
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
                </View><TouchableWithoutFeedback onPress={() => this.altMenuClose()}>
                <View style={{height:"45%", width:"100%", backgroundColor:"red", opacity:0, position:"absolute", top:"50.5%", elevation:4}}></View></TouchableWithoutFeedback>
      </SafeAreaView>
        </>        
  );
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
            fontSize: 18,
            color:"white",
            alignSelf: "center",
            position: "absolute"
        },
        naviconTouch:{
            width:"5.5%"
        },  
        navIcon:{
            fontSize: 16,
            alignSelf: "flex-start",
            color:"white"
        },
        menuCont:{
            paddingTop:35,
            flex:0.65,
            justifyContent:"flex-start",
            backgroundColor:"#280758",
            width:"100%",
            borderBottomEndRadius: width,
            borderEndWidth: 35,
            borderEndColor:"#8E2C76",
            zIndex: 2,
            elevation:9
        },
        menuItems: {
            display: "flex",
            flexDirection: "row",
            marginBottom: height/19,  
            width: width-190,
            height: height/14,
            justifyContent: "center",
            alignContent: "center"   
        },
        menuItemsTxt: {
            fontFamily:"Roboto",
            fontSize: 18, 
            position:"absolute",
            color:"#E06A30"  
        },
        menuIcon: {
            alignSelf:"flex-start",
            fontSize: 18,
            color: "#0078B9"
        },
        menuItemsAdj:{
            height:height/14, 
            width:width-275, 
            marginBottom:height/19
        },
        crytoCard:{
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
        cryptoId:{
            fontFamily:"Raleway-SemiBold",
            color:"#31055A"
        },
        cryptoBal:{
            fontFamily:"Raleway-Light",
            color:"black"
        },
        charting:{
            backgroundColor:"#31055A",
            position:"absolute",
            height: "50%",
            width: "100%",
            top:"7.575%",
            justifyContent: "center",
            borderBottomLeftRadius:48,
            borderBottomRightRadius:48
        },
        cursor:{
            width:cursorRadius * 2,
            height: cursorRadius * 2,  
            borderRadius: cursorRadius,
            borderWidth:2,
            borderColor:"#0078B9",
            backgroundColor:"#CDCDCD"
        },
        label:{
            display:"flex",
            flexDirection:"row",
            position: "absolute",
            opacity: 1,
            top: "-15%",
            left: "6.5%",
            width: labelWidth,
            height: "26%"
        },
        labelDate:{
            flex:2,
            borderBottomColor:"#E06A30",
            borderBottomWidth:2
        },
        dollarSign:{
          top:"7%",
          fontSize:10,
          fontFamily:"Raleway-SemiBold",
          color:"#E06A30" 
        },
        labelMoney:{
            flex:3,
            flexDirection:"row",
            top:0,
            justifyContent:"flex-end",
            borderBottomColor:"#CDCDCD",
            borderBottomWidth:2
        },
        labelTxt1:{
            color:"#CDCDCD",
            top:1,
            fontSize: 18,
            padding:1,
            textAlign:"left",
            fontStyle:"normal"
        },
        labelTxt2:{
            color:"#E06A30",
            fontSize: 16,
            padding:1,
            paddingRight:3,
            textAlign:"right",
            top:1,
            fontFamily:"Raleway-Regular" 
 
        },
        coins:{
            display:"flex",
            flexDirection:"row",
            alignSelf: "center",
            height:"22%",
            width:"70%",
            position:"absolute",
            top:"37%",
            left: "15%",
            elevation:3
        },
        coinIcon:{
            borderWidth: 0.5,
            position:"relative",
            top:"5%",
            left:"13.5%",
            justifyContent:"space-between",
            alignContent:"space-between",
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
        coinIcon:{
            position:"relative",
            top:"5%"
        },  
        coins:{
            display:"flex",
            flexDirection:"row",
            alignSelf: "center",
            height:"22%",
            width:"80%",
            position:"absolute",
            top:"38%",
            elevation:3
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