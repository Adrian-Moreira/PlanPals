import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/validators/activity_validator.dart';
import 'package:planpals/shared/components/date_time_form.dart';

class SimpleActivityForm extends StatefulWidget {
  final Function(Activity) onActivityAdd;

  const SimpleActivityForm({super.key, required this.onActivityAdd});

  @override
  _SimpleActivityFormState createState() => _SimpleActivityFormState();
}

class _SimpleActivityFormState extends State<SimpleActivityForm> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _activityNameController = TextEditingController();
  DateTime? _selectedDate;
  String? _selectedTime; // Store the time as a string

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Simple Activity Form'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              // Activity Name Field
              TextFormField(
                controller: _activityNameController,
                decoration: const InputDecoration(labelText: 'Activity Name'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the activity name';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20), // Margin

              // Date Field
              DateTimeForm(
                initialDate: _selectedDate,
                labelText: 'Date',
                placeholder: 'Select Date',
                dateTimeSelected: (selectedDateTime) {
                  setState(() {
                    _selectedDate = selectedDateTime;
                  });
                },
              ),

              const SizedBox(height: 15), // Space between fields

              // Time Field
              TextFormField(
                decoration: const InputDecoration(labelText: 'Time (HH:mm)'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the time';
                  }
                  return null;
                },
                onChanged: (value) {
                  _selectedTime = value;
                },
              ),

              const SizedBox(height: 20), // Margin

              // Submit Button
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState?.validate() == true) {
                    // Validate custom date logic (if needed)
                    // Note: You might want to add validation for the time format as well

                    // Create an Activity object
                    final activity = Activity(
                      activityId: '123', // Placeholder ID, you may want to generate or fetch this
                      name: _activityNameController.text,
                      date: _selectedDate!.toIso8601String().split('T')[0],
                      time: _selectedDate!.toIso8601String().split('T')[1],
                    );

                    // Call the callback with the new activity
                    widget.onActivityAdd(activity);

                    // Close the form screen
                    Navigator.pop(context);
                  }
                },
                child: const Text('Add Activity'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
