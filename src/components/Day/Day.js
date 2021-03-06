import React, { Component } from "react";
import { connect } from 'react-redux'
import './Day.css';
import {
  showGroup, updateEventsList, createNewFlight, createNewLodging, createNewActivity, createNewRental, deleteSelectedFlight,
  deleteSelectedLodging, deleteSelectedRental, deleteSelectedActivity, editSelectedActivity, editSelectedFlight, editSelectedLodging, editSelectedRental,
  openRestaurantModal, closeRestaurantModal
} from '../../ducks/frontEnd';
/* Components*/
import Menu from '../Menu/Menu.js';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ActionCancel from 'material-ui/svg-icons/navigation/cancel';
import { addEvent, getAllEvents, deleteEvent } from '../../ducks/frontEndABs.js';
import { Link } from "react-router-dom";
import { searchRestaurants, updateSavedRestaurantsData, updateSavedRestaurants, clearRestaurant, clearReviews, getRestaurant, getReviews, addRestaurant, deleteRestaurant } from "../../ducks/restaurant.js"
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import Edit from 'material-ui/svg-icons/image/edit'
import { mapProps } from "recompose";
import axios from "axios";

class Day extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      eventName: 'New Event',
      value: 1,
      inputOne: '',
      inputTwo: '',
      restaurantArray: [],
      editOpen: false,
      editedId: ''
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleEventType = this.handleEventType.bind(this);
    this.updateInputOne = this.updateInputOne.bind(this);
    this.updateInputTwo = this.updateInputTwo.bind(this);
    this.handleAddEvent = this.handleAddEvent.bind(this);
    this.handleGetAllEvents = this.handleGetAllEvents.bind(this);
    this.handleEventDelete = this.handleEventDelete.bind(this);
    this.handleRestaurants = this.handleRestaurants.bind(this);
    this.handleEventEditWindow = this.handleEventEditWindow.bind(this);
    this.handleEditEvent = this.handleEditEvent.bind(this);
    this.handleAddRestaurant = this.handleAddRestaurant.bind(this);
  }

  componentDidMount() {
    this.props.showGroup(true);
  }

  handleAddEvent() {
    const { currentDay } = this.props;
    if (this.state.value === 1) {
      const flightObj = { confirmation: this.state.inputOne, airline_name: this.state.inputTwo, day_id: currentDay.day_id }
      this.props.createNewFlight(flightObj)
    } else if (this.state.value === 3) {
      const lodgingObj = { lodging_name: this.state.inputOne, lodging_details: this.state.inputTwo, day_id: currentDay.day_id }
      this.props.createNewLodging(lodgingObj)
    } else if (this.state.value === 5) {
      const activityObj = { activity_name: this.state.inputOne, activity_details: this.state.inputTwo, day_id: currentDay.day_id }
      this.props.createNewActivity(activityObj)
    } else if (this.state.value === 2) {
      const rentalObj = { rental_company: this.state.inputOne, rental_details: this.state.inputTwo, day_id: currentDay.day_id }
      this.props.createNewRental(rentalObj)
    }
  }

  handleAddRestaurant() {
    console.log("Restaurant: ", this.props.currentRestaurant);
    console.log("Day: ", this.props.currentDay.day_id)
    this.props.addRestaurant(this.props.currentDay.day_id, this.props.currentRestaurant.id)
  }

  handleGetAllEvents() {
    if (this.props.eventsList.length) {
      return this.props.eventsList.map((e, i, arr) => {
        console.log("event", e)
        console.log("current", this.props.currentTrip)
        console.log("user", this.props.user_id)
        return (
          <div key={i}>
            <Card className='event-container'>
           
              {e.lodging_name ? <CardTitle
                title={e.lodging_name}
                subtitle={e.lodging_details}
              /> : null}
              {e.airline_name ? <CardTitle
                title={e.airline_name}
                subtitle={e.confirmation}
              /> : null}
              {e.activity_name ? <CardTitle
                title={e.activity_name}
                subtitle={e.activity_details}
              /> : null}
              {e.rental_company ? <CardTitle
                title={e.rental_company}
                subtitle={e.rental_details}
              /> : null} 
            
              {this.props.currentTrip ? this.props.user_id == this.props.currentTrip.user_id ?
                <RaisedButton
                  label='Edit'
                  labelColor='white'
                  primary={true}
                  style={{ margin: '5px' }}
                  onClick={() => { this.handleEventEditWindow(e) }}
                /> : null : null}
              {this.props.currentTrip ? this.props.user_id == this.props.currentTrip.user_id ?
                <RaisedButton
                  label='Delete'
                  labelColor='white'
                  secondary={true}
                  style={{ margin: '5px' }}
                  onClick={() => { this.handleEventDelete(e) }}
                /> : null : null}
            </Card>
          </div>
        )
      })
    }
  }

  handleRestaurants() {
    console.log("handleRestaurant", this.props.savedRestaurants);
    console.log("handleRestaurantData", this.props.savedRestaurantsData)
    if (this.props.savedRestaurants.length) {
      return this.props.savedRestaurants.map((e, i, arr) => {
        return (
          <div key={i}>
            <Card className='restaurant-event-container'>
              <CardTitle
                title={e.name}
                subtitle={"Rating: " + e.rating}
              />
              <Link style={{ textDecoration: "none" }} to={`/restaurant/${e.id}`}>
                <RaisedButton
                  label='View'
                  labelColor='white'
                  primary={true}
                  style={{ margin: '5px' }}
                  onClick={() => {
                    if (this.props.currentRestaurant.id !== e.id) {
                      this.props.clearRestaurant(),
                        this.props.clearReviews()
                    }
                    this.props.getRestaurant(e.id),
                      this.props.getReviews(e.id)
                  }}
                />
              </Link>
              {this.props.currentTrip ? this.props.user_id == this.props.currentTrip.user_id ?
                <RaisedButton
                  label='Delete'
                  labelColor='white'
                  secondary={true}
                  style={{ margin: '5px' }}
                  onClick={() => { this.handleEventDelete(e) }}
                /> : null : null}
            </Card>
          </div>
        )
      })
    }
  }

  handleEventDelete(e) {
    console.log("Attempt", e)
    if (e.confirmation) {
      this.props.deleteSelectedFlight(e.flight_id);
      this.props.updateEventsList(e.day_id);
    } else if (e.lodging_name) {
      this.props.deleteSelectedLodging(e.lodging_id);
      this.props.updateEventsList(e.day_id);
    } else if (e.activity_name) {
      this.props.deleteSelectedActivity(e.activity_id);
      this.props.updateEventsList(e.day_id);
    } else if (e.rental_company) {
      this.props.deleteSelectedRental(e.rental_id);
      this.props.updateEventsList(e.day_id);
    } else if (e.id) {
      for (var i = 0; i < this.props.savedRestaurantsData.length; i++) {
        if (this.props.savedRestaurantsData[i].yelp_id === e.id) {
          this.props.deleteRestaurant({ restaurant_id: this.props.savedRestaurantsData[i].restaurant_id, day_id: this.props.savedRestaurantsData[i].day_id });
        }
      }
    }
  }

  handleEditEvent() {
    const value = this.state.value;
    if (value === 1) {
      this.props.editSelectedFlight({ confirmation: this.state.inputOne, airline_name: this.state.inputTwo, flight_id: this.state.editedId })
    } else if (value === 2) {
      this.props.editSelectedRental({ rental_company: this.state.inputOne, rental_details: this.state.inputTwo, rental_id: this.state.editedId })
    } else if (value === 3) {
      this.props.editSelectedLodging({ lodging_name: this.state.inputOne, lodging_details: this.state.inputTwo, lodging_id: this.state.editedId })
    } else if (value === 5) {
      this.props.editSelectedActivity({ activity_name: this.state.inputOne, activity_details: this.state.inputTwo, activity_id: this.state.editedId })
    }
  }

  handleEventEditWindow(e) {
    this.setState({
      editOpen: true
    })
    if (e.confirmation) {
      this.handleOpen();
      this.updateInputOne(e.confirmation);
      this.updateInputTwo(e.airline_name);
      this.setState({
        editedId: e.flight_id,
        value: 1
      })
    } else if (e.lodging_name) {
      this.handleOpen();
      this.updateInputOne(e.lodging_name);
      this.updateInputTwo(e.lodging_details);
      this.setState({
        editedId: e.lodging_id,
        value: 3
      })
    } else if (e.activity_name) {
      this.handleOpen();
      this.updateInputOne(e.activity_name);
      this.updateInputTwo(e.activity_details);
      this.setState({
        editedId: e.activity_id,
        value: 5
      })
    } else if (e.rental_company) {
      this.handleOpen();
      this.updateInputOne(e.rental_company);
      this.updateInputTwo(e.rental_details);
      this.setState({
        editedId: e.rental_id,
        value: 2
      })
    }
  }

  handleChange = (event, index, value) => this.setState({ value });

  handleOpen() {

    this.setState({ open: true });
  };

  handleClose() {

    console.log(this.state.editedId)
    this.setState({ open: false });
    this.makeBlank();
    this.setState({
      editOpen: false
    })
    console.log(this.state.value)
  };

  makeBlank() {

    this.setState({
      inputOne: '',
      inputTwo: ''
    })
  }

  updateEventName(value) {

    this.setState({ eventName: value });
  };

  updateInputOne(value) {

    this.setState({ inputOne: value })
  }

  updateInputTwo(value) {

    this.setState({ inputTwo: value })
  }


  handleEventType() {

    if (this.state.value === 1) {
      return (
        <div>
          <TextField
            hintText="Confirmation Number"
            id="text-field-default-event"
            defaultValue={this.state.inputOne}
            onChange={(e) => this.updateInputOne(e.target.value)}
          />
          <TextField
            hintText="Flight Airline"
            id="text-field-default-event"
            defaultValue={this.state.inputTwo}
            onChange={(e) => this.updateInputTwo(e.target.value)}
          />
        </div>
      )
    } else if (this.state.value === 2) {
      return (
        <div>
          <TextField
            hintText="Rental Company"
            id="text-field-default-event"
            defaultValue={this.state.inputOne}
            onChange={(e) => this.updateInputOne(e.target.value)}
          />
          <TextField
            hintText="Rental Company Details"
            id="text-field-default-event"
            defaultValue={this.state.inputTwo}
            onChange={(e) => this.updateInputTwo(e.target.value)}
          />
        </div>
      )
    } else if (this.state.value === 3) {
      return (
        <div>
          <TextField
            hintText="Lodge/Hotel Name"
            id="text-field-default-event"
            defaultValue={this.state.inputOne}
            onChange={(e) => this.updateInputOne(e.target.value)}
          />
          <TextField
            hintText="Lodging Details"
            id="text-field-default-event"
            defaultValue={this.state.inputTwo}
            onChange={(e) => this.updateInputTwo(e.target.value)}
          />
        </div>
      )
    } else if (this.state.value === 4) {
      return (
        <div>
          <TextField
            hintText="Enter City"
            id="text-field-default-event"
            defaultValue={this.state.inputOne}
            onChange={(e) => this.updateInputOne(e.target.value)}
          />
          <Link to="/listing" >
            <RaisedButton label="Search" primary={true} onClick={() => { this.props.searchRestaurants(this.state.inputOne), console.log(this.state.inputOne) }} />
          </Link>
        </div>
      )
    } else if (this.state.value === 5) {
      return (
        <div>
          <TextField
            hintText="Activity Name"
            id="text-field-default-event"
            defaultValue={this.state.inputOne}
            onChange={(e) => this.updateInputOne(e.target.value)}
          />
          <TextField
            hintText="Activity Details"
            id="text-field-default-event"
            defaultValue={this.state.inputTwo}
            onChange={(e) => this.updateInputTwo(e.target.value)}
          />
        </div>
      )
    }
  }

  render() {
    const { eventName } = this.state;

    const actions = (
      <div className='new-event-actions'>
        <RaisedButton
          label="Ok"
          primary={true}
          onClick={() => { this.handleAddEvent(), this.handleClose() }}
          className='new-event-ok'
        />
        <RaisedButton
          label='Cancel'
          secondary={true}
          onClick={this.handleClose}
          className='new-event-cancel'
        />
      </div>
    );
    const restaurantActions = (
      <div className='new-event-actions'>
        <RaisedButton
          label="Ok"
          primary={true}
          onClick={() => { this.handleAddRestaurant(), this.props.updateSavedRestaurants(this.props.currentDay.day_id), this.props.updateSavedRestaurantsData(this.props.currentDay.day_id), this.props.closeRestaurantModal() }}
          className='new-event-ok'
        />
        <RaisedButton
          label='Cancel Restaurant'
          secondary={true}
          onClick={this.props.closeRestaurantModal}
          className='new-event-cancel'
        />
      </div>
    );
    const editActions = (
      <div className='new-event-actions'>
        <RaisedButton
          label="Ok"
          primary={true}
          onClick={() => { this.handleEditEvent(), this.handleClose() }}
          className='new-event-ok'
        />
        <RaisedButton
          label='Cancel'
          secondary={true}
          onClick={this.handleClose}
          className='new-event-cancel'
        />
      </div>
    );
    return (
      <main>
        <section className='day'>
          <Menu />
          {this.props.currentDay ? <Card className='title-container' zDepth={3}>
            <CardTitle
              title={this.props.currentDay.day_name}
              subtitle={this.props.currentDay.date}
            />
          </Card> : null}
          <br />
          {this.props.currentTrip ? this.props.user_id == this.props.currentTrip.user_id ? <RaisedButton className="add-event-button" label="Add event" primary={true} onClick={this.handleOpen} /> : null : null}
          {this.handleGetAllEvents()}
          {this.handleRestaurants()}
          <Dialog
            title={eventName}
            actions={this.state.editOpen === false ? actions : editActions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
            <DropDownMenu value={this.state.value} onChange={this.handleChange}>
              <MenuItem value={1} label="Flight" primaryText="Flight" />
              <MenuItem value={2} label="Car Rentals" primaryText="Car Rentals" />
              <MenuItem value={3} label="Lodging" primaryText="Lodging" />
              <MenuItem value={4} label="Restaraunts" primaryText="Restaraunts" />
              <MenuItem value={5} label="Activites" primaryText="Activities" />
            </DropDownMenu>
            <TextField
              id="text-field-default-event"
              defaultValue={eventName}
              onChange={(e) => this.updateEventName(e.target.value)}
            />
            {this.handleEventType()}
          </Dialog >
          <Dialog
            title={eventName}
            actions={restaurantActions}
            modal={false}
            open={this.props.restaurantModalToggle}
            onRequestClose={this.props.closeRestaurantModal}>
            <div>
              <TextField
                id="text-field-default-event"
                defaultValue={eventName}
                onChange={(e) => this.updateEventName(e.target.value)}
              />
              <p></p>
              <TextField
                hintText={this.props.currentRestaurant.name}
                id="text-field-default-event"
                defaultValue={this.props.currentRestaurant.name}
              />
            </div>
          </Dialog>
        </section>
      </main >
    )
  }
}
function mapStateToProps(state) {
  return {
    user_id: state.frontEnd.user_id,
    currentTrip: state.frontEnd.currentTrip,
    gIcon: state.gIcon,
    restaurantModalToggle: state.frontEnd.restaurantModalToggle,
    currentRestaurant: state.restaurant.currentRestaurant,
    eventsList: state.frontEnd.eventsList,
    currentDay: state.frontEnd.currentDay,
    savedRestaurants: state.restaurant.savedRestaurants,
    savedRestaurantsData: state.restaurant.savedRestaurantsData
  }
}

export default connect(mapStateToProps, {
  updateSavedRestaurants, showGroup, searchRestaurants, updateEventsList, createNewFlight, createNewLodging, createNewActivity, createNewRental,
  deleteSelectedFlight, deleteSelectedLodging, deleteSelectedRental, deleteSelectedActivity, editSelectedActivity, editSelectedFlight, editSelectedLodging, editSelectedRental,
  openRestaurantModal, closeRestaurantModal, clearRestaurant, clearReviews, getRestaurant, getReviews, updateSavedRestaurantsData
  , addRestaurant, deleteRestaurant
})(Day);
