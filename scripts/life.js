// "use strict";

class FoodAndTime {
  constructor(hour, minute, second, time) {
    this.hour = document.querySelector("#hour");
    this.minute = document.querySelector("#min");
    this.second = document.querySelector("#sec");
    this.todayDate = document.querySelector("#today-date");
    this.form = document.querySelector("#food-detail");
    this.clearStorageBtn = document.querySelector("#clear-storage");
    //Checking the time every hour
    setInterval(() => {
      location.reload();
    }, 1000 * 60 * 60);
  }

  timeSetUP() {
    const now = new Date();
    let hrs = now.getHours();
    let min = now.getMinutes();
    let sec = now.getSeconds();
    let todayDate = now.toDateString();
    let ap = "AM";
    if (hrs > 11) ap = "PM";
    if (hrs > 12) hrs = hrs - 12;
    if (hrs === 0) hrs = 12;
    // if (hrs < 10) hrs = 12;
    return {
      hrs,
      ap,
      min,
      sec,
      todayDate,
    };
  }

  getTime = () => {
    let { hrs, min, sec, ap, todayDate } = this.timeSetUP();
    sec = sec < 10 ? "0" + sec : sec;
    min = min < 10 ? "0" + min : min;
    this.hour.innerHTML = `${hrs} <span>HRS</span>`;
    this.minute.innerHTML = `${min} <span>MIN</span>`;
    this.second.innerHTML = `${sec} <span>SEC</span>`;
    this.todayDate.innerHTML = `${todayDate}`;
  };

  timeToEat = () => {
    const dataFromDB = this.getFoodTimeTablefromStorage();
    this.showFoodTable(dataFromDB);
    let { hrs, ap } = this.timeSetUP();
    let imgUrl;
    let foodType;
    let foodName;
    const dbData = dataFromDB.filter((item) => {
      if (hrs == item.timeToEat && ap == "AM" && item.foodType == "Breakfast") {
        foodType = item.foodType;
        foodName = item.foodName;
        imgUrl = "images/bg.jpg";
        return { foodType, foodName, imgUrl };
      } else if (
        hrs == item.timeToEat &&
        ap == "PM" &&
        item.foodType == "Lunch"
      ) {
        foodType = item.foodType;
        foodName = item.foodName;
        return { foodType, foodName };
      } else if (
        hrs == item.timeToEat &&
        ap == "PM" &&
        item.foodType == "Dinner"
      ) {
        foodType = item.foodType;
        foodName = item.foodName;
        return { foodType, foodName };
      }
    });

    this.htmlTemplate(dbData);
  };

  htmlTemplate = (dbData) => {
    let imgUrl;
    let foodType;
    let foodName;
    if (dbData.length) {
      foodType = dbData[0].foodType;
      foodName = dbData[0].foodName;
      if (foodType === "Breakfast") {
        imgUrl = "images/bg.jpg";
      }
      if (foodType === "Lunch") {
        imgUrl = "images/wedding.jpg";
      }
      if (foodType === "Dinner") {
        imgUrl = "images/picture-136.png";
      }
    }

    const altForFoodType = "Coding";
    const altForFoodName = "nothing for now. I'm on my Laptop, coding";
    const baseImgUrl = "images/npmissue.png";

    const result = document.querySelector(".image-container");
    const div = document.createElement("div");
    div.innerHTML = `
       <h3>${foodType || altForFoodType} Time</h3>
       <p><b>I am eating ${foodName || altForFoodName}</b></p>
       <img src="${imgUrl || baseImgUrl}" alt="">
    `;
    return result.appendChild(div);
  };

  getDataFromUI = (e) => {
    e.preventDefault();
    let timeToEat = +document.querySelector("#time-to-eat").value;
    let foodName = document.querySelector("#food-name").value;
    let foodType = form.querySelector("#food-type").value;
    if (foodName === "" || foodType === "" || timeToEat === "") {
      alert("You need to add Something");
      return;
    }
    let foodTimeTable = { foodName, foodType, timeToEat };
    this.addFoodTimeTableToStorage(foodTimeTable);
    document.querySelector("#food-name").value = "";
  };

  showFoodTable = (data) => {
    const messageBox = document.querySelector("#message");

    let htmlTemplate = "";

    data.forEach((item) => {
      htmlTemplate += `
       <tr>
            <td>${item.foodType}</td>
            <td>${item.foodName}</td>
            <td>${item.timeToEat}</td>
      </tr>`;
    });

    messageBox.innerHTML = htmlTemplate;
  };

  //Local storage
  addFoodTimeTableToStorage = (obj) => {
    const timeTableDB = this.getFoodTimeTablefromStorage();

    for (let i = 0; i < timeTableDB.length; i++) {
      if (timeTableDB[i].foodType === obj.foodType) {
        alert(`${obj.foodType} is already exists in DB`);
        return;
      }
    }

    timeTableDB.push(obj);

    localStorage.setItem("foodObj", JSON.stringify(timeTableDB));
    location.reload();
    alert(`${obj.foodType} successfully added`);
    return false;
  };

  //Get Food time table from storage
  getFoodTimeTablefromStorage = () => {
    let foodObj;
    const LS = localStorage.getItem("foodObj");

    if (LS === null) {
      foodObj = [];
    } else {
      foodObj = JSON.parse(LS);
    }
    return foodObj;
  };

  clearStorage = () => {
    const clear = confirm("Are you sure you want to clear LocalStorage");
    if (clear == true) {
      localStorage.clear("foodObj");
      location.reload();
      return false;
    } else {
      return;
    }
  };

  init() {
    this.form.addEventListener("submit", this.getDataFromUI);
    this.clearStorageBtn.addEventListener("click", this.clearStorage);
    setInterval(this.getTime, 1000);
    this.timeToEat();
  }
}

const foodTime = new FoodAndTime();
foodTime.init();
