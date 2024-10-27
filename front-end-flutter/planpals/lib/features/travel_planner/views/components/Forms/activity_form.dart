import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/activity_model.dart';
<<<<<<< HEAD
<<<<<<<< HEAD:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/create/create_activity_form.dart
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
========
>>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/activity_form.dart
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
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
  DateTime? _selectedDate;
  String? _selectedDuration; // Store the time as a string

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
                    // Validate custom date logic (if needed)
                    // Note: You might want to add validation for the time format as well

                    // Create an Activity object
<<<<<<<< HEAD:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/create/create_activity_form.dart
                    Activity newActivity = Activity(
========
                    final activity = Activity(
                      activityId:
                          '123', // Placeholder ID, you may want to generate or fetch this
<<<<<<< HEAD
>>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/activity_form.dart
=======
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
                      name: _activityNameController.text,
                      date: _selectedDate!,
                      duration: double.parse(_selectedDuration!),
                      destinationId: destination.destinationId);
                   
                    newActivity = await plannerViewModel.addActivity(
                        newActivity, destination.plannerId, user!.id
                    );
                    
                    destination.activities.add(newActivity.activityId!);

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
