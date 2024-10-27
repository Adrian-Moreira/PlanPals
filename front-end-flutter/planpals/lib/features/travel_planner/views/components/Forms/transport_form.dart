import 'package:flutter/material.dart';
import 'package:planpals/features/profile/models/user_model.dart';
import 'package:planpals/features/profile/viewmodels/user_viewmodel.dart';
<<<<<<< HEAD
import 'package:planpals/features/travel_planner/models/planner_model.dart';
=======
<<<<<<<< HEAD:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/update/update_transport_form.dart
========
import 'package:planpals/features/travel_planner/models/planner_model.dart';
>>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/transport_form.dart
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
import 'package:planpals/features/travel_planner/models/transport_model.dart';
import 'package:planpals/features/travel_planner/validators/transport_validator.dart';
import 'package:planpals/features/travel_planner/viewmodels/planner_viewmodel.dart';
import 'package:planpals/shared/components/date_time_form.dart';
import 'package:provider/provider.dart';

<<<<<<< HEAD
<<<<<<<< HEAD:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/create/create_transport_form.dart
class CreateTransportForm extends StatefulWidget {
  final Planner planner;

  const CreateTransportForm({super.key, required this.planner});
=======
<<<<<<<< HEAD:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/update/update_transport_form.dart
class UpdateTransportForm extends StatefulWidget {
  final Transport transport;

  const UpdateTransportForm({super.key, required this.transport,});
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
========
class TransportForm extends StatefulWidget {
  final Planner planner;

  const TransportForm({super.key, required this.planner});
>>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/transport_form.dart

  @override
<<<<<<< HEAD
  _CreateTransportFormState createState() => _CreateTransportFormState();
}

class _CreateTransportFormState extends State<CreateTransportForm> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _typeController = TextEditingController();
  final TextEditingController _detailsController = TextEditingController();
=======
  _UpdateTransportFormState createState() => _UpdateTransportFormState();
}

class _UpdateTransportFormState extends State<UpdateTransportForm> {
  final _formKey = GlobalKey<FormState>();

<<<<<<<< HEAD:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/update/update_transport_form.dart
  late final TextEditingController _typeController;
  late final TextEditingController _detailsController;
========
  final TextEditingController _typeController = TextEditingController();
  final TextEditingController _detailsController = TextEditingController();
>>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/transport_form.dart
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
  DateTime? _departureDateTime;
  DateTime? _arrivalDateTime;

  @override
<<<<<<< HEAD
  Widget build(BuildContext context) {
    final PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context);
=======
  void initState() {
    super.initState();

    final Transport transport = widget.transport;

    _typeController = TextEditingController(text: transport.type);
    _detailsController = TextEditingController(text: transport.details);

    _departureDateTime = transport.departureTime;
    _arrivalDateTime = transport.arrivalTime;
  }

  @override
  Widget build(BuildContext context) {
    final PlannerViewModel plannerViewModel = Provider.of<PlannerViewModel>(context);
<<<<<<<< HEAD:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/update/update_transport_form.dart
    final User user = Provider.of<UserViewModel>(context).currentUser!;
    final Transport transport = widget.transport;
========
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
    final User? user = Provider.of<UserViewModel>(context).currentUser;

    final Planner planner = widget.planner;
    final String plannerId = planner.plannerId;
<<<<<<< HEAD
=======
>>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/transport_form.dart
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb

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
                decoration:
                    const InputDecoration(labelText: 'Type of transportation'),
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
                decoration:
                    const InputDecoration(labelText: 'Transportation Details'),
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
                onPressed: () async {
                  if (_formKey.currentState?.validate() == true) {
                    // Validate custom date logic
<<<<<<< HEAD
                    String? dateError = TransportValidator.validateDates(_departureDateTime, _arrivalDateTime);
=======
                    String? dateError = TransportValidator.validateDates(
                        _departureDateTime, _arrivalDateTime);
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
                    if (dateError != null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(dateError)),
                      );
                      return;
                    }

<<<<<<< HEAD
=======
<<<<<<<< HEAD:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/update/update_transport_form.dart
                    // Creted an updated transport
                    Transport updatedTransport = Transport(
                      createdBy: transport.createdBy, 
                      id: transport.id, 
                      plannerId: transport.plannerId, 
                      type: _typeController.text, 
                      details: _detailsController.text, 
                      vehicleId: transport.vehicleId, 
                      departureTime: _departureDateTime!, 
                      arrivalTime: _arrivalDateTime!,);

                    // request update
                    plannerViewModel.updateTransport(updatedTransport, user.id);
========
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
                    // Create a Transport object
                    Transport newTransport = Transport(
                      createdBy: user!.id,
                      type: _typeController.text,
                      details: _detailsController.text,
                      departureTime: _departureDateTime!.toUtc(),
                      arrivalTime: _arrivalDateTime!.toUtc(), 
                      plannerId: plannerId, 
                      id: '', 
                      vehicleId: '',
                    );

<<<<<<< HEAD
<<<<<<<< HEAD:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/create/create_transport_form.dart
                    newTransport = await plannerViewModel.addTransport(newTransport);
========
                    newTransport = await plannerViewModel.addTransport(plannerId, newTransport);
>>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/transport_form.dart

                    planner.transportations.add(newTransport.id); // Add new transport's ID to planner
=======
                    newTransport = await plannerViewModel.addTransport(plannerId, newTransport);

                    planner.transportations.add(newTransport.id); // Add new transport's ID to planner
>>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb:front-end-flutter/planpals/lib/features/travel_planner/views/components/Forms/transport_form.dart
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb

                    // Close the form screen
                    Navigator.pop(context);
                  }
                },
<<<<<<< HEAD
                child: const Text('Add Transport'),
=======
                child: const Text('Save Transport'),
>>>>>>> 9d450e7847ca1857e5a54067c7c6c85fdc311ccb
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _typeController.dispose();
    _detailsController.dispose();
    super.dispose();
  }
}
