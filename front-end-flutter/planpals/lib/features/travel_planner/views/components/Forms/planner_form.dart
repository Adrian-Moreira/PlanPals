import 'package:flutter/material.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/validators/planner_validator.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/shared/components/date_time_form.dart';
import 'package:planpals/features/travel_planner/models/planner_model.dart';
import 'package:planpals/features/travel_planner/views/planner_details_view.dart';
import 'package:provider/provider.dart';

class PlannerForm extends StatefulWidget {
  const PlannerForm({super.key});

  @override
  _PlannerFormState createState() => _PlannerFormState();
}

class _PlannerFormState extends State<PlannerForm> {
  final _formKey = GlobalKey<FormState>();

  // Controllers for the form fields
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  DateTime? _startDate;
  DateTime? _endDate;

  @override
  Widget build(BuildContext context) {
    // Use provider to access data of user currently logged in
    final viewModel = Provider.of<PlannerViewModel>(context);
    final user = Provider.of<UserViewModel>(context).currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Create Travel Plan"),
        backgroundColor: Colors.blueAccent,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Name field
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Travel Planner Name',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a travel planner name';
                  }
                  return null;
                },
              ),

              const SizedBox(
                height: 20,
              ), //margin

              // Destination field
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: 'Description',
                ),
              ),

              const SizedBox(
                height: 20,
              ), //margin

              // Start Date field
              DateTimeForm(
                initialDate: _startDate,
                labelText: 'Start Date',
                placeholder: 'Select Start Date',
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
                labelText: 'End Date',
                placeholder: 'Select End Date',
                dateTimeSelected: (selectedDateTime) {
                  setState(() {
                    _endDate = selectedDateTime;
                  });
                },
              ),

              // Submit Button
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 16.0),
                child: Center(
                  child: ElevatedButton(
                    onPressed: () async {
                      // Validate and save the form
                      if (_formKey.currentState?.validate() != true) {
                        // Validate custom date logic
                        return;
                      }

                      final dateError =
                          PlannerValidator.validateDates(_startDate, _endDate);
                      if (dateError != null) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(dateError)),
                        );
                        return;
                      }

                      // Set description if empty
                      _descriptionController.text = _descriptionController.text == '' ? "No Description" : _descriptionController.text;

                      Planner newPlanner = Planner(
                          plannerId: '',
                          createdBy: user!.id,
                          startDate: _startDate!,
                          endDate: _endDate!,
                          name: _nameController.text,
                          description: _descriptionController.text,
                          roUsers: [],
                          rwUsers: [user.id],
                          destinations: [],
                          transportations: []);

                      try {
                        newPlanner = await viewModel.addPlanner(newPlanner);
                      } catch (e) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(e.toString())));
                      }

                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              PlannerDetailsView(travelPlanner: newPlanner),
                        ),
                      );
                    },
                    child: const Text('Create Travel Plan'),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
