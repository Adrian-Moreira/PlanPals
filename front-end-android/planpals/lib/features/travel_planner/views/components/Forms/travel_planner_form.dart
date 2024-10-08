import 'package:flutter/material.dart';
import 'package:planpals/db/mock_db.dart';
import 'package:planpals/features/travel_planner/validators/travel_planner_validator.dart';
import 'package:planpals/shared/components/date_time_form.dart';
import 'package:planpals/shared/components/loading_screen.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/travel_planner_model.dart';
import 'package:planpals/features/travel_planner/viewmodels/travel_planner_viewmodel.dart';
import 'package:planpals/features/travel_planner/views/travel_planner_details_view.dart';
import 'package:provider/provider.dart';

class TravelPlannerForm extends StatefulWidget {
  const TravelPlannerForm({super.key});

  @override
  _TravelPlannerFormState createState() => _TravelPlannerFormState();
}

class _TravelPlannerFormState extends State<TravelPlannerForm> {
  final _formKey = GlobalKey<FormState>();

  // Controllers for the form fields
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _destinationController = TextEditingController();
  DateTime? _startDate;
  DateTime? _endDate;

  @override
  Widget build(BuildContext context) {
    // Use provider to access data of user currently logged in
    // final plannerViewModel = Provider.of<TravelPlannerViewModel>(context);
    // final user = Provider.of<UserViewModel>(context).currentUser;

    TravelPlannerViewModel plannerViewModel = TravelPlannerViewModel();
    User user = MockDatabase.user1;


    return plannerViewModel.isLoading
        ? const LoadingScreen()
        : _buildTravelPlannerForm(context, plannerViewModel, user);
  }

  Widget _buildTravelPlannerForm(
      BuildContext context, TravelPlannerViewModel viewModel, User userModel) {
    // Use provider to access data of user currently logged in
    final user = userModel;
    final plannerViewModel = viewModel;

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
                controller: _destinationController,
                decoration: const InputDecoration(
                  labelText: 'Destination',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a destination';
                  }
                  return null;
                },
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
                      if (_formKey.currentState?.validate() == true) {
                        // Validate custom date logic
                        final dateError = TravelPlannerValidator.validateDates(
                            _startDate, _endDate);
                        if (dateError != null) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text(dateError)),
                          );
                          return;
                        }

                        TravelPlanner planner = TravelPlanner(
                            travelPlanId: '123',
                            destination: _destinationController.text,
                            plannerName: _nameController.text,
                            startDate: _startDate!,
                            endDate: _endDate!,
                            createdAt: DateTime.now(),
                            userId: user.userId,
                            flights: [],
                            accommodations: [],
                            activities: []);

                        // await plannerViewModel.addTravelPlanner(planner);

                        // Check if the travel planner is added successfully or not
                        if (plannerViewModel.errorMessage != null) {
                          // Failed to add
                          Navigator.pop(context);
                        } else {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) => TravelPlannerDetailsView(
                                  travelPlanner: planner),
                            ),
                          );
                        }
                      }
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
