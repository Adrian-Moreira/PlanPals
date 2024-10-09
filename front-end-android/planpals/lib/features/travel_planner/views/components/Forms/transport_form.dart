import 'package:flutter/material.dart';
import 'package:planpals/db/mock_db.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/validators/transport_validator.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/shared/components/date_time_form.dart';
import 'package:provider/provider.dart';

class TransportForm extends StatefulWidget {
  final String plannerId;

  const TransportForm({super.key, required this.plannerId,});

  @override
  _TransportFormState createState() => _TransportFormState();
}

class _TransportFormState extends State<TransportForm> {
  final _formKey = GlobalKey<FormState>();

  User user = MockDataBase.user;

  final TextEditingController _typeController = TextEditingController();
  final TextEditingController _detailsController = TextEditingController();
  DateTime? _departureDateTime;
  DateTime? _arrivalDateTime;

  @override
  Widget build(BuildContext context) {
    final String plannerId = widget.plannerId;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Transportion Form'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [

              // Arrival Airport Field
              TextFormField(
                controller: _typeController,
                decoration: const InputDecoration(labelText: 'Type of transportation'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the type';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20), //margin

              // Transport Number Field
              TextFormField(
                controller: _detailsController,
                decoration: const InputDecoration(labelText: 'Transportation Details'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the transportation details';
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
                    final dateError = TransportValidator.validateDates(
                        _departureDateTime, _arrivalDateTime);
                    if (dateError != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(dateError)),
                      );
                      return;

                      // Handle logic stuffs
                    }

                    // Create a Transport object
                    final Transport newTransport = Transport(
                      transportationId: '', 
                      plannerId: '', 
                      type: _typeController.text, 
                      details: _detailsController.text, 
                      departureTime: _departureDateTime!, 
                      arrivalTime: _arrivalDateTime!
                    );

                    Provider.of<PlannerViewModel>(context).addTransport(plannerId, newTransport);

                    // Close the form screen
                    Navigator.pop(context);
                  }
                },
                child: const Text('Add Transport'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
