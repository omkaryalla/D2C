import './App.css';
import React from 'react';
const fetch = require('node-fetch');
const {base_url} = require('./config')

// toast.configure();

// const success = () => toast.success(document.getElementById("select").value+' seats booked', {
//   position: "bottom-center",
//   autoClose: 1500,
//   hideProgressBar: true,
//   closeOnClick: false,
//   pauseOnHover: false,
//   draggable: false,
//   progress: 0,
// });

// const fail = () => toast.error('Seats not available', {
//   position: "bottom-center",
//   autoClose: 1500,
//   hideProgressBar: true,
//   closeOnClick: false,
//   pauseOnHover: false,
//   draggable: false,
//   progress: 0,
// });

class Seat extends React.Component{
  render(){
    return(
        <div class="seat" className={this.props.booked === 1 ? "booked" : this.props.booked === 2 ? "booked_now" : ""} style={this.props.style} >
          {this.props.number}
        </div>
    );
  }
}

class Train extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      seatState: null,
        selectedSeatCount: 1,
    };
  }

  updateBookedSeats(){
      let options = {
          method: 'GET',
          headers: {'Content-Type': 'application/json'},
      };

      fetch(base_url, options)
          .then(res => res.json())
          .then(json => {
              console.log(json)
              let local_seats = Array(80).fill(0);
              const booked_seats = json.map(each=>each['_id']);
              booked_seats.forEach(e=>{
                  local_seats[e-1] = 1;
              })
              this.setState({
                  seatState: local_seats
              })
          })
          .catch(err => console.error('error:' + err));
  }

  componentDidMount() {
    this.updateBookedSeats();
  }

    render(){
    return(
        <div className="App">
          <div>
            <h1>Book your Tickets</h1>
            <select id="select" onChange={(e)=>{this.setState({selectedSeatCount: e.target.value})}}>
                {Array(7).fill(null).map((_, i)=><option value={i+1}> {i+1} </option>)}
            </select>
            <button onClick={()=>{
                let options = {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: `{"count": ${this.state.selectedSeatCount}}`
                };

                fetch(base_url+"/book", options)
                    .then(res => res.json())
                    .then(json => {
                        let now_booked = json.now_booked;
                        let already_booked = json.booked;
                        let local_seats = Array(80).fill(0);
                        const booked_seats = already_booked.map(each=>each['_id']);
                        booked_seats.forEach(e=>{
                            local_seats[e-1] = 1;
                        })
                        now_booked.forEach(e=>{
                            local_seats[e-1] = 2;
                        })
                        this.setState({
                            seatState: local_seats
                        })
                    })
                    .catch(err => console.error('error:' + err));
            }}>Book</button>
          </div>
          <div className="seats_layout">
              {this.state.seatState === null ? <h2>Loading</h2> :  this.state.seatState.map((e, i) =>  <div className="seat"><Seat number={i+1} booked={e}/></div>)}
          </div>
            <button onClick={()=>{
                let options = {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                };

                fetch(base_url+"/clear", options)
                    .then(res => res.json())
                    .then(json => ()=>{
                        console.log(json)
                        this.updateBookedSeats();
                    })
                    .catch(err => console.error('error:' + err));
            }}>Clear</button>
        </div>
    );
  }
}

function App() {
  return (
      <div>
        <Train/>
      </div>
  );
}

export default App;
