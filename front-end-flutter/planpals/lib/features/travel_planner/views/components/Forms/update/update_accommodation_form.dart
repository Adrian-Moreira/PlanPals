import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
import 'package:planpals/features/travel_planner/models/accommodation_model.dart';
import 'package:planpals/features/travel_planner/models/destination_model.dart';
import 'package:planpals/features/travel_planner/validators/accommodation_validator.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/shared/components/date_time_form.dart';
import 'package:provider/provider.dart';

class UpdateAccommodationForm extends StatefulWidget {
  final Destination destination;
  final Accommodation accommodation;

  const UpdateAccommodationForm({super.key, required this.destination, required this.accommodation});

  @override
  _UpdateAccommodationFormState createState() => _UpdateAccommodationFormState();
}

class _UpdateAccommodationFormState extends State<UpdateAccommodationForm> {
  final _formKey = GlobalKey<FormState>();

  late final TextEditingController _nameController;
  late final TextEditingController _addressController;
  DateTime? _checkIn;
  DateTime? _checkOut;

  @override
  void initState() {
    super.initState();

    final Accommodation accommodation = widget.accommodation;

    _nameController = TextEditingController(text: accommodation.name);
    _addressController = TextEditingController(text: accommodation.address);
    _checkIn = accommodation.checkInDate;
    _checkOut = accommodation.checkOutDate;
  }

  @override
  Widget build(BuildContext context) {
    final PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context, listen: false);
    final User user = Provider.of<UserViewModel>(context).currentUser!;
    final Destination destination = widget.destination;
    final Accommodation accommodation = widget.accommodation;


    return Scaffold(
      appBar: AppBar(
        title: const Text('Accommodation Form'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              // Accommodation Name Field
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

              const SizedBox(height: 20), // margin

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

              const SizedBox(height: 20), // margin

              // Check-In Date field
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

              // Check-Out Date field
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

              const SizedBox(height: 20), // margin

              // Submit Button
              ElevatedButton(
                onPressed: () async {
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


                    // // Create Updated Accommodoation
                    // final Accommodation updatedAccommodation = 
                    // Accommodation(
                    //   accommodationId: accommodation.accommodationId,
                    //   destinationId: destination.destinationId,
                    //   name: _nameController.text,
                    //   address: _addressController.text,
                    //   checkInDate: _checkIn!,
                    //   checkOutDate: _checkOut!,
                    // );

                    // // Update Accommodation
                    // await plannerViewModel.updateAccommodation(updatedAccommodation, destination.plannerId, user.id);

                    Accommodation? updatedAccommodation = await plannerViewModel.updateAccommodation(
                      Accommodation(
                        accommodationId: accommodation.accommodationId,
                        destinationId: destination.destinationId,
                        name: _nameController.text,
                        address: _addressController.text,
                        checkInDate: _checkIn!,
                        checkOutDate: _checkOut!,
                        location: accommodation.location,
                        createdBy: accommodation.createdBy,
                      ),
                      destination.plannerId,
                      user.id
                    );

                    if (updatedAccommodation != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Accommodation Updated')),
                      );
                      
                      destination.updateAnAccommodation(updatedAccommodation);  // Update the Accommodation in the Destination
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Failed to update accommodation')),
                      );
                    }


                    // Close the form screen
                    Navigator.pop(context);
                  }
                },
                child: const Text('Save Accommodation'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
