import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/validators/planner_validator.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/shared/components/date_time_form.dart';
import 'package:provider/provider.dart';

<<<<<<<< HEAD:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/update/update_destination_form.dart
class UpdateDestinationForm extends StatefulWidget {
  final Destination destination;

  const UpdateDestinationForm({super.key, required this.destination});

  @override
  _UpdateDestinationFormState createState() => _UpdateDestinationFormState();
}

class _UpdateDestinationFormState extends State<UpdateDestinationForm> {
========
class DestinationForm extends StatefulWidget {
  final Planner planner;

  const DestinationForm({super.key, required this.planner});

  @override
  DestinationFormState createState() => DestinationFormState();
}

class DestinationFormState extends State<DestinationForm> {
>>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/destination_form.dart
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _nameController;
  DateTime? _startDate;
  DateTime? _endDate;

  @override
<<<<<<<< HEAD:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/update/update_destination_form.dart
  void initState() {
    super.initState();

    final Destination destination = widget.destination;

    // Initialize the TextEditingController with the destination name
    _nameController = TextEditingController(text: destination.name);

    // Initialize the start and end dates with values from the destination
    _startDate = destination.startDate;
    _endDate = destination.endDate;
  }

  @override
  Widget build(BuildContext context) {
    final PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context, listen: false);
    final User user = Provider.of<UserViewModel>(context, listen: false).currentUser!;
    final Destination destination = widget.destination;
========
  Widget build(BuildContext context) {
    final PlannerViewModel plannerViewModel =
        Provider.of<PlannerViewModel>(context, listen: false);
    final User? user = Provider.of<UserViewModel>(context).currentUser;

    final Planner planner = widget.planner;
    final String plannerId = planner.plannerId;
>>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/destination_form.dart

    return Scaffold(
      appBar: AppBar(
        title: const Text('Destination Form'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              // Destination Number Field
              TextFormField(
                controller: _nameController,
                decoration:
                    const InputDecoration(labelText: 'Destination Name'),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter the destination name';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 20), //margin

              // Departure Date & Time Picker
              // Start Date field
              DateTimeForm(
                initialDate: _startDate,
                labelText: 'Departure Date',
                placeholder: 'Set Departure Date',
                dateTimeSelected: (selectedDate) {
                  setState(() {
                    _startDate = selectedDate;
                  });
                },
              ),

              const SizedBox(height: 15), // Space between date fields

              // End Date field
              DateTimeForm(
                initialDate: _endDate,
                labelText: 'Arrival Date',
                placeholder: 'Set Arrival Date',
                dateTimeSelected: (selectedDate) {
                  setState(() {
                    _endDate = selectedDate;
                  });
                },
              ),

              const SizedBox(height: 20), //margin

              // Submit Button
              ElevatedButton(
                onPressed: () async {
                  if (_formKey.currentState?.validate() == true) {
                    // Validate custom date logic
                    final dateError =
                        PlannerValidator.validateDates(_startDate, _endDate);
                    if (dateError != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(dateError)),
                      );
                      return;
                    }

<<<<<<<< HEAD:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/update/update_destination_form.dart
                    // Create an updated destination
                    Destination updatedDestination = Destination(
                      createdBy: destination.createdBy, 
                      destinationId: destination.destinationId, 
                      plannerId: destination.plannerId, 
                      name: _nameController.text, 
                      startDate: _startDate!, 
                      endDate: _endDate!, 
                      activities: destination.activities, 
                      accommodations: destination.accommodations);

                    // Update the destination
                    await plannerViewModel.updateDestination(updatedDestination, user.id);
========
                    Destination newDestination = Destination(
                        createdBy: user!.id,
                        destinationId: '',
                        plannerId: plannerId,
                        name: _nameController.text,
                        startDate: _startDate!,
                        endDate: _endDate!,
                        activities: [],
                        accommodations: []);

                    newDestination = await plannerViewModel.addDestination(plannerId, newDestination);
                    
                    planner.destinations.add(newDestination.destinationId); // Add destination ID to planner
>>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/destination_form.dart

                    // Close the form screen
                    Navigator.pop(context);
                  }
                },
                child: const Text('Save Destination'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }
}
