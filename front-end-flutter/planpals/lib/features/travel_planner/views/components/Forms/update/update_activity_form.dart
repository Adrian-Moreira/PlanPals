import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/shared/components/date_time_form.dart';
import 'package:provider/provider.dart';

class UpdateActivityForm extends StatefulWidget {
  final Destination destination;
  final Activity activity;

  const UpdateActivityForm({super.key, required this.destination, required this.activity,});

  @override
  _UpdateActivityFormState createState() => _UpdateActivityFormState();
}

class _UpdateActivityFormState extends State<UpdateActivityForm> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _activityNameController;
  DateTime? _selectedDate;
  String? _selectedDuration; // Store the time as a string

  @override
  void initState() {
    super.initState();

    final Activity activity = widget.activity;

    _activityNameController.text = activity.name;
    _selectedDate = activity.startDate;
    _selectedDuration = activity.duration.toString();
  }

  @override
  Widget build(BuildContext context) {
    final PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context, listen: false);
    final User user = Provider.of<UserViewModel>(context).currentUser!;
    final Destination destination = widget.destination;
    final Activity activity = widget.activity;
    
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
                decoration: const InputDecoration(labelText: 'Duration in Minutes'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the duration';
                  }
                  return null;
                },
                onChanged: (value) {
                  _selectedDuration = value;
                },
              ),

              const SizedBox(height: 20), // Margin

              // Submit Button
              ElevatedButton(
                onPressed: () async {
                  if (_formKey.currentState?.validate() == true) {
                    // TODO: Validate Activity Data

                    // Create an updated Activity
                    Activity updatedActivity = Activity(
                      activityId: activity.activityId,
                      name: _activityNameController.text,
                      startDate: _selectedDate!,
                      duration: double.parse(_selectedDuration!),
                      destinationId: activity.destinationId,
                      location: activity.location,
                      votes: activity.votes,
                      comments: activity.comments, 
                      createdBy: user.id,
                    );

                    // Update the Activity
                    await plannerViewModel.updateActivity(updatedActivity, destination.plannerId, user.id);

                    // Close the form screen
                    Navigator.pop(context);
                  }
                },
                child: const Text('Save Activity'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
