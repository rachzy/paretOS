import React, { Component } from "react";
import FormGroup from "react-bootstrap/lib/FormGroup";
import ControlLabel from "react-bootstrap/lib/ControlLabel";
import FormControl from "react-bootstrap/lib/FormControl";
import { CardElement, injectStripe } from "react-stripe-elements";
import LoaderButton from "../components/LoaderButton";

/**
 * This is the Billing form, where payment is processed for the Starter pack. This hides in the paywall.
 * @TODO Issue #50
 */

class BillingForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      storage: 1,
      isProcessing: false,
      isCardComplete: false,
      street: "",
      // street2: "",
      city: "",
      zip: "",
    };
  }

  validateForm() {
    return (
      this.state.name !== "" &&
      this.state.storage !== "" &&
      this.state.isCardComplete
    );
  }

  handleFieldChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  handleCardFieldChange = (event) => {
    this.setState({
      isCardComplete: event.complete,
    });
  };

  handleSubmitClick = async (event) => {
    event.preventDefault();

    const { name } = this.state;

    this.setState({ isProcessing: true });

    const { token, error } = await this.props.stripe.createToken({ name });

    this.setState({ isProcessing: false });

    this.props.onSubmit(this.state.storage, { token, error });
  };

  render() {
    const loading = this.state.isProcessing || this.props.loading;

    return (
      <form className="BillingForm" onSubmit={this.handleSubmitClick}>
        <FormGroup bsSize="large" controlId="name">
          <ControlLabel>Cardholder&apos;s name</ControlLabel>
          <FormControl
            type="text"
            value={this.state.name}
            onChange={this.handleFieldChange}
            placeholder="Name on the card"
          />
        </FormGroup>
        <FormGroup bsSize="large" controlId="street">
          <ControlLabel>Street Address</ControlLabel>
          <FormControl
            type="text"
            value={this.state.street}
            onChange={this.handleFieldChange}
            placeholder="Street Address"
          />
        </FormGroup>
        <FormGroup bsSize="large" controlId="city">
          <ControlLabel>City</ControlLabel>
          <FormControl
            type="text"
            value={this.state.city}
            onChange={this.handleFieldChange}
            placeholder="City"
          />
        </FormGroup>
        <FormGroup bsSize="large" controlId="zip">
          <ControlLabel>Zip Code</ControlLabel>
          <FormControl
            type="text"
            value={this.state.zip}
            onChange={this.handleFieldChange}
            placeholder="Zip Code"
          />
        </FormGroup>
        <ControlLabel>Credit Card Info</ControlLabel>
        <CardElement
          className="card-field"
          onChange={this.handleCardFieldChange}
          style={{
            base: {
              fontSize: "18px",
              fontFamily: '"Futura Std Book", sans-serif',
            },
          }}
        />
        <LoaderButton
          block
          bsSize="large"
          type="submit"
          text="Purchase"
          isLoading={loading}
          loadingText="Purchasing…"
          disabled={!this.validateForm()}
        />
      </form>
    );
  }
}

export default injectStripe(BillingForm);
