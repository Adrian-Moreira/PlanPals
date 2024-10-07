import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/validators/accommodation_validator.dart';
import 'package:planpals/shared/components/date_time_form.dart';

class AccommodationForm extends StatefulWidget {
  final Function(Accommodation) onAccommodationAdd;

  const AccommodationForm({super.key, required this.onAccommodationAdd});

  @override
  _AccommodationFormState createState() => _AccommodationFormState();
}

class _AccommodationFormState extends State<AccommodationForm> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _priceController = TextEditingController();
  DateTime? _checkIn;
  DateTime? _checkOut;

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
              // Accommodation Field
              TextFormField(
                controller: _nameController,
                decoration:
                    const InputDecoration(labelText: 'Accommodation Name'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the accommodation name';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20), //margin

              // Address Field
              TextFormField(
                controller: _addressController,
                decoration: const InputDecoration(labelText: 'Address'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the address';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20), //margin

              // Price Per Night Field
              TextFormField(
                controller: _priceController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Price Per Night',
                  prefixText: '\$  ', // Adds a dollar sign as a prefix
                  suffixText: ' CAD', // Adds CAD as a suffix
                  prefixStyle:
                      TextStyle(color: Colors.black), // Style for the prefix
                  suffixStyle:
                      TextStyle(color: Colors.black), // Style for the suffix
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the price per night';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20), //margin

              // CheckIn Date field
              DateTimeForm(
                initialDate: _checkIn,
                labelText: 'Check-In Date and Time',
                placeholder: 'Set Check-In Date and Time',
                dateTimeSelected: (selectedDateTime) {
                  setState(() {
                    _checkIn = selectedDateTime;
                  });
                },
              ),

              const SizedBox(height: 15), // Space between date fields

              // CheckOut Date field
              DateTimeForm(
                initialDate: _checkOut,
                labelText: 'Check-Out Date and Time',
                placeholder: 'Set Check-Out Date and Time',
                dateTimeSelected: (selectedDateTime) {
                  setState(() {
                    _checkOut = selectedDateTime;
                  });
                },
              ),

              const SizedBox(height: 20), //margin

              // Submit Button
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState?.validate() == true) {
                    // Validate custom date logic
                    final dateError = AccommodationValidator.validateDates(
                        _checkIn, _checkOut);
                    if (dateError != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(dateError)),
                      );
                      return;
                    }

                    // Create a Accommoodation object
                    final accommodation = Accommodation(
                      accommodationId: "123",
                      name: _nameController.text,
                      address: _addressController.text,
                      pricePerNight: _priceController.text,
                      checkIn: _checkIn!,
                      checkOut: _checkOut!,
                      travelPlanId:
                          'SomeId', // This could be passed or managed differently
                    );

                    // Call the callback with the new flight
                    widget.onAccommodationAdd(accommodation);

                    // Close the form screen
                    Navigator.pop(context);
                  }
                },
                child: const Text('Add Accommodation'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
