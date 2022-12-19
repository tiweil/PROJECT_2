const myURL2 = "https://api.coingecko.com/api/v3/coins/"
let aboutAll=[];
let myCoins = [];
let dataTo = [];
let toggleCoins = [];
let myPoints = [];
let interval = false;
let thisDataTO = [];
let sessionCoins=[];
let AllInfo = {//an object for every coin that we want to see its' info
  image: "",
  usd: 0,
  eur: 0,
  ils: 0,
  currentTime:0
};
let point = {
  x: "",
  y: "",
};
let singleData = {
  type: "spline",
  xValueType: "dateTime",
  name: "",
  showInLegend: true,
  xValueFormatString: "hh:mm:ss TT",
  yValueFormatString: "#,##0 ",
  dataPoints: thisDataTO,
};
let AboutMe={//create a literal object to ease the adding of another person who worked on the project
  firstName:"Ala",
  lastName:"Schwartz",
  ID:51651561653,
  image:"<img id='myImg' src='images/cryptonite-crypto.jpg'/>",
  aboutPJ:"This is an app which contains all the cryptonite coins, shows the information about them and the live graph of their monetary value."
}

$(() => {
  $(".container1").css("display", "block");
  getData();
});

const getData = () => {
  $.ajax({
    url: myURL2,
    success: (response) => {
      console.log(response);
      myCoins = response;
      console.log(myCoins);
      $(".container1").css("display", "none");
      home();
    },
    error: (error) => {
      console.log(error);
    },
  });
};

const home = () => {
  dataTo = [];
  myPoints = [];
  const stopInterval = () => clearInterval(myInter);
  (interval?stopInterval():console.log("home"));
  interval = false;
  toggleCoins = [];
  $("#res").html("");
  myCoins.map((item)=>{
    printCard(item);})
};

const printCard = (item) => {
  $("#res").append(`<div class="card" >
          <label class="switch">
          <input type="checkbox" class="check1" onclick='addRemove(${JSON.stringify(item)})'/>
          <span class="slider round"></span>
          </label>
          <div class="card-body"
          <p id="coin_img"><img src=${item.image.thumb}/>&nbsp<span id="coin_symb"> ${item.symbol.toUpperCase()}</span></p>
          <p class="coin_name">${item.name}</p><br>
          <input type="button"  id="infoButton_${item.id}" value="More Info" class="btn btn-success btn_info" 
          onclick='moreInfo(${JSON.stringify(item)})'/></div><div/>
          <div class="allInfo" id=${item.id}></div>`);
  console.log(item);
};

//We will check whether the value of the button is more or less and act accordingly
const moreInfo = (data) => {
  if($("#infoButton_"+data.id).val()=="More Info")
  {
    $("#infoButton_"+data.id).val("Less Info");
    console.log(data.name);
    checkData(data);
  }
  else
  {
    $("#infoButton_"+data.id).val("More Info");
    $("#"+data.id).html("");
  }
};

//A function in which we check whether the presentation of the information has already happened and if so how much time has passed since the last time
const checkData=(data)=>{
  let newTime=new Date();//We will create a current time in order to compare to the previous time (if any) when the information appeared
  if(sessionCoins.includes(data.id))
  {
    let temp=JSON.parse(sessionStorage.getItem(data.id));
    console.log(temp.currentTime);
    if(Number(newTime.getTime())-temp.currentTime>=120000)
    {
      specificCoin(data.id.toLowerCase());
    }
    else
    {
      $("#"+data.id).html(`
      <p id="info"><img src=${temp.image}/>&nbsp <span>USD:
      </span> ${temp.usd}$&nbsp <span>EUR:</span> ${temp.eur}&#8364 &nbsp <span>ILS:</span> ${temp.ils}&#8362 </p>
      `);
    }    
  }
  else
  {
    specificCoin(data.id.toLowerCase());
  }
  console.log(sessionCoins);
};

//A function to retrieve specific API information when the information request button is clicked
const specificCoin = (coin) => {
  $(".container1").css("display", "block");
  $.ajax({
    url: myURL2+coin,
    success: (response) => {
      console.log(response);
      let temp=response;
      returnCoin(temp);
      $(".container1").css("display", "none");
    },
    error: (error) => {
      console.log(error);
    },
  });
};

//build the field of coin's info and put it in the session storage
 const returnCoin=(temp)=>{
    //Create a new literal object that contains the desired information
    let myInfo = { ...AllInfo };
    myInfo.image = temp.image.thumb;
    myInfo.usd = temp.market_data.current_price.usd;
    myInfo.eur = temp.market_data.current_price.eur;
    myInfo.ils = temp.market_data.current_price.ils;
    console.log(myInfo);
    sessionCoins.push(temp.id);
    let time=new Date();
    myInfo.currentTime=Number(time.getTime());
    //We will push the object to sessionStorage with ID as keyword
    sessionStorage.setItem(temp.id,JSON.stringify(myInfo));  
    $("#"+temp.id).html(`
    <p id="info"><img src=${myInfo.image}/>&nbsp <span>USD:</span> ${myInfo.usd}$&nbsp <span>EUR:
    </span> ${myInfo.eur}&#8364 &nbsp <span>ILS:</span> ${myInfo.ils}&#8362 </p>
    `);
 };

 const search = () => {
  dataTo = [];
  myPoints = [];
  const stopInterval = () => clearInterval(myInter);
  (interval?stopInterval():console.log("about"));
  interval = false;
  toggleCoins = [];
  let isValid = false;
  myCoins.map((item) => {
    if (
      $("#toSearch").val() == item.name ||
      $("#toSearch").val() == item.symbol.toUpperCase()
    ) {
      isValid = true;
      $("#res").html("");
      printCard(item);
    }
  });
  isValid ? console.log("valid") : $("#res").html("Coin not found");
};

//Create an array that contains the coins selected for live
const addRemove = (data) =>{
  myCoins.map((item)=>{
    if(item.id == data.id)
    {
      if (toggleCoins.includes(item.symbol.toUpperCase()))
      {//if the array contains the coin then we have to remove it
        const index = toggleCoins.indexOf(item.symbol.toUpperCase());
        toggleCoins.splice(index, 1);
      }
      else
      {
        if(toggleCoins.length < 5)
        {toggleCoins.push(item.symbol.toUpperCase());}
        else
        {
          toggleCoins.push(item.symbol.toUpperCase());
          choice();
        }
      }
    }})
  console.log(toggleCoins);
};

//if toggleCoins.length > 5, you have to choice which coin to download
const choice = ()  => {
  $("#toChoice").html("");
  myCoins.map((item)=>{
    if(toggleCoins.includes(item.symbol.toUpperCase()))
    {
      $("#toChoice").append(`<div class="card" id="card1">
        <label class="switch1">
        <input type="checkbox" class="check" id=(${item.symbol.toUpperCase()}) 
        onclick='addRemove(${JSON.stringify(item)})'>
        <span class="slider round"></span>
        </label>
        <p>${item.symbol.toUpperCase()}</p>
        <p>${item.name}</p><br>
        </div>`)
      }});
  $(".check").prop("checked", true);
  $("#myModal").css("display","block");   
};

//after the choice, save the selected coins.
const save = () => {
  if (toggleCoins.length <= 5)
  {
    $("#myModal").css("display","none");   
    $(".check1").prop("checked", false);
    myCoins.map((item)=>{
    if(toggleCoins.includes(item.symbol.toUpperCase()))
    {
      let index = myCoins.indexOf(item);
      console.log(index);
      $(".check1").eq(index).prop("checked", true);//go to the specific index to mark the checkbox
    }})
  }
  else
  {
    alert("The choice is limited to 5 coins only, mark the coin you want to remove");
  }};

const myTitle = ()=>{//create title for the API
  let myText = "";
  toggleCoins.map((item)=> myText += (item + ","));
  let myCoinsTo = myText.substring(0, myText.length - 1);
  myText = myCoinsTo
  return myText
};  

const myTitle2 = ()=>{//create title for the graph
  let myText = "";
  toggleCoins.map((item)=> myText += (item + ", "));
  let myCoinsTo = myText.substring(0, myText.length - 2);
  myText = myCoinsTo
  return myText
};  

const live = ()=>{
  $(".container1").css("display", "block");
  console.log(toggleCoins);      
  addData();
  interval = true;
  const myInterval = () => myInter = setInterval(live2, 2000);
  myInterval();
  };

//create object to all selected coins
const addData = () => {
  toggleCoins.map((item)=>{
    let mySingleData = {...singleData};
    mySingleData.name = item,
    dataTo.push(mySingleData)
  })
  console.log(dataTo);
};
  
//create a new point in the graph to the selected coins
const live2 = ()  => {
  var options = {
    exportEnabled: true,
    animationEnabled: true,
    title:{
      text: myTitle2() + " to USD"
    },
    subtitles: [{
      text: "Click Legend to Hide or Unhide Data Series"
    }],
    axisX: {
      title: "timeline",
    },
    axisY: {
      title: "Coin Value",
      titleFontColor: "#4F81BC",
      lineColor: "#4F81BC",
      labelFontColor: "#4F81BC",
      tickColor: "#4F81BC"
    },
    
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: "pointer",
      itemClick: toggleDataSeries
    },
    data: dataTo,
  };

  getLiveData();

  pushPoint(myPoints, dataTo);
  $("html,body").animate({
    scrollTop:$(".parallax").offset().top
  });

  $("#res").CanvasJSChart(options);

  function toggleDataSeries(e) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    }
};

// get live data from API to point in the graph
const getLiveData = ()=>{
  let myURL3 = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${myTitle()}&tsyms=USD`
  $.ajax({
    url: myURL3,
    success: (response) => 
    { 
      myPoints = [];
      toggleCoins.map((item)=>{
      myPoints.push(createPoint(response, item));
      });
      console.log(myPoints);
      $(".container1").css("display", "none");
    },    
    error: (error) => 
    {
      console.log(error);
    },
  })
};

//create point from the live data.
const createPoint = (response, item) => {
  var myPoint = {...point};
  var time = new Date();
  myPoint.x = time.getTime();
  console.log(myPoint.x)
  myPoint.y = response[item]["USD"];
  return myPoint;
};

//add the new point to the graph
const pushPoint = (myPoints, dataTo)  => {
  for (let i = 0; i < myPoints.length; i+=1) 
  {if(dataTo[i]["dataPoints"].length > 0)
    {
      dataTo[i]["dataPoints"].push(myPoints[i]);
    }else{
      let thisDataTO = [];
      dataTo[i]["dataPoints"] = thisDataTO;
      dataTo[i]["dataPoints"].push(myPoints[i]);
    }
  }
};


const about = ()=>{
  dataTo = [];
  myPoints = [];
  const stopInterval = () => clearInterval(myInter);
  (interval?stopInterval():console.log("about"));
  interval = false;
  toggleCoins = [];
  createAbout();
  let showAbout=`<div class="aboutPage"><br/>
  <h1>About The program</h1><br/>
  <p>${aboutAll[0].aboutPJ}</p>
  <br/><br/><br/>
  <h1>The Producers:</h1>
  <div class="grid">
  <div class="infoMe">${aboutAll[0].image}<br/><p><span>${aboutAll[0].firstName} ${aboutAll[0].lastName}</span><br/>${aboutAll[0].ID}</p></div>
  <div class="infoMe">${aboutAll[1].image}<br/><p><span>${aboutAll[1].firstName} ${aboutAll[1].lastName}</span><br/>${aboutAll[1].ID}</p></div>
  <div class="infoMe">${aboutAll[2].image}<br/><p><span>${aboutAll[2].firstName} ${aboutAll[2].lastName}</span><br/>${aboutAll[2].ID}</p></div>
  <div class="infoMe">${aboutAll[3].image}<br/><p><span>${aboutAll[3].firstName} ${aboutAll[3].lastName}</span><br/>${aboutAll[3].ID}</p></div>
  </div></div>`;
  $("html,body").animate({
    scrollTop:$(".parallax").offset().top
  });
  $("#res").html(showAbout);
};

function createAbout(){
  let about1={...AboutMe};
  let about2={...AboutMe};
  let about3={...AboutMe};
  let about4={...AboutMe};
  about1.firstName="Tirza";
  about1.lastName="Weiss";
  about1.ID=325063980;
  about1.image="<img id='myImg' src='images/about1.jpg'/>";
  about2.firstName="Reut";
  about2.lastName="Yacobovich";
  about2.ID=201056504;
  about2.image="<img id='myImg' src='images/about2.jpg'/>";
  about3.firstName="Chaya";
  about3.lastName="Maman";
  about3.ID=316288752;
  about3.image="<img id='myImg' src='images/about3.jpg'/>";
  about4.firstName="Sivan";
  about4.lastName="Saban";
  about4.ID=312116924;
  about4.image="<img id='myImg' src='images/about4.jpg'/>";
  aboutAll.push(about1,about2,about3,about4);
}