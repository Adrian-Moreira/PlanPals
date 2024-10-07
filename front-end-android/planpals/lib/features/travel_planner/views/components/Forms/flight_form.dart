import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/validators/flight_validator.dart';
import 'package:planpals/shared/components/date_time_form.dart';
import 'package:planpals/features/travel_planner/models/flight_model.dart';

class FlightForm extends StatefulWidget {
  final Function(Flight) onFlightAdd;

  const FlightForm({super.key, required this.onFlightAdd});

  @override
  _FlightFormState createState() => _FlightFormState();
}

class _FlightFormState extends State<FlightForm> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _flightNumberController = TextEditingController();
  final TextEditingController _departureAirportController =
      TextEditingController();
  final TextEditingController _arrivalAirportController =
      TextEditingController();
  DateTime? _departureDateTime;
  DateTime? _arrivalDateTime;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Flight Form'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              // Flight Number Field
              TextFormField(
                controller: _flightNumberController,
                decoration: const InputDecoration(labelText: 'Flight Number'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the flight number';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20), //margin

              // Departure Airport Field
              TextFormField(
                controller: _departureAirportController,
                decoration:
                    const InputDecoration(labelText: 'Departure Airport'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the departure airport';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20), //margin

              // Arrival Airport Field
              TextFormField(
                controller: _arrivalAirportController,
                decoration: const InputDecoration(labelText: 'Arrival Airport'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the arrival airport';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20), //margin

              // Departure Date & Time Picker
              // Start Date field
              DateTimeForm(
                initialDate: _departureDateTime,
                labelText: 'Departure Date and Time',
                placeholder: 'Set Departure Date and Time',
                dateTimeSelected: (selectedDateTime) {
                  setState(() {
                    _departureDateTime = selectedDateTime;
                  });
                },
              ),

              const SizedBox(height: 15), // Space between date fields

              // End Date field
              DateTimeForm(
                initialDate: _arrivalDateTime,
                labelText: 'Arrival Date and Time',
                placeholder: 'Set Arrival Date and Time',
                dateTimeSelected: (selectedDateTime) {
                  setState(() {
                    _arrivalDateTime = selectedDateTime;
                  });
                },
              ),

              const SizedBox(height: 20), //margin

              // Submit Button
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState?.validate() == true) {
                    // Validate custom date logic
                    final dateError = FlightValidator.validateDates(
                        _departureDateTime, _arrivalDateTime);
                    if (dateError != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(dateError)),
                      );
                      return;
                    }

                    // Create a Flight object
                    final flight = Flight(
                      flightNumber: _flightNumberController.text,
                      departureAirport: _departureAirportController.text,
                      arrivalAirport: _arrivalAirportController.text,
                      departureDateTime: _departureDateTime!,
                      arrivalDateTime: _arrivalDateTime!,
                      travelPlanId:
                          'SomeId', // This could be passed or managed differently
                    );

                    // Call the callback with the new flight
                    widget.onFlightAdd(flight);

                    // Close the form screen
                    Navigator.pop(context);
                  }
                },
                child: const Text('Add Flight'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
