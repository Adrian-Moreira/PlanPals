import 'package:flutter/material.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/validators/activity_validator.dart';
import 'package:planpals/shared/components/date_time_form.dart';

class ActivityForm extends StatefulWidget {
  final Function(Activity) onActivityAdd;

  const ActivityForm({super.key, required this.onActivityAdd});

  @override
  _ActivityFormState createState() => _ActivityFormState();
}

class _ActivityFormState extends State<ActivityForm> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _activityNameController = TextEditingController();
  DateTime? _startDate;
  DateTime? _endDate;

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


              const SizedBox(height: 20), //margin

              // Start Date field
              DateTimeForm(
                initialDate: _startDate,
                labelText: 'Start Date and Time',
                placeholder: 'Set Start Date and Time',
                dateTimeSelected: (selectedDateTime) {
                  setState(() {
                    _startDate = selectedDateTime;
                  });
                },
              ),

              const SizedBox(height: 15), // Space between date fields

              // End Date field
              DateTimeForm(
                initialDate: _endDate,
                labelText: 'End Date and Time',
                placeholder: 'Set End Date and Time',
                dateTimeSelected: (selectedDateTime) {
                  setState(() {
                    _endDate = selectedDateTime;
                  });
                },
              ),

              const SizedBox(height: 20), //margin

              // Submit Button
              ElevatedButton(
                onPressed: () {
                  if (_formKey.currentState?.validate() == true) {
                    // Validate custom date logic
                    final dateError = ActivityValidator.validateDates(
                        _startDate, _endDate);
                    if (dateError != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(dateError)),
                      );
                      return;
                    }

                    // Create a Flight object
                    final activity = Activity(
                      activityId: '123',
                      activityName: _activityNameController.text,
                      startDate: _startDate!,
                      endDate: _endDate!,
                      travelPlanId:
                          'SomeId', // This could be passed or managed differently
                    );

                    // Call the callback with the new flight
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
