import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/shared/components/date_time_form.dart';
import 'package:provider/provider.dart';

class CreateActivityForm extends StatefulWidget {
  final Destination destination;

  const CreateActivityForm({super.key, required this.destination,});

  @override
  _CreateActivityFormState createState() => _CreateActivityFormState();
}

class _CreateActivityFormState extends State<CreateActivityForm> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _activityNameController = TextEditingController();
  final TextEditingController _activityDurationController = TextEditingController();
  DateTime? _selectedDate;

  @override
  Widget build(BuildContext context) {

    final PlannerViewModel plannerViewModel =
        Provider.of<PlannerViewModel>(context, listen: false);
    final User? user = Provider.of<UserViewModel>(context).currentUser;

    final Destination destination = widget.destination;
    
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
                controller: _activityDurationController,
                decoration: const InputDecoration(labelText: 'Duration in Minutes'),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the duration';
                  }
                  if (double.tryParse(value) == null) {
                    return 'Please enter a valid number';
                  }
                  return null;
                },

              ),

              const SizedBox(height: 20), // Margin

              // Submit Button
              ElevatedButton(
                onPressed: () async {
                  if (_formKey.currentState?.validate() == true) {
                    // Validate custom date logic (if needed)
                    // Note: You might want to add validation for the time format as well

                    Activity? newActivity;

                    newActivity = await plannerViewModel.addActivity(
                      Activity(
                        activityId: '',
                        name: _activityNameController.text,
                        startDate: _selectedDate!,
                        duration: double.parse(_activityDurationController.text),
                        destinationId: destination.destinationId,
                        createdBy: user!.id, 
                        location: '',
                      ),
                      destination.plannerId,
                      user.id,
                    );

                    if (newActivity != null) {
                      // Activity added successfully, do something with the newActivity object
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Activity added successfully!')),
                      );
                      
                      destination.activityList.add(newActivity);  // Add the new activity to the destination

                    } else {
                      // Failed to add activity
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Failed to add activity!')),
                      );
                    }

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
