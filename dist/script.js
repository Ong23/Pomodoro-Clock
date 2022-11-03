class Clock extends React.Component {
  constructor(props) {
    super(props);

    this.formatTime = this.formatTime.bind(this);
    this.beep = this.beep.bind(this);
    this.tick = this.tick.bind(this);
    this.reset = this.reset.bind(this);
    this.audio = '';
    this.timerId = '';

    this.state = {
      timerState: "Stop",
      timerType: "Session",
      remainingTime: 1500,
      sessionLength: 25,
      breakLength: 5,
      apiKey: localStorage.getItem("api-key"),
      backgroundImage: ""
      //insert your pixalbay api_key 
      //to retrieve background image
    };
  }

  //get image with api to pixalbay
  componentDidMount() {
    this.getBackgroundImage();
  }

  getBackgroundImage() {
    const { apiKey } = this.state;

    fetch(`https://pixabay.com/api/?key=${apiKey}&q=` + encodeURIComponent('clock'), { method: "GET" }).
    then(res => res.json()).
    then(response => this.setState({ backgroundImage: response.hits[0]["largeImageURL"] }));
  }

  tick() {
    if (this.state.timerState == "Running") {
      if (this.state.remainingTime == 0) {
        this.beep();

        const newTimerType = this.state.timerType === "Session" ? "Break" : "Session";
        const newRemainingTime = this.state.timerType === "Session" ? this.state.breakLength * 60 : this.state.sessionLength * 60;

        this.setState({
          timerType: newTimerType,
          remainingTime: newRemainingTime });


        return;
      }
      this.setState({ remainingTime: this.state.remainingTime - 1 });
    }
  }

  beep() {
    if (this.audio == '') {
      this.audio = document.getElementById('beep');
    }
    this.audio.play();
  }

  formatTime(time) {
    const minutes = parseInt(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return minutes + ":" + seconds;
  }

  startStop() {
    if (this.state.timerState == "Running") {
      clearInterval(this.timerId);
      this.setState({ timerState: "Stop" });
    } else {
      this.timerId = setInterval(this.tick, 1000);
      this.setState({ timerState: "Running" });
    }
  }

  reset() {
    if (this.audio != '') {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    if (this.timerId != '') {
      clearInterval(this.timerId);
    }
    this.setState({
      remainingTime: 1500,
      sessionLength: 25,
      breakLength: 5,
      timerType: "Session",
      timerState: "Stop" });

  }

  decreaseBreak() {
    if (this.state.timerState == "Stop" && this.state.breakLength > 1) {
      if (this.state.timerType == "Break") {
        this.setState({
          breakLength: this.state.breakLength - 1,
          remainingTime: (this.state.breakLength - 1) * 60 });

      } else {
        this.setState({
          breakLength: this.state.breakLength - 1 });

      }
    }
  }

  increaseBreak() {
    if (this.state.timerState == "Stop" && this.state.breakLength < 60) {
      if (this.state.timerType != "Break") {
        this.setState({
          breakLength: this.state.breakLength + 1 });

      } else {
        this.setState({
          breakLength: this.state.breakLength + 1,
          remainingTime: (this.state.breakLength + 1) * 60 });

      }
    }
  }

  decreaseSession() {
    if (this.state.timerState == "Stop" && this.state.sessionLength > 1) {
      if (this.state.timerType == "Session") {
        this.setState({
          sessionLength: this.state.sessionLength - 1,
          remainingTime: (this.state.sessionLength - 1) * 60 });

      } else {
        this.setState({
          sessionLength: this.state.sessionLength - 1 });

      }
    }
  }

  increaseSession() {
    if (this.state.timerState == "Stop" && this.state.sessionLength < 60) {
      if (this.state.timerType == "Session") {
        this.setState({
          sessionLength: this.state.sessionLength + 1,
          remainingTime: (this.state.sessionLength + 1) * 60 });

      } else {
        this.setState({
          sessionLength: this.state.sessionLength + 1 });

      }
    }
  }

  render() {
    const backgroundImage = {
      backgroundImage: 'url(' + this.state.backgroundImage + ')',
      position: 'absolute',
      width: '102%',
      height: '103%',
      margin: '-2%' };


    const startStopButton = this.state.timerState == "Stop" ? "btn btn-light" : "btn btn-danger";

    return /*#__PURE__*/(
      React.createElement("div", { id: "clock", style: backgroundImage }, /*#__PURE__*/
      React.createElement("div", { id: "clock-content" }, /*#__PURE__*/
      React.createElement("div", { id: "timer-label" },
      this.state.timerType), /*#__PURE__*/

      React.createElement("div", { class: "fs-1 fw-bold", id: "time-left" },
      this.formatTime(this.state.remainingTime)), /*#__PURE__*/

      React.createElement("div", { id: "session-buttons" }, /*#__PURE__*/
      React.createElement("div", { class: "mx-2", className: startStopButton, id: "start_stop", onClick: () => this.startStop() },
      this.state.timerState == "Stop" ? "Start" : "Stop"), /*#__PURE__*/

      React.createElement("div", { class: "mx-2 btn btn-light", id: "reset", onClick: () => this.reset() }, "Reset")), /*#__PURE__*/



      React.createElement("div", { class: "row" }, /*#__PURE__*/
      React.createElement("div", { class: "col-6" }, /*#__PURE__*/
      React.createElement("div", { id: "break-increment", onClick: () => this.increaseBreak() }, "+"), /*#__PURE__*/


      React.createElement("div", { id: "break-length" },
      this.state.breakLength), /*#__PURE__*/

      React.createElement("div", { id: "break-decrement", onClick: () => this.decreaseBreak() }, "-"), /*#__PURE__*/


      React.createElement("div", { id: "break-label" }, "Break Length")), /*#__PURE__*/



      React.createElement("div", { class: "col-6" }, /*#__PURE__*/
      React.createElement("div", { id: "session-increment", onClick: () => this.increaseSession() }, "+"), /*#__PURE__*/
      React.createElement("div", { id: "session-length" }, this.state.sessionLength), /*#__PURE__*/
      React.createElement("div", { id: "session-decrement", onClick: () => this.decreaseSession() }, "-"), /*#__PURE__*/
      React.createElement("div", { id: "session-label" }, "Session Length"))))));







  }}


ReactDOM.render( /*#__PURE__*/React.createElement(Clock, null), document.getElementById('root'));

function setKey(newValue) {
  localStorage.setItem("api-key", newValue);
}
//setKey() call this to insert Pixalbay api-key into localstorage
//console.log(localStorage.getItem("api-key"));